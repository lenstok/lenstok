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
          <div className="flex items-center bg-emerald-700 rounded-full p-2 md:p-3 hover:bg-[#96de26]">
            <ArrowsRightLeftIcon className='w-4 h-4 text-white' />
          </div>
        )}
        <p className="text-xs hidden lg:block font-semibold text-gray-400">{publication.stats.totalAmountOfMirrors}</p>
        </div>
        </div>
    );
}

export default MirrorButton; 