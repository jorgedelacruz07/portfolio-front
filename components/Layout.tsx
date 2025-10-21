import Head from "next/head";
import { Navbar } from "./Navbar";
import { ReactNode } from "react";
import Footer from "./Footer";
import { ErrorBoundary } from "./ErrorBoundary";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
      <Head>
        <title>Jorge de la Cruz - Senior Software Engineer | React & Next.js Expert</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Senior Software Engineer specializing in React.js, Next.js, TypeScript, and Node.js. Building scalable web applications since 2016. Expert in modern JavaScript development and AI-powered tools."
        />
        <meta name="keywords" content="Jorge de la Cruz, Software Engineer, React, Next.js, TypeScript, Node.js, Full Stack Developer, Web Development" />
        <meta name="author" content="Jorge de la Cruz Padilla" />
        <meta property="og:title" content="Jorge de la Cruz - Senior Software Engineer" />
        <meta property="og:description" content="Senior Software Engineer specializing in React.js, Next.js, TypeScript, and Node.js" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jorgedelacruzpadilla.dev" />
        <meta property="og:image" content="https://jorgedelacruzpadilla.dev/images/jorge.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Jorge de la Cruz - Senior Software Engineer" />
        <meta name="twitter:description" content="Senior Software Engineer specializing in React.js, Next.js, TypeScript, and Node.js" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="canonical" href="https://jorgedelacruzpadilla.dev" />
      </Head>
      <Navbar />
      <main className="animate-fade-in px-4 sm:px-6 lg:px-8 py-8 md:py-10 mx-auto max-w-5xl min-h-[calc(100vh-8rem)]">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};
