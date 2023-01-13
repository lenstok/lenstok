import "../styles/globals.css";
import Loading from "@/components/Loading";
import type { AppProps } from "next/app";
import { lazy, Suspense } from "react";
import Head from "next/head";
import Script from "next/script";

const Providers = lazy(() => import("@/components/Providers"));
const Layout = lazy(() => import("@/components/Layout"));

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_MEASUREMENT_ID;

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <div>
      <Head>
      <title>LensTok</title>
        <meta
          name="description"
          content="Decentralised social video sharing"/>
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </Head>
      <Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}');
  `}
</Script>
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
