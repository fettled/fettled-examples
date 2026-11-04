// Bricks and blocks (fettled/products): one of each the tables have, side by side on their beds, the bricks in a row
// and the blocks behind them.
//
// Each is its specified size (a US modular brick 3⅝ x 2¼ x 7⅝", a UK one 215 x 102.5 x 65 mm), of its material:
// a clay brick weighed by its body and drawn its colour; a hollow block drawn solid, and weighed as its row says one
// weighs. Laid in a wall, a unit's course is its gauge (`bricks.usModular.gauge`: three courses to 8").

import { part, placed, mm, as } from "fettled";
import { bricks, blocks, unit, type MasonryUnit } from "fettled/products";

/** Units in a row along x, `gap` apart, at `y`. */
function row(units: Record<string, MasonryUnit>, y: number, gap = 40) {
  let x = 0;
  return Object.fromEntries(Object.entries(units).map(([k, u]) => {
    const at = placed({ origin: [mm(x), mm(y), 0] });
    x += as(u.length, mm) + gap;
    return [k, unit(u.name, u, { at })];
  }));
}

export default part("bricks and blocks", () => ({
  bricks: part("bricks", row(bricks, 0)),
  blocks: part("blocks", row(blocks, 200)),
}));
