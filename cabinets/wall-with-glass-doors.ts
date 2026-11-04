// A wall cabinet with glass doors (fettled/cabinets): 30" wide, 42" high, 12" deep, hung 18" above a counter.
//
// Its doors are maple frames round 4 mm glass, on 110° hinges (four each: a 42" door takes four); its two shelves on
// the 32 mm line. It hangs on the wall: its screws into the studs behind it are not said yet, so it is held by nothing (said).

import { part, placed, inch } from "fettled";
import { cabinet, doors, glass } from "fettled/cabinets";

export default part("a wall cabinet with glass doors", () => ({
  cabinet: cabinet("wall", { kind: "wall", width: inch(30), style: glass(), fronts: [doors()], at: placed({ origin: [0, 0, inch(54)] }) }),
}));
