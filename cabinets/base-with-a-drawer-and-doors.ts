// A base cabinet with a drawer over a pair of doors (fettled/cabinets): frameless, 32 mm, of the US frameless system.
//
// 24" wide, 34½" high on its toe kick, its carcase of 18 mm melamine, its back of ¼" ply in a groove. Its fronts are
// shaker (maple stiles and rails round a ¼" panel): a drawer 6" high on undermount slides, as long as fit its depth,
// and two doors under it on 110° hinges, three each. Its shelf is on the nearest hole of the 32 mm line to the middle
// of its height. Its drawer slides out as far as its slides extend; its doors open to 110°: where either meets
// something first, it is said.

import { part, plane, node, support, mm, inch } from "fettled";
import { cabinet, drawer, doors, shaker } from "fettled/cabinets";

export default part("a base cabinet with a drawer and doors", () => {
  const floor = [node(0, 0, 0), node(mm(1), 0, 0), node(0, mm(1), 0)];
  return {
    floor,
    ground: support(plane(floor[0], floor[1], floor[2])),
    cabinet: cabinet("base", { width: inch(24), style: shaker(), fronts: [drawer(inch(6)), doors()] }),
  };
});
