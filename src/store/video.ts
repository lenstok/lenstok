import { WMATIC_TOKEN_ADDRESS } from "@/constants";
import { UploadedVideo } from "@/types/local";
import type { FetchSignerResult } from "@wagmi/core";
import type { BundlrDataState } from "src/types/local";
import { WebBundlr } from "@bundlr-network/client";
import { INFURA_RPC, BUNDLR_NODE_URL, BUNDLR_CURRENCY } from "@/constants";

import create from "zustand";

export const UPLOADED_VIDEO_FORM_DEFAULTS = {
  stream: null,
  preview: "",
  videoType: "",
  file: null,
  title: "",
  description: "",
  thumbnail: "",
  thumbnailType: "",
  videoSource: "",
  percent: 0,
  playbackId: "",
  isUploadToIpfs: false,
  loading: false,
  uploadingThumbnail: false,
  buttonText: "Post Video",
  durationInSeconds: null,
  collectModule: {
    type: "freeCollectModule",
    followerOnlyCollect: false,
    amount: { currency: WMATIC_TOKEN_ADDRESS, value: "" },
    referralFee: 0,
    isTimedFeeCollect: false,
    isFreeCollect: true,
    isFeeCollect: false,
    isRevertCollect: false,
  },
  referenceModule: {
    followerOnlyReferenceModule: false,
    degreesOfSeparationReferenceModule: null,
  },
};

export const UPLOADED_VIDEO_BUNDLR_DEFAULTS = {
  balance: "0",
  estimatedPrice: "0",
  deposit: null,
  instance: null,
  depositing: false,
  showDeposit: false,
};

interface VideoState {
  bundlrData: BundlrDataState;
  setBundlrData: (bundlrData: { [k: string]: any }) => void;
  uploadedVideo: UploadedVideo;
  setUploadedVideo: (video: { [k: string]: any }) => void;
  getBundlrInstance: (signer: FetchSignerResult) => Promise<WebBundlr | null>;
}

export const useVideoStore = create<VideoState>((set) => ({
  bundlrData: UPLOADED_VIDEO_BUNDLR_DEFAULTS,
  setBundlrData: (bundlrData) =>
    set((state) => ({ bundlrData: { ...state.bundlrData, ...bundlrData } })),
  uploadedVideo: UPLOADED_VIDEO_FORM_DEFAULTS,
  setUploadedVideo: (videoData) =>
    set((state) => ({
      uploadedVideo: { ...state.uploadedVideo, ...videoData },
    })),
  getBundlrInstance: async (signer: any) => {
    try {
      const bundlr = new WebBundlr(
        BUNDLR_NODE_URL,
        BUNDLR_CURRENCY,
        signer?.provider,
        {
          providerUrl: INFURA_RPC,
        }
      );
      await bundlr.utils.getBundlerAddress(BUNDLR_CURRENCY);
      await bundlr.ready();
      return bundlr;
    } catch (error) {
      console.log("[Error Init Bundlr]", error);
      set((state) => ({
        uploadedVideo: { ...state.uploadedVideo, loading: false },
      }));
      return null;
    }
  },
}));
