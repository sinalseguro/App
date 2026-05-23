import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  emergencyCallButtonDialogPresentation,
  resolveEmergencyCallButtonPresentation
} from "../src/components/emergencyCallButtonPresentationPolicy";
import {
  resolveSafeScreenPresentation,
  safeScreenFooterTextFit,
  safeScreenSubtitleTextFit,
  safeScreenTitleTextFit
} from "../src/components/safeScreenPresentationPolicy";

assert.deepEqual(resolveSafeScreenPresentation({}), {
  footerTextFit: safeScreenFooterTextFit,
  shouldRenderBrand: false,
  shouldRenderFooter: false,
  shouldRenderSubtitle: false,
  showBack: true,
  subtitleTextFit: safeScreenSubtitleTextFit,
  titleTextFit: safeScreenTitleTextFit
});
assert.deepEqual(resolveSafeScreenPresentation({ footer: "Rodape", showBack: false, showBrand: true, subtitle: "Sub" }), {
  footerTextFit: safeScreenFooterTextFit,
  shouldRenderBrand: true,
  shouldRenderFooter: true,
  shouldRenderSubtitle: true,
  showBack: false,
  subtitleTextFit: safeScreenSubtitleTextFit,
  titleTextFit: safeScreenTitleTextFit
});
assert.deepEqual(safeScreenTitleTextFit, { maxFontSizeMultiplier: 1.2 });
assert.deepEqual(safeScreenSubtitleTextFit, { maxFontSizeMultiplier: 1.2 });
assert.deepEqual(safeScreenFooterTextFit, { maxFontSizeMultiplier: 1.2 });

assert.deepEqual(emergencyCallButtonDialogPresentation, {
  buttonLabel: "Ligar 190",
  cancelLabel: "Cancelar",
  confirmLabel: "Ligar",
  dialogIconSize: 18,
  dialogMessage:
    "O 190 e o canal oficial em risco imediato. O SinalSeguro nao substitui o atendimento publico de emergencia.",
  dialogTitle: "Ligar para 190?"
});
assert.equal(resolveEmergencyCallButtonPresentation(false).buttonIconSize, 20);
assert.equal(resolveEmergencyCallButtonPresentation(true).buttonIconSize, 18);

async function main() {
  const safeScreenSource = await readFile("src/components/SafeScreen.tsx", "utf8");
  const safeScreenPolicySource = await readFile("src/components/safeScreenPresentationPolicy.ts", "utf8");
  const emergencyCallButtonSource = await readFile("src/components/EmergencyCallButton.tsx", "utf8");
  const emergencyCallButtonPolicySource = await readFile(
    "src/components/emergencyCallButtonPresentationPolicy.ts",
    "utf8"
  );

  assert.ok(safeScreenSource.includes("resolveSafeScreenPresentation({ footer, showBack, showBrand, subtitle })"));
  assert.ok(safeScreenSource.includes("presentation.shouldRenderBrand"));
  assert.ok(safeScreenSource.includes("presentation.titleTextFit"));
  assert.ok(safeScreenSource.includes("presentation.footerTextFit"));
  assert.ok(emergencyCallButtonSource.includes("resolveEmergencyCallButtonPresentation(compact)"));
  assert.ok(emergencyCallButtonSource.includes("presentation.buttonIconSize"));
  assert.ok(emergencyCallButtonSource.includes("presentation.dialogMessage"));
  assert.ok(emergencyCallButtonSource.includes('Linking.openURL("tel:190")'));
  assert.ok(!emergencyCallButtonPolicySource.includes("tel:190"));

  for (const source of [safeScreenPolicySource, emergencyCallButtonPolicySource]) {
    assert.ok(
      !/from "react|from "react-native|lucide-react-native|theme\.colors|router\.push|apiClient|Share\.share|SecureStore|AsyncStorage|Linking\.openURL|useEffect|Animated|require\(/.test(
        source
      )
    );
  }

  console.log("screen components presentation policy ok");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
