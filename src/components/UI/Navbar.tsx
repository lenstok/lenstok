import logo from "@/images/Lenstoklogo.png";
import Link from "next/link";
import Image from "next/image";

import { BiSearch } from 'react-icons/bi';
import { IoMdAdd } from 'react-icons/io';

const Navbar = () => {
  
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
        <Link href='/upload'>
        <button className=' px-2 py-2 md:px-4 text-md font-semibold flex items-center gap-2 cursor-pointer
         bg-white text-lg border-[1px] border-[#96de26] text-[#25511f] hover:bg-[#96de26]' >
         {/*className='border-2 px-2 py-2 md:px-4 text-md font-semibold flex items-center gap-2'*/}
         <IoMdAdd className='text-xl' />{' '}
         <span className='hidden md:block'>Upload </span>
        </button>  
        </Link>

        <Link href={`/`}>
                <div>
                  <Image
                    className='rounded-full cursor-pointer'
                    src={'/'}
                    alt='currentUserProfilePic'
                    width={40}
                    height={40}
                  />
                </div>
              </Link>
      </div>
    </div>

    </div>
  );
};

export default Navbar;
