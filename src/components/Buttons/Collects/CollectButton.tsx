import React, { useEffect, useState } from 'react';
import type { FC } from 'react'
import { FolderPlusIcon } from '@heroicons/react/24/solid';
import { CollectModules, Publication } from '@/types/lens';
import CollectModule from './CollectModule';
import { Modal } from '../../UI/Modal';
import { getModule } from '@/lib/getModule';
import GetModuleIcon from '@/utils/GetModuleIcon';


//should also add authorisation so user cant like posttwice

interface Props {
  publication: Publication
}

const CollectButton: FC<Props> = ({publication}) => {
  const [alreadyCollected, setAlreadyCollected] = useState(false);
  const [count, setCount] = useState(publication.stats.totalAmountOfCollects)
  const [showCollectModal, setShowCollectModal] = useState(false);
  const isFreeCollect = publication?.collectModule.__typename === 'FreeCollectModuleSettings';
  const isUnknownCollect = publication?.collectModule.__typename === 'UnknownCollectModuleSettings';

  useEffect(() => {
    if (publication?.hasCollectedByMe === true) {
      setAlreadyCollected(true)
    } else {
      setAlreadyCollected(false)
    }
  }, [publication?.hasCollectedByMe])

    return (
      <div className="flex gap-6">
      <div className="mt-4 flex flex-col justify-center items-center cursor-pointer">
      {alreadyCollected ? (
       <div className="flex items-center drop-shadow-lg  border border-[#96de26] md:border-none md:bg-emerald-700  rounded-full p-2 md:p-3">
       <FolderPlusIcon className="w-4 h-4 text-[#96de26] font-bold" onClick={() =>{setShowCollectModal(true)}} />
        </div>
      ) : (
        <div className="flex items-center drop-shadow-lg  border border-[#96de26] md:border-none md:bg-emerald-700 rounded-full p-2 md:p-3 hover:bg-[#96de26] group relative w-max">
            <FolderPlusIcon className='w-4 h-4 text-[#96de26] font-bold md:text-white' onClick={() => {setShowCollectModal(true)}} />
            <span className="pointer-events-none absolute -bottom-7 left-7 w-max shadow px-2 py-1 text-xs text-emerald-700 opacity-0 group-hover:opacity-100"> Collect </span>
          </div>
        )}
        <Modal
          title={
            isFreeCollect
              ? 'Free Collect'
              : isUnknownCollect
              ? 'Unknown Collect'
              : getModule(publication?.collectModule?.type).name
          }
          icon={
            <div className="text-[#96de26]">
              <GetModuleIcon
                module={isFreeCollect ? CollectModules.FreeCollectModule : publication?.collectModule?.type}
                size={5}
              />
            </div>
          }
          show={showCollectModal}
          onClose={() => setShowCollectModal(false)}
      >
        <CollectModule 
          publication={ publication as Publication }
          setCount={setCount}
          count={count} 
        />
      </Modal>
        <p className="text-xs hidden lg:block font-semibold text-gray-400">{count}</p>
        </div>
        </div>
    );
}

export default CollectButton; 