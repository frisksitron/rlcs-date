import "src/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar";
import Head from "next/head";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <div className={"bg-base-300"}>
          <Head>
            <title>rlcs.date - Keep up with RLCS events and dates</title>
            <meta
              name="description"
              content="When is the next RLCS event, and what is the schedule? Keep up with RLCS events and dates, Rocket League Championship Series. "
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <header className={"pb-8"}>
            <Navbar />
          </header>

          <main className={"container max-w-5xl mx-auto px-4 mb-20"}>
            <Component {...pageProps} />
          </main>

          <footer className="footer footer-center p-4 bg-neutral text-neutral-content">
            <div>
              <p>Data provided by Liquipedia.</p>
            </div>
          </footer>
        </div>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
