// Every fastener of the tables (fettled/fasteners): each screw standard at every size and every length it comes in, each
// nut and washer standard at every size, their threads modelled, set out as a drawer of trays. Some two and a half
// thousand parts: a test of drawing many.
//
// Each standard is a tray of aluminium, a floor in a rim, rounded at its corners: its screws stand on it head up, a row
// for each size (smallest at the front) between dividers, shortest to longest from the left, so each row climbs as a
// stair; its nuts and washers lie flat, a row of sizes. The trays are packed in rows of a drawer, the ISO ones, then the
// inch ones (ASME), then the nuts and washers.
//
// Lengths are each size's own (`lengths`): an ISO standard's, as its table gives them (between its stepped lines); an
// ASME one's, which fixes none, those Brighton-Best stocks (its "standard" items; a fillister head's, a reseller's list,
// for four sizes). A size with none listed is left out, as is a length the tables cannot make (a set screw's short
// lengths, which its standard gives a shallower socket the tables have not; a countersunk screw no longer than its head).
// Each is weighed as fettled/fasteners says, from its table's dimensions, not by its threaded body's integrals.

import { part, placed, extrusion, node, mm, inch, as, materials, type Length, type Node, type Corner } from "fettled";
import { screws, nuts, washers, screw, nut, washer, type ScrewStandard, type Thread, type NutStandard, type WasherStandard } from "fettled/fasteners";

const mmOf = (l: Length) => as(l, mm);
/** Room between things in a tray, and between its things and its rim (mm). */
const GAP = 3, RIM = 8;
/** A tray: its floor's thickness, its rim's height above the floor and thickness, its dividers' height and thickness, and
 *  the radius of its corners outside (mm). */
const FLOOR = 3, WALL = { h: 14, t: 2 }, DIVIDER = { h: 8, t: 1.2 }, ROUND = 6;
/** How wide the drawer is (mm): trays are packed in rows no wider. */
const DRAWER = 2400;

/** How far across a screw's head is (or its thread, of one with none), in millimetres. */
function across(std: ScrewStandard, t: Thread, length: Length): number {
  const h = std.of(t, length).head;
  return h.kind === "hex" ? (mmOf(h.s) * 2) / Math.sqrt(3) : h.kind === "none" ? mmOf(t.d) : mmOf(h.d);
}

/** The lengths of a size of a standard to show: its own, but those the tables cannot make (see the head of the file). */
const lengthsOf = (std: ScrewStandard, t: Thread): Length[] => std.lengths(t).filter((l) => { try { std.of(t, l); return true; } catch { return false; } });

/** A length as its standard says it: millimetres, or inches as a fraction (to a 64th). */
function said(std: ScrewStandard, l: Length): string {
  if (!std.standard.startsWith("ASME")) return `${+mmOf(l).toFixed(2)}`;
  const n = Math.round(as(l, inch) * 64), whole = Math.floor(n / 64);
  let [top, bottom] = [n % 64, 64];
  while (top && top % 2 === 0) [top, bottom] = [top / 2, bottom / 2];
  return top ? `${whole ? `${whole}-` : ""}${top}/${bottom}` : `${whole}`;
}

/** A tray's contents laid out from its front left corner, and how wide and deep it is (mm), and where its dividers are
 *  (how far from its front). */
type Laid = { width: number; depth: number; dividers: number[]; put: (x0: number, y0: number) => Record<string, unknown> };
const keyOf = (s: string) => s.replace(/\//g, "⁄");
const bySize = (ts: readonly Thread[]) => [...ts].sort((a, b) => mmOf(a.d) - mmOf(b.d));

/** A standard's screws standing head up: a row a size, its lengths left to right, a divider between rows. */
function screwTray(std: ScrewStandard): Laid | undefined {
  const rows = bySize(std.threads).map((t) => ({ t, lengths: lengthsOf(std, t) })).filter((r) => r.lengths.length);
  if (!rows.length) return undefined;
  const pitch = rows.map((r) => across(std, r.t, r.lengths[0]) + GAP);
  const width = Math.max(...rows.map((r, k) => r.lengths.length * pitch[k])) + 2 * RIM;
  const depth = pitch.reduce((a, b) => a + b, 0) + 2 * RIM;
  const dividers = pitch.slice(0, -1).map((_, k) => RIM + pitch.slice(0, k + 1).reduce((a, b) => a + b, 0));
  return {
    width, depth, dividers,
    put: (x0, y0) => {
      const out: Record<string, unknown> = {};
      let y = y0 + RIM;
      rows.forEach((r, k) => {
        const p = pitch[k];
        r.lengths.forEach((length, j) => {
          // (Its axis down, its tip on the tray: its bearing face as high as it is long overall; a shoulder screw's
          // length, as its standard names it, is its shoulder's.)
          const s = std.of(r.t, length);
          const at = placed({ origin: [mm(x0 + RIM + p * (j + 0.5)), mm(y + p / 2), s.length as Length], x: [1, 0, 0], y: [0, -1, 0] });
          out[keyOf(`${r.t.label} x ${said(std, length)}`)] = screw(`${std.standard} ${r.t.label} x ${said(std, length)}`, s, { at, threads: "modelled" });
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
    width, depth, dividers: [],
    put: (x0, y0) => {
      const out: Record<string, unknown> = {};
      let x = x0 + RIM;
      for (const i of items) {
        out[keyOf(i.t.label)] = i.make(x + i.across / 2, y0 + depth / 2);
        x += i.across + GAP;
      }
      return out;
    },
  };
}
const nutTray = (std: NutStandard) => flatTray((t) => { const n = std.of(t); const w = (mmOf(n.s) * 2) / Math.sqrt(3); return { across: w, make: (x, y) => nut(n.designation, n, { at: placed({ origin: [mm(x), mm(y), 0] }), threads: "modelled" }) }; }, std.threads);
const washerTray = (std: WasherStandard) => flatTray((t) => { const w = std.of(t); return { across: mmOf(w.d2), make: (x, y) => washer(w.designation, w, { at: placed({ origin: [mm(x), mm(y), 0] }) }) }; }, std.threads);

/** A tray from its front left corner (mm), as laid: its floor, its rim round it, its dividers across it. */
function tray(x0: number, y0: number, l: Laid) {
  const box = (a: number, b: number, c: number, d: number): Node[] => [node(mm(a), mm(b), 0), node(mm(c), mm(b), 0), node(mm(c), mm(d), 0), node(mm(a), mm(d), 0)];
  const rounded = (ns: Node[], r: number): Corner[] => ns.map((n) => (r > 0 ? { node: n, round: mm(r) } : { node: n }));
  const outside = box(x0, y0, x0 + l.width, y0 + l.depth);
  const inside = box(x0 + WALL.t, y0 + WALL.t, x0 + l.width - WALL.t, y0 + l.depth - WALL.t);
  const dividers = l.dividers.map((y) => box(x0 + WALL.t, y0 + y - DIVIDER.t / 2, x0 + l.width - WALL.t, y0 + y + DIVIDER.t / 2));
  const of = materials.aluminium6061T6;
  return part("tray", { outside, inside, dividers }, {
    shapes: [
      extrusion(rounded(outside, ROUND), { from: mm(-FLOOR), to: 0, material: of }),
      extrusion(rounded(outside, ROUND), { to: mm(WALL.h), holes: [rounded(inside, ROUND - WALL.t)], material: of }),
      ...dividers.map((d) => extrusion(rounded(d, 0), { to: mm(DIVIDER.h), material: of })),
    ],
  });
}

export default part("every fastener of the tables", () => {
  const all = (o: Record<string, unknown>, pre: string) => Object.keys(o).filter((k) => k.startsWith(pre));
  const screwTrays = [...all(screws, "iso"), ...all(screws, "asme")].map((k): [string, Laid | undefined] => [k, screwTray((screws as Record<string, ScrewStandard>)[k])]);
  const trays: [string, Laid][] = [
    ...screwTrays.filter((t): t is [string, Laid] => t[1] !== undefined),
    ...[...all(nuts, "iso"), ...all(nuts, "asme")].map((k): [string, Laid] => [k, nutTray((nuts as Record<string, NutStandard>)[k])]),
    ...[...all(washers, "iso"), ...all(washers, "asme")].map((k): [string, Laid] => [k, washerTray((washers as Record<string, WasherStandard>)[k])]),
  ];
  // Packed in rows of the drawer, front to back, each row as deep as its deepest tray.
  const out: Record<string, unknown> = {};
  let [x, y, rowDepth] = [0, 0, 0];
  for (const [k, l] of trays) {
    if (x > 0 && x + l.width > DRAWER) [x, y, rowDepth] = [0, y + rowDepth + 4 * GAP, 0];
    out[k] = { ...l.put(x, y), tray: tray(x, y, l) };
    x += l.width + 4 * GAP;
    rowDepth = Math.max(rowDepth, l.depth);
  }
  return out;
});
