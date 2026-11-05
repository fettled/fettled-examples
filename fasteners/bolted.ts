// Two plates fixed together (fettled/fixings `fixed`, of fettled/fasteners' screws): a 10 mm steel plate on a 12 mm
// one, each 80 by 50.
//
// - An M8 hex bolt (ISO 4017) down through both, a washer (ISO 7089) under its head and under its nut (ISO 4032): as
//   long as its grip, both washers, the nut and two turns past it want, of its standard's lengths. Each plate is bored
//   for it at its thread's clearance (ISO 273, medium: 9).
// - An M6 countersunk socket screw (ISO 10642) down through the upper plate into the lower, tapped for it 10 deep: its
//   head flush in a recess in the upper, as long as the grip and a diameter of thread want, no longer than the tapping.
//
// Nothing meets anything but as its fits say: the bolt free in its holes, the screw's thread in its tapped hole.

import { part, node, placed, materials, mm } from "fettled";
import { plate, type PlateCorner } from "fettled/sheet";
import { fixed } from "fettled/fixings";
import { screws, threads, washers } from "fettled/fasteners";

const square = (w: number, h: number): PlateCorner[] => [["a", [0, 0]], ["b", [mm(w), 0]], ["c", [mm(w), mm(h)]], ["d", [0, mm(h)]]];

export default part("bolted plates", () => {
  const lower = plate("lower", square(80, 50), mm(12), materials.A36);
  const upper = plate("upper", square(80, 50), mm(10), materials.A36, { at: placed({ origin: [0, 0, mm(12)] }) });
  const marks = { bolt: [node(mm(20), mm(25), mm(40)), node(mm(20), mm(25), 0)], screw: [node(mm(60), mm(25), mm(40)), node(mm(60), mm(25), 0)] };
  return {
    lower, upper, marks,
    bolt: fixed("bolt", { from: marks.bolt[0], toward: marks.bolt[1], through: [upper, lower], thread: threads.M8, screw: screws.iso4017, washer: washers.iso7089 }),
    screw: fixed("screw", { from: marks.screw[0], toward: marks.screw[1], through: [upper], into: lower, depth: mm(10), thread: threads.M6, screw: screws.iso10642 }),
  };
});
