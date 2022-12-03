import logo from "@/images/Lenstoklogo.png";
import Link from "next/link";
import Image from "next/image";
import type { FC } from "react";
import { useAppStore } from "src/store/app";
import { sanitizeIpfsUrl } from '@/utils/sanitizeIpfsUrl';

import { BiSearch } from 'react-icons/bi';
import { IoMdAdd } from 'react-icons/io';
import LoginButtonMobile from "../LoginButtonMobile";

const Navbar: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const profilePic = currentProfile?.picture
  console.log('CURRENT PROFILE', currentProfile?.picture)
  
  return (
    <div className="w-full flex justify-between items-center border-b-2 border-gray-200 py-2 px-4">
      <Link href="/">
        <div className="w-[100px] md:w-[129px]">
          <Image
            className="cursor-pointer"
            src={logo}
            alt="logo"
            layout="responsive"
          />
        </div>
      </Link>

    <div className='relative hidden md:block'>
      <form className='absolute md:static top-10 -left-20 bg-white'>
        <input 
        className='bg-primary p-3 md:text-md font-medium border-2 border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 w-[300px] md:w-[350px] rounded-full md:top-0'
        placeholder='Search accounts and videos'
        />
        <button className='absolute md:right-5 right-6 top-4 border-l-2 border-gray-300 pl-4 text-2xl text-gray-400'>
        <BiSearch />
        </button>
      </form>
    </div>

    <div>
      <div className='flex gap-5 md:gap-10 '>
      {currentProfile ? (
        <Link href='/upload'>
        <button className=' px-2 py-2 md:px-4 text-md font-semibold flex items-center gap-2 cursor-pointer
         bg-white text-lg border-[1px] border-[#96de26] text-[#25511f] hover:bg-[#96de26]' >
         {/*className='border-2 px-2 py-2 md:px-4 text-md font-semibold flex items-center gap-2'*/}
         <IoMdAdd className='text-xl' />{' '}
         <span className='hidden md:block'>Upload </span>
        </button>  
        </Link>
        ) : (
          null
        )}

      <div className="flex">
        {currentProfile ? (
           <div className='w-12 h-12'>
          <Link href={`/profile/${currentProfile.id}`} key={currentProfile.id}>
            { profilePic?.__typename === "MediaSet" ? (
              profilePic.original?.url.includes("ipfs") ? (
                    <Image
                    src={sanitizeIpfsUrl(profilePic?.original.url)}
                    width={40}
                    height={40}
                    className='rounded-full cursor-pointer'
                    alt={currentProfile.id.handle}
                    layout='responsive'
                    />
                    ) : (
                      <Image
                      src={profilePic?.original.url}
                      width={40}
                      height={40}
                      className='rounded-full cursor-pointer'
                      alt={currentProfile.id.handle}
                      layout='responsive'
                      />
                    )
                    ) : <div className="bg-emerald-900 w-8 h-8 rounded-full" />}
           </Link>
             </div>
        ) : (
          <div className=''>
          <LoginButtonMobile  />
          </div>
        )}
        </div>
      </div>
     </div>
    </div>
  );
};

export default Navbar;