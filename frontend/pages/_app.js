import "../styles/globals.css";
import { Inter } from "@next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/logo.png" />
      </Head>
      <div className={inter.className}>
        <Toaster position="top-center" />
        <Component {...pageProps} />
      </div>
    </>
  );
}
