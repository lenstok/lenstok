import Link from "next/link";
import Image from "next/image";
import type { FC } from "react";
import type { Publication } from "@/types/lens";
import { sanitizeIpfsUrl } from "@/utils/sanitizeIpfsUrl";
import Video from './Video'
import { GoVerified } from "react-icons/go";

interface Props {
  publication: Publication;
}
const VideoCard: FC<Props> = ({ publication }) => {

  return (
    <div className="flex flex-col border-b-2 border-gray-200 pb-6">
      <div>
        <div className="flex gap-3 p-2 mt-4 cursor-pointer font-semibold rounded ">
        <Link href={`/profile/${publication.profile.id}`} key={publication.profile.id}>
          <div className="md:w-16 md:h-16 w-10 h-10">
              <>
               {publication.profile.picture?.__typename === "MediaSet" ? (
                publication.profile.picture.original?.url.includes("ipfs") ? (
                  <div>
                    <Image
                    src={sanitizeIpfsUrl(publication.profile.picture.original.url)}
                    width={62}
                    height={62}
                    alt={publication.profile.handle}
                    className="rounded-full"
                    />
                  </div>
                ) : (
                  <Image
                   src={publication.profile.picture.original.url}
                   width={62}
                   height={62}
                   alt={publication.profile.handle}
                   className="rounded-full"
                  />
                )
               ) : null}
              </>
              </div>
            </Link>
        <div>
          <Link href={`/profile/${publication.profile.id}`} key={publication.profile.id}>
            <div className="flex items-center gap-2">
              <p className="flex gap-2 items-center md:text-md font-bold text-primary">
                {publication.profile.handle}{' '}
                <GoVerified className="text-blue-400 text-md"/>
              </p>
              <p className="capitalize font-medium text-xs text-gray-500 hidden md:block">
                {publication.profile.name}
              </p>
            </div>
          </Link>
          <Link href="/">
            <p className="mt-2 font-normal">
              {publication.metadata.description.slice(0, 105)}
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
