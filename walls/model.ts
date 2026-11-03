// Walls: each example of the topic set side by side. Each is a part of its own, a file in this folder,
// which opens by itself (as any part does) or may be copied out to start from.
//
// Walls as legs (fettled/walls, docs/walls.md): legs meeting at corners and tees, openings, partitions, tops that
// slope, and what walls stand on (a slab, a curb, a slab laid to fall, a floor at two heights).

import { part, place, placed, mm } from "fettled";
import legs from "./legs";
import lShape from "./l-shape";
import corner from "./corner";
import leanTo from "./lean-to";
import wallsThatSlope from "./walls-that-slope";
import interiorWall from "./interior-wall";
import onASlabAndACurb from "./on-a-slab-and-a-curb";
import slabLaidToFallAndALevelCurb from "./slab-laid-to-fall-and-a-level-curb";
import floorAtTwoHeights from "./floor-at-two-heights";

export default part("walls", {
  legs: place(legs, placed({ origin: [mm(0), mm(0), 0] })),
  lShape: place(lShape, placed({ origin: [mm(6877), mm(0), 0] })),
  corner: place(corner, placed({ origin: [mm(15877), mm(62), 0] })),
  leanTo: place(leanTo, placed({ origin: [mm(0), mm(8000), 0] })),
  wallsThatSlope: place(wallsThatSlope, placed({ origin: [mm(6000), mm(8000), 0] })),
  interiorWall: place(interiorWall, placed({ origin: [mm(11658), mm(8000), 0] })),
  onASlabAndACurb: place(onASlabAndACurb, placed({ origin: [mm(0), mm(14877), 0] })),
  slabLaidToFallAndALevelCurb: place(slabLaidToFallAndALevelCurb, placed({ origin: [mm(5658), mm(14877), 0] })),
  floorAtTwoHeights: place(floorAtTwoHeights, placed({ origin: [mm(11315), mm(14877), 0] })),
});
