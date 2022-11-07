import { PublicationsDocument, Profile } from '@/types/lens'
import type { Publication } from '@/types/lens'
import React from 'react'
import type { FC } from 'react'
import { sanitizeIpfsUrl } from '@/utils/sanitizeIpfsUrl'
import { GoVerified } from 'react-icons/go'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import Video from './Video'

interface Props {
  profile: Profile
}

const ProfilePage: FC<Props> = ({ profile }) => {
  const router = useRouter()
  const { id } = router.query
  const { data, loading, error } = useQuery(PublicationsDocument, {
    variables: {
       request: {
        profileId: id,
        publicationTypes: ["POST"],
        limit: 50,
       }
     },
  });
  

  console.log("Pubications", data?.publications.items);

  return (
    <div className="w-full">
      <div className="flex gap-6 md:gap-10 mb-4 bg-white w-full">
        <div className="w-16 h-16 md:w-32 md:h-32">
        {profile.picture?.__typename === "MediaSet" ? (
          profile.picture.original?.url.includes("ipfs") ? (
            <img
              src={sanitizeIpfsUrl(profile.picture.original.url)}
              width={120}
              height={120}
              alt={profile.handle}
              className="rounded-full"
            />
          ) : (
            <img
              src={profile.picture.original.url}
              width={120}
              height={120}
              alt={profile.handle}
              className="rounded-full"
            />
          )
          ) : null}
        </div>

        <div>
          <div className="text-md md:text-2x1 font-bold tracking-wider flex gap-2 items-center justify-center lowercase">
            <span>{profile.handle?.replace(/\s+/g, '')}</span>
            <GoVerified className="text-blue-400 md:text-xl text-md"></GoVerified>
          </div>
          <p className="text-sm font-medium">{profile.name}</p>
        </div>
      </div>
      <div>
        <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
          <p className="text-xl font-semibold cursor-pointer">
            Videos
          </p>
          <p className="text-xl font-semibold cursor-pointer">
            Liked
          </p>
        </div>
        <div>
        {data?.publications.items.map((pub => (
          <div>
            <Video key={pub.id} publication={pub as Publication} />
          </div>
        )))}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage