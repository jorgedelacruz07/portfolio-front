import Head from "next/head";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export const Layout = ({ children }: any) => {
  return (
    <div>
      <Head>
        <title>Portafolio de Jorge de la Cruz</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Navbar />
      <main className="m-8 md:my-12 md:mx-auto md:max-w-2xl lg:max-w-3xl min-h-[89vh]">
        {children}
      </main>
      <Footer />
    </div>
  );
};
