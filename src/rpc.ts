import type { Chain, HttpTransport, Transport } from "viem";
import { fallback, http } from "viem";
import {
  ARC_TESTNET_CHAIN_ID,
  ARC_TESTNET_RPC_URLS,
  ARC_TESTNET_USDC_ADDRESS,
} from "./constants.js";

/** viem chain definition for Arc Testnet. */
export const arcTestnet = {
  id: ARC_TESTNET_CHAIN_ID,
  name: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  rpcUrls: {
    default: { http: [...ARC_TESTNET_RPC_URLS] },
  },
  blockExplorers: {
    default: { name: "ArcScan", url: "https://testnet.arcscan.app" },
  },
} as const satisfies Chain;

/** Fallback transport across public Arc Testnet RPC providers. */
export function arcTestnetTransport(
  urls: readonly string[] = ARC_TESTNET_RPC_URLS,
): Transport {
  return fallback(urls.map((url) => http(url)));
}

export type ArcClientOptions = {
  rpcUrls?: readonly string[];
  transport?: Transport;
};

/** Shorthand for `createPublicClient({ chain: arcTestnet, transport })`. */
export function arcPublicClientOptions(
  options: ArcClientOptions = {},
): { chain: typeof arcTestnet; transport: Transport } {
  return {
    chain: arcTestnet,
    transport: options.transport ?? arcTestnetTransport(options.rpcUrls),
  };
}

export { ARC_TESTNET_USDC_ADDRESS };
