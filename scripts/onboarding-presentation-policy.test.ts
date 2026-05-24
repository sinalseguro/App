import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  onboardingScreenCopy,
  onboardingSteps
} from "../src/features/onboarding/onboardingPresentationPolicy";
import {
  buildConsentCardPresentation,
  consentCardBodyTextFit,
  consentCardStatusLabels
} from "../src/components/consentCardPresentationPolicy";

assert.deepEqual(onboardingScreenCopy, {
  title: "Boas-vindas",
  subtitle: "Antes de usar, revise os limites e consentimentos do SinalSeguro."
});

assert.equal(onboardingSteps.length, 4);
assert.deepEqual(
  onboardingSteps.map((step) => step.id),
  ["limites", "privacidade", "localizacao", "midia"]
);
assert.deepEqual(
  onboardingSteps.map((step) => step.status),
  ["obrigatorio", "obrigatorio", "opcional", "opcional"]
);
assert.equal(new Set(onboardingSteps.map((step) => step.id)).size, onboardingSteps.length);

for (const step of onboardingSteps) {
  assert.ok(step.title.length >= 5);
  assert.ok(step.text.length >= 40);
  assert.ok(!/frente|release|ec2|manifesto|checksum|backend|p2p|webrtc/i.test(`${step.title} ${step.text}`));
}

assert.ok(onboardingSteps[0].text.includes("nao substitui canais oficiais de emergencia"));
assert.ok(onboardingSteps[1].text.includes("consentimento, finalidade e retencao"));
assert.ok(onboardingSteps[2].text.includes("permissao clara"));
assert.ok(onboardingSteps[3].text.includes("autoriza"));

assert.deepEqual(consentCardStatusLabels, {
  obrigatorio: "obrigatorio",
  opcional: "opcional",
  bloqueado: "bloqueado"
});
assert.equal(buildConsentCardPresentation("obrigatorio").statusLabel, "obrigatorio");
assert.equal(buildConsentCardPresentation("opcional").statusLabel, "opcional");
assert.equal(buildConsentCardPresentation("bloqueado").statusLabel, "bloqueado");
assert.deepEqual(buildConsentCardPresentation("opcional").textTextFit, consentCardBodyTextFit);
assert.deepEqual(buildConsentCardPresentation("obrigatorio").statusTextFit, {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
  minimumFontScale: 0.84,
  numberOfLines: 1
});

async function main() {
  const onboardingScreenSource = await readFile("app/onboarding.tsx", "utf8");
  const onboardingPolicySource = await readFile("src/features/onboarding/onboardingPresentationPolicy.ts", "utf8");
  const consentCardPolicySource = await readFile("src/components/consentCardPresentationPolicy.ts", "utf8");
  const consentCardSource = await readFile("src/components/ConsentCard.tsx", "utf8");

  assert.ok(onboardingScreenSource.includes("onboardingScreenCopy"));
  assert.ok(onboardingScreenSource.includes("onboardingSteps.map"));
  assert.ok(!onboardingScreenSource.includes('title="Boas-vindas"'));

  for (const source of [onboardingPolicySource, consentCardPolicySource]) {
    assert.ok(!/from "react|from "react-native|router\.push|apiClient|Share\.share|SecureStore|AsyncStorage/.test(source));
  }

  assert.ok(consentCardSource.includes("buildConsentCardPresentation(status)"));
  assert.ok(consentCardSource.includes("presentation.statusTextFit"));
  assert.ok(consentCardSource.includes("presentation.titleTextFit"));
  assert.ok(consentCardSource.includes("presentation.textTextFit"));

  console.log("onboarding presentation policy ok");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
