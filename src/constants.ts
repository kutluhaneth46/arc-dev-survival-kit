/** Arc Testnet chain id. */
export const ARC_TESTNET_CHAIN_ID = 5042002;

/** Canonical TIP-20 / ERC-20 USDC on Arc Testnet (6 decimals for balanceOf/transfer). */
export const ARC_TESTNET_USDC_ADDRESS =
  "0x3600000000000000000000000000000000000000" as const;

/** Native gas token uses 18 decimals; ERC-20 USDC uses 6. */
export const NATIVE_TO_ERC20_SCALE = 10n ** 12n;

/** Self-hosted arc-node-execution default --rpc.gascap. */
export const NODE_DEFAULT_RPC_GAS_CAP = 30_000_000;

/** EIP-7825 (Osaka) per-transaction gas limit — protocol cap on all endpoints. */
export const EIP7825_TX_GAS_LIMIT = 16_777_216;

/** Alias for EIP-7825 per-transaction gas limit. */
export const PUBLIC_RPC_GAS_CAP = EIP7825_TX_GAS_LIMIT;

/** Arc Testnet block gas limit (observed via eth_getBlockByNumber). */
export const BLOCK_GAS_LIMIT = 30_000_000;

/** CCTP domain for Arc Testnet (circlefin/arc-node#110). */
export const CCTP_DOMAIN_ARC_TESTNET = 26;

/** JSON-RPC rate limit error code on public endpoints. */
export const RPC_RATE_LIMIT_CODE = -32011;

/**
 * One URL per distinct provider budget for fallback().
 * Do not rotate .network → .io on the same provider — those pairs often share
 * one rate-limit bucket (QuickNode confirmed on arc-node#305).
 */
export const ARC_TESTNET_RPC_PROVIDER_URLS = [
  "https://rpc.testnet.arc.network",
  "https://rpc.drpc.testnet.arc.network",
  "https://rpc.blockdaemon.testnet.arc.network",
  "https://rpc.quicknode.testnet.arc.network",
  "https://arc-testnet.drpc.org",
] as const;

/**
 * All public hostnames (9). For reference / manual spreading only — prefer
 * ARC_TESTNET_RPC_PROVIDER_URLS in fallback transport.
 * @see https://github.com/circlefin/arc-node/pull/299
 */
export const ARC_TESTNET_RPC_URLS = [
  "https://rpc.testnet.arc.network",
  "https://rpc.testnet.arc.io",
  "https://rpc.drpc.testnet.arc.network",
  "https://rpc.drpc.testnet.arc.io",
  "https://rpc.blockdaemon.testnet.arc.network",
  "https://rpc.blockdaemon.testnet.arc.io",
  "https://rpc.quicknode.testnet.arc.network",
  "https://rpc.quicknode.testnet.arc.io",
  "https://arc-testnet.drpc.org",
] as const;
