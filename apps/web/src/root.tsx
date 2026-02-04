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

// @ts-ignore
 
import { serializeError } from 'serialize-error';
import { Toaster } from 'sonner';
// @ts-ignore
import { LoadFonts } from 'virtual:load-fonts.jsx';
import type { Route } from './+types/root';
import './i18n/config';
// @ts-ignore
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
  },
  { rel: "icon", href: "/logo.jpeg" }
];

export function meta() {
  return [
    { title: "Sekolah Mentor Indonesia" },
    { name: "description", content: "Platform mentoring content creator Indonesia. Belajar dari mentor profesional, gabung komunitas, dan kembangkan karir digital Anda." },
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "theme-color", content: "#2563eb" },
    { name: "msapplication-TileColor", content: "#2563eb" },
    { name: "application-name", content: "Sekolah Mentor Indonesia" },
    { name: "apple-mobile-web-app-title", content: "SMI" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "default" },
    { name: "author", content: "Mohammad Iqbal Alhafizh" },
    { name: "robots", content: "index, follow" },
  ];
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

// Komponen root utama aplikasi.
// Bertanggung jawab untuk setup routing dasar, meta tags, dan error handling global.
export function Layout({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const location = useLocation();
  const pathname = location?.pathname;
  return (
    <html lang={i18n.language || 'id'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Sekolah Mentor Indonesia</title>
        <meta name="description" content="Platform mentoring content creator Indonesia. Belajar dari mentor profesional, gabung komunitas, dan kembangkan karir digital Anda." />
        <link rel="canonical" href={`https://smi.multipriority.com${pathname || ''}`} />

        {/* Schema Markup */}
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
                "url": "https://smi.multipriority.com"
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
              "url": "https://smi.multipriority.com/app"
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
              "url": "https://smi.multipriority.com",
              "logo": "https://smi.multipriority.com/logo.jpeg",
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
                "email": "info@smi.multipriority.com"
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
                "url": "https://smi.multipriority.com",
              },
              "description": "Founder & praktisi content creator dengan pengalaman 10+ tahun di digital marketing dan mentoring. Mentor utama di Sekolah Mentor Indonesia.",
              "url": "https://smi.multipriority.com/founder",
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
              "image": "https://smi.multipriority.com/mohamad-iqbal-alhafizh-founder-smi.jpeg"
            }),
          }}
        />
        
        <Meta />
        <Links />
        {LoadFontsSSR ? <LoadFontsSSR /> : null}
      </head>
      <body>
        <NotificationProvider>
          <AuthInitializer>
            <ClientOnly loader={() => children} />
            <NotificationContainer />
          </AuthInitializer>
        </NotificationProvider>
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
