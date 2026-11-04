// A downpipe and a cable, routed: a section carried
// along a polyline, bent round each corner.
//
// Each is a `route` (fettled/routes): points in space, a section and a bend radius. Between bends it is a straight, a
// prism of its section; at each corner it turns, a bend: its section turned about the bend's axis by the angle it
// turns, exactly (a round section's is a torus; a tube's, a torus within a torus). The bends take what they need of the
// legs either side (a bend of radius r turning θ takes r·tan(θ/2) of each), so a leg must be long enough for its bends.
//
// The wall's face is the plane y = 0, the ground z = 0. The downpipe, Ø68 x 1.2 aluminium, comes down from a gutter's
// outlet 450 out from the wall, through a swan neck (two bends of 45°, back under the eave to 60 out from the wall,
// where its brackets hold it), down the wall and out through a shoe at its foot. The cable, Ø8, comes up the wall from
// a socket, out along the soffit and across under it: its bends in three planes, 90° each, to a radius of five times
// its diameter. Each route's `length` is its middle line's (along its straights and round its bends): what to buy or
// cut.

import { part, place, placed, sections, materials, mm } from "fettled";
import { route } from "fettled/routes";

export default part("a downpipe and a cable, routed", () => {
  const downpipe = route("downpipe", {
    section: sections.tube(mm(68), mm(1.2)),
    path: [
      [0, mm(450), mm(2700)],
      [0, mm(450), mm(2500)],
      [0, mm(60), mm(2110)],
      [0, mm(60), mm(250)],
      [0, mm(200), mm(110)],
    ],
    bend: mm(100),
    material: materials.aluminium6060T66,
  });
  const cable = route("cable", {
    section: sections.rod(mm(8)),
    path: [
      [mm(400), mm(10), mm(300)],
      [mm(400), mm(10), mm(2400)],
      [mm(400), mm(300), mm(2400)],
      [mm(1400), mm(300), mm(2400)],
      [mm(1400), mm(300), mm(2600)],
    ],
    bend: mm(40),
    material: materials.ABS,
  });
  return { downpipe, cable: place(cable, placed({ origin: [mm(200), 0, 0] })) };
});
