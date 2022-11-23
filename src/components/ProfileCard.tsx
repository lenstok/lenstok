//this is just the profile pic and info 

import React, { Dispatch, FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { Profile} from '@/types/lens';
import { sanitizeIpfsUrl } from '@/utils/sanitizeIpfsUrl';
import FollowButton from  "@/components/Buttons/FollowButton";
import { useAppStore } from "src/store/app";

import ProfileVideos from "@/components/UI/ProfileVideos";
import UnfollowButton from './Buttons/UnfollowButton';
import getAvatar from '@/lib/getAvatar';
import MirrorVideos from './UI/MirrorVideos';

interface Props {
    profile: Profile
    setFollowing: Dispatch<boolean>
    following: boolean
}
    const ProfileCard: FC<Props> = ({ profile, setFollowing, following }) => {
        const currentProfile = useAppStore((state) => state.currentProfile);

        const itsNotMe = profile?.id !== currentProfile?.id

        const [mirror, setMirror] = useState(false)

    return (
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
                            <UnfollowButton setFollowing={ setFollowing } profile={ profile as Profile } />
                        ) : (
                            <FollowButton setFollowing={ setFollowing } profile={ profile as Profile }/>
                        )
                        }
                        </div>
                      ) : (
                        null
                      )
                    }  
                 </div>    
            </div>

            <div className='flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full'>
                <p className={`text-xl font-semibold cursor-pointer mt-2`} onClick={() => setMirror(false)}>
                    Videos
                </p>
                <p className={`text-xl font-semibold cursor-pointer mt-2`} onClick={() => setMirror(true)}>
                    Mirrored
                </p>
                <p className={`text-xl font-semibold cursor-pointer mt-2`}>
                    Collected
                </p>
            </div>

            <div>
                <div className='flex gap-6 flex-wrap md:justify-start'>
                    {mirror ? (
                        <MirrorVideos />
                    ) : (
                        <ProfileVideos />
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProfileCard;


