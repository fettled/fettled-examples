// A drawer base (fettled/cabinets): three drawers of slab fronts, 18" wide, on side-mount ball-bearing slides.
//
// Its top drawer is 6" and its middle 10"; its bottom one takes what is left. (Said top down: a drawer of each
// height, the last as high as what is left is said as a door would be, so here all three are said.) Behind drawers
// alone there are no shelves.

import { part, plane, node, support, inch } from "fettled";
import { cabinet, drawer, slab } from "fettled/cabinets";
import { slides } from "fettled/products";

export default part("a drawer base", () => {
  const floor = [node(0, 0, 0), node(inch(1), 0, 0), node(0, inch(1), 0)];
  return {
    floor,
    ground: support(plane(floor[0], floor[1], floor[2])),
    cabinet: cabinet("drawer base", { width: inch(18), style: slab(), slide: slides.sideBallBearing, fronts: [drawer(inch(6)), drawer(inch(10)), drawer(inch(13.25))] }),
  };
});
