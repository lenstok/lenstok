import Link from "next/link";
import Image from "next/image";
import type { FC } from "react";
import type { Profile, Publication } from "@/types/lens";
import Video from './Video'
import { GoVerified } from "react-icons/go";
import getAvatar from "@/lib/getAvatar";

interface Props {
  publication: Publication;
  profile: Profile;
}
const VideoCard: FC<Props> = ({ publication, profile }) => {

  return (
    <div className="flex flex-col border-b-2 border-gray-200 pb-6">
      <div>
        <div className="flex gap-3 p-2 mt-4 cursor-pointer font-semibold rounded ">
        <Link href={`/profile/${profile.id}`} key={profile.id}>
          <div className="md:w-16 md:h-16 w-10 h-10">
              <img
                src={getAvatar(profile)}
                width={62}
                height={62}
                alt={profile.handle}
                className="rounded-full"
              />
              </div>
            </Link>
        <div>
          <Link href={`/profile/${profile.id}`} key={profile.id}>
            <div className="flex items-center gap-2">
              <p className="flex gap-2 items-center md:text-md font-bold text-primary">
                {profile.handle}{' '}
                <GoVerified className="text-blue-400 text-md"/>
              </p>
              <p className="capitalize font-medium text-xs text-gray-500 hidden md:block">
                {profile.name}
              </p>
            </div>
          </Link>
          <Link href="/">
            <p className="mt-2 font-normal">
              {publication.metadata.description.slice(0, 105)} {""}
            </p>
          </Link>
        </div>
        </div>
      </div>
      <Video publication={publication as Publication} />
    </div>
  );
};

export default VideoCard;
