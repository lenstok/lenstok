//mapping for the prfile vids
import React, { useRef, useState } from 'react';
import Link from "next/link";
import { PublicationsDocument, PublicationsQueryRequest, PaginatedPublicationResult} from "@/types/lens";
import type { Publications, Publication } from "@/types/lens";
import { useQuery } from "@apollo/client";
import { useRouter } from 'next/router';
import type { FC } from "react";
import { sanitizeIpfsUrl } from "@/utils/sanitizeIpfsUrl";

interface Props {
    publication: Publications;
  }

  const ProfileVideos = () => {
    const router = useRouter();
    const { id } = router.query

  const { data, loading, error } = useQuery
  <{publications: PaginatedPublicationResult ;}>
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

    return (
      <div>
      <div className='flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full'>
      <p className='text-xl font-semibold cursor-pointer mt-2'>Videos</p>
      </div>
      {publications ? (
      <div className='grid gap-1 mt-2 lg:grid-cols-3 md:gap-y-8 gap-y-2 3xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-col-1'>
      {publications?.map((pub) => (
        <div key={pub.id} className='relative w-full h-60 bg-cover bg-center bg-no-repeat'>
            <Link href={`/detail/${pub.id}`} key={pub.id}>
            <video
            loop
            src={sanitizeIpfsUrl(pub.metadata.media[0].original.url)}
            className='bg-gray-100 rounded-xl dark:bg-[#181818] aspect-w-16 aspect-h-9 cursor-pointer w-full h-full lg:w-full lg:h-full object-contain'
          ></video> 
          </Link>
          <p>{pub.metadata.name}</p>
        </div>
      ))}
      </div>
      ) : (
          <div>
            <p>No videos yet</p>
          </div>
      )} 
    </div>
    );
  };
  
  export default ProfileVideos;