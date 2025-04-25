import Head from "next/head";
import { Navbar } from "./Navbar";
import { ReactNode } from "react";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
      <Head>
        <title>Portafolio de Jorge de la Cruz</title>
        <meta
          name="description"
          content="Portfolio personal de Jorge de la Cruz - Desarrollador Web"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <Navbar />
      <main className="animate-fade-in px-4 sm:px-6 lg:px-8 py-8 md:py-10 mx-auto max-w-5xl min-h-[calc(100vh-8rem)]">
        {children}
      </main>
      <Footer />
    </div>
  );
};
