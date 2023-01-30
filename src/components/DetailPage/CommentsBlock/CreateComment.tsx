import {
  AccessConditionOutput,
  CreatePublicCommentRequest,
  Publication,
  PublicationMainFocus,
  PublicationMetadataV2Input,
} from "@/types/lens";
import React, { Dispatch, FC, useRef, useState, Fragment } from "react";
import { LENS_HUB_ABI } from "@/abi/abi";
import { useAppStore, useTransactionPersistStore } from "src/store/app";
import { useContractWrite, useProvider, useSignTypedData, useSigner } from "wagmi";
import onError from "@/lib/onError";
import toast from "react-hot-toast";
import { Switch } from "@headlessui/react";
import { APP_NAME, LENSHUB_PROXY, LIT_PROTOCOL_ENV, RELAY_ON } from "@/constants";
import getSignature from "@/lib/getSignature";
import { splitSignature } from "ethers/lib/utils";
import { uploadIpfs } from "@/utils/ipfs";
import { v4 as uuid } from "uuid";
import useBroadcast from "@/utils/useBroadcast";
import {
  useCreateCommentTypedDataMutation,
  useCreateCommentViaDispatcherMutation,
} from "@/types/graph";
import lit from "@/lib/lit";
import LitJsSdk from "@lit-protocol/sdk-browser";
import AccessSettings from "./AccessSettings";
import { useAccessSettingsStore } from "@/store/access";
import { CollectCondition, EncryptedMetadata, FollowCondition, LensGatedSDK } from "@lens-protocol/sdk-gated";

interface Props {
  publication: Publication;
  refetchComments: () => void;
}

const CreateComment: FC<Props> = ({ publication, refetchComments }) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const provider = useProvider();
  const { data: signer } = useSigner();

  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const setTxnQueue = useTransactionPersistStore((state) => state.setTxnQueue);
  const restricted = useAccessSettingsStore((state) => state.restricted);
  const followToView = useAccessSettingsStore((state) => state.followToView);
  const collectToView = useAccessSettingsStore((state) => state.collectToView);
  const resetAccessSettings = useAccessSettingsStore((state) => state.reset);

  const { signTypedDataAsync } = useSignTypedData({ onError });

  const onCompleted = () => {
    toast.success("Post has been commented!");
    setComment("");
    resetAccessSettings();
  };

  console.log("PUBLICATION ADDRESS", publication?.profile?.ownedBy);
  console.log("CURRENT PROFILE ADDRESS", currentProfile?.ownedBy);

  const generateOpitimisticComment = ({
    txHash,
    txId,
  }: {
    txHash?: string;
    txId?: string;
  }) => {
    return {
      id: uuid(),
      parent: publication.id,
      type: "NEW_COMMENT",
      content: comment,
      txHash,
      txId,
    };
  };

  const { error, write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LENS_HUB_ABI,
    functionName: "commentWithSig",
    mode: "recklesslyUnprepared",
    onSuccess: ({ hash }) => {
      onCompleted();
      setTxnQueue([generateOpitimisticComment({ txHash: hash }), ...txnQueue]);
    },
    onError,
  });

  const { broadcast } = useBroadcast({
    onCompleted: (data) => {
      onCompleted();
      setTxnQueue([
        generateOpitimisticComment({ txId: data?.broadcast?.txId }),
        ...txnQueue,
      ]);
    },
  });

  const [createCommentTypedData] = useCreateCommentTypedDataMutation({
    onCompleted: async ({ createCommentTypedData }) => {
      try {
        const { id, typedData } = createCommentTypedData;
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
          deadline,
        } = typedData.value;
        const signature = await signTypedDataAsync(getSignature(typedData));
        const { v, r, s } = splitSignature(signature);
        const sig = { v, r, s, deadline };
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
          sig,
        };

        setUserSigNonce(userSigNonce + 1);
        if (!RELAY_ON) {
          return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
        }

        const {
          data: { broadcast: result },
        } = await broadcast({ request: { id, signature } });

        if ("reason" in result) {
          write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
        }
      } catch {}
    },
    onError,
  });

  const [createCommentViaDispatcher] = useCreateCommentViaDispatcherMutation({
    onCompleted,
    onError,
  });

  const createViaDispatcher = async (request: any) => {
    const { data } = await createCommentViaDispatcher({
      variables: { request },
    });
    if (data?.createCommentViaDispatcher.__typename === "RelayError") {
      createCommentTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request,
        },
      });
    }
  };

  const createTokenGatedMetadata = async (metadata: PublicationMetadataV2Input) => {
    if (!currentProfile) {
      return toast.error("Please connect your Wallet!");
    }

    if (!signer) {
      return toast.error("Please connect your Wallet!");
    }

    // Create the SDK instance
    const tokenGatedSdk = await LensGatedSDK.create({
      provider,
      signer,
      env: LIT_PROTOCOL_ENV as any
    });

    // Connect to the SDK
    await tokenGatedSdk.connect({
      address: currentProfile.ownedBy,
      env: LIT_PROTOCOL_ENV as any
    });

    // Condition for gating the content
    const collectAccessCondition: CollectCondition = { thisPublication: true };
    const followAccessCondition: FollowCondition = { profileId: currentProfile.id };

    // Create the access condition
    let accessCondition: AccessConditionOutput = {};
    if (collectToView && followToView) {
      accessCondition = {
        and: { criteria: [{ collect: collectAccessCondition }, { follow: followAccessCondition }] }
      };
    } else if (collectToView) {
      accessCondition = { collect: collectAccessCondition };
    } else if (followToView) {
      accessCondition = { follow: followAccessCondition };
    }

    // Generate the encrypted metadata and upload it to Arweave
    const { contentURI } = await tokenGatedSdk.gated.encryptMetadata(
      metadata,
      currentProfile.id,
      accessCondition,
      async (data: EncryptedMetadata) => {
        return await uploadIpfs(data);
      }
    );

    return contentURI;
  };

  const createMetadata = async (metadata: PublicationMetadataV2Input) => {
    return await uploadIpfs(metadata);
  };

  async function createComment() {
    if (!currentProfile) {
      return toast.error("Please connect your Wallet!");
    }
    try {
      setIsSubmitting(true);

      const metadata: PublicationMetadataV2Input = {
        version: "2.0.0",
        mainContentFocus: PublicationMainFocus.TextOnly,
        metadata_id: uuid(),
        locale: "en-US",
        content: comment,
        external_url: null,
        image: null,
        imageMimeType: null,
        name: `Comment by :${currentProfile.handle}`,
        attributes: [],
        tags: [],
        appId: APP_NAME,
      }

      let ipfsResult = null
      if (restricted) {
        ipfsResult = await createTokenGatedMetadata(metadata);
      } else {
        ipfsResult = await createMetadata(metadata);
      }

      const request = {
        profileId: currentProfile?.id,
        publicationId: publication.id,
        contentURI: `ipfs://${ipfsResult.path}`,
        collectModule: {
          revertCollectModule: true,
        },
        referenceModule: {
          followerOnlyReferenceModule: false,
        },
      };
      if (currentProfile?.dispatcher?.canUseRelay) {
        await createViaDispatcher(request);
      } else {
        await createCommentTypedData({
          variables: {
            options: { overrideSigNonce: userSigNonce },
            request: request as CreatePublicCommentRequest,
          },
        });
      }
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex-shrink-0 flex p-5 gap-3 border-t">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="bg-[#F1F1F2] rounded-md p-2 flex-grow text-sm outline-none placeholder:text-gray-500 border border-transparent focus:border-gray-300 transition"
        placeholder="Add comment.."
      />
      <div className="flex flex-col">
        <button
          className="text-md text-gray-400 border-gray-100"
          onClick={createComment}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Commenting..." : <div className="cursor-pointer border-1 hover:text-[#96de26]">Comment</div>}
        </button>
        <AccessSettings />
      </div>
    </div>
  );
};

export default CreateComment;
