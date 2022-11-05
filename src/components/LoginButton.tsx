import type { FC } from "react";
import { useAppStore } from "src/store/app";
import LoginWallet from "./LoginWallet";

const LoginButton: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  return (
    <>
      <button className="cursor-pointer bg-white text-lg text-[#96de26] border-[1px] border-[#96de26] font-semibold px-6 py-3 rounded-md outline-none w-full mt-3 hover:text-[#25511f] hover:bg-[#96de26]"
               type="button">
        {currentProfile ? currentProfile.handle : <LoginWallet />}
      </button>
    </>
  );
};

export default LoginButton;
