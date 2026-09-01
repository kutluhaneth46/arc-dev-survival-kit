# Arc Developer Survival Kit

Practical helpers and reference notes for building on **Arc Testnet** without stepping on the same landmines twice.

This repo complements upstream docs and open PRs — it is meant to be **copied, imported, or forked** into your app.

## Quick start

```bash
git clone https://github.com/kutluhaneth46/arc-dev-survival-kit.git
cd arc-dev-survival-kit
npm install
npm run typecheck
npm run example
```

```ts
import { createPublicClient } from "viem";
import { arcPublicClientOptions, waitForReceiptWithRetry } from "./src/index.js";

const client = createPublicClient(arcPublicClientOptions());

const hash = await client.sendTransaction({ /* ... */ });
await waitForReceiptWithRetry(client, hash);
```

## What’s inside

| Module | Problem it solves |
|--------|-------------------|
| `constants.ts` | Chain id, USDC address, RPC URL list, gas cap numbers |
| `rpc.ts` | `arcTestnet` chain + `fallback()` transport across public endpoints |
| `usdc.ts` | Native 18-decimal gas token vs ERC-20 6-decimal USDC (`10^12` scale) |
| `gas.ts` | Parse gas-cap errors (`-32003` / `-32000`) — EIP-7825 vs balance allowance |
| `receipt.ts` | Retry `waitForTransactionReceipt` on `-32011` rate limits |

## Arc Testnet cheat sheet

| Topic | Value |
|-------|-------|
| Chain ID | `5042002` |
| USDC (ERC-20, 6 dec) | `0x3600000000000000000000000000000000000000` |
| Native gas token | USDC at **18 decimals** (`eth_getBalance`, receipts) |
| Block gas limit | 30,000,000 (shared across txs per block) |
| EIP-7825 per-tx gas cap | 16,777,216 (2²⁴) — all endpoints post-Osaka |
| Node `--rpc.gascap` default | 30,000,000 (effective cap is `min(gascap, 2²⁴)`) |
| Concurrency limit JSON-RPC code | `-32011` (`request limit reached`; `x-ratelimit-limit: 1;w=1`) |
| CCTP domain (testnet) | `26` |

### USDC decimals (silent bug)

| Source | Decimals | Example for 1 USDC |
|--------|----------|-------------------|
| `eth_getBalance` / gas fees | 18 | `1000000000000000000` |
| `balanceOf` on USDC contract | 6 | `1000000` |

```ts
import { nativeToErc20Usdc, maxErc20Sendable } from "./src/usdc.js";

// Display token balance from ERC-20, not native
// Gas affordability: compare in 18-decimal native units
const sendable = maxErc20Sendable(nativeBalance, estimatedGasCostNative);
```

**Max-send trap:** transferring full `balanceOf` leaves only `native mod 10^12` for gas — always too little. Reserve gas in native units first.

### Gas estimation failures at the EIP-7825 cap

Post-Osaka, **no single transaction can exceed 16,777,216 gas** — this is protocol-level
(EIP-7825), not a public-endpoint policy. The 30M block limit is for multiple
transactions per block.

Common error shapes:

```json
{"code":-32003,"message":"out of gas: gas required exceeds: 16777216"}
{"code":-32000,"message":"gas required exceeds allowance (16777216)"}
```

If the parsed limit is 2²⁴, lowering gas in the contract or splitting work across
transactions is required — switching RPC providers will not help.

### Concurrency limits (not requests/sec)

Public endpoints allow **one in-flight request per connection** (`x-ratelimit-limit: 1;w=1`).
Serialize calls per URL; avoid `Promise.all` fan-out on a single endpoint.

`viem` `fallback()` advances past `-32011` on most read/estimate paths. **`waitForTransactionReceipt` still aborts on the first `-32011`** unless wrapped — use `waitForReceiptWithRetry` from this kit.

## Related upstream work

| PR | Topic |
|----|-------|
| [arc-node#299](https://github.com/circlefin/arc-node/pull/299) | Public testnet RPC guide (gas caps, fallbacks) |
| [arc-node#297](https://github.com/circlefin/arc-node/pull/297) | JSON-RPC breaking changes for app developers |
| [arc-node#295](https://github.com/circlefin/arc-node/pull/295) | Separated-host RPC deprecation docs |
| [arc-commerce#58](https://github.com/circlefin/arc-commerce/pull/58) | Reproducible dependency pins |

Official docs: [docs.arc.io](https://docs.arc.io/)

Community reference (same EIP-7825 corrections): [arc-node #305](https://github.com/circlefin/arc-node/issues/305) · linked from [PR #299](https://github.com/circlefin/arc-node/pull/299#issuecomment-5486019162).

## License

MIT
