import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';
import { MdFavorite } from 'react-icons/md';
import { AddReactionDocument, AddReactionMutation, AddReactionMutationVariables, Publication, ReactionTypes, RemoveReactionDocument, RemoveReactionMutation, RemoveReactionMutationVariables } from '@/types/lens';
import { useRouter } from 'next/router';
import { useAppStore } from '@/store/app';
import * as Apollo from '@apollo/client'
import { ApolloCache } from '@apollo/client';
import { publicationKeyFields } from '@/lib/keyFields';
import Like from '../Like';
import Unlike from '../Unlike';

//should also add authorisation so user cant like posttwice
interface Props {
  publication: Publication
}

const LikeButton: FC<Props> = ({publication}) => {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(publication.stats.totalUpvotes)

  useEffect(() => {
    if (publication?.reaction === 'UPVOTE') {
      setLiked(true)
    } else {
      setLiked(false)
    }
  }, [publication?.reaction])
  

  return (
    <div className="flex gap-6">
    <div className="mt-4 flex flex-col justify-center items-center cursor-pointer">
      <Like setCount={setCount} count={count} setLiked={setLiked} liked={liked} publication={publication as Publication} />
        <p className="text-xs font-semibold text-gray-400"> {count} </p>
      </div>
    </div>
  );
}

export default LikeButton; 