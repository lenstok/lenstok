//this is just the profile pic and info 

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { GoVerified } from 'react-icons/go';
import { ProfileDocument, PublicationsDocument, ProfileQuery} from '@/types/lens';
import type { Publication } from "@/types/lens";
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { sanitizeIpfsUrl } from '@/utils/sanitizeIpfsUrl';
import FollowButton from  "@/components/Buttons/FollowButton";
import { useAppStore } from "src/store/app";

import ProfileVideos from "@/components/UI/ProfileVideos";

    const ProfileCard = () => {
        const currentProfile = useAppStore((state) => state.currentProfile);
        const [isPlaying, setIsPlaying] = useState<boolean>(false);
        const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);
    
        const router = useRouter();
        const { id } = router.query
    
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

        const itsNotMe = profile?.id !== currentProfile?.id

    return (
        <div className='w-full'>
            <div className='flex gap-6 md:gap-10 mb-4 bg-white w-full'>
                <div className='w-16 h-16 md:w-32 md:h-32'>
                    { profile?.picture?.__typename === "MediaSet" ? (
                        profile.picture.original?.url.includes("ipfs") ? (
                    <Image
                    src={sanitizeIpfsUrl(profile?.picture.original.url)}
                    width={120}
                    height={120}
                    className='rounded-full'
                    alt={profile.handle}
                    layout='responsive'
                    />
                    ) : (
                    <Image
                    src={profile?.picture.original.url}
                    width={120}
                    height={120}
                    className='rounded-full'
                    alt={profile.handle}
                    layout='responsive'
                    />
                    )
                    ) : <div className="bg-emerald-900 w-[120px] h-[120px] rounded-full" />}
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
                        <FollowButton />
                        </div>
                      ) : (
                        null
                      )
                    }  
                 </div>    
            </div>

            <div>
                <div className='flex gap-6 flex-wrap md:justify-start'>
                <ProfileVideos/>
                </div>
            </div>
        </div>
    )
}

export default ProfileCard;


