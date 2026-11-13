import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Navbar } from "./Navbar";
import { ReactNode } from "react";
import Footer from "./Footer";
import { ErrorBoundary } from "./ErrorBoundary";
import { PerformanceMonitor } from "./PerformanceMonitor";
import { useSiteContent } from "@/hooks";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { copy, settings } = useSiteContent();
  const currentUrl = `https://jorgedelacruzpadilla.dev${location.pathname}`;
  const isAdmin = location.pathname.startsWith("/admin");
  const siteTitle = settings?.seoTitle || copy["layout.siteName"];
  const siteDescription = settings?.seoDescription || "";
  const siteKeywords =
    settings?.seoKeywords || "Jorge de la Cruz Padilla, Software Engineer, React, TypeScript, Node.js";
  const openGraphImage = settings?.openGraphImage || "https://jorgedelacruzpadilla.dev/images/og-image.png?v=2";

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground selection:bg-primary/20 selection:text-foreground">
      <PerformanceMonitor />
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={siteDescription} />
        <meta name="keywords" content={siteKeywords} />
        <meta name="author" content={copy["layout.author"]} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={copy["layout.siteName"]} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:image" content={openGraphImage} />
        <meta property="og:image:secure_url" content={openGraphImage} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={copy["layout.openGraphAlt"]} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={copy["layout.twitterSite"]} />
        <meta name="twitter:creator" content={copy["layout.twitterCreator"]} />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={openGraphImage} />
        <meta name="twitter:image:alt" content={copy["layout.openGraphAlt"]} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="canonical" href={currentUrl} />
      </Helmet>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-foreground focus:px-3 focus:py-2 focus:text-sm focus:text-background"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="content" tabIndex={-1} className="relative z-10 min-h-[calc(100vh-8rem)] w-full outline-none">
        <div className={isAdmin ? "admin-theme px-4 sm:px-6" : undefined}>
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
      </main>
      <Footer />
    </div>
  );
};
