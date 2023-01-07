import React, { useState } from "react";
import CreateStream from "./CreateStream";
import LiveContent from "./LiveContent";

const Toggle = () => {
  const [selectedTab, setSelectedTab] = useState("watch");

  return (
    <div>
    <div className="bg-emerald-800 rounded-md w-48 max-w-50% mx-auto">
      <div className="flex justify-between">
        <button
          className={`cursor-pointer bg-emerald-800 rounded-md py-2 px-4 font-semibold text-sm ${
            selectedTab === "go" ? "text-purple-100" : "text-[#96de26]"
          } border-emerald-700 hover:bg-emerald-900`}
          onClick={() => setSelectedTab("watch")}
        >
          Watch LIVE
        </button>
        <button
          className={`cursor-pointer bg-emerald-800 rounded-md py-2 px-4 font-semibold text-sm ${
            selectedTab === "watch" ? "text-purple-100" : "text-[#96de26]"
          } hover:bg-emerald-900`}
          onClick={() => setSelectedTab("go")}
        >
          Go LIVE
        </button>
      </div>
    </div>
    {selectedTab === "watch" && <LiveContent/>}
    {selectedTab === "go" && <CreateStream />}
    </div>
  );
};

export default Toggle;
