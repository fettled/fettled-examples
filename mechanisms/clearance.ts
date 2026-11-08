// Kept clear of bodies: drag a thing into another and it stops on it (slides along it), never in it.
//
// - A ball (5 mm round), its middle free to go anywhere, kept clear of a block: the block an L (a notch in it) with a hole
//   through its long leg (8 mm round: the ball goes down it, and no further across it than it may).
// - A flap on a hinge (its turn free) over a stop: it comes down onto the stop and no further.
// - A lever on a hinge over a round crossbar, the bar wider than the lever: it comes down onto the bar across its
//   middle, where no corner of either is.
//
// What says it: `clear(a, b, { gap })`, how far apart the bodies of two parts are, exactly; or of a point from a part's
// bodies (docs/clearance.md).

import { part, node, free, placed, frame, joints, must, clear, extrusion, revolve, mm, deg, materials, type Corner } from "fettled";

const steel = materials.nickelSteel;
const r = 5;
const loop = (pts: [number, number, number][]): Corner[] => pts.map(([x, y, z]) => ({ node: node(mm(x), mm(y), mm(z)) }));

export default part("clear of bodies", () => {
  // The block: an L in its xy (0..60 × 0..20 and 0..20 × 0..50), 20 deep, a hole through its long leg at (40, 10).
  const outline = loop([[0, 0, 0], [60, 0, 0], [60, 20, 0], [20, 20, 0], [20, 50, 0], [0, 50, 0]]);
  const centre = node(mm(40), mm(10), 0), rim = node(mm(48), mm(10), 0);
  const block = part("block", { outline, centre, rim }, { kind: "solid", shapes: [extrusion(outline, { to: mm(20), material: steel, holes: [[{ node: rim, arc: { centre, ccw: true } }]] })] });

  // The ball: its middle free, in the notch to start.
  const c = node(free(mm(30)), free(mm(35)), free(mm(10)));
  const o = node(0, 0, 0), s = node(0, 0, mm(-r)), n = node(0, 0, mm(r));
  const ball = part("ball", { o, s, n }, { kind: "solid", at: frame(c), shapes: [revolve([{ node: s, arc: { centre: o, ccw: true } }, { node: n }], steel)] });

  // The flap on its hinge (along the flap's y): 50 long, 30 across, 4 thick, turned up 10° to start.
  const turn = free(deg(10));
  const leaf = loop([[0, 0, 0], [50, 0, 0], [50, 30, 0], [0, 30, 0]]);
  const tip = node(mm(50), mm(15), 0);
  const flap = part("flap", { leaf, tip }, { kind: "solid", at: placed({ origin: [mm(-80), mm(0), mm(0)], joint: joints.hinge([0, -1, 0], turn) }), shapes: [extrusion(leaf, { to: mm(4), material: steel })] });

  // The stop under it, 38 to 46 out from the hinge, its top 5 below it.
  // (Its frame at its base, 25 below the hinge.)
  const base = loop([[-42, 5, 0], [-34, 5, 0], [-34, 25, 0], [-42, 25, 0]]);
  const stop = part("stop", { base }, { kind: "solid", at: placed({ origin: [mm(0), mm(0), mm(-25)] }), shapes: [extrusion(base, { to: mm(20), material: steel })] });

  // The lever on its hinge (along the lever's y): 60 long, 10 across, 4 thick, level to start; the crossbar under it, 2
  // round, 35 out from the hinge and 6 below it, along the hinge, wider than the lever either side.
  const leverTurn = free(deg(0));
  const arm = loop([[0, 0, 0], [60, 0, 0], [60, 10, 0], [0, 10, 0]]);
  const end = node(mm(60), mm(5), 0);
  const lever = part("lever", { arm, end }, { kind: "solid", at: placed({ origin: [mm(-80), mm(60), mm(0)], joint: joints.hinge([0, -1, 0], leverTurn) }), shapes: [extrusion(arm, { to: mm(4), material: steel })] });
  const axis = node(0, 0, 0), edge = node(mm(2), 0, 0);
  const crossbar = part("crossbar", { axis, edge }, { kind: "solid", at: placed({ origin: [mm(-45), mm(80), mm(-6)], x: [1, 0, 0], y: [0, 0, 1] }), shapes: [extrusion([{ node: edge, arc: { centre: axis, ccw: true } }], { to: mm(30), material: steel })] });

  return {
    block, ball, c, flap, turn, stop, lever, leverTurn, crossbar,
    ballOut: must(clear(ball, block)),
    flapOnStop: must(clear(flap, stop)),
    leverOnBar: must(clear(lever, crossbar)),
  };
});
