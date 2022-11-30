import { chain } from "wagmi";

export const IS_MAINNET = process.env.NEXT_PUBLIC_NETWORK === "mainnet";

export const APP_ID = "lenstok";
export const APP_NAME = "Lenstok";
export const LENSTOK_URL = IS_MAINNET
  ? "https://lenstok-gamma.vercel.app"
  : "http://localhost:3000";

export const CHAIN_ID = IS_MAINNET ? chain.polygon.id : chain.polygonMumbai.id;
export const API_URL = IS_MAINNET
  ? "https://api.lens.dev"
  : "https://api-mumbai.lens.dev";
export const LENSHUB_PROXY = IS_MAINNET
  ? "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d"
  : "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82";
export const LENS_PERIPHERY = IS_MAINNET
  ? "0xeff187b4190E551FC25a7fA4dFC6cf7fDeF7194f"
  : "0xD5037d72877808cdE7F669563e9389930AF404E8";

export const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID;
export const INFURA_RPC = IS_MAINNET
  ? `https://polygon-mainnet.infura.io/v3/${INFURA_ID}`
  : `https://polygon-mumbai.infura.io/v3/${INFURA_ID}`;

export const ERROR_MESSAGE = "Something went wrong!";

export const WMATIC_TOKEN_ADDRESS = IS_MAINNET
  ? "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"
  : "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889";

export const BUNDLR_NODE_URL = IS_MAINNET
  ? "https://node1.bundlr.network"
  : "https://devnet.bundlr.network";

export const BUNDLR_CURRENCY = "matic";

export const VIDEO_CDN_URL = "https://cdn.livepeer.com";

export const API_ORIGINS = "";
