import { createPublicClient } from "viem";
import {
  arcPublicClientOptions,
  isLikelyRpcCapRejection,
  parseGasAllowanceError,
} from "../src/index.js";

const client = createPublicClient(arcPublicClientOptions());

const block = await client.getBlock();
console.log("latest block:", block.number.toString());
console.log("gasLimit:", block.gasLimit.toString());

const sample = "gas required exceeds allowance (16777216)";
console.log("parsed:", parseGasAllowanceError(sample));
console.log("likely cap rejection:", isLikelyRpcCapRejection(sample));
