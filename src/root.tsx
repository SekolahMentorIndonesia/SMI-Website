import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from 'react-router';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type FC,
  Component,
} from 'react';
import './styles/global.css';

import fetch from '@/__create/fetch.ts';
// @ts-ignore

import { useNavigate } from 'react-router';
import { Toaster } from 'sonner';
// @ts-ignore
import { LoadFonts } from 'virtual:load-fonts.jsx';
import { HotReloadIndicator } from './__create/HotReload.tsx';
import { useSandboxStore } from './__create/hmr-sandbox-store.ts';
import type { Route } from './+types/root.ts';
import { useDevServerHeartbeat } from './__create/useDevServerHeartbeat.ts';
import './i18n/config.js';
import { useTranslation } from 'react-i18next';
// @ts-ignore
import { useNotification, NotificationProvider } from './contexts/NotificationContext.jsx';
// @ts-ignore
import { AuthProvider } from './contexts/AuthContext.jsx';
// @ts-ignore
import NotificationContainer from './components/NotificationContainer.jsx';
// @ts-ignore


export const links = () => [
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect", 
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  }
];

export function meta() {
  return [
    { title: "Sekolah Mentor Indonesia" },
    { name: "description", content: "Belajar langsung dari mentor praktisi. Kurikulum terukur, komunitas suportif, dan akses kolaborasi untuk generasi muda siap berkarya." },
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "robots", content: "index, follow" }
  ];
}
if (globalThis.window && globalThis.window !== undefined) {
  globalThis.window.fetch = fetch;
}

const LoadFontsSSR = import.meta.env.SSR ? LoadFonts : null;
if (import.meta.hot) {
  import.meta.hot.on('update-font-links', (urls: string[]) => {
    // remove old font links
    for (const link of document.querySelectorAll('link[data-auto-font]')) {
      link.remove();
    }

    // add new ones
    for (const url of urls) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.dataset.autoFont = 'true';
      document.head.appendChild(link);
    }
  });
}

function SharedErrorBoundary({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children?: ReactNode;
}): React.ReactElement {
  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out ${
        isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="bg-[#18191B] text-[#F2F2F2] rounded-lg p-4 max-w-md w-full mx-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-[#F2F2F2] rounded-full flex items-center justify-center">
              <span className="text-black text-[1.125rem] leading-none">!</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <div className="flex flex-col gap-1">
              <p className="font-light text-[#F2F2F2] text-sm">App Error Detected</p>
              <p className="text-[#959697] text-sm font-light">
                It looks like an error occurred while trying to use your app.
              </p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * NOTE: we have a shared error boundary for the app, but then we also expose
 * this in case something goes wrong outside of the normal user's app flow.
 * React-router will mount this one
 */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <SharedErrorBoundary isOpen={true} />;
}

/**
 * useHmrConnection()
 * ------------------
 * • `true`  → HMR socket is healthy
 * • `false` → socket lost (Vite is polling / may auto‑reload soon)
 *
 * Works only in dev; in prod it always returns `true`.
 */
export function useHmrConnection(): boolean {
  const [connected, setConnected] = useState(() => !!import.meta.hot);

  useEffect(() => {
    // No HMR object outside dev builds
    if (!import.meta.hot) return;

    /** Fired the moment the WS closes unexpectedly */
    const onDisconnect = () => setConnected(false);
    /** Fired every time the WS (re‑)opens */
    const onConnect = () => setConnected(true);

    import.meta.hot.on('vite:ws:disconnect', onDisconnect);
    import.meta.hot.on('vite:ws:connect', onConnect);

    // Optional: catch the “about to full‑reload” event as a last resort
    const onFullReload = () => setConnected(false);
    import.meta.hot.on('vite:beforeFullReload', onFullReload);

    return () => {
      import.meta.hot?.off('vite:ws:disconnect', onDisconnect);
      import.meta.hot?.off('vite:ws:connect', onConnect);
      import.meta.hot?.off('vite:beforeFullReload', onFullReload);
    };
  }, []);

  return connected;
}

const healthyResponseType = 'sandbox:web:healthcheck:response';
const useHandshakeParent = () => {
  const isHmrConnected = useHmrConnection();
  useEffect(() => {
    const healthyResponse = {
      type: healthyResponseType,
      healthy: isHmrConnected,
    };
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'sandbox:web:healthcheck') {
        window.parent.postMessage(healthyResponse, '*');
      }
    };
    window.addEventListener('message', handleMessage);
    // Immediately respond to the parent window with a healthy response in
    // case we missed the healthcheck message
    window.parent.postMessage(healthyResponse, '*');
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isHmrConnected]);
};

const useCodeGen = () => {
  const { startCodeGen, setCodeGenGenerating, completeCodeGen, errorCodeGen, stopCodeGen } =
    useSandboxStore();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type } = event.data;

      switch (type) {
        case 'sandbox:web:codegen:started':
          startCodeGen();
          break;
        case 'sandbox:web:codegen:generating':
          setCodeGenGenerating();
          break;
        case 'sandbox:web:codegen:complete':
          completeCodeGen();
          break;
        case 'sandbox:web:codegen:error':
          errorCodeGen();
          break;
        case 'sandbox:web:codegen:stopped':
          stopCodeGen();
          break;
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [startCodeGen, setCodeGenGenerating, completeCodeGen, errorCodeGen, stopCodeGen]);
};

const useRefresh = () => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'sandbox:web:refresh:request') {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        window.parent.postMessage({ type: 'sandbox:web:refresh:complete' }, '*');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
};

const waitForScreenshotReady = async () => {
  const images = Array.from(document.images);

  await Promise.all([
    // make sure custom fonts are loaded
    'fonts' in document ? document.fonts.ready : Promise.resolve(),
    ...images.map(
      (img) =>
        new Promise((resolve) => {
          img.crossOrigin = 'anonymous';
          if (img.complete) {
            resolve(true);
            return;
          }
          img.onload = () => resolve(true);
          img.onerror = () => resolve(true);
        })
    ),
  ]);

  // small buffer to ensure rendering is stable
  await new Promise((resolve) => setTimeout(resolve, 250));
};

export const useHandleScreenshotRequest = () => {
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data.type === 'sandbox:web:screenshot:request') {
        try {
          await waitForScreenshotReady();

          const width = window.innerWidth;
          const aspectRatio = 16 / 9;
          const height = Math.floor(width / aspectRatio);

          // Lazy load html-to-image
          const { toPng } = await import('html-to-image');

          // html-to-image already handles CORS, fonts, and CSS inlining
          const dataUrl = await toPng(document.body, {
            cacheBust: true,
            skipFonts: false,
            width,
            height,
            style: {
              // force snapshot sizing
              width: `${width}px`,
              height: `${height}px`,
              margin: '0',
            },
          });

          window.parent.postMessage({ type: 'sandbox:web:screenshot:response', dataUrl }, '*');
        } catch (error) {
          window.parent.postMessage(
            {
              type: 'sandbox:web:screenshot:error',
              error: error instanceof Error ? error.message : String(error),
            },
            '*'
          );
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
};
// Komponen root utama aplikasi.
// Bertanggung jawab untuk setup routing dasar, meta tags, dan error handling global.
export function Layout({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  useHandshakeParent();
  useCodeGen();
  useRefresh();
  useHandleScreenshotRequest();
  useDevServerHeartbeat();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location?.pathname;
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'sandbox:navigation') {
        navigate(event.data.pathname);
      }
    };
    window.addEventListener('message', handleMessage);
    window.parent.postMessage({ type: 'sandbox:web:ready' }, '*');
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [navigate]);

  useEffect(() => {
    if (pathname) {
      window.parent.postMessage(
        {
          type: 'sandbox:web:navigation',
          pathname,
        },
        '*'
      );
    }
  }, [pathname]);

  useEffect(() => {
    let loaded = false;
    const loadGtag = () => {
      if (loaded) return;
      loaded = true;
      if (typeof window === 'undefined') return;
      if ((window as any).gtag) return;
      const script = document.createElement('script');
      script.src = "https://www.googletagmanager.com/gtag/js?id=G-4QKTE25P65";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      (window as any).dataLayer = (window as any).dataLayer || [];
      // @ts-ignore
      (window as any).gtag = function(){(window as any).dataLayer.push(arguments);}
      // @ts-ignore
      (window as any).gtag('js', new Date());
      // @ts-ignore
      (window as any).gtag('config', 'G-4QKTE25P65', { send_page_view: false });
    };
    const onFirstInteraction = () => {
      loadGtag();
      window.removeEventListener('pointerdown', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
      window.removeEventListener('scroll', onFirstInteraction);
    };
    window.addEventListener('pointerdown', onFirstInteraction, { once: true });
    window.addEventListener('keydown', onFirstInteraction, { once: true });
    window.addEventListener('scroll', onFirstInteraction, { once: true, passive: true });
    const idle = (cb: () => void, timeout = 15000) => {
      // @ts-ignore
      if (window.requestIdleCallback) {
        // @ts-ignore
        window.requestIdleCallback(cb, { timeout });
      } else {
        setTimeout(cb, timeout);
      }
    };
    idle(loadGtag, 15000);
    return () => {
      window.removeEventListener('pointerdown', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
      window.removeEventListener('scroll', onFirstInteraction);
    };
  }, []);

  return (
    <html lang={i18n.language} dir={typeof i18n.dir === 'function' ? i18n.dir() : 'ltr'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Sekolah Mentor Indonesia</title>
        <meta name="description" content="Belajar langsung dari mentor praktisi. Kurikulum terukur, komunitas suportif, dan akses kolaborasi untuk generasi muda siap berkarya." />
        <link rel="canonical" href={`https://smi.multipriority.com${pathname || ''}`} />
        <meta name="robots" content="index, follow" />
        <link rel="preload" as="image" href="/logo.jpeg" />
        
        <Meta />
        <Links />
        
        {/* Umami Analytics */}
        <script 
          defer 
          src="https://cloud.umami.is/script.js" 
          data-website-id="e080d060-1f57-4d3c-a156-e58648442b43"
        />
        
        <link rel="icon" href="/logo.jpeg" type="image/jpeg" />
        {LoadFontsSSR ? <LoadFontsSSR /> : null}
      </head>
      <body>
        <AuthProvider>
          <NotificationProvider>
              {children}
              <NotificationContainer />
          </NotificationProvider>
        </AuthProvider>
        
        <Toaster position="bottom-right" />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Outlet />
  );
}
