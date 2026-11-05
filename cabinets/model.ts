// Cabinets: each example of the topic set side by side, and a short run of them under a counter. Each example is a
// part of its own, a file in this folder, which opens by itself (as any part does) or may be copied out to start from.
//
// Frameless (32 mm) kitchen cabinets (fettled/cabinets), of the products of the tables: carcases of melamine, backs of
// ply in grooves, fronts slab, shaker or glass, doors on hinges and drawers on slides each opening through its range.
//
// The run: a sink base of two shaker doors, a drawer base, and a base with a drawer over doors, side by side under a
// laminate counter 1" over their fronts; a wall cabinet of glass doors over the sink, 18" above the counter. Its pulls
// (fettled/hardware) black bar pulls, 160 mm centres; the wall cabinet's, knobs. And handles and knobs on sample
// boards: each of the tables, and some said by their sizes.

import { part, place, placed, plane, node, support, mm, inch } from "fettled";
import { cabinet, counter, doors, drawer, glass, shaker } from "fettled/cabinets";
import { handles } from "fettled/hardware";
import baseWithADrawerAndDoors from "./base-with-a-drawer-and-doors";
import wallWithGlassDoors from "./wall-with-glass-doors";
import handlesAndKnobs from "./handles";

export default part("cabinets", () => {
  const floor = [node(0, 0, 0), node(mm(1), 0, 0), node(0, mm(1), 0)];
  const [sink, drawers, both] = [inch(36), inch(18), inch(24)];
  const x = (inches: number) => placed({ origin: [inch(inches), 0, 0] });
  const pull = handles.barPull160Black;
  return {
    floor,
    ground: support(plane(floor[0], floor[1], floor[2])),
    run: part("run", {
      sink: cabinet("sink base", { width: sink, style: shaker(), fronts: [doors()], shelves: 0, pull }),
      drawers: cabinet("drawer base", { width: drawers, style: shaker(), fronts: [drawer(inch(6)), drawer(inch(10)), drawer(inch(13.25))], pull, at: x(36) }),
      both: cabinet("base", { width: both, style: shaker(), fronts: [drawer(inch(6)), doors()], pull, at: x(54) }),
      counter: counter("counter", inch(78), { at: placed({ origin: [0, 0, inch(34.5)] }) }),
      wall: cabinet("wall", { kind: "wall", width: sink, style: glass(), fronts: [doors()], pull: handles.roundKnob32Nickel, at: placed({ origin: [0, 0, inch(54)] }) }),
    }),
    examples: part("examples", {
      baseWithADrawerAndDoors: place(baseWithADrawerAndDoors, placed({ origin: [inch(110), 0, 0] })),
      wallWithGlassDoors: place(wallWithGlassDoors, placed({ origin: [inch(164), 0, 0] })),
      handlesAndKnobs: place(handlesAndKnobs, placed({ origin: [0, inch(-60), 0] })),
    }),
  };
});
