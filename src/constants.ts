/** Arc Testnet chain id. */
export const ARC_TESTNET_CHAIN_ID = 5042002;

/** Canonical TIP-20 / ERC-20 USDC on Arc Testnet (6 decimals for balanceOf/transfer). */
export const ARC_TESTNET_USDC_ADDRESS =
  "0x3600000000000000000000000000000000000000" as const;

/** Native gas token uses 18 decimals; ERC-20 USDC uses 6. */
export const NATIVE_TO_ERC20_SCALE = 10n ** 12n;

/** Self-hosted arc-node-execution default --rpc.gascap. */
export const NODE_DEFAULT_RPC_GAS_CAP = 30_000_000;

/** Observed public RPC eth_estimateGas clamp (also EIP-7825 per-tx cap). */
export const PUBLIC_RPC_GAS_CAP = 16_777_216;

/** Arc Testnet block gas limit (observed via eth_getBlockByNumber). */
export const BLOCK_GAS_LIMIT = 30_000_000;

/** CCTP domain for Arc Testnet (circlefin/arc-node#110). */
export const CCTP_DOMAIN_ARC_TESTNET = 26;

/** JSON-RPC rate limit error code on public endpoints. */
export const RPC_RATE_LIMIT_CODE = -32011;

/**
 * Public Arc Testnet HTTPS endpoints. Spread load across providers.
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
] as const;
