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

  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-4J8T4WP1S7"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
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
