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

//should also add authorisation so user cant like posttwice
interface Props {
  publication: Publication
}

const LikeButton: FC<Props> = ({publication}) => {
  const { pathname } = useRouter()
  const currentProfile = useAppStore((state) => state.currentProfile)
  const [alreadyLiked, setAlreadyLiked] = useState((publication.reaction) === "UPVOTE");
  const [count, setCount] = useState(publication.stats.totalUpvotes)

  function useAddReactionMutation(
    baseOptions?: Apollo.MutationHookOptions<AddReactionMutation, AddReactionMutationVariables>
  ) {
    const options = {...baseOptions}
    return Apollo.useMutation<AddReactionMutation, AddReactionMutationVariables>(
      AddReactionDocument, 
      options
    )
  }

  const updateCache = (cache: ApolloCache<any>, type: ReactionTypes.Upvote | ReactionTypes.Downvote) => {
    cache.modify({
      id: publicationKeyFields(publication),
      fields: {
        stats: (stats) => ({
          ...stats,
          totalUpvotes: type === ReactionTypes.Upvote ? stats.totalUpvotes + 1 : stats.totalUpvotes - 1
        })
      }
    })
  }

  function useRemoveReactionMutation(
    baseOptions?: Apollo.MutationHookOptions<RemoveReactionMutation, RemoveReactionMutationVariables>
  ) {
    const options = {...baseOptions}
    return Apollo.useMutation<RemoveReactionMutation, RemoveReactionMutationVariables>(
      RemoveReactionDocument,
      options
    )
  }

  const addReaction = useAddReactionMutation({
    variables: {
      request: {
        profileId: currentProfile?.id,
        reaction: ReactionTypes.Upvote,
        publicationId: publication.id
      }
    },
    update: (cache) => updateCache(cache, ReactionTypes.Upvote)
  })

  const removeReaction = useRemoveReactionMutation({
    variables: {
      request: {
        profileId: currentProfile?.id,
        reaction: ReactionTypes.Downvote,
        publicationId: publication.id
      }
    },
    update: (cache) => updateCache(cache, ReactionTypes.Downvote)
  })

  const createLike = () => {
    if (!currentProfile) {
      throw new Error("No Profile dected");
    }

    if(alreadyLiked) {
      setAlreadyLiked(false)
      setCount(count - 1)
      removeReaction
    } else {
      setAlreadyLiked(true)
      setCount(count + 1)
      addReaction
    }
  }

  return (
    <div className="flex gap-6">
    <div className="mt-4 flex flex-col justify-center items-center cursor-pointer">
      {alreadyLiked ? (
        <div className="flex items-center bg-emerald-700 rounded-full p-2 md:p-3">
         <HeartIcon className="w-4 h-4 text-[#96de26]" onClick={createLike} />
        </div>
      ) : (
        <div className="flex items-center bg-emerald-700 rounded-full p-2 md:p-3 hover:bg-[#96de26]">
          <HeartIcon className='w-4 h-4 text-white' onClick={createLike} />
        </div>
      )}
        <p className="text-xs font-semibold text-gray-400"> {count} </p>
      </div>
    </div>
  );
}

export default LikeButton; 