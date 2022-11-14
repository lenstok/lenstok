import React, { useRef, useState } from 'react';
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { MdFavorite } from 'react-icons/md';
import { NextPage } from 'next';
import Link from "next/link";
import type { FC } from "react";
import type { Publication } from "@/types/lens";

//should also add authorisation so user cant like posttwice

interface Props {
  publication: Publication;
}

const CommentButton: FC<Props> = ({ publication }) => {
    const [alreadyCommented, setAlreadyLiked] = useState(false);
    const videoRef = useRef(publication?.metadata?.media[0]?.original?.url);

    return (
       <div className="flex gap-6">
         <Link ref={videoRef} href={`/detail/${publication.id}`}> 
        <div className="mt-4 flex flex-col justify-center items-center cursor-pointer">        
        {alreadyCommented ? (
         
          <div className="flex items-center bg-emerald-700 rounded-full p-2 md:p-3">
          <ChatBubbleLeftEllipsisIcon className="w-4 h-4 text-[#96de26]" />
           </div>
       
        ) : (
          <div className="flex items-center bg-emerald-700 rounded-full p-2 md:p-3 hover:bg-[#96de26]">
            <ChatBubbleLeftEllipsisIcon className='w-4 h-4 text-white' />
          </div>
        )}
        <p className="text-xs font-semibold text-gray-400">{publication.stats.totalAmountOfComments}</p>
        </div>
        </Link>
        </div>
    );
}

export default CommentButton