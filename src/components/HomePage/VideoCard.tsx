import Link from "next/link";
import Image from "next/image";
import type { FC } from "react";
import type { Profile, Publication } from "@/types/lens";
import Video from './Video'
import { GoVerified } from "react-icons/go";
import getAvatar from "@/lib/getAvatar";
import { timeStamp } from "console";
import LikeButton from  "@/components/Buttons/Likes/LikeButton";

interface Props {
  publication: Publication;
  profile: Profile;
}
const VideoCard: FC<Props> = ({ publication, profile }) => {

  const date = publication.createdAt;
  const timestamp = date.split("T")[0];

  return (
    <div className="flex flex-col border-b-2 border-gray-200 pb-0 md:pb-6">
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
              {publication.metadata.description.slice(0, 90)} {""}
            </p>
          </Link>
        </div>
        </div>
        <div className="flex ml-auto"> 
        {/* // follow button goes here */}
        <div className="mt-6 mr-6 md:mr-16 flex flex-col justify-center items-center cursor-pointer">
        <button 
           className='active:bg-violet-600 py-1 px-3 rounded text-sm border hover:text-[#25511f] hover:bg-[#96de26] transition cursor-pointer bg-[#96de26] text-white font-semibold'>
          FOLLOW
        </button>
        <button className="block md:hidden flex-row m-2 ml-8">
        <LikeButton publication={publication as Publication}/>
        </button>
        </div>
      </div>
      </div>
      <Video publication={publication as Publication} />
      <div className='flex flex-row space-x-3 pt-2 pl-2'>
      <p className="text-xs block md:hidden font-semibold text-gray-400"> {publication.stats.totalUpvotes} likes</p>
      <p className="text-xs block md:hidden font-semibold text-gray-400"> {publication.stats.totalAmountOfComments} comments</p>
      <p className="text-xs block md:hidden font-semibold text-gray-400"> {publication.stats.totalAmountOfMirrors} mirrors</p>
      <p className="text-xs block md:hidden font-semibold text-gray-400"> {publication.stats.totalAmountOfCollects} collects</p>
        </div>
    </div>
  );
};

export default VideoCard;