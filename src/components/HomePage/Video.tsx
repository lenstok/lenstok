import { useState, useRef } from "react";
import Link from "next/link";
import type { FC } from "react";
import type { Publication } from "@/types/lens";
import { Player } from '@livepeer/react';

import LikeButton from  "@/components/Buttons/Likes/LikeButton";
import MirrorButton from  "@/components/Buttons/Mirrors/MirrorButton";
import CommentButton from  "@/components/Buttons/CommentButton";
import CollectButton from  "@/components/Buttons/Collects/CollectButton";
import getMedia from "@/lib/getMedia";

interface Props {
  publication: Publication;
}
const Video: FC<Props> = ({ publication }) => {

  return (
    <div className="lg:ml-20 flex gap-4 relative">
      <div className="rounded-3xl">
        <Link href={`/detail/${publication.id}`} key={publication.id}>
          <div className='lg:w-[400px] rounded-2xl cursor-pointer bg-gray-100'>
          <Player
            title={`${publication?.metadata?.name}`}
            loop
            muted
            aspectRatio="9to16"
            src={getMedia(publication)}
          ></Player>
          </div>
        </Link>
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