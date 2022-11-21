//this is just the profile pic and info 

import React, { Dispatch, FC, useEffect, useLayoutEffect, useState } from 'react';
import Image from 'next/image';
import { Profile} from '@/types/lens';
import { sanitizeIpfsUrl } from '@/utils/sanitizeIpfsUrl';
import FollowButton from  "@/components/Buttons/FollowButton";
import { useAppStore } from "src/store/app";

import ProfileVideos from "@/components/UI/ProfileVideos";
import UnfollowButton from './Buttons/UnfollowButton';
import getAvatar from '@/lib/getAvatar';

interface Props {
    profile: Profile
}
    const ProfileCard: FC<Props> = ({ profile }) => {
        const currentProfile = useAppStore((state) => state.currentProfile);
        const [showUserVideos, setShowUserVideos] = useState<Boolean>(true);

        const [following, setFollowing] = useState(profile?.isFollowedByMe)
        console.log(following)

        const itsNotMe = profile?.id !== currentProfile?.id
        const videos = showUserVideos ? 'border-b-2 border-black' : 'text-gray-400';
        const liked = !showUserVideos ? 'border-b-2 border-black' : 'text-gray-400';
        
    return (
        <div className="flex justify-center mx-4">
            <div className="w-full max-w-[1150px]">
               
                    <div className="flex gap-3">
                        <div>
                        <Image
                        src={getAvatar(profile)}
                        alt=""
                        height={115}
                        width={115}
                        className="object-cover rounded-full"
                        />
                        </div>

                        <div className='flex flex-col justify-center p-2'>
                            <h1 className="text-3xl font-semibold">
                            {profile?.name}
                            </h1>
                            <p className="text-lg mt-2">{profile?.handle}</p>

                 <div className="flex-shrink-0">
                       {itsNotMe ? (
                         <div>
                        { following ? (
                            <UnfollowButton  />
                        ) : (
                           <button className='py-1 px-3 rounded text-sm mt-2 border hover:bg-[#F8F8F8] transition'>
                              Follow Me
                            </button>
                        )
                        }
                        </div>
                       ) : (
                        null
                       )
                       } 
                </div>


                        </div>
                    </div>

                    <div className="flex gap-4 mt-3">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-lg"> {profile?.stats.totalFollowing} </span>
                            <span>Following</span>
                        </div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{profile?.stats.totalFollowers}</span>
                        <span>Followers</span>
                    </div>
                    </div>
                    <div className='flex gap-10 p-5 border-b mb-5 mt-5  border-gray-200 bg-white w-full'>
                    <p className={`text-xl font-semibold cursor-pointer ${videos} mt-2`} onClick={() => setShowUserVideos(true)}>
                    Videos
                    </p>
                    <p className={`text-xl font-semibold cursor-pointer ${liked} mt-2`} onClick={() => setShowUserVideos(false)}>
                    Collected 
                    </p>
                    </div>
                {(showUserVideos) ? <ProfileVideos /> : <p>Collected Videos Here</p>}
            </div>
        </div>
        )
}

export default ProfileCard;