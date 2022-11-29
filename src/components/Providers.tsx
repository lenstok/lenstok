import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { INFURA_ID, INFURA_RPC, CHAIN_ID, IS_MAINNET } from "src/constants";
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { apolloClient } from "@/apollo-client";
const { chains, provider } = configureChains(
  [IS_MAINNET ? chain.polygon : chain.polygonMumbai],
  [infuraProvider({ apiKey: INFURA_ID }), publicProvider()]
);

const connectors = () => {
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true },
    }),
    new WalletConnectConnector({
      chains,
      options: { rpc: { [CHAIN_ID]: INFURA_RPC } },
    }),
  ];
};

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const livepeerClient = createReactClient({
  provider: studioProvider({ apiKey: process.env.NEXT_PUBLIC_LIVEPEER_KEY }),
});

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <ApolloProvider client={apolloClient}>
        <LivepeerConfig client={livepeerClient}>
          <ThemeProvider defaultTheme="light" attribute="class">
            {children}
          </ThemeProvider>
        </LivepeerConfig>
      </ApolloProvider>
    </WagmiConfig>
  );
};

export default Providers;
