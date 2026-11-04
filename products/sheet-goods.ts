// Sheet goods (fettled/products): a square of each, 300 by 300, laid flat in a row; panels in front, counters behind.
//
// Each is its thickness (gypsum board ½" and ⅝", sheathing, carcase panels, counters), of its material: weighed by
// its body (gypsum board at ASCE 7's 0.55 psf per ⅛", sheathing at 0.4, as the weights table has them) and drawn as
// its material looks. `sheets.gwb1_2.sizes` are the sheets it is sold in (4 x 8, 4 x 10, 4 x 12 ft).

import { part, placed, mm } from "fettled";
import { sheets, panel } from "fettled/products";

const square = mm(300);

export default part("sheet goods", () => {
  const counts = { panel: 0, counter: 0 };
  return Object.fromEntries(Object.entries(sheets).map(([k, s]) => {
    const x = counts[s.kind]++ * 360, y = s.kind === "panel" ? 0 : 400;
    return [k, panel(s.name, s, { width: square, length: square, at: placed({ origin: [mm(x), mm(y), 0] }) })];
  }));
});
