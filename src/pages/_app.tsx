import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar";
import "src/styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={"bg-base-300"}>
      <Head>
        <title>rlcs.date</title>
        <meta
          name="description"
          content="Dates and schedule for RLCS events, Rocket League Championship Series 2021-2022"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={"pb-8"}>
        <Navbar />
      </header>

      <main className={"container mx-auto px-4 mb-20"}>
        <Component {...pageProps} />
      </main>

      <footer className="footer footer-center p-4 bg-neutral text-neutral-content">
        <div>
          <p>Data provided by Liquipedia.</p>
        </div>
      </footer>
    </div>
  );
}

export default MyApp;
