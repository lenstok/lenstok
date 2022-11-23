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
}

const LensSteps = ({ id }: Props) => {
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
  const { isLoading: writeLoading, write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LENS_HUB_ABI,
    functionName: "commentWithSig",
    mode: "recklesslyUnprepared",
    onSuccess: onCompleted,
    onError,
  });

  const storeToIPFS = async () => {
    const body = { id: id };
    try {
      console.log("Asset id from Lenssteps", id);
      const response = await fetch(`${LENSTOK_URL}/api/get-ipfs-cid`, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status !== 200) {
        alert("Something wrong while trying getting Ipfs cid");
      } else {
        console.log("Form successfully submitted!");
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
    console.log("Uploaded video before storing", uploadedVideo.videoSource);
    const videoSource = await storeToIPFS();
    console.log("Uploaded video after storing", videoSource);
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
        animation_url: videoSource,
        image: uploadedVideo.thumbnail,
        imageMimeType: uploadedVideo.thumbnailType,
        name: uploadedVideo.title.trim(),
        attributes: [],
        media: [{ item: videoSource }],
        appId: "lenstok",
      };
      const response = await fetch(`${LENSTOK_URL}/api/metaToIpfs`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(metadata),
      });

      if (response.status !== 200) {
        console.log("Something wrong while trying storing to IPFS");
      } else {
        console.log("Metadata sent successfully to Ipfs...");
        let responseJSON = await response.json();
        console.log("Metadata  response is", responseJSON);
        const contentURI = `https://infura-ipfs.io/ipfs/${responseJSON.cid}`;
        console.log("Content URI", contentURI);
        /* const url = responseJSON.storage.ipfs.url;s
        console.log("ipfs url:", url); */
        return contentURI;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createPublication = async () => {
    const contentUri = await uploadMetadata();

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
    console.log("A");
    const typedData = result.data?.createPostTypedData.typedData;
    console.log("B");
    const signature = await signTypedDataAsync(getSignature(typedData));
    console.log("C");
    const { v, r, s } = splitSignature(signature);
    console.log("D");
    const sig = { v, r, s };
    console.log("E");
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
    console.log("F");
    const tx = await write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
    console.log(tx);
    console.log("TypedData", typedData);
    console.log("Current user", currentUser);
  };
  return (
    <div>
      Uploading to lens<button onClick={createPublication}>send!</button>
    </div>
  );
};

export default LensSteps;
