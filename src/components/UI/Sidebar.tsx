import { useState } from "react";
import { ImCancelCircle } from "react-icons/im";
import { AiFillHome, AiOutlineMenu } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/router";

//import Discover from "./Discover";
import SuggestedAccounts from "@/components/SuggestedAccounts";
import Footer from "./Footer";
import LoginButton from "@/components/LoginButton";

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const { pathname } = useRouter();

  const userProfile = false;

  const activeLink =
    "flex items-center gap-3 hover:bg-primary p-3 justify-center xl:justify-start cursor-pointer font-semibold text-[#527862]";

  const normalLink =
    "flex items-center gap-3 hover:bg-primary p-3 justify-center xl:justify-start cursor-pointer font-semibold rounded";

  return (
    <div>
      <div
        className="block xl:hidden m-2 ml-4 mt-3 text-xl"
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? <ImCancelCircle /> : <AiOutlineMenu />}
      </div>
      {showSidebar && (
        <div className="w-20 md:w-72 flex flex-col  justify-start mb-10 border-r-2 border-gray-100 xl:border-0 p-3 ">
          <div className="pr-4">
            <LoginButton />
          </div>
          {/*  <Discover /> */}
          <SuggestedAccounts />
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
