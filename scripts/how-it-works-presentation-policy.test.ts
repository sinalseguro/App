import assert from "node:assert/strict";

import { howItWorksSteps } from "../src/features/onboarding/howItWorksPresentationPolicy";

assert.equal(howItWorksSteps.length, 6);
assert.deepEqual(
  howItWorksSteps.map((step) => step.id),
  ["acionamento", "localizacao", "cofre-local", "protecao-arquivos", "midia", "privacidade"]
);
assert.deepEqual(
  howItWorksSteps.map((step) => step.iconKey),
  ["radio", "location", "archive", "key", "video", "shield"]
);
assert.equal(new Set(howItWorksSteps.map((step) => step.id)).size, howItWorksSteps.length);

for (const step of howItWorksSteps) {
  assert.equal("icon" in step, false);
  assert.ok(step.title.length >= 5);
  assert.ok(step.text.length >= 30);
  assert.ok(!/frente|release|ec2|manifesto|checksum/i.test(`${step.title} ${step.text}`));
}

assert.ok(howItWorksSteps[0].text.includes("pressao longa"));
assert.ok(howItWorksSteps[1].text.includes("localizacao pontual"));
assert.ok(howItWorksSteps[5].text.includes("protecao"));

console.log("how-it-works presentation policy ok");
