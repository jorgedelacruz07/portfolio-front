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
    <div className="relative min-h-screen overflow-x-hidden bg-transparent text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_8%,hsl(var(--primary)/0.18),transparent_28%),radial-gradient(circle_at_82%_16%,hsl(var(--accent)/0.12),transparent_24%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background))_42%,hsl(195_38%_7%))]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.05)_1px,transparent_1px)] bg-[size:88px_88px]" />
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
          content="Jorge de la Cruz - Senior Software Engineer"
        />
        <meta
          property="og:description"
          content="Senior Software Engineer specializing in React.js, TypeScript, and Node.js"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta
          property="og:image"
          content="https://jorgedelacruzpadilla.dev/images/jorge.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Jorge de la Cruz - Senior Software Engineer"
        />
        <meta
          name="twitter:description"
          content="Senior Software Engineer specializing in React.js, TypeScript, and Node.js"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="canonical" href={currentUrl} />
      </Helmet>
      <Navbar />
      <main className="relative z-10 min-h-[calc(100vh-8rem)] w-full px-4 py-8 sm:px-6 lg:px-8 md:py-10">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};
