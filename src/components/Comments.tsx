import React, { Dispatch, FC, SetStateAction } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppStore } from "src/store/app";

import NoResults from './NoResults';
import { useQuery } from '@apollo/client';
import { Publication, PublicationsDocument } from '@/types/lens';
import { useRouter } from 'next/router';
import { sanitizeIpfsUrl } from '@/utils/sanitizeIpfsUrl';
import CreateComment from './CreateComment';
import LoginButton from './LoginButton';

interface Props {
    publication: Publication;
}

const Comments: FC<Props> = ({publication}) => {
    const currentProfile = useAppStore((state) => state.currentProfile);
    
    const router = useRouter()
    const { id } = router.query

    const { data, loading, error } = useQuery(PublicationsDocument, {
        variables: { 
          request: {
            commentsOf: id,
            limit: 10
          }
         },
      });
    const comments = data?.publications.items
    console.log("Comments", comments);

    return (
    <div className="overflow-y-auto">
        <div className=" h-screen flex-grow flex flex-col items-stretch gap-3 overflow-y-auto bg-[#F8F8F8] p-5">
            { comments?.length ? (
              comments?.map((comment) => 
                <>
                <div className="flex gap-2">
                    <Link href={`/profile/${comment.profile.id}`} key={comment.profile.id}>
                        <div className="flex-shrink-0 rounded-full">
                        {comment.profile.picture?.__typename === "MediaSet" ? (
                          comment.profile.picture.original.url.includes("ipfs") ? (
                                            <Image
                                            width={40}
                                            height={40}
                                            className="rounded-full cursor-pointer"
                                            src={sanitizeIpfsUrl(comment.profile.picture.original.url)}
                                            alt={comment.profile.handle}
                                            />
                                        ) : (
                                            <Image
                                            width={48}
                                            height={48}
                                            className="rounded-full cursor-pointer"
                                            src={comment.profile.picture.original.url}
                                            alt={comment.profile.handle}
                                            />
                                        )
                                        ) : null}
                         </div>
                    </Link>
                    <div className="flex-grow">
                        <p className="font-bold hover:underline">
                        {comment.profile.handle}
                        </p>
                        <p
                         style={{
                         wordWrap: "break-word",
                         overflowWrap: "break-word",
                         }}
                        >
                        {comment.metadata.content}
                        </p>
                    </div>
                    </div>
                    </>
              )
 ) : (
     <NoResults text='No Comments Yet! Be the first...' />
 ) }
</div>

</div>

);
}

export default Comments;