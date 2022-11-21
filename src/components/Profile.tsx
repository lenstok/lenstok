import type { NextPage } from "next";
import Image from 'next/image';

import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { Profile, ProfileDocument } from "@/types/lens";

import UnfollowButton from "./Buttons/UnfollowButton";
import FollowButton from "./Buttons/FollowButton";
import ProfileVideos from "./UI/ProfileVideos";
import getAvatar from '@/lib/getAvatar';
import { useAppStore } from "@/store/app";
import { useEffect, useState } from "react";


const Profile: NextPage = () => {
  const router = useRouter();
  const { id } = router.query
  const currentProfile = useAppStore((state) => state.currentProfile);
    
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

    const [following, setFollowing] = useState(false)

    const itsNotMe = profile?.id !== currentProfile?.id

    useEffect(() => {
      if(profile?.isFollowedByMe === true) {
      setFollowing(true) }
    }, [profile?.isFollowedByMe])

  return (
    <div>
      <div className="mt-4 flex flex-col gap-10 overflow-auto h-[88vh] videos flex-1">
      <div className='w-full'>
            <div className='flex gap-6 md:gap-10 mb-4 bg-white w-full'>
                <div className='w-16 h-16 md:w-32 md:h-32'>
                    <Image
                    src={getAvatar(profile)}
                    width={120}
                    height={120}
                    className='rounded-full'
                    alt=""
                    layout='responsive'
                    />
                </div>

                <div className='flex flex-col justify-center'> 
                    <p className='md:text-2xl tracking-wider flex gap-1 items-center justify-center text-md font-bold text-primary lowercase'>
                    {profile?.handle}
                    </p>
                    <p className='capitalize md:text-xl text-gray-400 text-xs'>
                    {profile?.name}
                    </p>
                
                      {itsNotMe ? (
                        <div>
                        { following ? (
                            <UnfollowButton setFollowing={setFollowing} profile={profile as Profile} />
                        ) : (
                            <FollowButton setFollowing={setFollowing} profile={profile as Profile}  />
                        )
                        }
                        </div>
                      ) : (
                        null
                      )
                    }  
                 </div>    
            </div>
            <div>
                <div className='flex gap-6 flex-wrap md:justify-start'>
                <ProfileVideos key={profile?.id} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;