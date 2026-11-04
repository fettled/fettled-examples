// Bricks and blocks (fettled/products): one of each the tables have, side by side on their beds, each twice: as its
// box (as a wall of many draws it) and with its cores through it.
//
// Each is its specified size (a US modular brick 3⅝ x 2¼ x 7⅝", three cores of 1½"; a UK one 215 x 102.5 x 65 mm), of
// its material, drawn its colour. Its box weighs what one does: as its datasheet says (a block's row), else as its
// body less its cores would. Drawn cored, it weighs as its body: beside the box, a check on the datasheet (an 8x8x16
// block drawn with its cells weighs 12.6 kg, its source 15.4: its cells are drawn at their least webs and shells,
// straight, where a real block's taper and are thicker). Laid in a wall, a unit's course is its gauge
// (`bricks.usModular.gauge`: three courses to 8").

import { part, placed, mm, as } from "fettled";
import { bricks, blocks, unit, type Detail, type MasonryUnit } from "fettled/products";

/** Units in a row along x, `gap` apart, at `y`, drawn as `detail` says. */
function row(units: Record<string, MasonryUnit>, y: number, detail: Detail, gap = 40) {
  let x = 0;
  return Object.fromEntries(Object.entries(units).map(([k, u]) => {
    const at = placed({ origin: [mm(x), mm(y), 0] });
    x += as(u.length, mm) + gap;
    return [k, unit(u.name, u, { at, detail })];
  }));
}

export default part("bricks and blocks", () => ({
  bricks: part("bricks", row(bricks, 0, "box")),
  coredBricks: part("cored bricks", row(bricks, 160, "cored")),
  blocks: part("blocks", row(blocks, 360, "box")),
  coredBlocks: part("cored blocks", row(blocks, 700, "cored")),
}));
