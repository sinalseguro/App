import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  buildButtonIconPresentation,
  buttonIconLabelTextFit,
  buttonIconVisualSize
} from "../src/components/buttonIconPresentationPolicy";
import {
  buildEmergencyCallDockTargetPresentation,
  emergencyCallDockIconSize,
  emergencyCallDockLabelTextFit
} from "../src/features/emergency-home/emergencyCallDockPresentationPolicy";
import { emergencyCallTargets } from "../src/features/emergency-home/EmergencyCallTarget";

assert.deepEqual(buttonIconLabelTextFit, {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
  minimumFontScale: 0.82,
  numberOfLines: 1
});
assert.deepEqual(buttonIconVisualSize, {
  height: 28,
  width: 28
});
assert.deepEqual(buildButtonIconPresentation(false), {
  accessibilityRole: "button",
  disabled: false,
  iconSize: buttonIconVisualSize,
  labelTextFit: buttonIconLabelTextFit
});
assert.equal(buildButtonIconPresentation(true).disabled, true);

assert.equal(emergencyCallDockIconSize, 24);
assert.deepEqual(emergencyCallDockLabelTextFit, {
  numberOfLines: 1
});
for (const target of emergencyCallTargets) {
  assert.deepEqual(buildEmergencyCallDockTargetPresentation(target), {
    accessibilityHint: `Abre confirmacao para ligar ${target.number}`,
    accessibilityLabel: target.label,
    accessibilityRole: "button",
    iconSize: emergencyCallDockIconSize,
    labelTextFit: emergencyCallDockLabelTextFit
  });
}

async function main() {
  const buttonIconSource = await readFile("src/components/ButtonIcon.tsx", "utf8");
  const buttonIconPolicySource = await readFile("src/components/buttonIconPresentationPolicy.ts", "utf8");
  const emergencyCallDockSource = await readFile("src/features/emergency-home/EmergencyCallDock.tsx", "utf8");
  const emergencyCallDockPolicySource = await readFile(
    "src/features/emergency-home/emergencyCallDockPresentationPolicy.ts",
    "utf8"
  );

  assert.ok(buttonIconSource.includes("buildButtonIconPresentation(disabled)"));
  assert.ok(buttonIconSource.includes("presentation.labelTextFit"));
  assert.ok(buttonIconSource.includes("presentation.iconSize"));
  assert.ok(emergencyCallDockSource.includes("buildEmergencyCallDockTargetPresentation(target)"));
  assert.ok(emergencyCallDockSource.includes("presentation.accessibilityHint"));
  assert.ok(emergencyCallDockSource.includes("renderEmergencyIcon(target.icon, presentation.iconSize)"));

  for (const source of [buttonIconPolicySource, emergencyCallDockPolicySource]) {
    assert.ok(
      !/from "react|from "react-native|lucide-react-native|theme\.colors|router\.push|apiClient|Share\.share|SecureStore|AsyncStorage|Linking\.openURL|useEffect|Animated/.test(
        source
      )
    );
  }

  console.log("action components presentation policy ok");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
