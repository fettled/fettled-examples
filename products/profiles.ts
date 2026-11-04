// Profiles (fettled/products): a short length of each siding, panelling, soffit and trim, standing on end in a row,
// so its section is seen from above.
//
// Each is drawn from its nominal sizes (a bevel siding a wedge 15/32" at its butt and 3/16" at its tip; shiplap
// lipped each edge; a vinyl Dutch lap a shell 0.044" thick), its back on its x = 0 and its foot on its y = 0, of
// its material (cedar, fibre cement, vinyl, aluminium). A siding says its exposure (`profiles.bevel1x6.exposure`,
// 4½") and the lengths it is sold in.

import { part, placed, mm, as } from "fettled";
import { profiles, board } from "fettled/products";

export default part("profiles", () => {
  let x = 0;
  return Object.fromEntries(Object.entries(profiles).map(([k, p]) => {
    const at = placed({ origin: [mm(x), 0, 0] });
    x += as(p.thickness, mm) + 40;
    return [k, board(p.name, p, mm(150), { at })];
  }));
});
