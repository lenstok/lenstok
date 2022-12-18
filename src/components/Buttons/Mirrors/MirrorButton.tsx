import React, { useEffect, useState } from 'react';
import type { FC } from 'react'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { MdFavorite } from 'react-icons/md';
import { NextPage } from 'next';
import type { Publication } from '@/types/lens';

//should also add authorisation so user cant like posttwice

interface Props {
  publication: Publication
}

const MirrorButton: FC<Props> = ({publication}) => {
    const [alreadyMirrored, setAlreadyLiked] = useState(false);

    return (
       <div className="flex gap-6">
        <div className="mt-4 flex flex-col justify-center items-center cursor-pointer">
        {alreadyMirrored ? (
         <div className="flex items-center bg-emerald-700 rounded-full p-2 md:p-3">
         <ArrowsRightLeftIcon className="w-4 h-4 text-[#96de26]" />
          </div>
        ) : (
        <div className="flex items-center border border-[#96de26] md:border-none md:bg-emerald-700 rounded-full p-2 md:p-3 md:hover:bg-[#96de26] group relative w-max">
            <ArrowsRightLeftIcon className='w-4 h-4 text-[#96de26] font-bold md:text-white' />
            <span className="pointer-events-none absolute -bottom-7 left-7 w-max shadow px-2 py-1 text-xs text-emerald-700 opacity-0 group-hover:opacity-100"> Mirror </span>
          </div>
        )}
        <p className="text-xs hidden lg:block font-semibold text-gray-400">{publication.stats.totalAmountOfMirrors}</p>
        </div>
        </div>
    );
}

export default MirrorButton; 