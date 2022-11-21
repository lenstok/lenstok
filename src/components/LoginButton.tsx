import type { FC } from "react";
import LoginWallet from "./LoginWallet";

const LoginButton: FC = () => {
  return (
    <>
      <div className="cursor-pointer bg-white text-lg text-[#96de26] border-[1px] border-[#96de26] font-semibold px-6 py-3 rounded-md outline-none w-full mt-3 hover:text-[#25511f] hover:bg-[#96de26]">
        <LoginWallet />
      </div>
    </>
  );
};

export default LoginButton;
