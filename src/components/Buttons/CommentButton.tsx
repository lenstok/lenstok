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
    const isMirror = publication.__typename === 'Mirror'
    const comments = isMirror ? publication.mirrorOf.stats.totalAmountOfComments : publication.stats.totalAmountOfComments

    return (
       <div className="flex gap-6">
         <Link href={`/detail/${publication.id}`}> 
        <a className="md:mt-4 flex flex-col justify-center items-center cursor-pointer">        
        {alreadyCommented ? (
         
          <div className="flex items-center drop-shadow-lg border border-[#96de26] md:border-none bg-emerald-700 rounded-full p-2 md:p-3">
          <ChatBubbleLeftEllipsisIcon className="w-4 h-4 text-[#96de26] font-bold" />
           </div>
       
        ) : (
          <div className="flex items-center drop-shadow-lg border border-[#96de26] md:border-none bg-emerald-700 rounded-full p-2 md:p-3
          md:hover:bg-[#96de26] group relative w-max">
            <ChatBubbleLeftEllipsisIcon className='w-4 h-4 font-bold text-white' />
            <span className="hidden md:block pointer-events-none absolute -bottom-7 left-7 w-max shadow px-2 py-1 text-xs text-emerald-700 opacity-0 group-hover:opacity-100"> Comment </span>
          </div>
        )}
        <p className="text-xs hidden lg:block font-semibold text-gray-400">{comments}</p>
        </a>
        </Link>
        </div>
    );
}

export default CommentButton