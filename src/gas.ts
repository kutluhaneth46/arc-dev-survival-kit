import {
  NODE_DEFAULT_RPC_GAS_CAP,
  PUBLIC_RPC_GAS_CAP,
} from "./constants.js";

export type GasAllowanceCause =
  | "public_or_eip7825_cap"
  | "node_rpc_gascap"
  | "balance_derived_allowance"
  | "unknown";

const ALLOWANCE_RE =
  /gas required exceeds allowance \((\d+)\)/i;

/**
 * Parse `gas required exceeds allowance (<limit>)` from JSON-RPC errors.
 * Same string is used for RPC gas cap vs balance exhaustion — compare `<limit>`.
 */
export function parseGasAllowanceError(message: string): {
  limit: number;
  cause: GasAllowanceCause;
} | null {
  const match = ALLOWANCE_RE.exec(message);
  if (!match) return null;

  const limit = Number(match[1]);
  let cause: GasAllowanceCause = "unknown";

  if (limit === PUBLIC_RPC_GAS_CAP) {
    cause = "public_or_eip7825_cap";
  } else if (limit === NODE_DEFAULT_RPC_GAS_CAP) {
    cause = "node_rpc_gascap";
  } else if (limit < NODE_DEFAULT_RPC_GAS_CAP) {
    cause = "balance_derived_allowance";
  }

  return { limit, cause };
}

/** True when eth_estimateGas failure does not prove the tx is impossible on-chain. */
export function isLikelyRpcCapRejection(message: string): boolean {
  const parsed = parseGasAllowanceError(message);
  if (!parsed) return false;
  return (
    parsed.cause === "public_or_eip7825_cap" ||
    parsed.cause === "node_rpc_gascap"
  );
}
