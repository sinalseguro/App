import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  appLaunchPresentation,
  resolveAppLaunchPresentation
} from "../src/components/appLaunchPresentationPolicy";
import {
  brandLockupPresentation,
  resolveBrandLockupPresentation
} from "../src/components/brandLockupPresentationPolicy";

assert.deepEqual(resolveAppLaunchPresentation(), appLaunchPresentation);
assert.equal(appLaunchPresentation.brandName, "SinalSeguro");
assert.equal(appLaunchPresentation.progressAccessibilityLabel, "Carregando SinalSeguro");
assert.equal(appLaunchPresentation.progressInitialValue, 0.18);
assert.equal(appLaunchPresentation.progressFinalValue, 1);
assert.equal(appLaunchPresentation.progressDurationMs, 900);
assert.deepEqual(appLaunchPresentation.progressInputRange, [0, 1]);
assert.deepEqual(appLaunchPresentation.progressOutputRange, ["18%", "100%"]);

assert.deepEqual(resolveBrandLockupPresentation(), brandLockupPresentation);
assert.equal(brandLockupPresentation.accessibilityLabel, "SinalSeguro");
assert.equal(brandLockupPresentation.accessibilityRole, "image");
assert.deepEqual(brandLockupPresentation.logoSize, {
  height: 72,
  width: 245
});

async function main() {
  const appLaunchSource = await readFile("src/components/AppLaunchScreen.tsx", "utf8");
  const appLaunchPolicySource = await readFile("src/components/appLaunchPresentationPolicy.ts", "utf8");
  const brandLockupSource = await readFile("src/components/BrandLockup.tsx", "utf8");
  const brandLockupPolicySource = await readFile("src/components/brandLockupPresentationPolicy.ts", "utf8");

  assert.ok(appLaunchSource.includes("resolveAppLaunchPresentation()"));
  assert.ok(appLaunchSource.includes("presentation.progressInitialValue"));
  assert.ok(appLaunchSource.includes("presentation.progressAccessibilityLabel"));
  assert.ok(brandLockupSource.includes("resolveBrandLockupPresentation()"));
  assert.ok(brandLockupSource.includes("presentation.accessibilityLabel"));
  assert.ok(brandLockupSource.includes("presentation.logoSize"));

  for (const source of [appLaunchPolicySource, brandLockupPolicySource]) {
    assert.ok(
      !/from "react|from "react-native|lucide-react-native|theme\.colors|router\.push|apiClient|Share\.share|SecureStore|AsyncStorage|useEffect|Animated/.test(
        source
      )
    );
  }

  console.log("brand components presentation policy ok");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
