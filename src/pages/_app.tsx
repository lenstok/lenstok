import "../styles/globals.css";
import Loading from "@/components/Loading";
import type { AppProps } from "next/app";
import { lazy, Suspense } from "react";
import Navbar from "@/components/UI/Navbar";
import Sidebar from "@/components/UI/Sidebar";

const Providers = lazy(() => import("@/components/Providers"));
// const Layout = lazy(() => import("@/components/Layout"));

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <Providers>
      <div className="xl:w-[1200px] m-auto overflow-hidden h-[100vh]">
        <Navbar />
        <div className="flex gap-6 md:gap-20 ">
        <div className="h-[92vh] overflow-hidden xl:hover:overflow-auto">
          <Sidebar />
        </div>
        <div className="mt-4 flex flex-col gap-10 overflow-auto h-[88vh] videos flex-1">
          <Component {...pageProps} />
        </div>
        </div>
      </div>
      </Providers>
    </Suspense>
  );
};

export default App;
