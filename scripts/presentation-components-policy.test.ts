import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  buildResourceTilePresentation,
  resourceTileDescriptionTextFit,
  resourceTileLabelTextFit
} from "../src/components/resourceTilePresentationPolicy";
import {
  buildStatusBannerPresentation,
  statusBannerTonePresentation
} from "../src/components/statusBannerPresentationPolicy";

assert.deepEqual(statusBannerTonePresentation, {
  danger: {
    borderColorToken: "danger"
  },
  secure: {
    borderColorToken: "secure"
  },
  warning: {
    borderColorToken: "warning"
  }
});
assert.equal(buildStatusBannerPresentation("secure").borderColorToken, "secure");
assert.equal(buildStatusBannerPresentation("warning").borderColorToken, "warning");
assert.equal(buildStatusBannerPresentation("danger").borderColorToken, "danger");

assert.deepEqual(resourceTileLabelTextFit, {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
  minimumFontScale: 0.82,
  numberOfLines: 2
});
assert.deepEqual(resourceTileDescriptionTextFit, {
  adjustsFontSizeToFit: true,
  maxFontSizeMultiplier: 1.2,
  minimumFontScale: 0.84,
  numberOfLines: 2
});
assert.equal(buildResourceTilePresentation().shouldRenderDescription, false);
assert.equal(buildResourceTilePresentation("").shouldRenderDescription, false);
assert.equal(buildResourceTilePresentation("Abrir recurso").shouldRenderDescription, true);

async function main() {
  const resourceTileSource = await readFile("src/components/ResourceTile.tsx", "utf8");
  const resourceTilePolicySource = await readFile("src/components/resourceTilePresentationPolicy.ts", "utf8");
  const statusBannerSource = await readFile("src/components/StatusBanner.tsx", "utf8");
  const statusBannerPolicySource = await readFile("src/components/statusBannerPresentationPolicy.ts", "utf8");

  assert.ok(resourceTileSource.includes("buildResourceTilePresentation(description)"));
  assert.ok(resourceTileSource.includes("presentation.labelTextFit"));
  assert.ok(resourceTileSource.includes("presentation.descriptionTextFit"));
  assert.ok(statusBannerSource.includes("buildStatusBannerPresentation(tone)"));
  assert.ok(statusBannerSource.includes("theme.colors[presentation.borderColorToken]"));

  for (const source of [resourceTilePolicySource, statusBannerPolicySource]) {
    assert.ok(!/from "react|from "react-native|lucide-react-native|theme\.colors|router\.push|apiClient|Share\.share|SecureStore|AsyncStorage|useEffect/.test(source));
  }

  console.log("presentation components policy ok");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
