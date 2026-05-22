import assert from "node:assert/strict";

import { resolveTrustedAngelsMenuRouteTarget } from "../src/features/invitations/trustedAngelsNavigationPolicy";

assert.deepEqual(
  resolveTrustedAngelsMenuRouteTarget({
    panelRoute: "em_andamento",
    route: "/arquivos"
  }),
  {
    kind: "archives-panel",
    params: {
      painel: "em_andamento"
    },
    pathname: "/arquivos"
  }
);

assert.deepEqual(
  resolveTrustedAngelsMenuRouteTarget({
    route: "/perfis"
  }),
  {
    kind: "route",
    route: "/perfis"
  }
);

assert.deepEqual(
  resolveTrustedAngelsMenuRouteTarget({
    route: "/arquivos"
  }),
  {
    kind: "route",
    route: "/arquivos"
  }
);

console.log("trusted angels navigation policy ok");
