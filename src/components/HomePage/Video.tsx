import { useState, useEffect, useRef } from "react";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { HiVolumeOff, HiVolumeUp } from "react-icons/hi";
import Link from "next/link";
import type { FC } from "react";
import type { Publication } from "@/types/lens";

import LikeButton from  "@/components/Buttons/Likes/LikeButton";
import MirrorButton from  "@/components/Buttons/Mirrors/MirrorButton";
import CommentButton from  "@/components/Buttons/CommentButton";
import CollectButton from  "@/components/Buttons/CollectButton";
import getMedia from "@/lib/getMedia";

interface Props {
  publication: Publication;
}
const Video: FC<Props> = ({ publication }) => {
  const [isHover, setIsHover] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(publication?.metadata?.media[0]?.original?.url);

  // const onVideoPress = () => {
  //   if (playing) {
  //     videoRef?.current?.pause();
  //     setPlaying(false);
  //   } else {
  //     videoRef?.current?.play();
  //     setPlaying(true);
  //   }
  // };

  // useEffect(() => {
  //   if (videoRef?.current) {
  //     videoRef.current.muted = isVideoMuted;
  //   }
  // }, [isVideoMuted]);

  return (
    <div className="lg:ml-20 flex gap-4 relative">
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className="rounded-3xl"
      >
        <Link href={`/detail/${publication.id}`} key={publication.id}>
          <video
            loop
            controls
            autoPlay
            muted
            // ref={videoRef}
            src={getMedia(publication)}
            className='lg:w-[400px] h-[300px] md:h-[400px] lg:h-[500px] w-[400px] rounded-2xl cursor-pointer bg-gray-100'
          ></video>
        </Link>
        {/* {isHover && (
          <div className="absolute bottom-6 cursor-pointer left-8 md:left-14 lg:left-0 flex gap-10 lg:justify-between w-[100px] md:w-[50px] lg:w-[300px] p-3">
            {playing ? (
              <button onClick={onVideoPress}>
                <BsFillPauseFill className="text-black text-2xl lg:text-4xl" />
              </button>
            ) : (
              <button onClick={onVideoPress}>
                <BsFillPlayFill className="text-black text-2xl lg:text-4xl" />
              </button>
            )}
            {isVideoMuted ? (
              <button onClick={() => setIsVideoMuted(false)}>
                <HiVolumeOff className="text-black text-2xl lg:text-4xl" />
              </button>
            ) : (
              <button onClick={() => setIsVideoMuted(true)}>
                <HiVolumeUp className="text-black text-2xl lg:text-4xl" />
              </button>
            )}
          </div>
        )} */}
         </div>
        <div className="max-w-xs flex flex-col pt-[120px]">
          <LikeButton publication={publication as Publication}/>
          <CommentButton publication={publication as Publication} />
          <MirrorButton publication={publication as Publication}/>
          <CollectButton publication={publication as Publication}/>
        </div>
    </div>
    
  );
};

export default Video;