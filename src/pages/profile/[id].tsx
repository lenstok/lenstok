import { Publication } from '@/types/lens'
import React, { FC } from 'react'

interface Props {
    publication: Publication
}

const Profile: FC<Props> = ({publication}) => {
  return (
    <div className="w-full">
        <div className="flex gap-6 md:gap-10 mb-4 bg-white w-full">
            <div className='w-16 h-16 md:w-32 md:h-32'>
                Profile
            </div>
        </div>
    </div>
  )
}

export default Profile
