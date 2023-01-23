import Link from "next/link";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import type { Profile, Publication } from "@/types/lens";
import Video from './Video'
import { GoVerified } from "react-icons/go";
import getAvatar from "@/lib/getAvatar";
import { timeStamp } from "console";
import UnfollowButton from "../Buttons/UnfollowButton";
import FollowButton from "../Buttons/FollowButton";
import { useAppStore } from "@/store/app";
import LikeButton from  "@/components/Buttons/Likes/LikeButton";
import CommentButton from "../Buttons/CommentButton";
import MirrorButton from "../Buttons/Mirrors/MirrorButton";
import CollectButton from "../Buttons/Collects/CollectButton";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

interface Props {
  publication: Publication;
}
const VideoCard: FC<Props> = ({ publication}) => {

  const date = publication.createdAt;
  const timestamp = date.split("T")[0];
  const [following, setFollowing] = useState(false) 
  const currentProfile = useAppStore((state) => state.currentProfile);
  const isMirror = publication?.__typename === 'Mirror'
  const profile = isMirror ? publication?.mirrorOf?.profile : publication?.profile 

  useEffect(() => {
    if(profile?.isFollowedByMe === true) {
    setFollowing(true) 
  } else {
    setFollowing(false)
  }
    if (!currentProfile) {
      setFollowing(false)
    }
    }, [profile?.isFollowedByMe])

  return (
    <div className="flex flex-col border-b-2 border-gray-200 pb-0 md:pb-6">
      <div className="text-sm flex flex-row items-center">
        {isMirror && (
          <>
            <ArrowsRightLeftIcon className="w-6 h-6 text-emerald-600" />
            <span> Mirrored by {publication?.profile?.handle}</span>
          </>
        )}
      </div>
      <div className="flex flex-row">
        <div className="flex gap-3 p-2 mt-4 cursor-pointer font-semibold rounded">
        <Link href={`/profile/${profile.id}`} key={profile.id}>
          <a className="md:w-16 md:h-16 w-10 h-10">
            <Image
              src={getAvatar(profile)}
              width={62}
              height={62}
              alt={profile.handle}
              className="rounded-full"
              layout="responsive"
              />
          </a>
            </Link>
        <div>
          <Link href={`/profile/${profile.id}`} key={profile.id}>
            <div className="flex items-center gap-2">
              <p className="capitalize flex gap-2 items-center md:text-md font-bold text-primary">
                {profile.handle}{' '}
                <GoVerified className="text-blue-400 text-md"/>
              </p>
              <p className="capitalize font-medium text-xs text-gray-500 hidden md:block">
                {profile.name}
              </p>
            </div>
          </Link>
          <p className="text-xs block font-semibold text-gray-400"> {timestamp}</p>
          <Link href="/">
            <p className="mt-2 text-sm font-normal">
              {publication?.metadata?.description?.slice(0, 90)} {""}
            </p>
          </Link>
        </div>
        </div>
        <div className="flex ml-auto"> 
        {/* // follow button goes here */}
        <div className="mt-6 mr-6 md:mr-16">
          { following ? ( 
            <UnfollowButton setFollowing={ setFollowing } profile={ profile as Profile } /> 
            ) : (
            <FollowButton setFollowing={ setFollowing } profile={ profile as Profile } />
          )}
        </div>
      </div>
      </div>
      <Video publication={publication as Publication} />

      <div className='flex flex-row space-x-3'>
      <p className="text-xs block md:hidden font-semibold text-gray-400 pl-1"> {publication.stats.totalUpvotes} likes</p>
      <p className="text-xs block md:hidden font-semibold text-gray-400"> {publication.stats.totalAmountOfComments} comments</p>
      <p className="text-xs block md:hidden font-semibold text-gray-400"> {publication.stats.totalAmountOfMirrors} mirrors</p>
      <p className="text-xs block md:hidden font-semibold text-gray-400"> {publication.stats.totalAmountOfCollects} collects</p>  
      </div>

      <div className='flex ml-auto'>
      <button className="block md:hidden pr-2 pb-2 ">
        <LikeButton publication={publication as Publication} />
        </button>
        <button className="block md:hidden pr-2 pb-2">
        <CommentButton publication={publication as Publication} />
        </button>
        <button className="block md:hidden pr-2 pb-2">
          <MirrorButton publication={publication as Publication}/>
        </button>
      <button className="block md:hidden pr-2 pb-2">
      <CollectButton publication={publication as Publication}/>
      </button>
      </div>
    </div>
  );
};

export default VideoCard;