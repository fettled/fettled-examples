// Threads modelled (fettled/fasteners, `screw(…, { threads: "modelled" })`): each screw's thread is ISO 68-1's basic
// profile swept along its shank, exactly, its crests, roots and flanks each a face the length of the thread (a
// cylinder, a helicoid), each corner of the profile a helix that may be sighted, picked or dimensioned as any edge.
//
// - An ISO 4762 M6 by 30: threaded its standard 24 from its point, running out onto its shank, into its chamfered point.
// - An ISO 4762 M10 by 25: threaded to its head (its bearing face the thread's end there).
// - An ISO 10642 countersunk M8 by 30: its thread running out under its head's cone.
// - An M7 by 0.75 of no table, flat at its point, threaded 18 of its 30.
// - The same M6 by 30 with its thread drawn at its major diameter, beside it, as a building of a thousand screws draws
//   it.

import { part, placed, mm, materials } from "fettled";
import { screw, screws, screwOf, thread, threads, heads, drives } from "fettled/fasteners";

export default part("threads modelled", () => {
  const at = (x: number) => placed({ origin: [mm(x), 0, 0], x: [1, 0, 0], y: [0, -1, 0] });
  const m7 = thread(mm(7), mm(0.75));
  return {
    m6: screw("ISO 4762 M6x30", screws.iso4762.of(threads.M6, mm(30)), { at: at(0), threads: "modelled" }),
    m10: screw("ISO 4762 M10x25", screws.iso4762.of(threads.M10, mm(25)), { at: at(25), threads: "modelled" }),
    countersunk: screw("ISO 10642 M8x30", screws.iso10642.of(threads.M8, mm(30)), { at: at(55), threads: "modelled" }),
    fine: screw("M7x0.75", screwOf({ name: "cap screw", thread: m7, length: mm(30), head: heads.socketCap(mm(11), mm(7)), drive: drives.hex(mm(6), mm(4)), threadLength: mm(18), point: "flat", material: materials.stainlessA4_80, grade: "A4-80" }), { at: at(80), threads: "modelled" }),
    drawn: screw("ISO 4762 M6x30 drawn", screws.iso4762.of(threads.M6, mm(30)), { at: at(100) }),
  };
});
