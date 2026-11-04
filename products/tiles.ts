// Tiles (fettled/products): one of each, laid flat in a row, each its grout joint from the next.
//
// A tile is its made size (a 12" floor tile is 11⅞", so that with its ⅛" joint it comes to 12"), of its material.

import { part, placed, mm, as } from "fettled";
import { tiles, tile } from "fettled/products";

export default part("tiles", () => {
  let x = 0;
  return Object.fromEntries(Object.entries(tiles).map(([k, t]) => {
    const at = placed({ origin: [mm(x), 0, 0] });
    x += as(t.length, mm) + 40;
    return [k, tile(t.name, t, { at })];
  }));
});
