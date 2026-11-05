// Cabinets: each example of the topic set side by side, and a short run of them under a counter. Each example is a
// part of its own, a file in this folder, which opens by itself (as any part does) or may be copied out to start from.
//
// Frameless (32 mm) kitchen cabinets (fettled/cabinets), of the products of the tables: carcases of melamine, backs of
// ply in grooves, fronts slab, shaker or glass, doors on hinges and drawers on slides each opening through its range.
//
// The run: a sink base of two shaker doors, a drawer base, and a base with a drawer over doors, side by side under a
// laminate counter 1" over their fronts; a wall cabinet of glass doors over the sink, 18" above the counter. Placed by
// hand, standing alone: the kitchen and the diagonal corner beside them are how cabinets are laid in runs along walls
// and hung on them.

import { part, place, placed, plane, node, support, mm, inch } from "fettled";
import { cabinet, counter, doors, drawer, glass, shaker } from "fettled/cabinets";
import baseWithADrawerAndDoors from "./base-with-a-drawer-and-doors";
import wallWithGlassDoors from "./wall-with-glass-doors";
import kitchen from "./kitchen";
import diagonalCorner from "./diagonal-corner";

export default part("cabinets", () => {
  const floor = [node(0, 0, 0), node(mm(1), 0, 0), node(0, mm(1), 0)];
  const [sink, drawers, both] = [inch(36), inch(18), inch(24)];
  const x = (inches: number) => placed({ origin: [inch(inches), 0, 0] });
  return {
    floor,
    ground: support(plane(floor[0], floor[1], floor[2])),
    run: part("run", {
      sink: cabinet("sink base", { width: sink, style: shaker(), fronts: [doors()], shelves: 0 }),
      drawers: cabinet("drawer base", { width: drawers, style: shaker(), fronts: [drawer(inch(6)), drawer(inch(10)), drawer(inch(13.25))], at: x(36) }),
      both: cabinet("base", { width: both, style: shaker(), fronts: [drawer(inch(6)), doors()], at: x(54) }),
      counter: counter("counter", inch(78), { at: placed({ origin: [0, 0, inch(34.5)] }) }),
      wall: cabinet("wall", { kind: "wall", width: sink, style: glass(), fronts: [doors()], at: placed({ origin: [0, 0, inch(54)] }) }),
    }),
    examples: part("examples", {
      baseWithADrawerAndDoors: place(baseWithADrawerAndDoors, placed({ origin: [inch(110), 0, 0] })),
      wallWithGlassDoors: place(wallWithGlassDoors, placed({ origin: [inch(164), 0, 0] })),
      kitchen: place(kitchen, placed({ origin: [inch(-260), inch(-60), 0] })),
      diagonalCorner: place(diagonalCorner, placed({ origin: [inch(-260), inch(100), 0] })),
    }),
  };
});
