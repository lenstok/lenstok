import { LENSHUB_PROXY_ABI } from "@/abis/LensHubProxy";
import { useVideoStore, UPLOADED_VIDEO_FORM_DEFAULTS } from "@/store/video";
import { useAppStore } from "src/store/app";
import {
  APP_NAME,
  IS_MAINNET,
  LENSHUB_PROXY,
  LENSTOK_URL,
  RELAYER_ENABLED,
  VIDEO_CDN_URL,
} from "@/constants";

import omitKey from "@/utils/functions/omitKeys";

import trimify from "@/utils/functions/trimify";
import uploadToAr from "@/utils/functions/uploadToArweave";

import usePendingTxn from "@/utils/hooks/usePendingTxn";
import axios from "axios";
import { utils } from "ethers";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import type {
  CreatePostBroadcastItemResult,
  CreatePublicPostRequest,
  MetadataAttributeInput,
  PublicationMetadataMediaInput,
  PublicationMetadataV2Input,
} from "@/types/lens";
import {
  PublicationContentWarning,
  PublicationMainFocus,
  PublicationMetadataDisplayTypes,
  useBroadcastMutation,
  useCreatePostTypedDataMutation,
  useCreatePostViaDispatcherMutation,
} from "@/types/lens";
import type { CustomErrorWithData } from "src/types/local";
import { v4 as uuidv4 } from "uuid";
import {
  useAccount,
  useContractWrite,
  useSigner,
  useSignTypedData,
} from "wagmi";

import type { VideoFormData } from "./Details";
import Details from "./Details";

const UploadSteps = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const getBundlrInstance = useVideoStore((state) => state.getBundlrInstance);
  const setBundlrData = useVideoStore((state) => state.setBundlrData);
  const bundlrData = useVideoStore((state) => state.bundlrData);
  const uploadedVideo = useVideoStore((state) => state.uploadedVideo);
  const setUploadedVideo = useVideoStore((state) => state.setUploadedVideo);
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const resetToDefaults = () => {
    setUploadedVideo(UPLOADED_VIDEO_FORM_DEFAULTS);
  };

  useEffect(() => {
    if (uploadedVideo.videoSource) {
      resetToDefaults();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onError = (error: CustomErrorWithData) => {
    toast.error(
      error?.data?.message ??
        error?.message ??
        "Oops, something went something!"
    );
    setUploadedVideo({
      buttonText: "Post Video",
      loading: false,
    });
  };

  const onCompleted = (data: any) => {
    if (
      data?.broadcast?.reason !== "NOT_ALLOWED" &&
      !data.createPostViaDispatcher?.reason
    ) {
      setUploadedVideo({
        buttonText: "Indexing...",
        loading: true,
      });
    }
  };

  const { signTypedDataAsync } = useSignTypedData({
    onError,
  });
  const [broadcast, { data: broadcastData }] = useBroadcastMutation({
    onCompleted,
    onError,
  });

  const { write: writePostContract, data: writePostData } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LENSHUB_PROXY_ABI,
    functionName: "postWithSig",
    mode: "recklesslyUnprepared",
    onSuccess: () => {
      setUploadedVideo({
        buttonText: "Indexing...",
        loading: true,
      });
    },
    onError,
  });

  const [createPostViaDispatcher, { data: dispatcherData }] =
    useCreatePostViaDispatcherMutation({
      onError,
      onCompleted,
    });

  const broadcastTxId =
    broadcastData?.broadcast.__typename === "RelayerResult"
      ? broadcastData?.broadcast?.txId
      : null;
  const dispatcherTxId =
    dispatcherData?.createPostViaDispatcher.__typename == "RelayerResult"
      ? dispatcherData?.createPostViaDispatcher?.txId
      : null;

  usePendingTxn({
    txId: dispatcherTxId ?? broadcastTxId,
    txHash: writePostData?.hash,
    isPublication: true,
  });

  const getPlaybackId = async (url: string) => {
    // Only on production and mp4 (only supported on livepeer)
    if (!IS_MAINNET || uploadedVideo.videoType !== "video/mp4") return null;
    try {
      const playbackResponse = await axios.post("/api/video/playback", {
        url,
      });
      const { playbackId } = playbackResponse.data;
      return playbackId;
    } catch (error) {
      console.log("[Error Get Playback]", error);
      return null;
    }
  };

  const initBundlr = async () => {
    if (signer?.provider && address && !bundlrData.instance) {
      toast("Sign to initialize & estimate upload...");
      const bundlr = await getBundlrInstance(signer);
      if (bundlr) {
        setBundlrData({ instance: bundlr });
      }
    }
  };

  const [createPostTypedData] = useCreatePostTypedDataMutation({
    onCompleted: async (data: any) => {
      const { typedData, id } =
        data.createPostTypedData as CreatePostBroadcastItemResult;
      const {
        profileId,
        contentURI,
        collectModule,
        collectModuleInitData,
        referenceModule,
        referenceModuleInitData,
      } = typedData?.value;
      try {
        const signature = await signTypedDataAsync({
          domain: omitKey(typedData?.domain, "__typename"),
          types: omitKey(typedData?.types, "__typename"),
          value: omitKey(typedData?.value, "__typename"),
        });
        const { v, r, s } = utils.splitSignature(signature);
        const args = {
          profileId,
          contentURI,
          collectModule,
          collectModuleInitData,
          referenceModule,
          referenceModuleInitData,
          sig: { v, r, s, deadline: typedData.value.deadline },
        };
        if (!RELAYER_ENABLED) {
          return writePostContract?.({ recklesslySetUnpreparedArgs: [args] });
        }
        const { data } = await broadcast({
          variables: { request: { id, signature } },
        });
        if (data?.broadcast?.__typename === "RelayError")
          writePostContract?.({ recklesslySetUnpreparedArgs: [args] });
      } catch {}
    },
    onError,
  });

  const signTypedData = (request: CreatePublicPostRequest) => {
    createPostTypedData({
      variables: { request },
    });
  };

  const createViaDispatcher = async (request: CreatePublicPostRequest) => {
    const { data } = await createPostViaDispatcher({
      variables: { request },
    });
    if (data?.createPostViaDispatcher.__typename === "RelayError") {
      signTypedData(request);
    }
  };

  const createPublication = async ({
    videoSource,
    playbackId,
  }: {
    videoSource: string;
    playbackId: string;
  }) => {
    try {
      setUploadedVideo({
        buttonText: "Storing metadata...",
        loading: true,
      });
      uploadedVideo.playbackId = playbackId;
      uploadedVideo.videoSource = videoSource;
      const media: Array<PublicationMetadataMediaInput> = [
        {
          item: uploadedVideo.videoSource,
          type: uploadedVideo.videoType,
          cover: uploadedVideo.thumbnail,
        },
      ];
      const attributes: MetadataAttributeInput[] = [
        {
          displayType: PublicationMetadataDisplayTypes.String,
          traitType: "handle",
          value: `${currentProfile?.handle}`,
        },
        {
          displayType: PublicationMetadataDisplayTypes.String,
          traitType: "app",
          value: "lenstok",
        },
      ];
      if (uploadedVideo.playbackId) {
        media.push({
          item: `${VIDEO_CDN_URL}/asset/${uploadedVideo.playbackId}/video`,
          type: uploadedVideo.videoType,
          cover: uploadedVideo.thumbnail,
        });
      }
      if (uploadedVideo.durationInSeconds) {
        attributes.push({
          displayType: PublicationMetadataDisplayTypes.String,
          traitType: "durationInSeconds",
          value: uploadedVideo.durationInSeconds.toString(),
        });
      }

      const metadata: PublicationMetadataV2Input = {
        version: "2.0.0",
        metadata_id: uuidv4(),
        description: trimify(uploadedVideo.description),
        content: trimify(
          `${uploadedVideo.title}\n\n${uploadedVideo.description}`
        ),
        locale: "en-US",
        tags: [],
        mainContentFocus: PublicationMainFocus.Video,
        external_url: `${LENSTOK_URL}/${currentProfile?.handle}`,
        animation_url: uploadedVideo.videoSource,
        image: uploadedVideo.thumbnail,
        imageMimeType: uploadedVideo.thumbnailType,
        name: trimify(uploadedVideo.title),
        attributes,
        media,
        appId: "Lenstok",
      };

      const { url } = await uploadToAr(metadata);
      setUploadedVideo({
        buttonText: "Posting video...",
        loading: true,
      });
      const isRestricted = Boolean(
        uploadedVideo.referenceModule?.degreesOfSeparationReferenceModule
          ?.degreesOfSeparation
      );
      const referenceModuleDegrees = {
        commentsRestricted: isRestricted,
        mirrorsRestricted: isRestricted,
        degreesOfSeparation: uploadedVideo.referenceModule
          ?.degreesOfSeparationReferenceModule?.degreesOfSeparation as number,
      };

      const request = {
        profileId: currentProfile?.id,
        contentURI: url,
        collectModule: {
          revertCollectModule: true,
        },
        referenceModule: {
          followerOnlyReferenceModule: false,
        },
      };

      const canUseDispatcher = currentProfile?.dispatcher?.canUseRelay;
      if (!canUseDispatcher) {
        return signTypedData(request);
      }
      await createViaDispatcher(request);
    } catch (error) {
      console.log("[Error Store & Post Video]", error);
    }
  };

  const uploadToBundlr = async () => {
    if (!bundlrData.instance) {
      return await initBundlr();
    }
    if (!uploadedVideo.stream) {
      return toast.error("Video not uploaded correctly.");
    }
    if (
      parseFloat(bundlrData.balance) < parseFloat(bundlrData.estimatedPrice)
    ) {
      return toast.error("Insufficient balance");
    }
    try {
      setUploadedVideo({
        loading: true,
        buttonText: "Uploading to Arweave...",
      });
      const bundlr = bundlrData.instance;
      const tags = [
        { name: "Content-Type", value: uploadedVideo.videoType || "video/mp4" },
        { name: "App-Name", value: APP_NAME },
      ];
      const uploader = bundlr.uploader.chunkedUploader;
      uploader.setChunkSize(10000000); // 10 MB
      uploader.on("chunkUpload", (chunkInfo) => {
        const fileSize = uploadedVideo?.file?.size as number;
        const percentCompleted = Math.round(
          (chunkInfo.totalUploaded * 100) / fileSize
        );
        setUploadedVideo({
          loading: true,
          percent: percentCompleted,
        });
      });
      const upload = uploader.uploadData(uploadedVideo.stream as any, {
        tags: tags,
      });
      const response = await upload;
      setUploadedVideo({
        loading: false,
      });
      const playbackId = await getPlaybackId(
        `https://arweave.net/${response.data.id}`
      );
      setUploadedVideo({
        videoSource: `https://arweave.net/${response.data.id}`,
        playbackId,
      });
      return createPublication({
        videoSource: `https://arweave.net/${response.data.id}`,
        playbackId,
      });
    } catch (error) {
      toast.error("Failed to upload video!");
      console.log("[Error Bundlr Upload Video]", error);
      setUploadedVideo({
        loading: false,
        buttonText: "Post Video",
      });
    }
  };

  const onUpload = async (data: VideoFormData) => {
    uploadedVideo.title = data.title;
    uploadedVideo.description = data.description;

    uploadedVideo.loading = true;
    setUploadedVideo({ ...uploadedVideo });
    await uploadToBundlr();
  };

  return (
    <div className="max-w-5xl gap-5 mx-auto my-10">
      <div className="mt-10">
        <Details onCancel={resetToDefaults} onUpload={onUpload} />
      </div>
    </div>
  );
};

export default UploadSteps;
