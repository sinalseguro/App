import assert from "node:assert/strict";

import {
  buildDeviceKeyProof,
  createDevicePublicKey,
  DEVICE_KEY_ALGORITHM,
  publicKeySha256Hex,
  verifyDeviceKeyProof
} from "../src/services/deviceKeyProof";

const privateSeedHex = "1111111111111111111111111111111111111111111111111111111111111111";
const publicKey = createDevicePublicKey(privateSeedHex);
const input = {
  appVersion: "0.1.0",
  deviceLabel: "SinalSeguro Android",
  platform: "android" as const,
  privateSeedHex,
  publicKey,
  purpose: "device.register" as const
};

const proof = buildDeviceKeyProof(input, new Uint8Array(16).fill(7));

assert.equal(proof.algorithm, DEVICE_KEY_ALGORITHM);
assert.equal(publicKeySha256Hex(publicKey).length, 64);
assert.equal(verifyDeviceKeyProof(input, proof), true);
assert.equal(
  verifyDeviceKeyProof(
    {
      ...input,
      publicKey: publicKey.replace("ed25519", "ed25518")
    },
    proof
  ),
  false
);

console.log("Device key proof test aprovado.");
