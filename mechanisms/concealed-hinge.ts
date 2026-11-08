// A 110° concealed hinge, its four-bar designed by its motion: where its four pivots are, found so that its door opens
// from shut to 110°.
//
// What it hangs from and on, as much as is near it: a cabinet's side (18 mm), its front edge on the hinge's z = 0, its
// inner face on x = 0; a door (¾") shut on it in full overlay, its back on z = 0, its hinged edge 1.5 mm in from the
// side's outer face; the cup (35 mm, 13 deep, bored 3 mm from the door's edge) in the door; the arm on its plate on the
// side's inner face. Seen across the hinge (its y up the door's edge), everything turns about y.
//
// A chain of hinges: link 1 hangs from the arm at its pivot A, turning (its angle `link1Turn`); the door hangs from link
// 1's far end, its pivot C, turning (`link1.doorTurn`); link 2 hangs from the arm at B (`link2Turn`), its far end held on the
// door's pivot D, which closes the loop. Those three turns are all that has a value at each time of its motion: the
// motion turns the door (link 1's turn and the door's on it, together, 110° times its time), and the loop places the
// rest. What is designed is one at every time: A and B on the arm, the links' lengths, and where D and the door's hinged
// corner are in the door's own frame (its origin at C). Shut at time 0, its corner where a door in full overlay is.
//
// Nothing else is said of it (what it is to clear, where its pivots may be): its lengths between its pivots are hinted,
// round numbers, and the rest is where it is drawn. Drag the door at a time to see how far it may go.

import { part, node, line, free, hinted, placed, frame, joints, motion, must, equal, coincide, dist, add, mul, cut, extrusion, revolve, polygon, mm, deg, materials, type Corner, type Node } from "fettled";
import { sheets } from "fettled/products";

// The side, the door and the cup (mm).
const T = 18, td = 19.05, inset = 1.5, e = -(T - inset), W = 120, H = 80;
const cupR = 17.5, cupDepth = 13, boring = 3, cupWall = 1.5, cupFloor = 1;
// The arm and links: how wide a link is, how far round a pivot the arm's end is, its cheeks' and links' heights across.
const linkWidth = 2, margin = 2, armBack = 45, plateThickness = 2, armWidth = 10;
const cheeks: [number, number] = [6, 9];
const linkBands: [number, number][] = [[1.5, 5.5], [-5.5, -1.5]];

// Where it is drawn, shut (the hinge's x and z): the arm's pivots, the cup's.
const drawn = { A: [16, -4], B: [26, -12], C: [-6, 6], D: [-2, 2] };
// The lengths hinted: between the arm's pivots, the cup's, and along each link.
const hints = { arm: 12, cup: 6, link1: 24, link2: 30 };
const turnOf = (p: number[], q: number[]) => (Math.atan2(q[1] - p[1], q[0] - p[0]) * 180) / Math.PI;

/** A slab across the hinge: its outline's corners (nodes in the frame of the part it is of, at y = 0) carried along that
 *  part's y from `y0` to `y1`, as a part of its own in it. */
function slab(name: string, corners: Node[], y0: number, y1: number, material: typeof materials.nickelSteel, arcs: (Node | undefined)[] = []) {
  // (Its own frame: its x the part's, its y the part's z, so its z is down the part's y: from y1, as far as y1 − y0.)
  const local = corners.map((c) => node(c.x, c.z!, 0));
  const centres = arcs.map((c) => (c ? node(c.x, c.z!, 0) : undefined));
  const outline = local.map((n, i): Corner => (centres[i] ? { node: n, arc: { centre: centres[i]!, ccw: false } } : { node: n }));
  return part(name, { corners: local, centres: centres.filter((c): c is Node => !!c) }, { kind: "solid", at: placed({ origin: [0, mm(y1), 0], x: [1, 0, 0], y: [0, 0, 1] }), shapes: [extrusion(outline, { to: mm(y1 - y0), material })] });
}

/** A link, round ended, from its origin along its x as far as its length (`length`), `band` across the hinge. */
function bar(length: ReturnType<typeof free>, band: [number, number]) {
  const w = mm(linkWidth / 2), minus = mm(-linkWidth / 2);
  const a = node(0, 0, 0), b = node(length, 0, 0);
  const outline = [node(0, 0, minus), node(length, 0, minus), node(length, 0, w), node(0, 0, w)];
  return { a, b, body: slab("body", outline, band[0], band[1], materials.nickelSteel, [undefined, b, undefined, a]) };
}

export default part("concealed hinge", (self) => {
  const open = motion({ samples: 12 });
  const link1Turn = free(deg(turnOf(drawn.A, drawn.C)), { moves: open });
  const link2Turn = free(deg(turnOf(drawn.B, drawn.D)), { moves: open });

  // The arm's pivots, and the arm round them on its plate on the side's inner face.
  const A = node(free(mm(drawn.A[0])), 0, free(mm(drawn.A[1]))), B = node(free(mm(drawn.B[0])), 0, free(mm(drawn.B[1])));
  const m = mm(margin), x0 = mm(plateThickness), x1 = mm(plateThickness + armWidth), back = mm(-armBack);
  const armOutline = [
    node(x0, 0, back), node(x1, 0, back),
    node(add(B.x, m), 0, add(B.z!, mul(-1, m))), node(add(B.x, m), 0, add(B.z!, m)),
    node(add(A.x, m), 0, add(A.z!, m)), node(add(A.x, mul(-1, m)), 0, add(A.z!, m)), node(add(A.x, mul(-1, m)), 0, add(A.z!, mul(-1, m))),
    node(x0, 0, add(A.z!, mul(-1, m))),
  ];
  const arm = part("arm", {
    A, B, outline: armOutline,
    upper: slab("upper cheek", armOutline, cheeks[0], cheeks[1], materials.nickelSteel),
    lower: slab("lower cheek", armOutline, -cheeks[1], -cheeks[0], materials.nickelSteel),
  });
  const side = slab("side", [node(mm(-T), 0, mm(-60)), node(0, 0, mm(-60)), node(0, 0, 0), node(mm(-T), 0, 0)], -H / 2, H / 2, sheets.melamine18.material);
  const plate = slab("plate", [node(0, 0, mm(-50)), node(x0, 0, mm(-50)), node(x0, 0, mm(-24)), node(0, 0, mm(-24))], -21, 21, materials.nickelSteel);

  // Link 1, from A: and the door on its far end, C, its frame's origin there (as it is drawn shut, its axes the hinge's).
  const [cx, cz] = drawn.C;
  const link1 = part("link 1", (l) => {
    const length = hinted(mm(hints.link1));
    // (The door's turn on it: held by it, as the door is.)
    const doorTurn = free(deg(-turnOf(drawn.A, drawn.C)), { moves: open });
    const { a, b, body } = bar(length, linkBands[0]);
    const door = part("door", () => {
      // (Its hinged corner, behind: where it is in its own frame is designed; the rest of it from there.)
      const K = node(free(mm(e - cx)), 0, free(mm(-cz)));
      const D = node(free(mm(drawn.D[0] - cx)), 0, free(mm(drawn.D[1] - cz)));
      const C = node(0, 0, 0);
      const at = (x: number, z: number) => node(add(K.x, mm(x)), 0, add(K.z!, mm(z)));
      const corners = [at(0, 0), at(W, 0), at(W, td), at(0, td)];
      const cupAt = at(boring + cupR, 0), cupIn = at(boring + cupR, 1), cupUp = node(add(K.x, mm(boring + cupR)), mm(1), K.z!);
      const wood = slab("wood", corners, -H / 2, H / 2, sheets.mdf3_4.material);
      const outline = [node(mm(cupR - cupWall), 0, 0), node(mm(cupR), 0, 0), node(mm(cupR), 0, mm(cupDepth)), node(0, 0, mm(cupDepth)), node(0, 0, mm(cupDepth - cupFloor)), node(mm(cupR - cupWall), 0, mm(cupDepth - cupFloor))];
      const cup = part("cup", { outline }, { kind: "solid", at: frame(cupAt, { x: corners[1], y: cupUp }), shapes: [revolve(polygon(...outline), materials.nickelSteel)] });
      const axis = line(cupAt, cupIn);
      return { K, C, D, corners, cupAt, cupIn, cupUp, axis, wood, cup, bore: cut(wood, { tool: "bore", line: axis, r: mm(cupR), depth: mm(cupDepth) }, "cup") };
    }, { at: frame(b, { x: l.x, y: l.y, joint: joints.hinge([0, -1, 0], doorTurn) }) });
    return { length, doorTurn, a, b, body, door };
  }, { at: frame(A, { x: self.x, y: self.y, joint: joints.hinge([0, -1, 0], link1Turn) }) });

  // Link 2, from B: its far end held on the door's D.
  const link2 = part("link 2", () => {
    const length = hinted(mm(hints.link2));
    return { length, ...bar(length, linkBands[1]) };
  }, { at: frame(B, { x: self.x, y: self.y, joint: joints.hinge([0, -1, 0], link2Turn) }) });

  const door = (link1 as unknown as { door: { K: Node; C: Node; D: Node } }).door;
  const doorTurn = (link1 as unknown as { doorTurn: ReturnType<typeof free> }).doorTurn;
  const end2 = (link2 as unknown as { b: Node }).b;
  // Where its corner is, shut: a door in full overlay.
  const shut = node(mm(e), 0, 0);
  return {
    open, link1Turn, link2Turn, arm, side, plate, link1, link2, shut,
    // The motion turns the door: link 1's turn and the door's on it, together, from shut to 110°.
    drive: must(equal(add(link1Turn, doorTurn), mul(open, deg(110)))),
    // The loop closed: link 2's far end on the door's pivot D.
    closed: must(coincide(end2, door.D)),
    // Shut at time 0, its corner where a door in full overlay is.
    shutAt: open.at(0, must(coincide(door.K, shut))),
    // The lengths between its pivots, hinted.
    armLength: hinted(equal(dist(A, B), mm(hints.arm))),
    cupLength: hinted(equal(dist(door.C, door.D), mm(hints.cup))),
  };
});
