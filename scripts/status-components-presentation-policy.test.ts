import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  buildInviteCardPresentation,
  inviteCardStatusPresentation
} from "../src/components/inviteCardPresentationPolicy";
import {
  buildPermissionGatePresentation,
  permissionGateStatusLabels
} from "../src/components/permissionGatePresentationPolicy";

assert.deepEqual(permissionGateStatusLabels, {
  pendente: "pendente",
  permitido: "permitido",
  negado: "negado",
  bloqueado: "bloqueado"
});
assert.equal(buildPermissionGatePresentation("pendente").statusLabel, "pendente");
assert.equal(buildPermissionGatePresentation("permitido").statusLabel, "permitido");
assert.equal(buildPermissionGatePresentation("negado").statusLabel, "negado");
assert.equal(buildPermissionGatePresentation("bloqueado").statusLabel, "bloqueado");

assert.deepEqual(inviteCardStatusPresentation, {
  aceito: {
    iconKey: "shield-check",
    label: "Autorizado",
    tone: "secure"
  },
  compartilhado: {
    iconKey: "check-circle",
    label: "Compartilhado",
    tone: "primary"
  },
  expirado: {
    iconKey: "shield-alert",
    label: "Expirado",
    tone: "warning"
  },
  pendente: {
    iconKey: "clock",
    label: "Pendente",
    tone: "warning"
  },
  revogado: {
    iconKey: "x-circle",
    label: "Revogado",
    tone: "danger"
  }
});
assert.equal(buildInviteCardPresentation("aceito").label, "Autorizado");
assert.equal(buildInviteCardPresentation("compartilhado").iconKey, "check-circle");
assert.equal(buildInviteCardPresentation("expirado").tone, "warning");
assert.equal(buildInviteCardPresentation("pendente").iconKey, "clock");
assert.equal(buildInviteCardPresentation("revogado").tone, "danger");

async function main() {
  const inviteCardSource = await readFile("src/components/InviteCard.tsx", "utf8");
  const inviteCardPolicySource = await readFile("src/components/inviteCardPresentationPolicy.ts", "utf8");
  const permissionGateSource = await readFile("src/components/PermissionGate.tsx", "utf8");
  const permissionGatePolicySource = await readFile("src/components/permissionGatePresentationPolicy.ts", "utf8");

  assert.ok(inviteCardSource.includes("buildInviteCardPresentation(status)"));
  assert.ok(inviteCardSource.includes("defaultIcon(presentation.iconKey, color)"));
  assert.ok(!inviteCardSource.includes("statusLabel"));
  assert.ok(permissionGateSource.includes("buildPermissionGatePresentation(status)"));
  assert.ok(permissionGateSource.includes("presentation.statusLabel"));

  for (const source of [inviteCardPolicySource, permissionGatePolicySource]) {
    assert.ok(!/from "react|from "react-native|lucide-react-native|theme\.colors|router\.push|apiClient|Share\.share|SecureStore|AsyncStorage|useEffect/.test(source));
  }

  console.log("status components presentation policy ok");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
