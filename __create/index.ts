import { AsyncLocalStorage } from 'node:async_hooks';
import nodeConsole from 'node:console';
import { skipCSRFCheck } from '@auth/core';
import Credentials from '@auth/core/providers/credentials';
import { authHandler, initAuthConfig } from '@hono/auth-js';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { hash, verify } from 'argon2';
import { Hono } from 'hono';
import { contextStorage, getContext } from 'hono/context-storage';
import { cors } from 'hono/cors';
import { proxy } from 'hono/proxy';
import { bodyLimit } from 'hono/body-limit';
import { requestId } from 'hono/request-id';
import { createHonoServer } from 'react-router-hono-server/node';
import { serializeError } from 'serialize-error';
import ws from 'ws';
import crypto from 'node:crypto';
import midtransClient from 'midtrans-client';
import NeonAdapter from './adapter';
import { getHTMLForErrorPage } from './get-html-for-error-page';
import { isAuthAction } from './is-auth-action';
import { API_BASENAME, api } from './route-builder';
neonConfig.webSocketConstructor = ws;

const als = new AsyncLocalStorage<{ requestId: string }>();

for (const method of ['log', 'info', 'warn', 'error', 'debug'] as const) {
  const original = nodeConsole[method].bind(console);

  console[method] = (...args: unknown[]) => {
    const requestId = als.getStore()?.requestId;
    if (requestId) {
      original(`[traceId:${requestId}]`, ...args);
    } else {
      original(...args);
    }
  };
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/dummy',
});
const adapter = NeonAdapter(pool);

const app = new Hono();

app.use('*', requestId());

app.use('*', (c, next) => {
  const requestId = c.get('requestId');
  return als.run({ requestId }, () => next());
});

app.use(contextStorage());

app.onError((err, c) => {
  if (c.req.method !== 'GET' || c.req.path.startsWith('/api/')) {
    const isProd = process.env.NODE_ENV === 'production';
    return c.json(
      isProd
        ? { error: 'Internal server error' }
        : { error: 'An error occurred in your app', details: serializeError(err) },
      500
    );
  }
  return c.html(getHTMLForErrorPage(err), 200);
});

if (process.env.CORS_ORIGINS) {
  app.use(
    '/*',
    cors({
      origin: process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()),
    })
  );
}
for (const method of ['post', 'put', 'patch'] as const) {
  app[method](
    '*',
    bodyLimit({
      maxSize: 4.5 * 1024 * 1024, // 4.5mb to match vercel limit
      onError: (c) => {
        return c.json({ error: 'Body size limit exceeded' }, 413);
      },
    })
  );
}

// Basic Security Headers (CSP, XFO, XCTO, RP, HSTS)
app.use('/*', async (c, next) => {
  await next();
  const isProd = process.env.NODE_ENV === 'production';
  const csp = [
    "default-src 'self'",
    "script-src 'self' https://www.googletagmanager.com https://cloud.umami.is https://kit.fontawesome.com 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://www.googleapis.com https://api.sandbox.midtrans.com https://api.midtrans.com https://api.telegram.org",
    "frame-src 'self' https://www.google.com",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
  c.res.headers.set('Content-Security-Policy', csp);
  c.res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  c.res.headers.set('X-Content-Type-Options', 'nosniff');
  c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (isProd) {
    c.res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
});

// CSRF: Double-submit token (cookie + header)
function getOrSetCsrfToken(c: any) {
  const cookie = c.req.cookie('csrfToken');
  if (cookie) return cookie;
  const token = crypto.randomBytes(16).toString('hex');
  c.cookie('csrfToken', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  return token;
}
app.use('/*', async (c, next) => {
  if (c.req.method === 'GET') {
    getOrSetCsrfToken(c);
  }
  return next();
});
function verifyCsrf(c: any) {
  const cookie = c.req.cookie('csrfToken');
  const header = c.req.header('x-csrf-token');
  return cookie && header && cookie === header;
}

// Payment: Server-side Price Authority
const PRODUCT_PRICE_MAP: Record<string, number> = {
  community: 50000,
  private: 100000,
  // corporate handled via consultation/manual flow, not gateway
};

function createMidtransClient() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
  const isProd = process.env.NODE_ENV === 'production';
  return new midtransClient.Snap({
    isProduction: isProd,
    serverKey,
    clientKey: process.env.VITE_MIDTRANS_CLIENT_KEY || '',
  });
}

app.post('/api/payment/token', async (c) => {
  if (!verifyCsrf(c)) {
    return c.json({ error: 'Invalid CSRF token' }, 403);
  }
  try {
    const payload = await c.req.json();
    const { itemDetails, customerDetails } = payload || {};
    const item = Array.isArray(itemDetails) ? itemDetails[0] : null;
    if (!item || !item.id || !customerDetails?.email) {
      return c.json({ error: 'Invalid payload' }, 400);
    }
    const productId = String(item.id);
    const unitPrice = PRODUCT_PRICE_MAP[productId];
    if (!unitPrice) {
      return c.json({ error: 'Unknown product' }, 400);
    }
    const quantity = 1;
    const grossAmount = unitPrice * quantity;
    const orderId = `SMI-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${crypto.randomBytes(3).toString('hex')}`;
    const snap = createMidtransClient();
    const transactionParams = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      item_details: [
        {
          id: productId,
          price: unitPrice,
          quantity,
          name: item.name || productId,
        },
      ],
      customer_details: {
        first_name: customerDetails.first_name || 'Customer',
        email: customerDetails.email,
        phone: customerDetails.phone || '',
      },
    };
    const tokenResponse = await snap.createTransactionToken(transactionParams);
    return c.json({ token: tokenResponse, redirect_url: '' }, 200);
  } catch (err) {
    console.error('Payment token error:', err);
    return c.json({ error: 'Failed to create payment token' }, 500);
  }
});

// Midtrans Webhook: Signature Verification
app.post('/api/payment/webhook', async (c) => {
  try {
    const body = await c.req.json();
    const signatureKey = body.signature_key;
    const orderId = body.order_id;
    const statusCode = body.status_code;
    const grossAmount = body.gross_amount;
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    const expected = crypto
      .createHash('sha512')
      .update(orderId + statusCode + grossAmount + serverKey)
      .digest('hex');
    if (expected !== signatureKey) {
      return c.json({ error: 'Invalid signature' }, 403);
    }
    // TODO: update order status in database (pending/success/failed) safely
    return c.json({ ok: true }, 200);
  } catch (err) {
    console.error('Webhook error:', err);
    return c.json({ error: 'Webhook processing failed' }, 500);
  }
});

// Contact: Telegram forwarding (Server-side)
app.post('/api/contact/telegram', async (c) => {
  if (!verifyCsrf(c)) {
    return c.json({ error: 'Invalid CSRF token' }, 403);
  }
  try {
    const { name, email, subject, message } = await c.req.json();
    if (!name || !email || !message) {
      return c.json({ error: 'Invalid form data' }, 400);
    }
    const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    const chatId = process.env.TELEGRAM_CHAT_ID || '';
    if (!botToken || !chatId) {
      return c.json({ error: 'Server not configured' }, 500);
    }
    const text = `📩 Pesan Baru dari Website SMI

Nama: ${name}
Email: ${email}
Subjek: ${subject ?? '-'}
Pesan: ${message}

---
Dikirim: ${new Date().toLocaleString('id-ID')}`;
    const resp = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!resp.ok) {
      return c.json({ error: 'Failed to send message' }, 502);
    }
    return c.json({ ok: true }, 200);
  } catch (err) {
    console.error('Contact telegram error:', err);
    return c.json({ error: 'Failed to process contact' }, 500);
  }
});
/* 
const authSecret = process.env.AUTH_SECRET || 'development_secret_only';
if (authSecret) {
  app.use(
    '*',
    initAuthConfig((c) => ({
      secret: authSecret,
      basePath: '/api/auth',
      pages: {
        signIn: '/account/signin',
        signOut: '/account/logout',
      },
      skipCSRFCheck,
      session: {
        strategy: 'jwt',
      },
      callbacks: {
        session({ session, token }) {
          if (token.sub) {
            session.user.id = token.sub;
          }
          return session;
        },
      },
      cookies: {
        csrfToken: {
          options: {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
          },
        },
        sessionToken: {
          options: {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
          },
        },
        callbackUrl: {
          options: {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
          },
        },
      },
      providers: [
        Credentials({
          id: 'credentials-signin',
          name: 'Credentials Sign in',
          credentials: {
            email: {
              label: 'Email',
              type: 'email',
            },
            password: {
              label: 'Password',
              type: 'password',
            },
          },
          authorize: async (credentials) => {
            const { email, password } = credentials;
            if (!email || !password) {
              return null;
            }
            if (typeof email !== 'string' || typeof password !== 'string') {
              return null;
            }

            // logic to verify if user exists
            const user = await adapter.getUserByEmail(email);
            if (!user) {
              return null;
            }
            const matchingAccount = user.accounts.find(
              (account) => account.provider === 'credentials'
            );
            const accountPassword = matchingAccount?.password;
            if (!accountPassword) {
              return null;
            }

            const isValid = await verify(accountPassword, password);
            if (!isValid) {
              return null;
            }

            // return user object with the their profile data
            return user;
          },
        }),
        Credentials({
          id: 'credentials-signup',
          name: 'Credentials Sign up',
          credentials: {
            email: {
              label: 'Email',
              type: 'email',
            },
            password: {
              label: 'Password',
              type: 'password',
            },
            name: { label: 'Name', type: 'text' },
            image: { label: 'Image', type: 'text', required: false },
          },
          authorize: async (credentials) => {
            const { email, password, name, image } = credentials;
            if (!email || !password) {
              return null;
            }
            if (typeof email !== 'string' || typeof password !== 'string') {
              return null;
            }

            // logic to verify if user exists
            const user = await adapter.getUserByEmail(email);
            if (!user) {
              const newUser = await adapter.createUser({
                id: crypto.randomUUID(),
                emailVerified: null,
                email,
                name: typeof name === 'string' && name.length > 0 ? name : undefined,
                image: typeof image === 'string' && image.length > 0 ? image : undefined,
              });
              await adapter.linkAccount({
                extraData: {
                  password: await hash(password),
                },
                type: 'credentials',
                userId: newUser.id,
                providerAccountId: newUser.id,
                provider: 'credentials',
              });
              return newUser;
            }
            return null;
          },
        }),
      ],
    }))
  );
}
*/
app.all('/integrations/:path{.+}', async (c, next) => {
  const queryParams = c.req.query();
  const url = `${process.env.NEXT_PUBLIC_CREATE_BASE_URL ?? 'https://www.create.xyz'}/integrations/${c.req.param('path')}${Object.keys(queryParams).length > 0 ? `?${new URLSearchParams(queryParams).toString()}` : ''}`;

  return proxy(url, {
    method: c.req.method,
    body: c.req.raw.body ?? null,
    // @ts-ignore - this key is accepted even if types not aware and is
    // required for streaming integrations
    duplex: 'half',
    redirect: 'manual',
    headers: {
      ...c.req.header(),
      'X-Forwarded-For': process.env.NEXT_PUBLIC_CREATE_HOST,
      'x-createxyz-host': process.env.NEXT_PUBLIC_CREATE_HOST,
      Host: process.env.NEXT_PUBLIC_CREATE_HOST,
      'x-createxyz-project-group-id': process.env.NEXT_PUBLIC_PROJECT_GROUP_ID,
    },
  });
});

/*
app.use('/api/auth/*', async (c, next) => {
  if (isAuthAction(c.req.path)) {
    return authHandler()(c, next);
  }
  return next();
});
*/
app.route(API_BASENAME, api);

export default await createHonoServer({
  app,
  defaultLogger: false,
});
