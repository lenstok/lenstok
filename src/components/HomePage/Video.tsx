import { useState, useEffect, useMemo, useRef } from "react";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { HiVolumeOff, HiVolumeUp } from "react-icons/hi";
import Link from "next/link";
import type { FC } from "react";
import type { Publication } from "@/types/lens";

import { Player } from '@livepeer/react';
import { parseArweaveTxId, parseCid } from 'livepeer/media';
 
import LikeButton from  "@/components/Buttons/Likes/LikeButton";
import MirrorButton from  "@/components/Buttons/Mirrors/MirrorButton";
import CommentButton from  "@/components/Buttons/CommentButton";
import CollectButton from  "@/components/Buttons/Collects/CollectButton";
import getMedia from "@/lib/getMedia";
import { ChevronDoubleDownIcon } from '@heroicons/react/24/solid';

interface Props {
  publication: Publication;
}
const Video: FC<Props> = ({ publication }) => {
  const [isHover, setIsHover] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const videoRef = useRef(publication?.metadata?.media[0]?.original?.url);
  const [url, setUrl] = useState<string>('');
  const idParsed = useMemo(() => parseCid(url) ?? parseArweaveTxId(url), [url]);

  return (
    <div className="lg:ml-20 md:flex gap-4 relative">
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="rounded-3xl"
      >
        <Link href={`/detail/${publication.id}`} key={publication.id}>
          <video
            loop
            controls
            muted
            autoPlay
            // ref={videoRef}
            src={getMedia(publication)}
            // className='lg:w-[400px] h-[300px] md:h-[400px] lg:h-[500px] w-[400px] rounded-2xl cursor-pointer bg-gray-100'
            className='lg:w-[400px] lg:h-[500px] md:h-[400px] md:w-[400px] h-[500px] w-full
            object-contain rounded cursor-pointer bg-black lg:bg-gray-100'
          ></video>
        </Link>
        </div>
        
        <div className='absolute md:relative md:flex md:flex-col z-50 top-0 right-0 space-x-6 md:space-x-0 flex flex-row p-2 m-2 mb-10 md:p-0 md:m-0 md:pt-[135px]'>
        <div className="dropdown inline-block relative">
           <button 
           onClick={() => setShowButtons(!showButtons)}
           className="bg-black text-[#96de26] md:invisible font-semibold py-2 px-2 rounded inline-flex overflow-auto items-center border-2 border-gray-800">
               <span>
                <ChevronDoubleDownIcon className='w-4 h-4'/>
               </span>
           </button>
           {showButtons && (
          <ul className="dropdown-menu hidden md:block pt-1">
            <li><LikeButton publication={publication as Publication}/></li>
            <li><CommentButton publication={publication as Publication} /></li>
            <li> <MirrorButton publication={publication as Publication}/></li>
            <li><CollectButton publication={publication as Publication}/></li>
        </ul>
          )}
        </div>
        </div>
        </div>

        
  );
};

export default Video;