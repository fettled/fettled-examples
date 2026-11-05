// A downpipe and a cable, routed: a section swept
// along nodes, bent round each corner.
//
// Each is a sweep of a section along a path of its part's nodes, each corner between its ends rounded to a radius (`{
// node, round }`, its middle line's): between bends a straight, a prism of its section; at each corner a bend, the
// section turned about the bend's axis by the angle the path turns there, exactly (a rod's a torus; a tube's, a torus
// within a torus). A bend takes what it needs of the runs either side (a bend of radius r turning θ takes r·tan(θ/2) of
// each), so a run must be long enough for its bends; one its bends take up wholly is none (two bends back to back). The
// path is of nodes, so it goes where they are found: the downpipe's top is at its gutter's outlet, whose height is
// free, drawn at 2600 and held at 2700 by what is said of it, and the whole pipe follows.
//
// The wall's face is the plane y = 0, the ground z = 0. The downpipe, Ø68 x 1.2 aluminium, comes down from the outlet,
// 450 out from the wall, through a swan neck (two bends of 45°, back under the eave to 60 out from the wall, where its
// brackets would hold it), down the wall and out through a shoe at its foot. The cable, Ø8, comes up the wall from a
// socket, out along the soffit and across under it: its bends in three planes, 90° each, to five times its diameter.

import { part, node, free, sub, sweep, sections, must, is, materials, mm, type Node } from "fettled";

export default part("a downpipe and a cable, routed", () => {
  // (Its top at the outlet, wherever that is found; its neck below it, back at 45° to the wall; its foot and shoe at
  // the ground.)
  const outlet = free(mm(2600));
  const fall = {
    outlet: node(0, mm(450), outlet),
    neck: node(0, mm(450), sub(outlet, mm(200))),
    back: node(0, mm(60), sub(outlet, mm(590))),
    foot: node(0, mm(60), mm(250)),
    shoe: node(0, mm(200), mm(110)),
  };
  const downpipe = part("downpipe", fall, { kind: "solid" });
  const bend = (n: Node) => ({ node: n, round: mm(100) });
  downpipe.shapes = [sweep(sections.tube(mm(68), mm(1.2)), [fall.outlet, bend(fall.neck), bend(fall.back), bend(fall.foot), fall.shoe], materials.aluminium6060T66)];

  const run = {
    socket: node(mm(600), mm(10), mm(300)),
    eave: node(mm(600), mm(10), mm(2400)),
    soffit: node(mm(600), mm(300), mm(2400)),
    across: node(mm(1600), mm(300), mm(2400)),
    up: node(mm(1600), mm(300), mm(2600)),
  };
  const cable = part("cable", run, { kind: "solid" });
  const turn = (n: Node) => ({ node: n, round: mm(40) });
  cable.shapes = [sweep(sections.rod(mm(8)), [run.socket, turn(run.eave), turn(run.soffit), turn(run.across), run.up], materials.ABS)];

  return { downpipe, cable, outletHeld: must(is(outlet, mm(2700))) };
});
