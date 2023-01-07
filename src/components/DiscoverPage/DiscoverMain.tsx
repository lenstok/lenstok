import React, { Dispatch, FC, useEffect, useState } from "react";
import Image from "next/image";
import { Profile } from "@/types/lens";
import { sanitizeIpfsUrl } from "@/utils/sanitizeIpfsUrl";
import { useAppStore } from "src/store/app";
import { Router } from "next/router";

import getAvatar from "@/lib/getAvatar";
import SuggestedAccounts from "@/components/Sidebar/SuggestedAccounts";
import FollowingAccounts from "@/components/Sidebar/FollowingAccounts";
import Categories from "@/components/Sidebar/Categories";
import SearchBarDiscover from "../Search/SearchBarDiscover";

const DiscoverMain = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [selectedTab, setSelectedTab] = useState<
    "suggestedaccounts" | "categories" | "search"
  >("suggestedaccounts");

  const suggestedaccountsClass =
    selectedTab === "suggestedaccounts"
      ? "border-b-2 border-black"
      : "text-gray-400";
  const categoriesClass =
    selectedTab === "categories" ? "border-b-2 border-black" : "text-gray-400";
  const searchClass =
    selectedTab === "search" ? "border-b-2 border-black" : "text-gray-400";

  console.log("oioioioio", selectedTab);
  console.log("a", suggestedaccountsClass);
  console.log("b", categoriesClass);
  console.log("c", searchClass);

  return (
    <div className="flex justify-center mx-4">
      <div className="w-full max-w-[1150px]">
        <div className="flex justify-center items-center p-5 border-b border-gray-200 bg-white w-full">
          <span className="text-xl font-semibold text-center">Discover</span>
        </div>
        <div className="flex justify-center items-center gap-10 p-5 border-b mb-5 border-gray-200 bg-white w-full">
          <span
            className={`text-lg font-semibold cursor-pointer ${suggestedaccountsClass} mt-2`}
            onClick={() => setSelectedTab("suggestedaccounts")}
          >
            Users
          </span>
          <span
            className={`text-lg font-semibold cursor-pointer ${categoriesClass} mt-2`}
            onClick={() => setSelectedTab("categories")}
          >
            Categories
          </span>
          <span
            className={`text-lg font-semibold cursor-pointer ${searchClass} mt-2`}
            onClick={() => setSelectedTab("search")}
          >
            Search
          </span>
        </div>
        {selectedTab === "suggestedaccounts" && (
          <>
            <SuggestedAccounts />
            <FollowingAccounts />
          </>
        )}
        {selectedTab === "categories" && <Categories />}
        {selectedTab === "search" && <SearchBarDiscover />}
      </div>
    </div>
  );
};

export default DiscoverMain;
