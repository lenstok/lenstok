import { useAppStore } from "@/store/app";
import type { FC } from "react";
import { IoIosContact } from 'react-icons/io';
import LoginWalletMobile from "./LoginWalletMobile";

const LoginButton: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile)
  return (
    <>
      <div className="">
      <button className='border-2 px-2 py-2 md:px-4 text-md font-semibold flex items-center gap-2 border-[#96de26] text-[#25511f]' >
<LoginWalletMobile />
<IoIosContact className='text-xl' />{' '}
</button>  
      </div>
    </>
  );
};

export default LoginButton;


