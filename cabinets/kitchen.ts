// An L-shaped kitchen (fettled/cabinets on fettled/walls): two runs of cabinets set against the gypsum board of a room's
// walls, hung on blocking in their bays, standing on its slab.
//
// The room is 18'-4" by 12' of 2x4 walls, sheathed and lined with ½" gypsum board, a window in its back wall over the
// sink. Along its back wall, a run from wall to wall: a blind corner cabinet (its first 27" a fixed panel, behind the
// other run), a sink base under the window, a space for a dishwasher (the counter over it), a drawer base, a space for
// a range (no counter over it), a base cabinet, a filler, and a space holding a fridge (a part of its own). Its uppers
// 18" over the counter, either side of the window and of the range's hood, a 6" filler where they meet the left wall.
// Along its left wall, a tall pantry and a drawer base, stopped on the back run's fronts with a 3" filler so their doors
// clear each other, its counter short of the back run's overhang. Doors beside a wall, a tall cabinet or the fridge are
// hinged on their other side: each opens through its range without meeting anything.
//
// Where each run is along its wall is found: the back run from the left wall's gypsum board to the right's (its filler
// what is left: 2"), the left run from the back run's fronts. Its height from the slab it stands on. Each cabinet hangs
// by rails across its back, screwed through them and the gypsum board into blocks the wall puts in its bays at their
// heights (or into its plates or its cripples, where they are there): each screw's load is checked into what it is
// found to go into. The base cabinets stand on the slab, their screws only holding them back; the uppers hang on theirs.

import { part, node, polygon, extrusion, materials, lumber, nominal, DFL, inch, ft, kg, join } from "fettled";
import { slab } from "fettled/framing";
import { perimeter, framing } from "fettled/walls";
import { sheets, panels } from "fettled/products";
import { cabinet, cabinetRun, filler, space, door, doors, drawer, glass, shaker } from "fettled/cabinets";

const [wide, deep, height] = [inch(220), ft(12), ft(8)];
const corners = [node(0, 0, 0), node(wide, 0, 0), node(wide, deep, 0), node(0, deep, 0)];
const stud = lumber(nominal["2x4"], DFL.No2), header = lumber(nominal["2x8"], DFL.No2, { plies: 2 });
const build = [panels(sheets.osb7_16), framing(stud, { spacing: inch(16) }), panels(sheets.gwb1_2)];
// (The window over the sink: its middle 60" from the back run's start, which is the left wall's gypsum board, 4" in.)
const window = { label: "W1", kind: "window" as const, centre: inch(220 - 64), width: inch(36), head: inch(82), height: inch(36), header };
const legs = { side: { height, build }, back: { height, build, openings: [window] } };

/** A fridge, as a box its size and weight, its front toward its −y. */
function fridge() {
  const c = [[0, 0], [35.5, 0], [35.5, -30], [0, -30]].map(([x, y]) => node(inch(x), inch(y), 0));
  const middle = node(inch(17.75), inch(-15), inch(35));
  return part("fridge", { c, middle }, { kind: "solid", shapes: [extrusion(polygon(...c), { to: inch(70), material: materials.A36 })], weighs: { mass: kg(110), centre: middle } });
}

export default part("kitchen", () => {
  const floor = slab("slab", { outline: [[0, 0], [wide, 0], [wide, deep], [0, deep]], top: [node(0, 0, 0), node(inch(1), 0, 0), node(0, inch(1), 0)], thickness: inch(4) });
  const walls = perimeter("walls", { corners, legs: [legs.side, legs.side, legs.back, legs.side], names: ["front", "right", "back", "left"] });
  const [, right, back, left] = walls.legs;
  const upper = (name: string, width: number, o: { style?: ReturnType<typeof shaker>; hinged?: "left" | "right" } = {}) => cabinet(name, { kind: "wall", width: inch(width), height: inch(30), style: o.style ?? shaker(), fronts: [o.hinged ? door({ hinged: o.hinged }) : doors()] });
  const backRun = cabinetRun("back run", {
    base: [
      cabinet("corner", { width: inch(42), style: shaker(), fronts: [drawer(inch(6)), door({ hinged: "right" })], blind: { width: inch(27), at: "left" } }),
      cabinet("sink", { width: inch(36), style: shaker(), fronts: [doors()], shelves: 0 }),
      space("dishwasher", inch(24)),
      cabinet("drawers", { width: inch(18), style: shaker(), fronts: [drawer(inch(6)), drawer(inch(10)), drawer(inch(13.25))] }),
      space("range", inch(30), { counter: false }),
      cabinet("base", { width: inch(24), style: shaker(), fronts: [drawer(inch(6)), door({ hinged: "left" })] }),
      filler(),
      space("fridge", inch(36), { holds: fridge(), counter: false }),
    ],
    wall: { items: [filler({ width: inch(6) }), upper("corner upper", 30), space("window", inch(48)), upper("upper", 36, { style: glass() }), space("hood", inch(30)), upper("upper by the fridge", 24, { hinged: "left" })] },
  });
  const sideRun = cabinetRun("side run", {
    base: [
      cabinet("pantry", { kind: "tall", width: inch(24), height: inch(84), style: shaker(), fronts: [door({ hinged: "left" }), door({ hinged: "left" })] }),
      cabinet("side drawers", { width: inch(30), style: shaker(), fronts: [drawer(inch(6)), drawer(inch(10)), drawer(inch(13.25))] }),
      filler({ width: inch(3) }),
    ],
    counter: { short: [inch(0), inch(1)] },
  });
  return {
    slab: floor,
    walls,
    backRun,
    sideRun,
    // (The walls on the slab; the back run against the back wall, from the left wall to the right; the side run against
    // the left wall, its end on the back run's fronts; both on the slab.)
    joints: [
      join(walls.base, floor.top),
      join(backRun.back, back.inside.face()), join(backRun.start, left.inside.face()), join(backRun.end, right.inside.face()), join(backRun.base, floor.top),
      join(sideRun.back, left.inside.face()), join(sideRun.end, backRun.front), join(sideRun.base, floor.top),
    ],
  };
});
