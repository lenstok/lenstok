import type { FC, ReactNode } from "react";
import { useAppPersistStore, useAppStore } from "src/store/app";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  const setProfiles = useAppStore((state) => state.setProfiles);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const profileId = useAppPersistStore((state) => state.profileId);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);

  return (
    <>
      <div className="flex flex-col min-h-screen">{children}</div>
    </>
  );
};

export default Layout;
