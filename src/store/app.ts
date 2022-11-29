import { LS_KEYS } from "@/constants";
import { Profile, ReferenceModules } from "@/types/lens";
import create from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  profiles: Profile[] | [];
  setProfiles: (profiles: Profile[]) => void;
  currentProfile: Profile | null;
  setCurrentProfile: (currentProfile: Profile | null) => void;
  userSigNonce: number;
  setUserSigNonce: (userSigNonce: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
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
  setSelectedReferenceModule: (selectedReferenceModule) => set(() => ({ selectedReferenceModule })),
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