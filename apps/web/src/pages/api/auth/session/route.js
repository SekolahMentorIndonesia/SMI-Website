import { getToken } from '@auth/core/jwt';

export async function GET(request) {
  try {
    const jwt = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.AUTH_URL?.startsWith('https') || false,
    });

    if (!jwt) {
      return new Response(JSON.stringify({}), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(
      JSON.stringify({
        user: {
          id: jwt.sub,
          email: jwt.email,
          name: jwt.name,
          image: jwt.picture,
        },
        expires: jwt.exp ? new Date(jwt.exp * 1000).toISOString() : null,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Session API error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
