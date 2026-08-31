import { NATIVE_TO_ERC20_SCALE } from "./constants.js";

/**
 * Convert native balance (eth_getBalance, 18 decimals) to ERC-20 USDC units (6 decimals).
 * Truncates toward zero — sub-10^12 native dust is invisible to balanceOf.
 */
export function nativeToErc20Usdc(nativeAmount: bigint): bigint {
  return nativeAmount / NATIVE_TO_ERC20_SCALE;
}

/** Convert ERC-20 USDC amount (6 decimals) to native gas-token units (18 decimals). */
export function erc20UsdcToNative(erc20Amount: bigint): bigint {
  return erc20Amount * NATIVE_TO_ERC20_SCALE;
}

/**
 * Max ERC-20 USDC sendable after reserving `gasBudgetNative` for fees.
 * On Arc, gas and token balance share the same native USDC pool.
 */
export function maxErc20Sendable(
  nativeBalance: bigint,
  gasBudgetNative: bigint,
): bigint {
  if (nativeBalance <= gasBudgetNative) return 0n;
  return nativeToErc20Usdc(nativeBalance - gasBudgetNative);
}
