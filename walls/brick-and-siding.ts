// A lean-to shed clad two ways, each brick and each board a body of its own: its front and its right in a brick
// veneer, its back and its left in bevel siding, each over OSB sheathing on 2x4 studs at 16", gypsum board inside. Its
// front 8' tall, its back 7', its sides' tops sloping between: their courses raked, each brick and board cut to it.
//
// The veneer (`masonry`): US modular bricks in running bond, an inch of air space behind them, course by course on bed
// joints of mortar from the slab's edge, which runs out under it as its ledge; cut short at its ends and either side
// of the front's window, a steel angle lintel over the window, the course over it on that; at its corner, the two faces'
// courses take turns running past, each end unit against the back of the other face's. It stands on the slab, not on
// the framing. The siding (`siding`): 1x8 bevel boards in courses 6" apart, each leaning out on the board below,
// their butt joints on studs and staggered, cut round the back's door, each nailed through the sheathing into each stud
// it crosses. Where two sided walls meet (the back and the left), their siding is mitred, as the part's rule says
// (`corner({ mitre: true })`); where brick meets siding, the build-up that runs past covers the other's end, layer by
// layer, the other's reaching its back.

import { part, node, lumber, nominal, DFL, joinery, lands, mm, inch, ft } from "fettled";
import { slab } from "fettled/framing";
import { wall, perimeter, corner, framing } from "fettled/walls";
import { sheets, panels, siding, masonry, bricks, profiles } from "fettled/products";

const stud = lumber(nominal["2x4"], DFL.No2), header = lumber(nominal["2x8"], DFL.No2, { plies: 2 });
const [wide, deep, high, low] = [ft(12), ft(10), ft(8), ft(7)];
const osb = panels(sheets.osb7_16), gwb = panels(sheets.gwb1_2, { laid: "horizontal" });
const studs = framing(stud, { spacing: inch(16) });
// (Each build-up from outside in.)
const brick = [masonry(bricks.usModular), osb, studs, gwb];
// (The right's raked top capped: a course of bricks on edge along it, each square to the slope; the front's cut to its
// line, as under a frieze.)
const capped = [masonry(bricks.usModular, { rake: "capped" }), osb, studs, gwb];
const lap = [siding(profiles.bevel1x8), osb, studs, gwb];

export default part("brick and siding", () => {
  // (The slab under the walls, and out under the veneer by 6": its ledge.)
  const ledge = mm(152.4);
  const floor = slab("slab", { outline: [[0, mm(-152.4)], [mm(3810), mm(-152.4)], [mm(3810), deep], [0, deep]], top: [node(0, 0, 0), node(mm(1000), 0, 0), node(0, mm(1000), 0)], thickness: inch(4) });
  const walls = perimeter("walls", {
    corners: [node(0, 0, 0), node(wide, 0, 0), node(wide, deep, 0), node(0, deep, 0)],
    names: ["front", "right", "back", "left"],
    legs: [
      { height: high, build: brick, openings: [{ label: "W1", kind: "window", centre: mm(1830), width: mm(900), head: mm(2032), height: mm(1000), header }] },
      { height: [high, low], build: capped },
      { height: low, build: lap, openings: [{ label: "D1", kind: "door", centre: mm(1830), width: mm(900), head: ft(6), header }] },
      { height: [low, high], build: lap },
    ],
  });
  return { slab: floor, ledge, walls };
}, { joinery: joinery(lands(wall, wall, corner({ mitre: true }))) });
