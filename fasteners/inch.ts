// The inch fastener catalog (fettled/fasteners, ASME): one of each screw standard of the tables, a 1/4-20 UNC where it
// has one (else its largest below), an inch long where its table has no lengths; each nut and washer standard, a 1/4;
// and a 1/4-20 socket head cap screw with its thread modelled.
//
// - ASME B18.3: socket head cap screw, button head, flat countersunk (82°), set screw (flat point).
// - ASME B18.2.1: hex cap screw. ASME B18.6.3: pan and flat head machine screws (cross recess, approximate), fillister
//   head (its slot, across a dome, not cut yet).
// - ASME B18.2.2: hex nut, jam nut, heavy hex nut, heavy jam nut. ASME B18.22.1: plain washers, narrow (SAE) and wide
//   (USS).
//
// Threads are Unified (ASME B1.1): `unc["1/4"]` is 1/4-20 UNC, `unf["#10"]` #10-32 UNF.

import { part, placed, inch, mm, as } from "fettled";
import { screws, nuts, washers, unc, screw, nut, washer, type Thread } from "fettled/fasteners";

export default part("inch fastener catalog", () => {
  let x = 0;
  const next = (w: number) => { const at = x; x += w; return placed({ origin: [mm(at), 0, 0], x: [1, 0, 0], y: [0, -1, 0] }); };
  const quarter = unc["1/4"];
  // (A 1/4-20 where the standard has one, else its largest below.)
  const size = (ts: readonly Thread[]) => ts.find((t) => t.label === quarter.label) ?? ts.filter((t) => as(t.d, mm) < as(quarter.d, mm)).pop()!;
  const inchScrews = ["asmeshcs", "asmebhcs", "asmefhcs", "asmeset", "asmehexcap", "asmepan", "asmeflat", "asmefillister"] as const;
  const all = Object.fromEntries(inchScrews.map((k) => {
    const std = screws[k];
    const t = size(std.threads);
    const lengths = std.lengths(t);
    const length = lengths.find((l) => as(l, inch) >= 0.5) ?? lengths[lengths.length - 1] ?? inch(1);
    return [k, screw(`${std.standard} ${t.label}`, std.of(t, length), { at: next(25) })];
  }));
  const nutsOf = Object.fromEntries((["asmehex", "asmejam", "asmeheavy", "asmeheavyjam"] as const).map((k) => [k, nut(`${nuts[k].standard} ${nuts[k].name}`, nuts[k].of(quarter), { at: next(20) })]));
  const washersOf = Object.fromEntries((["asmesae", "asmeuss"] as const).map((k) => [k, washer(`${washers[k].standard} ${washers[k].name}`, washers[k].of(quarter), { at: next(25) })]));
  const modelled = screw("1/4-20 SHCS, thread modelled", screws.asmeshcs.of(quarter, inch(1)), { at: next(25), threads: "modelled" });
  return { screws: all, nuts: nutsOf, washers: washersOf, modelled };
});
