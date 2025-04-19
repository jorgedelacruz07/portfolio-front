import Head from "next/head";
import { Navbar } from "./Navbar";
import { ReactNode } from "react";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <Head>
        <title>Portafolio de Jorge de la Cruz</title>
        <meta
          name="description"
          content="Portfolio personal de Jorge de la Cruz - Desarrollador Web"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Navbar />
      <main className="animate-fade-in px-4 py-8 md:py-12 mx-auto max-w-5xl min-h-[calc(100vh-8rem)]">
        {children}
      </main>
      <Footer />
    </div>
  );
};
