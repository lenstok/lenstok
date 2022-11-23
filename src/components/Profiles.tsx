import type { NextPage } from "next";

import Navbar from "@/components/UI/Navbar";
import Sidebar from "@/components/UI/Sidebar";
import ProfileCard from "@/components/ProfileCard";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { Profile, ProfileDocument } from "@/types/lens";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";



const Profile: NextPage = () => {
  const router = useRouter();
  const { id } = router.query
  const [following, setFollowing] = useState(false)  

  const { data, loading, error } = useQuery
    (ProfileDocument, {
      variables: { 
        request: {
          profileId: id,
        }
      },
    });
    
    const profile = data?.profile
    console.log("Profile", profile);

    useEffect(() => {
      if(profile?.isFollowedByMe === true) {
      setFollowing(true) 
    } else {
      setFollowing(false)
    }
      }, [profile?.isFollowedByMe])

  return (
    <div>
      <div className="xl:w-[1200px] lg:w-[1100px] m-auto overflow-hidden h-[100vh]">
        <Toaster position="bottom-right" />
        <Navbar />
        <div className="flex gap-6 md:gap-20 ">
          <div className="h-[92vh] overflow-hidden lg:hover:overflow-auto">
            <Sidebar />
          </div>
          <div className="mt-4 flex flex-col gap-10 overflow-auto h-[88vh] videos flex-1">
            <ProfileCard profile={profile as Profile} setFollowing={setFollowing} following={following} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;