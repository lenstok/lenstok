import React, { useEffect, useRef, useState, FC, Dispatch } from 'react';
import type { NextPage } from "next";
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { Toaster } from "react-hot-toast";
import { MdOutlineCancel } from 'react-icons/md';
import { BsFillPlayFill } from 'react-icons/bs';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';

import Comments from './CommentsBlock/Comments';
import { useQuery } from '@apollo/client';
import { Publication, PublicationDocument, Profile } from '@/types/lens';
import getMedia from '@/lib/getMedia';
import getAvatar from '@/lib/getAvatar';
import { copyToClipboard } from "@/utils/clipboard";

import { AiFillHeart, AiFillTwitterCircle } from "react-icons/ai";
import { BsFacebook, BsReddit } from "react-icons/bs";
import { FaCommentDots, FaTimes } from "react-icons/fa";
import LikeButton from '../Buttons/Likes/LikeButton';
import MirrorButton from '../Buttons/Mirrors/MirrorButton';
import CommentButton from '../Buttons/CommentButton';
import CreateComment from './CommentsBlock/CreateComment';
import LoginButton from '../LoginButton';
import { useAppStore } from "src/store/app";
import UnfollowButton from '../Buttons/UnfollowButton';
import FollowButton from '../Buttons/FollowButton';

const VideoDetail = () => {
    const currentProfile = useAppStore((state) => state.currentProfile);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const router = useRouter();
    const { id } = router.query
    
    const { data, loading, error } = useQuery(PublicationDocument, {
      variables: { 
        request: {
          publicationId: id
        }
       },
    });
    const profile = data?.publication?.profile
    console.log("Profile", profile);

    const publication = data?.publication
    console.log("Publication", publication)

    const Links = `http://localhost:3000/detail/${publication?.id}`
    const Title = `${profile?.handle} on Lenstok`

    const itsNotMe = profile?.id !== currentProfile?.id

    const onVideoClick = () => {
      if (isPlaying) {
        videoRef?.current?.pause();
        setIsPlaying(false);
      } else {
        videoRef?.current?.play();
        setIsPlaying(true);
      }
    };

    useEffect(() => {
      if (videoRef?.current) {
        videoRef.current.muted = isVideoMuted;
      }
    }, [isVideoMuted]);

    return (
       <div className="flex flex-col lg:flex-row lg:h-screen items-stretch">
        <Toaster position="bottom-right" />
        <div className="lg:flex-grow flex justify-center items-center relative bg-emerald-800">
           <video
              className="w-auto h-auto max-w-full max-h-[450px] lg:max-h-full"
              ref={videoRef}
               onClick={onVideoClick}
               loop
               src={getMedia(publication)}
              // poster={video.coverURL}
              controls
              playsInline
            ></video>
         <div className="absolute top-5 left-5 flex gap-3">
           <button
             onClick={() => router.back()}
             className="bg-[#3D3C3D] w-[40px] h-[40px] rounded-full flex justify-center items-center">
             <FaTimes className="w-5 h-5 fill-white cursor-pointer" />
            </button>
          </div>
        </div>

        <div className="w-full lg:w-[500px] flex-shrink-0 flex flex-col items-stretch h-screen">
          <div className="px-4 pt-10 pb-4 flex-shrink-0 border-b">
            <div className="flex">
            <Link  href={`/profile/${profile?.id}`} key={profile?.id}>
                  <a className="mr-3 flex-shrink-0 rounded-full">
                    <Image
                     src={getAvatar(profile)}
                      alt="profile pic here"
                      height={62}
                      width={62}
                      className="rounded-full"
                    />
                  </a>
                </Link>
              <div className='flex flex-col flex-grow justify-center'>
              <Link href={`/`}>
                <a className="font-bold block hover:underline items-center text-primary">
                {profile?.name}
                </a>
                </Link>
                <p className="capitalize font-medium text-sm text-gray-500">
                {profile?.handle}
                </p>
              </div>

              <div className="flex-shrink-0"> 
                         {/* // follow button goes here */}
              </div>

            </div>
            <p className="my-3 pb-3 text-lg text-gray-600" style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
             {publication?.metadata.content.slice(0, 175)}
            </p>

            {/* BUTTONS */}
            <div className="flex justify-between items-center">
              <div className="flex gap-5">
                <div className="flex items-center gap-1">
                  <button className="w-9 h-9 bg-[#F1F1F2] fill-black flex justify-center items-center rounded-full"
                    >
                      <AiFillHeart
                        className='w-5 h-5'
                      />
                  </button>
                  <span className="text-center text-xs font-semibold">
                      {publication?.stats.totalUpvotes}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="w-9 h-9 bg-[#F1F1F2] fill-black flex justify-center items-center rounded-full">
                      <FaCommentDots className="w-5 h-5 scale-x-[-1]" />
                  </button>
                  <p className="text-center text-xs font-semibold">
                      {publication?.stats.totalAmountOfComments}
                    </p>
                </div>
              </div>
              <div className="flex gap-1 items-center">
                 <a
                  href={`http://twitter.com/share?text=${encodeURIComponent(
                    Title
                  )}&url=${encodeURIComponent(Links)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <AiFillTwitterCircle className="fill-[#05AAF4] w-8 h-8" />
                </a>
                </div>
            </div>

            <div className="flex items-stretch mt-3">
              <input 
                  // @ts-ignore
                  onClick={(e) => e.target?.select?.()}
                  className="bg-[#F1F1F2] p-2 flex-grow text-sm border outline-none"
                  readOnly
                  type="text"
                  value={Links}
                />
              <button
                  className="flex-shrink-0 border px-2 active:bg-green-800 cursor-pointer"
                  onClick={() => {
                    copyToClipboard(Links)
                  }}
                  >
                  Copy link
                </button>
            </div>
          </div>
          { currentProfile ?
            (<Comments key={publication?.profile.id} publication={publication as Publication} />
            ) : (
            <div className='flex-shrink-0 flex pt-1 p-4 border-t'><LoginButton /></div>
            )
          }

        </div>
       </div>
    ) 
}

export default VideoDetail