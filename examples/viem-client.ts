import { createPublicClient } from "viem";
import {
  arcPublicClientOptions,
  isEip7825CapRejection,
  parseGasCapError,
} from "../src/index.js";

const client = createPublicClient(arcPublicClientOptions());

const block = await client.getBlock();
console.log("latest block:", block.number.toString());
console.log("gasLimit:", block.gasLimit.toString());

for (const sample of [
  "gas required exceeds allowance (16777216)",
  "out of gas: gas required exceeds: 16777216",
]) {
  console.log("parsed:", sample, "→", parseGasCapError(sample));
  console.log("EIP-7825 cap:", isEip7825CapRejection(sample));
}
