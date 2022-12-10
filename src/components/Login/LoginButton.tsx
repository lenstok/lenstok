import { useAppStore } from "@/store/app";
import type { FC } from "react";
import LoginWallet from "./LoginWallet";

const LoginButton: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile)
  return (
    <>
      <div className="cursor-pointer bg-[#96de26] text-lg text-[#25511f] border-[1px] border-[#96de26] font-semibold px-6 py-3 rounded-md
       outline-none w-full mt-3 hover:text-white hover:bg-[#96de26]">
      {currentProfile ? (
          <div className="flex justify-center">{currentProfile.handle}</div>
        ) : (
          <LoginWallet />
        )}
      </div>
    </>
  );
};

export default LoginButton;
