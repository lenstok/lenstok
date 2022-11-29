import { LS_KEYS } from "@/constants";
import { Profile, ReferenceModules } from "@/types/lens";
import { UploadedVideo } from "@/types/app";
import create from "zustand";
import { persist } from "zustand/middleware";
import { WMATIC_TOKEN_ADDRESS } from "@/constants";

export const UPLOADED_VIDEO_FORM_DEFAULTS = {
  stream: null,
  preview: "",
  videoType: "",
  file: null,
  title: "",
  description: "",
  category: "",
  thumbnail: "",
  thumbnailType: "",
  videoSource: "",
  percent: 0,
  playbackId: "",
  isSensitiveContent: false,
  isUploadToIpfs: false,
  loading: false,
  uploadingThumbnail: false,
  buttonText: "Post Video",
  durationInSeconds: null,
  /* videoCategory: CREATOR_VIDEO_CATEGORIES[0], */
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

interface AppState {
  uploadedVideo: UploadedVideo;
  setUploadedVideo: (video: { [k: string]: any }) => void;
  profiles: Profile[] | [];
  setProfiles: (profiles: Profile[]) => void;
  currentProfile: Profile | null;
  setCurrentProfile: (currentProfile: Profile | null) => void;
  userSigNonce: number;
  setUserSigNonce: (userSigNonce: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  uploadedVideo: UPLOADED_VIDEO_FORM_DEFAULTS,
  setUploadedVideo: (videoData) =>
    set((state) => ({
      uploadedVideo: { ...state.uploadedVideo, ...videoData },
    })),
  profiles: [],
  setProfiles: (profiles) => set(() => ({ profiles })),
  currentProfile: null,
  setCurrentProfile: (currentProfile) => set(() => ({ currentProfile })),
  userSigNonce: 0,
  setUserSigNonce: (userSigNonce) => set(() => ({ userSigNonce })),
}));

interface AppPersistState {
  profileId: string | null;
  setProfileId: (profileId: string | null) => void;
}

export const useAppPersistStore = create(
  persist<AppPersistState>(
    (set) => ({
      profileId: null,
      setProfileId: (profileId) => set(() => ({ profileId })),
    }),
    { name: "lenstok.store" }
  )
);

interface ReferenceModuleState {
  selectedReferenceModule: ReferenceModules;
  setSelectedReferenceModule: (selectedModule: ReferenceModules) => void;
  onlyFollowers: boolean;
  setOnlyFollowers: (onlyFollowers: boolean) => void;
  degreesOfSeparation: number;
  setDegreesOfSeparation: (degreesOfSeparation: number) => void;
}

export const useReferenceModuleStore = create<ReferenceModuleState>((set) => ({
  selectedReferenceModule: ReferenceModules.DegreesOfSeparationReferenceModule,
  setSelectedReferenceModule: (selectedReferenceModule) =>
    set(() => ({ selectedReferenceModule })),
  onlyFollowers: false,
  setOnlyFollowers: (onlyFollowers) => set(() => ({ onlyFollowers })),
  degreesOfSeparation: 2,
  setDegreesOfSeparation: (degreesOfSeparation) => set(() => ({ degreesOfSeparation }))
}));

interface TransactionPersistState {
  txnQueue: any[];
  setTxnQueue: (txnQueue: any[]) => void;
}

export const useTransactionPersistStore = create(
  persist<TransactionPersistState>(
    (set) => ({
      txnQueue: [],
      setTxnQueue: (txnQueue) => set(() => ({ txnQueue }))
    }),
    { name: LS_KEYS.TRANSACTION_STORE }
  )
);
