// Fasteners: each example of the topic set side by side. Each is a part of its own, a file in this folder, which opens
// by itself (as any part does) or may be copied out to start from.
//
// Threads, screws and bolts, nuts and washers (fettled/fasteners): the standards' catalog (ISO 4762, 10642, 7380-1,
// 4014, 4017, 7045, 7046-1, 1207, 7379, 4026; nuts ISO 4032, 4035; washers ISO 7089, 7092), fasteners said whole of
// any thread, head, drive, shoulder and material, and two plates fixed by them (fettled/fixings); and the inch catalog
// (ASME B18: Unified threads, socket, hex and machine screws, nuts and washers).

import { part, place, placed, mm } from "fettled";
import catalog from "./catalog";
import custom from "./custom";
import bolted from "./bolted";
import inchCatalog from "./inch";

export default part("fasteners", {
  catalog: place(catalog, placed({ origin: [0, 0, 0] })),
  custom: place(custom, placed({ origin: [0, mm(60), 0] })),
  bolted: place(bolted, placed({ origin: [0, mm(120), 0] })),
  inch: place(inchCatalog, placed({ origin: [0, mm(-60), 0] })),
});
