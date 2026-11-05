// A diagonal corner (fettled/cabinets): two runs of cabinets meeting at a corner cabinet set across it, in a 10' room
// of 2x4 walls lined with ½" gypsum board on a slab.
//
// Along the back wall, from the left wall to the right: a diagonal corner base cabinet (36" along each wall, its door
// across the corner at 45°), a 3" filler (so the next doors open past the corner's), a sink base, a drawer base, and a
// filler (what is left); over them a diagonal corner wall cabinet (24" along each wall), a 3" filler, two uppers, a
// narrow one and a filler. Along the left wall, a base cabinet and a drawer base, stopped on the corner cabinet's side.
// A counter of five sides over the corner, the back run's and the side run's counters meeting its edges. Each upper
// hung by screws through its rails into blocking in the back wall's bays. Settled, nothing is said: nothing clashes,
// every front opens through its range.

import { part, node, lumber, nominal, DFL, inch, ft, join } from "fettled";
import { slab } from "fettled/framing";
import { perimeter, framing } from "fettled/walls";
import { sheets, panels } from "fettled/products";
import { cabinet, cornerCabinet, cabinetRun, filler, door, doors, drawer, shaker } from "fettled/cabinets";

const size = ft(10);
const corners = [node(0, 0, 0), node(size, 0, 0), node(size, size, 0), node(0, size, 0)];
const build = [panels(sheets.osb7_16), framing(lumber(nominal["2x4"], DFL.No2), { spacing: inch(16) }), panels(sheets.gwb1_2)];
const drawers = () => [drawer(inch(6)), drawer(inch(10)), drawer(inch(13.25))];

export default part("diagonal corner", () => {
  const floor = slab("slab", { outline: [[0, 0], [size, 0], [size, size], [0, size]], top: [node(0, 0, 0), node(inch(1), 0, 0), node(0, inch(1), 0)], thickness: inch(4) });
  const walls = perimeter("walls", { corners, legs: { height: ft(8), build }, names: ["front", "right", "back", "left"] });
  const [, right, back, left] = walls.legs;
  const corner = cornerCabinet("corner", { on: "left", style: shaker() });
  const backRun = cabinetRun("back run", {
    base: [corner, filler({ width: inch(3) }), cabinet("sink", { width: inch(36), style: shaker(), fronts: [doors()], shelves: 0 }), cabinet("drawers", { width: inch(36), style: shaker(), fronts: drawers() }), filler()],
    wall: { items: [cornerCabinet("corner upper", { on: "left", kind: "wall", height: inch(30), style: shaker() }), filler({ width: inch(3) }), ...[36, 36].map((w, k) => cabinet(`upper ${k + 1}`, { kind: "wall", width: inch(w), height: inch(30), style: shaker(), fronts: [doors()] })), cabinet("narrow upper", { kind: "wall", width: inch(12), height: inch(30), style: shaker(), fronts: [door({ hinged: "left" })] }), filler()] },
  });
  const sideRun = cabinetRun("side run", {
    base: [cabinet("side base", { width: inch(24), style: shaker(), fronts: [drawer(inch(6)), door({ hinged: "left" })] }), cabinet("side drawers", { width: inch(18), style: shaker(), fronts: drawers() })],
  });
  return {
    slab: floor,
    walls,
    backRun,
    sideRun,
    joints: [
      join(walls.base, floor.top),
      join(backRun.back, back.inside.face()), join(backRun.start, left.inside.face()), join(backRun.end, right.inside.face()), join(backRun.base, floor.top),
      join(sideRun.back, left.inside.face()), join(sideRun.end, corner.other), join(sideRun.base, floor.top),
    ],
  };
});
