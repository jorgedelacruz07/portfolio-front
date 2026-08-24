import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Navbar } from "./Navbar";
import { ReactNode } from "react";
import Footer from "./Footer";
import { ErrorBoundary } from "./ErrorBoundary";
import { PerformanceMonitor } from "./PerformanceMonitor";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const currentUrl = `https://jorgedelacruzpadilla.dev${location.pathname}`;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-primary/20 selection:text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      <PerformanceMonitor />
      <Helmet>
        <title>Jorge de la Cruz - Senior Software Engineer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Senior Software Engineer specializing in React.js, TypeScript, and Node.js. Building scalable web applications since 2016. Expert in modern JavaScript development and AI-powered tools."
        />
        <meta
          name="keywords"
          content="Jorge de la Cruz, Software Engineer, React, TypeScript, Node.js, Full Stack Developer, Web Development, AI Tools, Vite, Portfolio"
        />
        <meta name="author" content="Jorge de la Cruz Padilla" />
        <meta
          property="og:title"
          content="Jorge de la Cruz | Senior Software Engineer"
        />
        <meta
          property="og:description"
          content="Senior Software Engineer specializing in React.js, TypeScript, Node.js, and Native MongoDB Architecture. Building fast, scalable full-stack products."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta
          property="og:image"
          content="https://jorgedelacruzpadilla.dev/images/og-image.png"
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Jorge de la Cruz - Senior Software Engineer"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@jorgedelacruz07" />
        <meta name="twitter:creator" content="@jorgedelacruz07" />
        <meta
          name="twitter:title"
          content="Jorge de la Cruz | Senior Software Engineer"
        />
        <meta
          name="twitter:description"
          content="Senior Software Engineer specializing in React.js, TypeScript, Node.js, and Native MongoDB Architecture. Building fast, scalable full-stack products."
        />
        <meta
          name="twitter:image"
          content="https://jorgedelacruzpadilla.dev/images/og-image.png"
        />
        <meta
          name="twitter:image:alt"
          content="Jorge de la Cruz - Senior Software Engineer"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="canonical" href={currentUrl} />
      </Helmet>
      <Navbar />
      <main className="relative z-10 min-h-[calc(100vh-8rem)] w-full px-4 py-4 sm:px-6 lg:px-8 sm:py-6">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};
