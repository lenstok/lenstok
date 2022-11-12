import { CreateCommentTypedDataDocument, CreatePublicCommentRequest, PublicationMainFocus } from '@/types/lens';
import React, { useState } from 'react'
import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/router';
import { uploadIpfs } from '@/utils/ipfs';
import { apolloClient } from '@/apollo-client';
import { LENS_HUB_ABI } from '@/abi/abi';
import { useAppStore } from "src/store/app";
import omitDeep from 'omit-deep';

const CreateComment = () => {
  const [comment, setComment] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false)
  const router = useRouter()
  const postId = router.query

  const currentProfile = useAppStore((state) => state.currentProfile);

  const LENS_HUB_CONTRACT_ADDRESS = '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82'

  const createCommentTypedData = async (request: CreatePublicCommentRequest) => {
    const result = await apolloClient.mutate({
      mutation: CreateCommentTypedDataDocument,
      variables: {
        request,
      },
    });
  
    return result
  };

  async function submitComment() {
    setIsPostingComment(true)

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract  (LENS_HUB_CONTRACT_ADDRESS, LENS_HUB_ABI, signer)

    if (!currentProfile) {
			console.log('No profile detected...')
			return
		}

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
      tags: [''],
      appId: 'lenstok',
    });
    console.log('create comment: ipfs result', ipfsResult);

    const createCommentRequest = {
			profileId: currentProfile.id,
			publicationId: postId.id,
			contentURI: 'ipfs://' + ipfsResult.path,
			collectModule: {
				revertCollectModule: true,
			},
			referenceModule: {
				followerOnlyReferenceModule: false,
			},
		}
		const result = await createCommentTypedData(createCommentRequest)
		const typedData = result.data!.createCommentTypedData.typedData
		console.log('typedData', typedData)

    const signature = await signer._signTypedData(
			omitDeep(typedData.domain, "__typename"),
			omitDeep(typedData.types, "__typename"),
			omitDeep(typedData.value, "__typename")
		)

		console.log('Signature', signature)
		const { v, r, s } = ethers.utils.splitSignature(signature)

    const tx = await contract.commentWithSig({
			profileId: typedData.value.profileId,
			contentURI: typedData.value.contentURI,
			profileIdPointed: typedData.value.profileIdPointed,
			pubIdPointed: typedData.value.pubIdPointed,
			referenceModuleData: typedData.value.referenceModuleData,
			collectModule: typedData.value.collectModule,
			collectModuleInitData: typedData.value.collectModuleInitData,
			referenceModule: typedData.value.referenceModule,
			referenceModuleInitData: typedData.value.referenceModuleInitData,
			sig: {
				v,
				r,
				s,
				deadline: typedData.value.deadline,
			},
		})
		console.log(tx.hash)
  }

  return (
    <div className="absolute bottom-0 left-0 pb-6 px-2 md:px-10">
      <form onSubmit={submitComment} className="flex gap-4">
        <input
          type="text"
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)}
          className='bg-primary px-6 py-4 text-md font-medium border-2 w-[250px] md:w-[700px] lg:w-[350px] border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 flex-1 rounded-lg'
          placeholder='Add comment..'
        />
        <button className="text-md text-gray-400 border-gray-100" onClick={submitComment}>
          {isPostingComment ? 'Commenting...' 
          :
          'Comment'}
        </button>
      </form>
    </div>
  )
}

export default CreateComment