import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { MdOutlineCancel } from 'react-icons/md';
import { BsFillPlayFill } from 'react-icons/bs';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';

import Comments from '../../components/Comments';

const Detail = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const router = useRouter();

    return (
        <div className='flex w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap'>
        <div className='relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-emerald-800'>
          <div className='opacity-90 absolute top-6 left-2 lg:left-6 flex gap-6 z-50'>
            <p className='cursor-pointer ' onClick={() => router.back()}>
              <MdOutlineCancel className='text-black text-[35px] hover:opacity-90' /> {/*This is cancel button*/}
            </p>
          </div>
          <div className='relative'>
            <div className='lg:h-[100vh] h-[60vh]'>
                <video
                  ref={videoRef}
             //   onClick={}
                  loop
                  src={'video goes here'}
                  className='h-full cursor-pointer'
                  >
                </video>
                    </div>
                    <div className="absolute top-[45%] left-[45%] cursor-pointer">
                    <button onClick={ () => {}}>
                      <BsFillPlayFill className="text-white text-6xl lg:text-8xl"/>
                    </button>
                   </div>
                </div>

            <div className="absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer">
              Video Mute button here
            </div>
            </div>

        <div className="relative w-[1000px] md:w-[900px] lg:w-[700px]">
          <div className="lg:mt-20 mt-10">
            <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded">
              <div className="ml-4 md:w-20 md:h-20 w-16 h-16">
                <Link href="/">
                  <>
                  <Image
                  width={62}
                  height={62}
                  className="rounded-full"
                  src={"/"}
                  alt="profile photo"
                  layout="responsive"
                  />
                  </>
                </Link>
              </div>
              <div>
                <Link href="/"> 
                  <div className="mt-3 flex flex-col gap-2">
                    <p className="flex gap-2 items-center md:text-md font-bold text-primary">
                      Profile.lensname
                    </p>
                    <p className="capitalize font-medium text-xs text-gray-500 hidden md:block">
                      post.postedby:username
                    </p>
                  </div>
                </Link>
              </div> 
            </div>

              <p className="px-10 text-lg text-gray-600">Lorum ipsum lorum ipsom caption goes here</p>

          <div className='mt-10 px-10'>
            {/* <LikeButton/> */}
          </div>
          <Comments/>
          </div>
        </div>

        </div>
    ) 
}


export default Detail