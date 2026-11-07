// Every fastener of the tables (fettled/fasteners): each screw standard at every size and every length it comes in, each
// nut and washer standard at every size, set out as a drawer of trays. Some two thousand seven hundred parts: a test of
// drawing many.
//
// Each standard is a tray, a plate of aluminium: its screws stand on it head up, a row for each size (smallest at the
// front), shortest to longest from the left, so each row climbs as a stair; its nuts and washers lie flat, a row of sizes.
// The trays are packed in rows of a drawer, the ISO ones, then the inch ones (ASME), then the nuts and washers.
//
// Lengths are the standard's own, for each size within its range, as the tables can make them (a set screw's short
// lengths, which its standard gives a shallower socket the tables have not, are left out; and a countersunk screw no
// longer than its head). Where a size has no range: ISO 14579's (the hexalobular twin of ISO 4762) are ISO 4762's for
// that thread; an inch standard whose table has no lengths is shown once a size, four diameters long to the nearest
// eighth of an inch (a set screw, one diameter long).

import { part, placed, extrusion, polygon, node, mm, inch, as, materials, type Length } from "fettled";
import { screws, nuts, washers, screw, nut, washer, type ScrewStandard, type Thread, type NutStandard, type WasherStandard } from "fettled/fasteners";

const mmOf = (l: Length) => as(l, mm);
/** Room between things in a tray, and round a tray's edge (mm). */
const GAP = 3, RIM = 8;
/** How wide the drawer is (mm): trays are packed in rows no wider. */
const DRAWER = 2400;

/** How far across a screw's head is (or its thread, of one with none), in millimetres. */
function across(std: ScrewStandard, t: Thread, length: Length): number {
  const h = std.of(t, length).head;
  return h.kind === "hex" ? (mmOf(h.s) * 2) / Math.sqrt(3) : h.kind === "none" ? mmOf(t.d) : mmOf(h.d);
}

/** The lengths of a size of a standard to show (see the head of the file). */
function lengthsOf(key: string, std: ScrewStandard, t: Thread): Length[] {
  return given(key, std, t).filter((l) => { try { std.of(t, l); return true; } catch { return false; } });
}
function given(key: string, std: ScrewStandard, t: Thread): Length[] {
  if (key === "iso14579" && screws.iso4762.threads.includes(t)) return screws.iso4762.lengths(t);
  const own = std.lengths(t);
  if (own.length) return own;
  const d = as(t.d, inch);
  return [inch(std.head === "none" ? Math.ceil(d * 16) / 16 : Math.ceil(d * 4 * 8) / 8)];
}

/** A tray's contents laid out from its front left corner, and how wide and deep it is (mm). */
type Laid = { width: number; depth: number; put: (x0: number, y0: number) => Record<string, unknown> };
const keyOf = (t: Thread) => t.label.replace(/\//g, "⁄");
const bySize = (ts: readonly Thread[]) => [...ts].sort((a, b) => mmOf(a.d) - mmOf(b.d));

/** A standard's screws standing head up: a row a size, its lengths left to right. */
function screwTray(key: string, std: ScrewStandard): Laid {
  const rows = bySize(std.threads).map((t) => ({ t, lengths: lengthsOf(key, std, t) })).filter((r) => r.lengths.length);
  const pitch = rows.map((r) => across(std, r.t, r.lengths[0]) + GAP);
  const width = Math.max(...rows.map((r, k) => r.lengths.length * pitch[k])) + 2 * RIM;
  const depth = pitch.reduce((a, b) => a + b, 0) + 2 * RIM;
  return {
    width, depth,
    put: (x0, y0) => {
      const out: Record<string, unknown> = {};
      let y = y0 + RIM;
      rows.forEach((r, k) => {
        const p = pitch[k];
        r.lengths.forEach((length, j) => {
          // (Its axis down, its tip on the tray: its bearing face as high as it is long.)
          const at = placed({ origin: [mm(x0 + RIM + p * (j + 0.5)), mm(y + p / 2), length], x: [1, 0, 0], y: [0, -1, 0] });
          out[`${keyOf(r.t)} x ${+mmOf(length).toFixed(2)}`] = screw(`${std.standard} ${r.t.label}`, std.of(r.t, length), { at });
        });
        y += p;
      });
      return out;
    },
  };
}

/** A standard's nuts or washers lying flat, its sizes left to right. */
function flatTray(of: (t: Thread) => { across: number; make: (x: number, y: number) => unknown }, ts: readonly Thread[]): Laid {
  const items = bySize(ts).map((t) => ({ t, ...of(t) }));
  const width = items.reduce((a, i) => a + i.across + GAP, 0) + 2 * RIM;
  const depth = Math.max(...items.map((i) => i.across)) + 2 * RIM;
  return {
    width, depth,
    put: (x0, y0) => {
      const out: Record<string, unknown> = {};
      let x = x0 + RIM;
      for (const i of items) {
        out[keyOf(i.t)] = i.make(x + i.across / 2, y0 + depth / 2);
        x += i.across + GAP;
      }
      return out;
    },
  };
}
const nutTray = (std: NutStandard) => flatTray((t) => { const n = std.of(t); const w = (mmOf(n.s) * 2) / Math.sqrt(3); return { across: w, make: (x, y) => nut(n.designation, n, { at: placed({ origin: [mm(x), mm(y), 0] }) }) }; }, std.threads);
const washerTray = (std: WasherStandard) => flatTray((t) => { const w = std.of(t); return { across: mmOf(w.d2), make: (x, y) => washer(w.designation, w, { at: placed({ origin: [mm(x), mm(y), 0] }) }) }; }, std.threads);

export default part("every fastener of the tables", () => {
  const all = (o: Record<string, unknown>, pre: string) => Object.keys(o).filter((k) => k.startsWith(pre));
  const trays: [string, Laid][] = [
    ...all(screws, "iso").map((k): [string, Laid] => [k, screwTray(k, (screws as Record<string, ScrewStandard>)[k])]),
    ...all(screws, "asme").map((k): [string, Laid] => [k, screwTray(k, (screws as Record<string, ScrewStandard>)[k])]),
    ...[...all(nuts, "iso"), ...all(nuts, "asme")].map((k): [string, Laid] => [k, nutTray((nuts as Record<string, NutStandard>)[k])]),
    ...[...all(washers, "iso"), ...all(washers, "asme")].map((k): [string, Laid] => [k, washerTray((washers as Record<string, WasherStandard>)[k])]),
  ];
  // Packed in rows of the drawer, front to back, each row as deep as its deepest tray.
  const out: Record<string, unknown> = {};
  let [x, y, rowDepth] = [0, 0, 0];
  for (const [k, tray] of trays) {
    if (x > 0 && x + tray.width > DRAWER) [x, y, rowDepth] = [0, y + rowDepth + 4 * GAP, 0];
    const [x0, y0] = [x, y];
    const corners = [node(mm(x0), mm(y0), 0), node(mm(x0 + tray.width), mm(y0), 0), node(mm(x0 + tray.width), mm(y0 + tray.depth), 0), node(mm(x0), mm(y0 + tray.depth), 0)];
    out[k] = { ...tray.put(x0, y0), tray: part("tray", { corners }, { shapes: [extrusion(polygon(...corners), { from: mm(-3), to: 0, material: materials.aluminium6061T6 })] }) };
    x += tray.width + 4 * GAP;
    rowDepth = Math.max(rowDepth, tray.depth);
  }
  return out;
});
