import type { Profile } from "@/types/lens";
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
    { name: "lenster.store" }
  )
);
