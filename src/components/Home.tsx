import type { NextPage } from "next";

import Navbar from "@/components/UI/Navbar";
import Sidebar from "@/components/UI/Sidebar";
import Explore from "@/components/Explore";

const Home: NextPage = () => {
  return (
    <div>
      <div className="xl:w-[1200px] lg:w-[1100px] m-auto overflow-hidden h-[100vh]">
        <Navbar />
        <div className="flex gap-6 md:gap-20 ">
          <div className="h-[92vh] overflow-hidden lg:hover:overflow-auto">
            <Sidebar />
          </div>
          <div className="mt-4 flex flex-col gap-10 overflow-auto h-[88vh] videos flex-1">
            <Explore />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
