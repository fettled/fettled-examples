// A shed clad two ways, each brick and each board a body of its own: its front and its right in a brick veneer, its
// back and its left in bevel siding, each over OSB sheathing on 2x4 studs at 16", gypsum board inside.
//
// The veneer (`masonry`): US modular bricks in running bond, an inch of air space behind them, course by course on bed
// joints of mortar from the slab's edge, which runs out under it as its ledge; cut short at its ends and either side
// of the front's window, a steel angle lintel over the window, the course over it on that. It stands on the slab, not
// on the framing. The siding (`siding`): 1x8 bevel boards in courses 6" apart, each leaning out on the board below,
// their butt joints on studs and staggered, cut round the back's door, each nailed through the sheathing into each stud
// it crosses. Where the two meet at a corner, the build-up that runs past covers the other's end, layer by layer.

import { part, node, lumber, nominal, DFL, mm, inch, ft } from "fettled";
import { slab } from "fettled/framing";
import { perimeter, framing } from "fettled/walls";
import { sheets, panels, siding, masonry, bricks, profiles } from "fettled/products";

const stud = lumber(nominal["2x4"], DFL.No2), header = lumber(nominal["2x8"], DFL.No2, { plies: 2 });
const [wide, deep, height] = [ft(12), ft(10), ft(8)];
const osb = panels(sheets.osb7_16), gwb = panels(sheets.gwb1_2, { laid: "horizontal" });
const studs = framing(stud, { spacing: inch(16) });
// (Each build-up from outside in.)
const brick = [masonry(bricks.usModular), osb, studs, gwb];
const lap = [siding(profiles.bevel1x8), osb, studs, gwb];

export default part("brick and siding", () => {
  // (The slab under the walls, and out under the veneer by 6": its ledge.)
  const ledge = mm(152.4);
  const floor = slab("slab", { outline: [[0, mm(-152.4)], [mm(3810), mm(-152.4)], [mm(3810), deep], [0, deep]], top: [node(0, 0, 0), node(mm(1000), 0, 0), node(0, mm(1000), 0)], thickness: inch(4) });
  const walls = perimeter("walls", {
    corners: [node(0, 0, 0), node(wide, 0, 0), node(wide, deep, 0), node(0, deep, 0)],
    names: ["front", "right", "back", "left"],
    legs: [
      { height, build: brick, openings: [{ label: "W1", kind: "window", centre: mm(1830), width: mm(900), head: mm(2032), height: mm(1000), header }] },
      { height, build: brick },
      { height, build: lap, openings: [{ label: "D1", kind: "door", centre: mm(1830), width: mm(900), head: mm(2032), header }] },
      { height, build: lap },
    ],
  });
  return { slab: floor, ledge, walls };
});
