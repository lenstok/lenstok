import React, { useEffect, useState } from 'react';
import type { FC } from 'react'
import { FolderPlusIcon } from '@heroicons/react/24/solid';
import { MdFavorite } from 'react-icons/md';
import { NextPage } from 'next';
import type { Publication } from '@/types/lens';

//should also add authorisation so user cant like posttwice

interface Props {
  publication: Publication
}

const CollectButton: FC<Props> = ({publication}) => {
    const [alreadyCollected, setAlreadyLiked] = useState(false);

    return (
       <div className="flex gap-6">
        <div className="mt-4 flex flex-col justify-center items-center cursor-pointer">
        {alreadyCollected ? (
         <div className="flex items-center bg-emerald-700 rounded-full p-2 md:p-3">
         <FolderPlusIcon className="w-4 h-4 text-[#96de26]" />
          </div>
        ) : (
          <div className="flex items-center bg-emerald-700 rounded-full p-2 md:p-3 hover:bg-[#96de26]">
            <FolderPlusIcon className='w-4 h-4 text-white' />
          </div>
        )}
        <p className="text-xs hidden lg:block font-semibold text-gray-400">{publication.stats.totalAmountOfCollects}</p>
        </div>
        </div>
    );
}

export default CollectButton; 