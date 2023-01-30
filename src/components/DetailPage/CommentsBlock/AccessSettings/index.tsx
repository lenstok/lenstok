import React, { useState } from 'react'
import { LockClosedIcon } from '@heroicons/react/24/outline'
import { useAccessSettingsStore } from '@/store/access';
import { Modal } from '@/components/UI/Modal';
import EncryptContent from './EncryptContent';

const AccessSettings = () => {
  const hasConditions = useAccessSettingsStore((state) => state.hasConditions);
  const reset = useAccessSettingsStore((state) => state.reset);
  const [showModal, setShowModal] = useState(false);

  return(
    <div>
        <button
            onClick={() => {
                setShowModal(!showModal);
            }}
        >
            <LockClosedIcon className='text-emerald-500 h-5 w-5' /> 
        </button>
        <Modal
            title={
                <div>
                    Access Settings
                </div>
            }
            show={showModal}
            onClose={() => {
                setShowModal(false)
                if (!hasConditions()) {
                    reset()
                }
            }}
        >
            <EncryptContent setShowModal={setShowModal} />
        </Modal>
    </div>
  )
}

export default AccessSettings