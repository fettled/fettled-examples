// As built: each example of the topic set side by side. Each is a part of its own, a file in this folder,
// which opens by itself (as any part does) or may be copied out to start from.
//
// Things as they are, not as they were drawn: taped, surveyed, scanned, or made already, and the rest found to
// suit them.

import { part, place, placed, mm } from "fettled";
import asMeasured from "./as-measured";
import unevenFloor from "./uneven-floor";
import slabReadFromAScan from "./slab-read-from-a-scan";
import headerAndTrussRow from "./header-and-truss-row";

export default part("as built", {
  asMeasured: place(asMeasured, placed({ origin: [mm(0), mm(0), 0] })),
  unevenFloor: place(unevenFloor, placed({ origin: [mm(2950), mm(-50), 0] })),
  slabReadFromAScan: place(slabReadFromAScan, placed({ origin: [mm(12796), mm(0), 0] })),
  headerAndTrussRow: place(headerAndTrussRow, placed({ origin: [mm(5677), mm(6686), 0] })),
});
