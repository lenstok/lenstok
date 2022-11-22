import type {
  Attribute,
  Comment,
  FeeCollectModuleSettings,
  FreeCollectModuleSettings,
  LimitedFeeCollectModuleSettings,
  LimitedTimedFeeCollectModuleSettings,
  Mirror,
  Post,
  RevertCollectModuleSettings,
  TimedFeeCollectModuleSettings,
} from "./lens";

export type CollectModuleType = {
  isTimedFeeCollect?: boolean;
  isFreeCollect?: boolean;
  isFeeCollect?: boolean;
  isRevertCollect?: boolean;
  isLimitedFeeCollect?: boolean;
  isLimitedTimeFeeCollect?: boolean;
  amount?: { currency?: string; value: string };
  referralFee?: number;
  collectLimit?: string;
  followerOnlyCollect?: boolean;
  recipient?: string;
};

export type ReferenceModuleType = {
  followerOnlyReferenceModule: boolean;
  degreesOfSeparationReferenceModule?: {
    commentsRestricted: boolean;
    mirrorsRestricted: boolean;
    degreesOfSeparation: number;
  } | null;
};

export type FileReaderStreamType = NodeJS.ReadableStream & {
  name: string;
  size: number;
  type: string;
  lastModified: string;
};

export type UploadedVideo = {
  stream: FileReaderStreamType | null;
  preview: string;
  videoType: string;
  file: File | null;
  title: string;
  description: string;
  thumbnail: string;
  thumbnailType: string;
  playbackId: string;
  /* videoCategory: { tag: string; name: string }; */
  percent: number;
  isSensitiveContent: boolean;
  isUploadToIpfs: boolean;
  loading: boolean;
  uploadingThumbnail: boolean;
  videoSource: string;
  buttonText: string;
  durationInSeconds: string | null;
  collectModule: CollectModuleType;
  referenceModule: ReferenceModuleType;
};
