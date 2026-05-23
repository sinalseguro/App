import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  emergencySettingsDrawerActions,
  emergencySettingsDrawerIconSize,
  emergencySettingsDrawerLabelTextFit,
  resolveEmergencySettingsDrawerPresentation
} from "../src/features/emergency-home/emergencySettingsDrawerPresentationPolicy";
import { resolveEmergencyTopBarPresentation } from "../src/features/emergency-home/emergencyTopBarPresentationPolicy";

assert.deepEqual(resolveEmergencyTopBarPresentation(false), {
  contextLabel: "Modo discreto",
  menuIcon: "settings",
  showMenu: true
});
assert.deepEqual(resolveEmergencyTopBarPresentation(true), {
  contextLabel: "Você pediu ajuda",
  menuIcon: "settings",
  showMenu: true
});

assert.deepEqual(emergencySettingsDrawerActions, [
  { iconKey: "archive", key: "vault", label: "Cofre" },
  { iconKey: "angels", key: "angels", label: "Anjos" },
  { iconKey: "alert", key: "alerts", label: "Alertas" },
  { iconKey: "profile", key: "profiles", label: "Perfis" },
  { iconKey: "player", key: "player", label: "Player" },
  { iconKey: "settings", key: "settings", label: "Configuracoes" }
]);
assert.equal(emergencySettingsDrawerIconSize, 18);
assert.deepEqual(emergencySettingsDrawerLabelTextFit, {
  maxFontSizeMultiplier: 1.2,
  numberOfLines: 1
});
assert.deepEqual(resolveEmergencySettingsDrawerPresentation(), {
  actionAccessibilityRole: "button",
  actions: emergencySettingsDrawerActions,
  drawerTestID: "home-settings-drawer",
  iconSize: emergencySettingsDrawerIconSize,
  labelTextFit: emergencySettingsDrawerLabelTextFit
});

async function main() {
  const topBarSource = await readFile("src/features/emergency-home/EmergencyTopBar.tsx", "utf8");
  const topBarPolicySource = await readFile(
    "src/features/emergency-home/emergencyTopBarPresentationPolicy.ts",
    "utf8"
  );
  const drawerSource = await readFile("src/features/emergency-home/EmergencySettingsDrawer.tsx", "utf8");
  const drawerPolicySource = await readFile(
    "src/features/emergency-home/emergencySettingsDrawerPresentationPolicy.ts",
    "utf8"
  );

  assert.ok(topBarSource.includes("resolveEmergencyTopBarPresentation(active)"));
  assert.ok(topBarSource.includes("presentation.contextLabel"));
  assert.ok(drawerSource.includes("resolveEmergencySettingsDrawerPresentation()"));
  assert.ok(drawerSource.includes("presentation.actions.map"));
  assert.ok(drawerSource.includes("drawerActionTargets"));
  assert.ok(drawerSource.includes('vault: { panel: "cofre", route: "/arquivos" }'));
  assert.ok(drawerSource.includes('player: { panel: "player", route: "/arquivos" }'));
  assert.ok(drawerSource.includes('angels: { route: "/contatos" }'));
  assert.ok(drawerSource.includes('alerts: { route: "/alerta" }'));
  assert.ok(drawerSource.includes('profiles: { route: "/perfis" }'));
  assert.ok(drawerSource.includes('settings: { route: "/configuracoes" }'));
  assert.ok(drawerSource.includes("onNavigate(target.route, target.panel)"));
  assert.ok(drawerSource.includes("renderDrawerIcon(action.iconKey, iconSize)"));
  assert.ok(drawerSource.includes("presentation.labelTextFit"));
  assert.ok(drawerPolicySource.includes('label: "Cofre"'));
  assert.ok(drawerPolicySource.includes('label: "Player"'));
  assert.ok(!drawerPolicySource.includes('route: "/'));
  assert.ok(!drawerPolicySource.includes('panel: "'));
  assert.ok(!drawerPolicySource.includes("backend/P2P"));

  for (const source of [topBarPolicySource, drawerPolicySource]) {
    assert.ok(
      !/from "react|from "react-native|lucide-react-native|theme\.colors|router\.push|apiClient|Share\.share|SecureStore|AsyncStorage|Linking\.openURL|useEffect|Animated|require\(/.test(
        source
      )
    );
  }

  console.log("emergency home shell presentation policy ok");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
