// A wall's build-up (fettled/walls): the shed of `legs.ts`, sheathed outside in 7/16" OSB stood on end and lined
// inside with ½" gypsum board laid on its side, and its partition lined both sides.
//
// Each layer is said of a leg, from its studs out (`outside`, `inside`: `panels(sheet, …)`). Its sheets are laid from
// the leg's start along it, cut to its face (its base and its top, and round its door's and window's rough openings),
// and nailed to every stud each crosses: 6" apart at its edges and 12" between (6d commons for ½" and less, IRC
// R602.3(1); the gypsum board's screws stood in for by them). Nailed so, each sheet's weight goes into its studs.
//
// At each corner, outside, one leg's sheathing runs past its end over the other's edge (here the sides', `layers`);
// inside, one leg's gypsum board stops at the other's, which runs into the corner. Where the partition is teed in, its
// gypsum board stops at the front's and the back's, which run on behind it.
//
// Each layer's seams are a whole sheet apart: from where its studs are laid out from, or from where the layer itself
// starts, whichever lands more of them on studs (here the OSB's from the outside corners, on the 16" and 24" layouts,
// and over the door on its header; the gypsum board's from the outside corners too, though it starts 5½" or 3½" in
// from them, so its first sheet is cut). A seam that lands on no stud is said, and a sheet narrower than the studs'
// spacing: none here.

import { part, node, sub, lumber, nominal, DFL, mm, inch, ft } from "fettled";
import { slab } from "fettled/framing";
import { wall, perimeter, tee, panels } from "fettled/walls";
import { sheets } from "fettled/products";

const twoBySix = lumber(nominal["2x6"], DFL.No2), twoByFour = lumber(nominal["2x4"], DFL.No2);
const header = lumber(nominal["2x10"], DFL.No2, { plies: 2 });
const [wide, deep, height] = [ft(16), ft(10), ft(8)];
const corners = [node(0, 0, 0), node(wide, 0, 0), node(wide, deep, 0), node(0, deep, 0)];
const outside = [panels(sheets.osb7_16)], inside = [panels(sheets.gwb1_2, { laid: "horizontal" })];
const legs = {
  front: { stock: twoBySix, height, spacing: inch(16), outside, inside, backs: [{ at: mm(3000), width: twoByFour.depth }], openings: [{ label: "D1", kind: "door" as const, centre: mm(1500), width: mm(1000), header, flush: true }] },
  side: { stock: twoByFour, height, spacing: inch(16), outside, inside },
  back: { stock: twoBySix, height, spacing: inch(24), outside, inside, backs: [{ at: mm(4876.8 - 3000), width: twoByFour.depth }], openings: [{ label: "W1", kind: "window" as const, centre: mm(1000), width: mm(1200), head: mm(2100), height: mm(1000), header }] },
};

export default part("sheathed and drywalled", () => {
  const floor = slab("slab", { outline: [[0, 0], [wide, 0], [wide, deep], [0, deep]], top: [node(0, 0, 0), node(mm(1000), 0, 0), node(0, mm(1000), 0)], thickness: inch(4) });
  // (At each corner, the side's sheathing runs past over the front's or the back's edge: so the front's and the back's,
  // 16' long, are four whole sheets each, not four and a sliver.)
  const walls = perimeter("walls", { corners, legs: [legs.front, legs.side, legs.back, legs.side], names: ["front", "right", "back", "left"], layers: [undefined, "b", undefined, "b"] });
  const partition = wall("partition", { from: node(mm(3044.5), twoBySix.depth, 0), to: node(mm(3044.5), sub(deep, twoBySix.depth), 0), stock: twoByFour, height, spacing: inch(16), outside: inside, inside });
  const tees = [tee(walls.legs[0], partition, mm(3000)), tee(walls.legs[2], partition, mm(4876.8 - 3000), { end: "end" })];
  return { slab: floor, walls, partition, tees };
});
