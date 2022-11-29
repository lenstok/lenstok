import { useEffect } from "react";
import { useAppStore } from "@/store/app";
import { useMutation } from "@apollo/client";
import {
  CreatePublicPostRequest,
  PublicationMetadataMediaInput,
  PublicationMetadataV2Input,
} from "@/types/lens";
import {
  PublicationMainFocus,
  PublicationMetadataDisplayTypes,
  CreatePostTypedDataDocument,
} from "@/types/lens";
import getSignature from "@/lib/getSignature";
import { splitSignature } from "ethers/lib/utils";
import { LENS_HUB_ABI } from "@/abi/abi";
import { LENSHUB_PROXY } from "@/constants";
import { useContractWrite, useSignTypedData } from "wagmi";
import onError from "@/lib/onError";
import { v4 as uuidv4 } from "uuid";
import { LENSTOK_URL } from "@/constants";

interface Props {
  id: string;
  title: string;
  description: string;
}

const LensSteps = ({ id, title, description }: Props) => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo);
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo);
  const currentUser = useAppStore((state) => state.currentProfile);
  const [
    createPostTypedData,
    { error: errorAuthenticate, loading: authLoading },
  ] = useMutation(CreatePostTypedDataDocument);
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError,
  });
  const onCompleted = () => {
    console.log("successfully write to contract");
  };
  const {
    data: writeData,
    isLoading: writeLoading,
    isSuccess: writeSuccess,
    write,
  } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LENS_HUB_ABI,
    functionName: "postWithSig",
    mode: "recklesslyUnprepared",
    onSuccess: onCompleted,
    onError,
  });
  console.log("Uploadeed Video State:", uploadedVideo);
  const storeToIPFS = async () => {
    const body = { id: id };
    try {
      const url = `${LENSTOK_URL}/api/get-ipfs-cid`;
      console.log("IPFS Fetch url", url);
      const response = await fetch(`${LENSTOK_URL}/api/get-ipfs-cid`, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status !== 200) {
        alert("Something wrong while trying getting Ipfs cid");
      } else {
        console.log("Video successfully stored on IPFS from Livepeer!");
        let cid = await response.json();
        const contentURI = `https://infura-ipfs.io/ipfs/${cid}`;
        setUploadedVideo({ videoSource: contentURI });
        return contentURI;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const uploadMetadata = async () => {
    const videoSource: any = await storeToIPFS();
    uploadedVideo.videoSource = videoSource;
    try {
      const metadata: PublicationMetadataV2Input = {
        version: "2.0.0",
        metadata_id: uuidv4(),
        description: uploadedVideo.description.trim(),
        content:
          `${uploadedVideo.title}\n\n${uploadedVideo.description}`.trim(),
        locale: "en",
        tags: [""],
        mainContentFocus: PublicationMainFocus.Video,
        animation_url: uploadedVideo.videoSource,
        image: uploadedVideo.thumbnail,
        imageMimeType: uploadedVideo.thumbnailType,
        name: "First Video",
        attributes: [],
        media: [
          {
            item: uploadedVideo.videoSource,
            type: "video/mp4",
          },
        ],
        appId: "lenstok",
      };
      const response = await fetch(`${LENSTOK_URL}/api/meta-to-ipfs`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(metadata),
      });

      if (response.status !== 200) {
        console.log("Something wrong while trying storing to IPFS");
      } else {
        let responseJSON = await response.json();
        const contentURI = `https://infura-ipfs.io/ipfs/${responseJSON.cid}`;
        return contentURI;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createPublication = async () => {
    const contentUri = await uploadMetadata();
    console.log("Current User id", currentUser?.id);

    const result = await createPostTypedData({
      variables: {
        request: {
          profileId: currentUser?.id,
          contentURI: contentUri,
          collectModule: {
            revertCollectModule: true,
          },
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        },
      },
    });
    const typedData = result.data?.createPostTypedData.typedData;
    const deadline = typedData?.value.deadline;
    const signature = await signTypedDataAsync(getSignature(typedData));
    const { v, r, s } = splitSignature(signature);
    const sig = { v, r, s, deadline };
    console.log("TypedData", typedData);
    const inputStruct = {
      profileId: typedData?.value.profileId,
      contentURI: typedData?.value.contentURI,
      referenceModuleData: typedData?.value.referenceModule,
      collectModule: typedData?.value.collectModule,
      collectModuleInitData: typedData?.value.collectModuleInitData,
      referenceModule: typedData?.value.referenceModule,
      referenceModuleInitData: typedData?.value.referenceModuleInitData,
      sig,
    };
    const tx = await write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
    console.log("TX", writeData?.hash);
  };
  return (
    <>
      <div onClick={createPublication}>Post on Lens</div>
    </>
  );
};

export default LensSteps;
