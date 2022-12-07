import { Publication } from '@/types/lens'
import Link from 'next/link'
import Image from 'next/image'
import React, { FC } from 'react'
import getAvatar from '@/lib/getAvatar'

interface Props {
    comment: Publication
}

const CommentData: FC<Props> = ({ comment }) => {
  return (
    <div className="flex gap-2">
                    <Link href={`/profile/${comment.profile.id}`} key={comment.profile.id}>
                        <div className="flex-shrink-0 rounded-full">
                            <Image
                                width={40}
                                height={40}
                                className="rounded-full cursor-pointer"
                                src={getAvatar(comment.profile)}
                                alt={comment.profile.handle}
                            />
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
  )
}

export default CommentData