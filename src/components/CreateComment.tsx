import { CreateCommentTypedDataDocument, CreateCommentTypedDataMutation, CreateCommentTypedDataMutationVariables, Publication, PublicationMainFocus } from '@/types/lens';
import React, { FC, useState } from 'react'
import { LENS_HUB_ABI } from '@/abi/abi';
import { useAppStore } from "src/store/app";
import { useContractWrite, useSignTypedData } from 'wagmi';
import onError from '@/lib/onError';
import toast from 'react-hot-toast';
import { LENSHUB_PROXY } from '@/constants';
import * as Apollo from '@apollo/client';
import getSignature from '@/lib/getSignature';
import { splitSignature } from 'ethers/lib/utils';
import { uploadIpfs } from '@/utils/ipfs';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  publication: Publication;
}

const CreateComment: FC<Props> = ({ publication }) => {
  const [comment, setComment] = useState("");
  
  const currentProfile = useAppStore((state) => state.currentProfile);

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

  const [commented, setCommented] = useState(false);

  function useCreateCommentTypedDataMutation(
    baseOptions?: Apollo.MutationHookOptions<
      CreateCommentTypedDataMutation,
      CreateCommentTypedDataMutationVariables
    >
  ){
    const options = {...baseOptions}
    return Apollo.useMutation<
      CreateCommentTypedDataMutation,
      CreateCommentTypedDataMutationVariables
    >(
      CreateCommentTypedDataDocument,
      options
    )
  }

  
  const onCompleted = () => {
    setCommented(true);
    toast.success('Post has been commented!');
  };

  const { isLoading: writeLoading, write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LENS_HUB_ABI,
    functionName: 'commentWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  });

  const [createCommentTypedData, { loading: typedDataLoading }] = useCreateCommentTypedDataMutation({
    onCompleted: async ({ createCommentTypedData }) => {
      try {
        const { id, typedData } = createCommentTypedData
        const {
          profileId,
          contentURI,
          profileIdPointed,
          pubIdPointed,
          collectModule,
          collectModuleInitData,
          referenceModule,
          referenceModuleData,
          referenceModuleInitData,
          deadline
        } = typedData.value
        const signature = await signTypedDataAsync(getSignature(typedData))
        const { v, r, s } = splitSignature(signature)
        const sig = { v, r, s, deadline }
        const inputStruct = {
          profileId,
          contentURI,
          profileIdPointed,
          pubIdPointed,
          collectModule,
          collectModuleInitData,
          referenceModule,
          referenceModuleData,
          referenceModuleInitData,
          sig
        };

        const tx =  write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
        console.log(tx)

      } catch {}
    },
    onError
  })

    async function createComment (e: React.FormEvent) {
      e.preventDefault()
      const ipfsResult = await uploadIpfs({
        version: '2.0.0',
        mainContentFocus: PublicationMainFocus.TextOnly,
        metadata_id: uuidv4(),
        description: 'Description',
        locale: 'en-US',
        content: comment,
        external_url: null,
        image: null,
        imageMimeType: null,
        name: 'Name',
        attributes: [],
        tags: ['using_api_examples'],
        appId: 'api_examples_github',
      });
      console.log('create comment: ipfs result', ipfsResult); 

      const request = {
        profileId: currentProfile?.id,
        publicationId: publication.id,
        contentURI: `ipfs://${ipfsResult.path}`,
        collectModule: {
          revertCollectModule: true,
        },
        referenceModule: {
          followerOnlyReferenceModule: false
        }
      }

      return createCommentTypedData({
        variables: {
          request
        }
      })
    }

    const isLoading = typedDataLoading || signLoading || writeLoading

  return (
   
      <form onSubmit={createComment} className="flex-shrink-0 flex p-5 gap-3 border-t">
        <input
          type="text"
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)}
            className="bg-[#F1F1F2] rounded-md p-2 flex-grow text-sm outline-none placeholder:text-gray-500 border border-transparent focus:border-gray-300 transition"
            placeholder='Add comment..'
        />
        <button className="text-md text-gray-400 border-gray-100" onClick={ createComment} disabled={isLoading}>
          {isLoading ? 'Commenting...' 
          :
          'Comment'}
        </button>
      </form>
  
  )
}

export default CreateComment