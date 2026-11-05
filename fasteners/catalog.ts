// The fastener catalog (fettled/fasteners): one of each screw standard of the tables, an M6 of it where it has one, in
// a row along x, each stood on its head's bearing face, its shank down; then each nut and washer standard, an M6.
//
// Each is a value of the standard (`screws.iso4762.of(threads.M6, mm(20))`): its head and drive as the standard sizes
// them, threaded as far as it says (its `b`), of the property class it is commonly sold in. Each is one body turned
// about its axis (a countersunk head a cone, a button's a sphere's cap), its recess cut in its head where that is made:
// a hex socket, a cross. A hex head is a prism of its own.

import { part, placed, mm, as } from "fettled";
import { screws, nuts, washers, threads, screw, nut, washer, type Thread } from "fettled/fasteners";

export default part("fastener catalog", () => {
  let x = 0;
  const next = (w: number) => { const at = x; x += w; return placed({ origin: [mm(at), 0, 0], x: [1, 0, 0], y: [0, -1, 0] }); };
  // (An M6 where the standard has one, else its largest below.)
  const size = (ts: readonly Thread[]) => ts.find((t) => t.label === "M6") ?? ts.filter((t) => t.series === "coarse").pop()!;
  const all = Object.fromEntries(Object.entries(screws).map(([k, std]) => {
    const t = size(std.threads);
    const lengths = std.lengths(t);
    const length = lengths.find((l) => as(l, mm) >= 20) ?? lengths[lengths.length - 1];
    return [k, screw(`${std.standard} ${t.label}`, std.of(t, length, k === "iso7379" ? { shoulder: mm(12) } : {}), { at: next(20) })];
  }));
  const nutsOf = Object.fromEntries(Object.entries(nuts).map(([k, std]) => [k, nut(`${std.standard} M6`, std.of(threads.M6), { at: next(20) })]));
  const washersOf = Object.fromEntries(Object.entries(washers).map(([k, std]) => [k, washer(`${std.standard} M6`, std.of(threads.M6), { at: next(20) })]));
  return { screws: all, nuts: nutsOf, washers: washersOf };
});

