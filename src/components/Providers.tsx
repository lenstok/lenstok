import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { INFURA_ID, INFURA_RPC, CHAIN_ID, IS_MAINNET } from "src/constants";
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

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider defaultTheme="light" attribute="class">
          {children}
        </ThemeProvider>
      </ApolloProvider>
    </WagmiConfig>
  );
};

export default Providers;
