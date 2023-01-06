import logo from "@/images/Lenstoknewlogo.png";
import Link from "next/link";
import Image from "next/image";
import type { FC } from "react";
import { useAppStore } from "src/store/app";
import { sanitizeIpfsUrl } from '@/utils/sanitizeIpfsUrl';

import { BiSearch } from 'react-icons/bi';
import { IoMdAdd } from 'react-icons/io';
import LoginButtonMobile from "./Login/LoginButtonMobile";
import SearchBar from "./Search/SearchBar";
import getAvatar from "@/lib/getAvatar";
import { Menu } from "@headlessui/react";
import MenuTransition from "./UI/MenuTransition";
import { NextLink } from "./UI/NextLink";

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

    <SearchBar />

    <div>
      <div className='flex gap-5 md:gap-10 '>
      
        <Link href='/upload'>
        <button className='hidden md:flex px-2 py-2 md:px-4 text-md font-semibold items-center gap-2 cursor-pointer
         bg-white text-lg border-[1px] border-[#96de26] text-[#25511f] hover:bg-[#96de26]' >
         {/*className='border-2 px-2 py-2 md:px-4 text-md font-semibold flex items-center gap-2'*/}
         <IoMdAdd className='text-xl' />{' '}
         <span className='hidden md:block'>Upload </span>
        </button>  
        </Link>

      <div className="flex">
        {currentProfile ? (
           <Menu as="div" className='w-12 h-12'>
              <Menu.Button
                as="div"
              >
                <Image
                  src={getAvatar(profilePic)}
                  width={40}
                  height={40}
                  className='rounded-full cursor-pointer'
                  alt={currentProfile.id.handle}
                  layout='responsive'
                />
              </Menu.Button>
              <MenuTransition>
                <Menu.Items
                static
                className="flex flex-col absolute right-20 py-1 px-3 mt-2 w-32 bg-white border shadow-sm focus:outline-none"
                >
                  <Menu.Item as={NextLink} href={`/profile/${currentProfile.id}`} key={currentProfile.id}>
                    Show Profile
                  </Menu.Item>
                  <Menu.Item as={NextLink} href={`/createstream`}>
                    LIVE
                  </Menu.Item>
                </Menu.Items>
              </MenuTransition>
            </Menu>
        ) : (
          <div className='block lg:hidden'>
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