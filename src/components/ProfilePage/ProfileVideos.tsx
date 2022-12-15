//mapping for the prfile vids
import React, { useRef, useState } from 'react';
import Link from "next/link";
import { PublicationsDocument, PublicationsQueryRequest, PaginatedPublicationResult} from "@/types/lens";
import { useQuery } from "@apollo/client";
import { useRouter } from 'next/router';
import type { FC } from "react";
import { sanitizeIpfsUrl } from "@/utils/sanitizeIpfsUrl";
import { BsPlay } from "react-icons/bs";


  const ProfileVideos = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const router = useRouter();
    const { id } = router.query

  const { data, loading, error } = useQuery
  <{publications: PaginatedPublicationResult}>
  ((PublicationsDocument), {
    variables: { 
      request: {
        profileId: id,
        publicationTypes: ["POST"],
        limit: 10,
        metadata: {
          mainContentFocus: ["VIDEO"],
        },
      }
     },
  });

    const publications = data?.publications.items;
    console.log("DATA", data?.publications?.items);

    const handleOnMouseOver = (e: React.MouseEvent<HTMLVideoElement>) => {
      e.currentTarget.play();
    };
    const handleOnMouseOut = (e: React.MouseEvent<HTMLVideoElement>) => {
      e.currentTarget.pause();
    };

    return (
  <div>
        {publications?.length === 0 ? (
            <p className="text-center">No videos yet</p>
           ) : (
            <div className="grid gap-2 mr-2 mt-2 mb-10 lg:grid-cols-3 md:gap-y-6 gap-x-4 gap-y-2 3xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-col-1">
            {publications?.map((pub) => (
                <div key={pub.id}>
                    <Link href={`/detail/${pub.id}`} key={pub.id}>
                        <a className="block h-0 relative pb-[131%]">
                        <video
                        ref={videoRef}
                        src={sanitizeIpfsUrl(pub.metadata.media[0].original.url)}
                        muted // Needs to be there to be able to play
                        onMouseOver={handleOnMouseOver}
                        onMouseOut={handleOnMouseOut}
                        className="absolute inset-0 h-full w-full object-cover rounded-md transform transition duration-500 md:hover:scale-125 hover:z-10 md:hover:border border-white"
                        /> 
                        {/*<BsPlay onClick={onVideoClick} className="absolute left-3 bottom-3 fill-white w-7 h-7" />*/}
                         <p className="whitespace-nowrap overflow-hidden text-ellipsis text-white">
                        {pub.metadata.name}
                        </p> 
                        </a>
                     </Link>
                </div>
             ))}
             </div>
         )}
  </div>
            )}
  
  export default ProfileVideos;