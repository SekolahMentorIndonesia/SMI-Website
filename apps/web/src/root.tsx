import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useAsyncError,
  useLocation,
  useRouteError,
} from 'react-router';

import { useButton } from '@react-aria/button';
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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { toPng } from 'html-to-image';
import fetch from '@/__create/fetch';
// @ts-ignore

import { useNavigate } from 'react-router';
import { serializeError } from 'serialize-error';
import { Toaster } from 'sonner';
// @ts-ignore
import { LoadFonts } from 'virtual:load-fonts.jsx';
import { HotReloadIndicator } from './__create/HotReload';
import { useSandboxStore } from './__create/hmr-sandbox-store';
import type { Route } from './+types/root';
import { useDevServerHeartbeat } from './__create/useDevServerHeartbeat';
import './i18n/config';
import { useTranslation } from 'react-i18next';
// @ts-ignore
import { useNotification, NotificationProvider } from './contexts/NotificationContext';
// @ts-ignore
import NotificationContainer from './components/NotificationContainer';
// @ts-ignore
import AuthInitializer from './components/AuthInitializer';

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

function InternalErrorBoundary({ error: errorArg }: Route.ErrorBoundaryProps) {
  const routeError = useRouteError();
  const asyncError = useAsyncError();
  const error = errorArg ?? asyncError ?? routeError;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const animateTimer = setTimeout(() => setIsOpen(true), 100);
    return () => clearTimeout(animateTimer);
  }, []);
  const { buttonProps: showLogsButtonProps } = useButton(
    {
      onPress: useCallback(() => {
        window.parent.postMessage(
          {
            type: 'sandbox:web:show-logs',
          },
          '*'
        );
      }, []),
    },
    useRef<HTMLButtonElement>(null)
  );
  const { buttonProps: fixButtonProps } = useButton(
    {
      onPress: useCallback(() => {
        window.parent.postMessage(
          {
            type: 'sandbox:web:fix',
            error: serializeError(error),
          },
          '*'
        );
        setIsOpen(false);
      }, [error]),
      isDisabled: !error,
    },
    useRef<HTMLButtonElement>(null)
  );
  const { buttonProps: copyButtonProps } = useButton(
    {
      onPress: useCallback(() => {
        navigator.clipboard.writeText(JSON.stringify(serializeError(error)));
      }, [error]),
    },
    useRef<HTMLButtonElement>(null)
  );

  function isInIframe() {
    try {
      return window.parent !== window;
    } catch {
      return true;
    }
  }
  return (
    <SharedErrorBoundary isOpen={isOpen}>
      {isInIframe() ? (
        <div className="flex gap-2">
          {!!error && (
            <button
              className="flex flex-row items-center justify-center gap-[4px] outline-none transition-colors rounded-[8px] border-[1px] bg-[#f9f9f9] hover:bg-[#dbdbdb] active:bg-[#c4c4c4] border-[#c4c4c4] text-[#18191B] text-sm px-[8px] py-[4px] cursor-pointer"
              type="button"
              {...fixButtonProps}
            >
              Try to fix
            </button>
          )}

          <button
            className="flex flex-row items-center justify-center gap-[4px] outline-none transition-colors rounded-[8px] border-[1px] bg-[#2C2D2F] hover:bg-[#414243] active:bg-[#555658] border-[#414243] text-white text-sm px-[8px] py-[4px]"
            type="button"
            {...showLogsButtonProps}
          >
            Show logs
          </button>
        </div>
      ) : (
        <button
          className="flex flex-row items-center justify-center gap-[4px] outline-none transition-colors rounded-[8px] border-[1px] bg-[#2C2D2F] hover:bg-[#414243] active:bg-[#555658] border-[#414243] text-white text-sm px-[8px] py-[4px] w-fit"
          type="button"
          {...copyButtonProps}
        >
          Copy error
        </button>
      )}
    </SharedErrorBoundary>
  );
}

type ErrorBoundaryProps = {
  children: React.ReactNode;
};

type ErrorBoundaryState = { hasError: boolean; error: unknown | null };

class ErrorBoundaryWrapper extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <InternalErrorBoundary error={this.state.error} params={{}} />;
    }
    return this.props.children;
  }
}

function LoaderWrapper({ loader }: { loader: () => React.ReactNode }) {
  return <>{loader()}</>;
}

type ClientOnlyProps = {
  loader: () => React.ReactNode;
};

export const ClientOnly: React.FC<ClientOnlyProps> = ({ loader }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <ErrorBoundaryWrapper>
      <LoaderWrapper loader={loader} />
    </ErrorBoundaryWrapper>
  );
};

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
  return (
    <html lang={i18n.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* SEO Meta Tags */}
        <meta name="description" content="Sekolah Mentor Indonesia - Platform mentoring terbaik untuk content creator Indonesia. Belajar dari mentor profesional, bergabung dengan komunitas kreator, dan kembangkan karir digital Anda." />
        <meta name="keywords" content="sekolah mentor indonesia, mentoring content creator, kursus digital, belajar content creation, komunitas creator, platform mentoring indonesia, kursus online indonesia, mentor profesional, belajar digital marketing" />
        <meta name="author" content="Mohammad Iqbal Alhafizh" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://smi.id" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Sekolah Mentor Indonesia - Mentoring untuk Content Creator" />
        <meta property="og:description" content="Platform mentoring terbaik untuk content creator Indonesia. Belajar dari mentor profesional dan bergabung dengan komunitas kreator." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://smi.id" />
        <meta property="og:image" content="/logo.jpeg" />
        <meta property="og:image:alt" content="Logo Sekolah Mentor Indonesia" />
        <meta property="og:site_name" content="Sekolah Mentor Indonesia" />
        <meta property="og:locale" content="id_ID" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sekolah Mentor Indonesia" />
        <meta name="twitter:description" content="Platform mentoring untuk content creator Indonesia" />
        <meta name="twitter:image" content="/logo.jpeg" />
        <meta name="twitter:image:alt" content="Logo Sekolah Mentor Indonesia" />
        <meta name="twitter:site" content="@sekolahmentorid" />
        
        {/* Additional SEO Tags */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="application-name" content="Sekolah Mentor Indonesia" />
        <meta name="apple-mobile-web-app-title" content="SMI" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Course Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Course",
              "name": "Mentoring Content Creator",
              "description": "Program mentoring komprehensif untuk content creator Indonesia dengan mentor profesional dan komunitas suportif.",
              "provider": {
                "@type": "Organization",
                "name": "Sekolah Mentor Indonesia",
                "url": "https://smi.id"
              },
              "educationalLevel": "Beginner to Advanced",
              "inLanguage": ["id"],
              "offers": {
                "@type": "Offer",
                "category": "Educational Course",
                "priceCurrency": "IDR",
                "availability": "https://schema.org/InStock"
              },
              "hasCourseInstance": {
                "@type": "CourseInstance",
                "courseMode": "online",
                "instructor": {
                  "@type": "Person",
                  "name": "Mohammad Iqbal Alhafizh"
                }
              },
              "teaches": [
                "Content Creation",
                "Digital Marketing",
                "Social Media Strategy",
                "Video Production",
                "Business Mentoring"
              ],
              "url": "https://smi.id/app"
            }),
          }}
        />
        
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Sekolah Mentor Indonesia",
              "alternateName": "SMI",
              "url": "https://smi.id",
              "logo": "https://smi.id/logo.jpeg",
              "description": "Platform mentoring terbaik untuk content creator Indonesia dengan program komprehensif dan komunitas profesional.",
              "foundingDate": "2023",
              "founder": {
                "@type": "Person",
                "name": "Mohammad Iqbal Alhafizh",
                "jobTitle": "Founder & Business Mentor"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "info@smi.id"
              },
              "sameAs": [
                "https://www.instagram.com/sekolahmentorindonesia",
                "https://www.youtube.com/@sekolahmentorindonesia"
              ],
              "knowsLanguage": ["id", "en"],
              "areaServed": "ID"
            }),
          }}
        />
        
        {/* Founder Person Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Mohammad Iqbal Alhafizh",
              "alternateName": "Iqbal Alhafizh",
              "jobTitle": "Founder & Mentor Utama",
              "worksFor": {
                "@type": "Organization",
                "name": "Sekolah Mentor Indonesia",
                "url": "https://smi.id",
              },
              "description": "Founder & praktisi content creator dengan pengalaman 10+ tahun di digital marketing dan mentoring. Mentor utama di Sekolah Mentor Indonesia.",
              "url": "https://smi.id/founder",
              "sameAs": [
                "https://www.instagram.com/iqbalalhafizh",
                "https://www.youtube.com/@iqbalalhafizh",
                "https://www.linkedin.com/in/iqbalalhafizh"
              ],
              "knowsAbout": [
                "Content Creation",
                "Digital Marketing", 
                "Mentoring",
                "Business Strategy",
                "Social Media Management"
              ],
              "image": "https://smi.id/mohamad-iqbal-alhafizh-founder-smi.jpeg"
            }),
          }}
        />
        
        <Meta />
        <Links />
        <script type="module" src="/src/__create/dev-error-overlay.js"></script>
        <link rel="icon" href="/logo.jpeg" />
        {LoadFontsSSR ? <LoadFontsSSR /> : null}
      </head>
      <body>
        <NotificationProvider>
          <AuthInitializer>
            <ClientOnly loader={() => children} />
            <NotificationContainer />
          </AuthInitializer>
        </NotificationProvider>
        <HotReloadIndicator />
        <Toaster position="bottom-right" />
        <ScrollRestoration />
        <Scripts />
        <script src="https://kit.fontawesome.com/2c15cc0cc7.js" crossOrigin="anonymous" async />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Outlet />
  );
}
