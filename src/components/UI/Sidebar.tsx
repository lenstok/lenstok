import React, { useState } from 'react'
import Link from "next/link";
import { useRouter } from "next/router";

import { AiFillHome, AiOutlineMenu, AiFillCalendar } from 'react-icons/ai';
import { ImCancelCircle } from 'react-icons/im';

//import Discover from "./Discover";
import SuggestedAccounts from "@/components/SuggestedAccounts";
import Footer from "./Footer";
import LoginButton from "@/components/LoginButton";

const Sidebar = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [accounts, setAccounts] = useState(null);
  const { pathname } = useRouter();

  const userProfile = false;

  const activeLink =
    "flex items-center gap-3 hover:bg-primary p-3 justify-center xl:justify-start cursor-pointer font-semibold text-[#527862]";

  const normalLink =
    "flex items-center gap-3 hover:bg-primary p-3 justify-center lg:justify-start curser-pointer font-semibold text-[#96de26] rounded'";

  return (
    <div>
    <div 
    className="block lg:hidden m-2 ml-4 mt-3 text-xl"
    onClick={() => setShowSidebar((prev) => !prev)}>    {/* the prev thing is the same as having !showSidebar but better practice  */}
     { showSidebar ? <ImCancelCircle /> 
     : <AiOutlineMenu />}
     </div> 
     {showSidebar && (
         <div className="lg:w-400 w-20 flex flex-col justify-start mb-10 border-r-2 border-gray-100 xl:border-0 p-3">
             <div className="lg:border-b-2 border-gray-200 xl:pb-4">
                 <Link href="/">
                     <div className={normalLink}>
                         <p className="text-2xl">
                             <AiFillHome />
                         </p>
                         <span className="text-lg hidden lg:block">
                             For You
                         </span>
                     </div>
                 </Link>
                 <Link href="/">
                     <div className={normalLink}>
                         <p className="text-2xl text-[#25511f]">
                             <AiFillCalendar />
                         </p>
                         <span className="text-lg hidden lg:block text-[#25511f]">
                             Latest
                         </span>
                     </div>
                 </Link>
             </div>
             {!userProfile && (
                 <div className="px-2 py-4 hidden lg:block">
                 <p className="text-gray-400">Log in to like and comment on videos</p>
                 {/* <div className="pr-4">
                     <Googlelogin
                     onSuccess={() => {}}
                     onFailure={() => {}}
                     />
                 </div> */}
                     <div>
                         <button 
                         className="cursor-pointer bg-white text-lg text-[#96de26] border-[1px] border-[#96de26] font-semibold px-6 py-3 rounded-md outline-none w-full mt-3
                         hover:text-[#25511f] hover:bg-[#96de26]"
                         type="button"
                         >
                         Log In
                         </button>
                     </div>
                 </div>
             )}
             <SuggestedAccounts />
             <Footer />
         </div>
     )}
 </div>
);
};

export default Sidebar;
