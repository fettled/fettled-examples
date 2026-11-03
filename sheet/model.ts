// Sheet: each example of the topic set side by side. Each is a part of its own, a file in this folder,
// which opens by itself (as any part does) or may be copied out to start from.
//
// Sheet and plate: a bracket folded from a plate, a sheet cut flat and folded and fixed in a T-slot rail, and
// plates cut apart and welded (fettled/sheet, docs/sheet-stock.md).

import { part, place, placed, mm } from "fettled";
import bracket from "./bracket";
import sheetBracket from "./sheet-bracket";
import sheetSeams from "./sheet-seams";

export default part("sheet", {
  bracket: place(bracket, placed({ origin: [mm(0), mm(0), 0] })),
  sheetBracket: place(sheetBracket, placed({ origin: [mm(125), mm(20), 0] })),
  sheetSeams: place(sheetSeams, placed({ origin: [mm(485), mm(0), 0] })),
});
