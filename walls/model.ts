// Walls: each example of the topic set side by side. Each is a part of its own, a file in this folder,
// which opens by itself (as any part does) or may be copied out to start from.
//
// Walls as legs (fettled/walls, docs/walls.md), each made of its build-up: a shed (corners of mixed stock, a door and
// a window, a partition teed in, sheathed and lined), an L said clockwise (a corner turning in, curbs, a stretch kept
// clear), a lean-to (a slab laid to fall, tops that slope, two walls teed in at one place), and a shed clad in brick
// and in siding (every brick and board a body: a veneer bonded at its corner, a lintel, boards leaning on each other).

import { part, place, placed, mm } from "fettled";
import shed from "./shed";
import lShape from "./l-shape";
import leanTo from "./lean-to";
import brickAndSiding from "./brick-and-siding";

export default part("walls", {
  shed: place(shed, placed({ origin: [mm(0), mm(0), 0] })),
  lShape: place(lShape, placed({ origin: [mm(6877), mm(0), 0] })),
  leanTo: place(leanTo, placed({ origin: [mm(0), mm(8000), 0] })),
  brickAndSiding: place(brickAndSiding, placed({ origin: [mm(6877), mm(8000), 0] })),
});
