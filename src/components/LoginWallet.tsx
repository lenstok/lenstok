import { FC, useState, ReactNode, useCallback, useEffect } from "react";
import { gql } from "@apollo/client/core";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  AuthenticateDocument,
  GetChallengeDocument,
  GetUserProfilesDocument,
} from "@/types/lens";
import { CHAIN_ID } from "src/constants";
import { useAppPersistStore, useAppStore } from "src/store/app";
import {
  useAccount,
  useNetwork,
  useConnect,
  useSignMessage,
  useSwitchNetwork,
} from "wagmi";
import type { Connector } from "wagmi";
import toast from "react-hot-toast";

const LoginWallet: FC = () => {
  const setProfiles = useAppStore((state) => state.setProfiles);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const [hasConnected, setHasConnected] = useState(false);
  const { address, connector: activeConnector } = useAccount();
  const { connectors, error, connectAsync } = useConnect();
  const { signMessageAsync, isLoading: signLoading } = useSignMessage();
  const [loadChallenge, { error: errorChallenge, loading: challengeLoading }] =
    useLazyQuery(GetChallengeDocument, {
      fetchPolicy: "no-cache",
    });
  const [authenticate, { error: errorAuthenticate, loading: authLoading }] =
    useMutation(AuthenticateDocument);
  const [getUserProfiles, { error: errorProfiles, loading: profilesLoading }] =
    useLazyQuery(GetUserProfilesDocument);

  const onConnect = async (connector: Connector) => {
    try {
      const account = await connectAsync({ connector });
      if (account) {
        setHasConnected(true);
        console.log("Account", account);
      }
    } catch {}
  };

  const handleLogin = async () => {
    try {
      // Get challenge
      const challenge = await loadChallenge({
        variables: {
          request: { address },
        },
      });

      if (!challenge?.data?.challenge?.text) {
        return toast.error("ERROR_MESSAGE");
      }

      // Get signature
      const signature = await signMessageAsync({
        message: challenge?.data?.challenge?.text,
      });

      // Auth user and set cookies
      const auth = await authenticate({
        variables: { request: { address, signature } },
      });
      localStorage.setItem("accessToken", auth.data?.authenticate.accessToken);
      localStorage.setItem(
        "refreshToken",
        auth.data?.authenticate.refreshToken
      );

      // Get authed profiles
      const { data: profilesData } = await getUserProfiles({
        variables: { address },
      });

      if (profilesData?.profiles?.items?.length === 0) {
        return toast.error("You have no lens profile yet, please create one");
      } else {
        const profiles: any = profilesData?.profiles?.items;
        const currentProfile = profiles[0];
        setProfiles(profiles);
        setCurrentProfile(currentProfile);
        setProfileId(currentProfile.id);
      }
    } catch {}
  };

  return activeConnector?.id ? (
    <div>
      {chain?.id === CHAIN_ID ? (
        <button onClick={() => handleLogin()}>Login In</button>
      ) : (
        <button
          onClick={() => {
            if (switchNetwork) {
              switchNetwork(CHAIN_ID);
            } else {
              toast.error("Please change your network wallet!");
            }
          }}
        >
          Switch Network
        </button>
      )}
    </div>
  ) : (
    <button onClick={() => onConnect(connectors[0])}>Connect</button>
  );
};

export default LoginWallet;
