import {
  EIP7825_TX_GAS_LIMIT,
  NODE_DEFAULT_RPC_GAS_CAP,
} from "./constants.js";

export type GasCapCause =
  | "eip7825_protocol_cap"
  | "node_rpc_gascap"
  | "balance_derived_allowance"
  | "unknown";

const ALLOWANCE_RE =
  /gas required exceeds allowance \((\d+)\)/i;
const EXCEEDS_RE = /gas required exceeds: (\d+)/i;

/**
 * Parse gas-cap / budget errors from JSON-RPC messages.
 * Post-Osaka, 16777216 is the EIP-7825 protocol cap (all endpoints).
 */
export function parseGasCapError(message: string): {
  limit: number;
  cause: GasCapCause;
} | null {
  const allowance = ALLOWANCE_RE.exec(message);
  if (allowance) {
    const limit = Number(allowance[1]);
    return {
      limit,
      cause:
        limit === EIP7825_TX_GAS_LIMIT
          ? "eip7825_protocol_cap"
          : limit === NODE_DEFAULT_RPC_GAS_CAP
            ? "node_rpc_gascap"
            : "balance_derived_allowance",
    };
  }

  const exceeds = EXCEEDS_RE.exec(message);
  if (exceeds) {
    const limit = Number(exceeds[1]);
    return {
      limit,
      cause:
        limit === EIP7825_TX_GAS_LIMIT ? "eip7825_protocol_cap" : "unknown",
    };
  }

  return null;
}

/** True when failure is at or above the EIP-7825 per-transaction cap. */
export function isEip7825CapRejection(message: string): boolean {
  const parsed = parseGasCapError(message);
  return parsed?.cause === "eip7825_protocol_cap";
}
