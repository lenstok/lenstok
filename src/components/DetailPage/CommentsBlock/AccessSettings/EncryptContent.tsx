import { Toggle } from '@/components/UI/Toggler';
import { useAccessSettingsStore } from '@/store/access';
import { Switch } from '@headlessui/react'
import React, { Dispatch, FC } from 'react'

interface Props {
    setShowModal: Dispatch<boolean>
}

const EncryptContent: FC<Props> = ({ setShowModal }) => {
  const restricted = useAccessSettingsStore((state) => state.restricted);
  const setRestricted = useAccessSettingsStore((state) => state.setRestricted);
  const followToView = useAccessSettingsStore((state) => state.followToView);
  const setFollowToView = useAccessSettingsStore((state) => state.setFollowToView);
  const collectToView = useAccessSettingsStore((state) => state.collectToView);
  const setCollectToView = useAccessSettingsStore((state) => state.setCollectToView);
  const hasConditions = useAccessSettingsStore((state) => state.hasConditions);
  const reset = useAccessSettingsStore((state) => state.reset);

  const onSave = () => {
    if (!hasConditions()) {
      reset();
    }
    setShowModal(false);
  };

  return(
    <div>
        <Toggle
            on={restricted}
            setOn={ () => {
                if(!restricted) {
                    reset()
                }
                    setRestricted(!restricted)
            }
            }
            title='Encrypt my comment'
        />
        {restricted && (
            <div className='flex flex-col'>
                <div className='ml-5 mt-4'>Set up who can view your comment:</div>
                    <Toggle
                      on={collectToView}
                      setOn={() => {
                          setCollectToView(!collectToView);
                      } }
                      title='Collectors can view'
                    />
                    {collectToView && (
                        <div className='m-5 text-red-500 bg-red-100 p-2 rounded-md'>Your collectors will be able to see this comment</div>
                    )}
                    <Toggle
                      on={followToView}
                      setOn={() => {
                          setFollowToView(!followToView);
                      } }
                      title='Followers can view'
                    />
                    {followToView && (
                        <div className='m-5 text-red-500 bg-red-100 p-2 rounded-md'>Your followers will be able to see this comment</div>
                    )}
            </div>
        )}
        <div className='m-5 flex space-x-2'>
            <button className='bg-[#96de26] text-[#25511f] font-semibold p-2 rounded cursor-pointer' onClick={onSave}>Save</button>
            <button className='bg-red-100 text-red-500 font-semibold p-2 rounded cursor-pointer' onClick={onSave}>Cancel</button>
        </div>
    </div>
  )
}

export default EncryptContent