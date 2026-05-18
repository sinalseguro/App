import assert from "node:assert/strict";

import { resolveEmergencyHomeNavigationTarget } from "../src/features/emergency-home/homeNavigationPolicy";

assert.deepEqual(resolveEmergencyHomeNavigationTarget("/arquivos", "cofre"), {
  kind: "with_panel",
  params: { painel: "cofre" },
  pathname: "/arquivos"
});

assert.deepEqual(resolveEmergencyHomeNavigationTarget("/arquivos"), {
  kind: "plain",
  route: "/arquivos"
});

assert.deepEqual(resolveEmergencyHomeNavigationTarget("/contatos", "player"), {
  kind: "plain",
  route: "/contatos"
});

console.log("home-navigation-policy ok");
