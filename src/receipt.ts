import { RPC_RATE_LIMIT_CODE } from "./constants.js";

type ReceiptClient = {
  waitForTransactionReceipt: (args: {
    hash: `0x${string}`;
    pollingInterval?: number;
  }) => Promise<unknown>;
};

function isRateLimitError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as { code?: number; shortMessage?: string; message?: string };
  if (e.code === RPC_RATE_LIMIT_CODE) return true;
  const text = `${e.shortMessage ?? ""} ${e.message ?? ""}`.toLowerCase();
  return text.includes("rate limit") || text.includes("request limit reached");
}

/**
 * Wrap viem waitForTransactionReceipt — retries on -32011 rate limits.
 * A rate-limited poll does not mean the transaction failed on-chain.
 */
export async function waitForReceiptWithRetry(
  client: ReceiptClient,
  hash: `0x${string}`,
  options: { maxAttempts?: number; pollingInterval?: number } = {},
): Promise<unknown> {
  const maxAttempts = options.maxAttempts ?? 8;
  let lastError: unknown;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await client.waitForTransactionReceipt({
        hash,
        pollingInterval: options.pollingInterval,
      });
    } catch (error) {
      lastError = error;
      if (!isRateLimitError(error) || attempt === maxAttempts - 1) {
        throw error;
      }
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }

  throw lastError;
}
