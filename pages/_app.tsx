import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "../components/Layout";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/query-client";
import { montserrat } from "../lib/fonts";
import { reportWebVitals } from "../lib/analytics";

function MyApp({ Component, pageProps }: AppProps) {
  // Report web vitals
  if (typeof window !== "undefined") {
    reportWebVitals();
  }

  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || 'G-4J8T4WP1S7';

  return (
    <>
      <Script
        id="gtm-script"
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
              transport_type: 'beacon',
              anonymize_ip: true
            });
          `,
        }}
      />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          enableSystem={false}
          defaultTheme="dark"
          attribute="class"
        >
          <div className={montserrat.variable}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
