// A shed (fettled/walls): four legs on a slab, two of 2x6 and two of 2x4, a door under a flush header in the front, a
// window in the back, and a partition of 2x4 teed into the front and the back from the inside; each leg made of its
// build-up, from outside in: 7/16" OSB stood on end, its framing, ½" gypsum board laid on its side; the partition
// lined both sides.
//
// Each leg runs between two corners of its outside face, anticlockwise seen from above. Where two meet their plates
// lap, and each one's end stud stands inside the other's inside face: so a 2x4 leg meeting a 2x6 one stops its end
// stud 140 in from the corner, the 2x6 one 89 in. The partition's bottom and lower top plates end on the front's inside
// face; its upper top plate laps over the front's lower one; the front has a stud each side of it to back it (where it
// is said to be teed into it), its end stud nailed to them. So at the back.
//
// Each layer's sheets are laid along its leg, cut to its face (its base, its top, round its door's and window's rough
// openings), and nailed to every stud each crosses: 6" apart at its edges and 12" between (6d commons for ½" and less,
// IRC R602.3(1); the gypsum board's screws stood in for by them). Nailed so, each sheet's weight goes into its studs.
// At each corner, outside, one leg's sheathing runs past its end over the other's edge (here the sides', `layers`);
// inside, one leg's gypsum board stops at the other's, which runs into the corner. Where the partition is teed in, the
// front's and the back's gypsum board stops either side of it, as a partition framed before it is lined.
//
// Each layer's seams are a whole sheet apart: from where its studs are laid out from, or from where the layer itself
// starts, whichever lands more of them on studs; a seam that lands on no stud is said, and a sheet narrower than the
// studs' spacing: none here. A reading of where a layer's seams are (`seamsMoved`) lays its sheets out again from there.

import { part, node, sub, lumber, nominal, DFL, mm, inch, ft, join } from "fettled";
import { slab } from "fettled/framing";
import { wall, perimeter, panels, framing } from "fettled/walls";
import { sheets } from "fettled/products";

const twoBySix = lumber(nominal["2x6"], DFL.No2), twoByFour = lumber(nominal["2x4"], DFL.No2);
const header = lumber(nominal["2x10"], DFL.No2, { plies: 2 });
const [wide, deep, height] = [ft(16), ft(10), ft(8)];
const corners = [node(0, 0, 0), node(wide, 0, 0), node(wide, deep, 0), node(0, deep, 0)];
// (Each leg's build-up from outside in: OSB, its framing, gypsum board; the partition's gypsum board both sides.)
const osb = panels(sheets.osb7_16), gwb = panels(sheets.gwb1_2, { laid: "horizontal" });
const built = (stock: typeof twoBySix, spacing: ReturnType<typeof inch>) => [osb, framing(stock, { spacing }), gwb];
const legs = {
  front: { height, build: built(twoBySix, inch(16)), backs: [{ at: mm(3000), width: twoByFour.depth }], openings: [{ label: "D1", kind: "door" as const, centre: mm(1500), width: mm(1000), header, flush: true }] },
  side: { height, build: built(twoByFour, inch(16)) },
  back: { height, build: built(twoBySix, inch(24)), backs: [{ at: mm(4876.8 - 3000), width: twoByFour.depth }], openings: [{ label: "W1", kind: "window" as const, centre: mm(1000), width: mm(1200), head: mm(2100), height: mm(1000), header }] },
};

export default part("sheathed and drywalled", () => {
  const floor = slab("slab", { outline: [[0, 0], [wide, 0], [wide, deep], [0, deep]], top: [node(0, 0, 0), node(mm(1000), 0, 0), node(0, mm(1000), 0)], thickness: inch(4) });
  // (At each corner, the side's sheathing runs past over the front's or the back's edge: so the front's and the back's,
  // 16' long, are four whole sheets each, not four and a sliver.)
  const walls = perimeter("walls", { corners, legs: [legs.front, legs.side, legs.back, legs.side], names: ["front", "right", "back", "left"], layers: [undefined, "b", undefined, "b"] });
  const partition = wall("partition", { from: node(mm(3044.45), twoBySix.depth, 0), to: node(mm(3044.45), sub(deep, twoBySix.depth), 0), height, build: [gwb, framing(twoByFour, { spacing: inch(16) }), gwb] });
  const tees = [join(partition.start, walls.legs[0].inside.along(mm(3000))), join(partition.end, walls.legs[2].inside.along(mm(4876.8 - 3000)))];
  return { slab: floor, walls, partition, tees };
});
