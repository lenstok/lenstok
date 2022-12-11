import "../styles/globals.css";
import Loading from "@/components/Loading";
import type { AppProps } from "next/app";
import { lazy, Suspense } from "react";
import Head from "next/head";

const Providers = lazy(() => import("@/components/Providers"));
const Layout = lazy(() => import("@/components/Layout"));

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <div>
      <Head>
      <title>Lenstok</title>
        <meta
          name="description"
          content="Decentralised social video sharing"/>
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
    <Suspense fallback={<Loading />}>
      <Providers>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Providers>
    </Suspense>
    </div>
  );
};

export default App;
