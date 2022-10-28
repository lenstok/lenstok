import type { FC } from "react";

const Loading: FC = () => {
  return (
    <div className="grid h-screen place-items-center">
      <img
        className="w-28 h-28"
        height={112}
        width={112}
        src="/vercel.svg"
        alt="Logo"
      />
    </div>
  );
};

export default Loading;
