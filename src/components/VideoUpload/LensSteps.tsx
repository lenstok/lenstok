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
import getUserLocale from "@/lib/getUserLocale";
import { splitSignature } from "ethers/lib/utils";
import { LENS_HUB_ABI } from "@/abi/abi";
import { LENSHUB_PROXY } from "@/constants";
import { useContractWrite, useSignTypedData } from "wagmi";
import toast from "react-hot-toast";
import onError from "@/lib/onError";
import { v4 as uuidv4 } from "uuid";
import { ARWEAVE_WEBSITE_URL } from "@/constants";
import { LENSTOK_URL } from "@/constants";

const LensSteps = () => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo);
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo);
  const currentUser = useAppStore((state) => state.currentProfile);
  const bundlrData = useAppStore((state) => state.bundlrData);
  const setBundlrData = useAppStore((state) => state.setBundlrData);
  const getBundlrInstance = useAppStore((state) => state.getBundlrInstance);

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

  const uploadToBundlr = async () => {
    try {
      if (!bundlrData.instance) console.log("Bundlr instance is undefined");
      if (bundlrData.balance > bundlrData.estimatedPrice) {
        setUploadedVideo({ loading: true, buttonText: "Uploading Video" });
        const uploader = bundlrData.instance?.uploader.chunkedUploader;
        uploader?.setBatchSize(2);
        uploader?.setChunkSize(10_000_000);
        uploader?.on("chunkUpload", (chunkInfo) => {
          const fileSize = uploadedVideo?.file?.size as number;
          const percentCompleted = Math.round(
            (chunkInfo.totalUploaded * 100) / fileSize
          );
          setUploadedVideo({
            percent: percentCompleted,
          });
        });
        const tags = [
          {
            name: "Content-Type",
            value: uploadedVideo.videoType || "video/mp4",
          },
          { name: "App-Name", value: "Lenstok" },
        ];
        const upload = uploader?.uploadData(uploadedVideo.stream as any, {
          tags: tags,
        });
        const response = await upload;
        console.log("Upload", response);
        const arweaveUrl: string = `${ARWEAVE_WEBSITE_URL}/${response?.data.id}`;
        setUploadedVideo({
          videoSource: arweaveUrl,
          isUploadToAr: true,
        });
        return createPublication(arweaveUrl);
      } else {
        toast.error(
          "Insuffisant balance on your account. Please fund it to reach the estimated price."
        );
      }
    } catch (error) {
      toast.error("Failed to upload video to bundlr.");
      console.log("Failed to upload video to bundlr: ", error);
    }
  };

  const uploadMetadata = async (contentUri: string) => {
    try {
      console.log("Arweave Url back from uploadToBundlr function", contentUri);
      uploadedVideo.videoSource = contentUri;

      const metadata: PublicationMetadataV2Input = {
        version: "2.0.0",
        metadata_id: uuidv4(),
        description: uploadedVideo.description.trim(),
        content:
          `${uploadedVideo.title}\n\n${uploadedVideo.description}`.trim(),
        locale: getUserLocale(),
        tags: [""],
        mainContentFocus: PublicationMainFocus.Video,
        animation_url: uploadedVideo.videoSource,
        image: uploadedVideo.thumbnail,
        imageMimeType: uploadedVideo.thumbnailType,
        name: uploadedVideo.title,
        attributes: [],
        media: [
          {
            item: uploadedVideo.videoSource,
            type: uploadedVideo.videoType,
          },
        ],
        appId: "lenstok",
      };
      const response = await fetch(` http://localhost:3001/api/meta-to-ipfs`, {
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

  const createPublication = async (arweaveUri: string) => {
    const contentUri = await uploadMetadata(arweaveUri);
    console.log("Metadata content uri ", contentUri);
    console.log("Current User id", currentUser?.id);
    if (errorAuthenticate)
      console.log("AUTHENTICATION ERROR", errorAuthenticate);

    // Check for currentUserId and throw if it's not connected
    // then redirect to login page

    setUploadedVideo({ buttonText: "Post on Lens" });
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
    setUploadedVideo({ buttonText: "Posting on Lens" });
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
    if (tx) setUploadedVideo({ buttonText: "Done!", loading: false });
  };
  return (
    <>
      <div onClick={uploadToBundlr}>{uploadedVideo.buttonText}</div>
    </>
  );
};

export default LensSteps;
