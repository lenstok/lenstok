import React, { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppStore } from "src/store/app";

import { GoVerified } from 'react-icons/go';

import NoResults from './NoResults';
import { useQuery } from '@apollo/client';
import { PublicationsDocument } from '@/types/lens';
import { useRouter } from 'next/router';
import { sanitizeIpfsUrl } from '@/utils/sanitizeIpfsUrl';
import CreateComment from './CreateComment';
import LoginButton from './LoginButton';

const Comments = () => {
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
        <div className="border-t-2 border-gray-200 pt-4 px-10 mt-4 bg-[#F8F8F8] border-b-2 lg:pb-0 pb-[100px]">
            <div className="overflow-scroll lg:h-[475px]">
                {comments?.length ? (
                comments?.map((comment) =>
                    <>
                        <div className="p-2 items-center">
                            <Link href="/">
                                <div className="flex items-start gap-3">
                                    <div className="w-12 h-12">
                                        {comment.profile.picture?.__typename === "MediaSet" ? (
                                        comment.profile.picture.original.url.includes("ipfs") ? (
                                            <Image
                                            width={48}
                                            height={48}
                                            className="rounded-full cursor-pointer"
                                            src={sanitizeIpfsUrl(comment.profile.picture.original.url)}
                                            alt={comment.profile.handle}
                                            layout="responsive" 
                                            />
                                        ) : (
                                            <Image
                                            width={48}
                                            height={48}
                                            className="rounded-full cursor-pointer"
                                            src={comment.profile.picture.original.url}
                                            alt={comment.profile.handle}
                                            layout="responsive" 
                                            />
                                        )
                                        ) : null}
                                    </div>

                                    <p className="flex cursor-pointer gap-1 items-center text-[18px] font-bold leading-6 text-primary">
                                        {comment.profile.handle}
                                    </p>
                                </div>
                            </Link>
                            <div>
                                <p className="-mt-5 ml-16 text-[16px] mr-8">
                                    {comment.metadata.content}
                                </p>
                            </div>
                        </div>
                    </>
                )
                ) : (
                    <NoResults text='No Comments Yet! Be the first...' />
                )}
            </div>
            {
                currentProfile ? <CreateComment /> : <LoginButton />
            }
        </div>
    ) 
}

export default Comments;

