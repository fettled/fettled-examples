// Fasteners no standard has, said whole (fettled/fasteners: `screwOf`, `thread`): each checked as it is said, its head
// wider than its shank, its recess within its head, its thread and shoulder within its length.
//
// - A screw of a thread no table has: M7 by 0.75, tapped from a 6.25 drill (d − P), with a socket cap head 11 across
//   and 7 high and a 6 mm hex socket 4 deep, 30 long, threaded 18 of it from its point, of A4-80 stainless.
// - A shoulder screw of its own: an M5 thread on a shoulder 8 across and 25 long, a socket cap head 13 across and 5
//   high, a 4 mm hex socket.
// - A square-drive (Robertson) countersunk screw, an M4, its head 8 across at 90°.
// - An M6 ISO 4762 screw made otherwise than the standard says: threaded only 10 of its 40, flat at its point.

import { part, placed, mm, deg, materials } from "fettled";
import { screwOf, screw, thread, threads, screws, heads, drives } from "fettled/fasteners";

export default part("custom fasteners", () => {
  const at = (x: number) => placed({ origin: [mm(x), 0, 0], x: [1, 0, 0], y: [0, -1, 0] });
  const m7 = thread(mm(7), mm(0.75));
  return {
    fine: screw("M7x0.75 cap screw", screwOf({ name: "cap screw", thread: m7, length: mm(30), head: heads.socketCap(mm(11), mm(7)), drive: drives.hex(mm(6), mm(4)), threadLength: mm(18), material: materials.stainlessA4_80, grade: "A4-80" }), { at: at(0) }),
    shoulder: screw("shoulder screw", screwOf({ name: "shoulder screw", thread: threads.M5, length: mm(35), head: heads.socketCap(mm(13), mm(5)), drive: drives.hex(mm(4), mm(3)), shoulder: { d: mm(8), length: mm(25) } }), { at: at(25) }),
    square: screw("square drive", screwOf({ name: "square drive countersunk screw", thread: threads.M4, length: mm(20), head: heads.countersunk(mm(8), deg(90)), drive: drives.square(mm(2.2), mm(1.8)) }), { at: at(50) }),
    short: screw("short thread", screws.iso4762.of(threads.M6, mm(40), { threadLength: mm(10), point: "flat" }), { at: at(70) }),
  };
});
