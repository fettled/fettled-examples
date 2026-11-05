// A 110° concealed hinge, designed by its motion: where its four pivots are, found so that its door opens from shut to
// 110° and nothing of the hinge stands in the door's wood outside its cup on the way.
//
// What it hangs from and on, as much as is near it: a cabinet's side (18 mm), its front edge on the hinge's z = 0, its
// inner face on x = 0; a door (¾") shut on it in full overlay, its back on z = 0, its hinged edge 1.5 mm in from the
// side's outer face. The cup (35 mm, 13 deep, bored 3 mm from the door's edge) is in the door; the arm is on its plate on
// the side's inner face; two links join them, each pinned to a pivot of the arm and one of the cup. Seen across the hinge
// (its y up the door's edge), everything turns about y: the links and the door move in the plane across (planar joints),
// the arm and the side do not.
//
// The hinge's design is its pivots: free, each hinted where a first guess (a search of linkages) puts it. Its motion
// opens the door: its angle 110° times the motion's time; at time 0 shut (where it is drawn). At every time each link
// is pinned at its ends (a link is rigid: its length is designed, as its pivots are); the door's hinged edge clear of the
// side (in front of its face, or past its outer face); and every place along the links and round the arm's end either
// out of the door's wood (behind its back, in front of its face, past its edge) or within the cup's bore (its half-width
// at the height across the hinge each is at: the bore is round). Its pivots are apart (8 mm on the arm, 6 in the cup):
// two links, not one on the other. What must hold moves the pivots from their guess; what gives way (the hints) says by
// how much.

import { part, node, line, free, hinted, placed, joints, motion, must, is, coincide, atLeast, dist, placeIn, max, min, add, sub, mul, cut, extrusion, revolve, polygon, mm, deg, materials, type Corner, type Node, type Num, type PartBase } from "fettled";
import { sheets } from "fettled/products";

// The side, the door and the cup (mm).
const T = 18, td = 19.05, inset = 1.5, e = -(T - inset), W = 120, H = 80;
const cupR = 17.5, cupDepth = 13, boring = 3, cupWall = 1.5, cupFloor = 1;
const xc = e + boring + cupR;
// The arm and links: how wide a link is, how far round a pivot the arm's end is, its cheeks' and links' heights across.
const linkWidth = 2, margin = 2, armBack = 45, plateThickness = 2, armWidth = 10;
const cheeks: [number, number] = [6, 9];
const linkBands: [number, number][] = [[1.5, 5.5], [-5.5, -1.5]];
// (The bore's half-width at a height off its middle, less what a piece's own width takes and a little to spare.)
const halfWidth = (h: number, own: number) => Math.sqrt((cupR - cupWall) ** 2 - h * h) - own - 0.3;
const floorAt = cupDepth - cupFloor - 0.3;
// The first guess at the pivots (the arm's A and B, the cup's C and D: A to C and B to D), across from the cup's middle
// and deep into the door from its back: a search of linkages for one that keeps what this says (scratch, in the plane
// across, more finely sampled), each pivot kept apart from the other as this does.
const guess = { A: [10.3, 9.4], B: [13.04, -10.25], C: [-10.98, 6.74], D: [-14.16, 1.3] };
const pivot = ([a, d]: number[]) => node(hinted(mm(xc + a)), 0, hinted(mm(d)));

/** A slab across the hinge: its outline's corners (nodes in the frame of the part it is of, at y = 0) carried along that
 *  part's y from `y0` to `y1`, as a part of its own in it. */
function slab(name: string, corners: Node[], y0: number, y1: number, material: typeof materials.nickelSteel, arcs: (Node | undefined)[] = []) {
  // (Its own frame: its x the part's, its y the part's z, so its z is down the part's y: from y1, as far as y1 − y0.)
  const local = corners.map((c) => node(c.x, c.z!, 0));
  const centres = arcs.map((c) => (c ? node(c.x, c.z!, 0) : undefined));
  const outline = local.map((n, i): Corner => (centres[i] ? { node: n, arc: { centre: centres[i]!, ccw: false } } : { node: n }));
  return part(name, { corners: local, centres: centres.filter((c): c is Node => !!c) }, { kind: "solid", at: placed({ origin: [0, mm(y1), 0], x: [1, 0, 0], y: [0, 0, 1] }), shapes: [extrusion(outline, { to: mm(y1 - y0), material })] });
}

/** Where a place is not in the door's wood outside its bore (a number at least nothing where it is so): behind its back,
 *  in front of its face, past its hinged edge, or within the bore (`half` its half-width there) above its floor. */
const minus = (x: Num<"length">) => sub(mm(0), x);
function clear(p: Node, door: PartBase, half: number): Num<"length"> {
  const [x, , z] = placeIn(p, door);
  const off = sub(x, mm(xc));
  const inBore = min(sub(mm(half), max(off, minus(off))), sub(mm(floorAt), z));
  return max(minus(z), sub(z, mm(td)), sub(mm(e), x), inBore);
}

export default part("concealed hinge", (self) => {
  const open = motion({ samples: 12 });
  // The door, shut where it is drawn: its place in the plane across and its turn move with the motion.
  const du = free(mm(0), { moves: open }), dv = free(mm(0), { moves: open }), turn = free(deg(0), { moves: open });
  const C = pivot(guess.C), D = pivot(guess.D);
  const doorCorners = [node(mm(e), 0, 0), node(mm(e + W), 0, 0), node(mm(e + W), 0, mm(td)), node(mm(e), 0, mm(td))];
  const axisEnds = [node(mm(xc), 0, 0), node(mm(xc), 0, mm(1))];
  const cupAxis = line(axisEnds[0], axisEnds[1]);
  const cupOutline = [node(mm(cupR - cupWall), 0, 0), node(mm(cupR), 0, 0), node(mm(cupR), 0, mm(cupDepth)), node(0, 0, mm(cupDepth)), node(0, 0, mm(cupDepth - cupFloor)), node(mm(cupR - cupWall), 0, mm(cupDepth - cupFloor))];
  const door = part("door", (d) => {
    const wood = slab("wood", doorCorners, -H / 2, H / 2, sheets.mdf3_4.material);
    // (The cup about the bore's axis: its x across, its z into the door, turned about its z.)
    const cup = part("cup", { outline: cupOutline }, { kind: "solid", at: placed({ origin: [mm(xc), 0, 0] }), shapes: [revolve(polygon(...cupOutline), materials.nickelSteel)] });
    // (Its pivots are in the cup, clear of its wall and floor, and in front of the door's back.)
    const inCup = (p: Node, k: string) => ({
      [`${k} within the cup`]: must(atLeast(sub(mm(halfWidth(0, 1)), max(sub(p.x, mm(xc)), sub(mm(xc), p.x))), mm(0))),
      [`${k} above its floor`]: must(atLeast(sub(mm(floorAt - 1), p.z!), mm(0))),
      [`${k} in front of the door's back`]: must(atLeast(p.z!, mm(1))),
    });
    return { corners: doorCorners, C, D, axisEnds, axis: cupAxis, wood, cup, bore: cut(wood, { tool: "bore", line: cupAxis, r: mm(cupR), depth: mm(cupDepth) }, "cup"), ...inCup(C, "C"), ...inCup(D, "D") };
  }, { at: placed({ joint: joints.planar([0, -1, 0], { u: du, v: dv, angle: turn }) }) });

  // The side, and the arm on its plate on the side's inner face.
  const side = slab("side", [node(mm(-T), 0, mm(-60)), node(0, 0, mm(-60)), node(0, 0, 0), node(mm(-T), 0, 0)], -H / 2, H / 2, sheets.melamine18.material);
  const A = pivot(guess.A), B = pivot(guess.B);
  const x0 = plateThickness, x1 = x0 + armWidth, back = -armBack;
  const m = mm(margin);
  const armOutline = [
    node(mm(x0), 0, mm(back)), node(mm(x1), 0, mm(back)),
    node(add(B.x, m), 0, sub(B.z!, m)), node(add(B.x, m), 0, add(B.z!, m)),
    node(add(A.x, m), 0, add(A.z!, m)), node(sub(A.x, m), 0, add(A.z!, m)), node(sub(A.x, m), 0, sub(A.z!, m)),
    node(mm(x0), 0, sub(A.z!, m)),
  ];
  const arm = part("arm", {
    A, B, outline: armOutline,
    upper: slab("upper cheek", armOutline, cheeks[0], cheeks[1], materials.nickelSteel),
    lower: slab("lower cheek", armOutline, -cheeks[1], -cheeks[0], materials.nickelSteel),
  });
  const plate = slab("plate", [node(0, 0, mm(-50)), node(mm(x0), 0, mm(-50)), node(mm(x0), 0, mm(-24)), node(0, 0, mm(-24))], -21, 21, materials.nickelSteel);

  // The links: each pinned at the arm's pivot (its origin) and the cup's (along its x, as far as its length).
  const link = (name: string, from: number[], to: number[], band: [number, number]) => {
    const [ax, az] = [xc + from[0], from[1]], [cx, cz] = [xc + to[0], to[1]];
    const length = free(mm(Math.hypot(cx - ax, cz - az)));
    const angle = (Math.atan2(cz - az, cx - ax) * 180) / Math.PI;
    const w = mm(linkWidth / 2);
    const a = node(0, 0, 0), b = node(length, 0, 0);
    // (Along it, places it is checked at: from its arm's end to its cup's.)
    const along = [0.2, 0.4, 0.6, 0.8].map((s) => node(mul(s, length), 0, 0));
    const outline = [node(0, 0, minus(w)), node(length, 0, minus(w)), node(length, 0, w), node(0, 0, w)];
    return part(name, { length, a, b, along, body: slab("body", outline, band[0], band[1], materials.nickelSteel, [undefined, b, undefined, a]) }, {
      at: placed({ joint: joints.planar([0, -1, 0], { u: free(mm(ax), { moves: open }), v: free(mm(az), { moves: open }), angle: free(deg(angle), { moves: open }) }) }),
    });
  };
  const link1 = link("link 1", guess.A, guess.C, linkBands[0]);
  const link2 = link("link 2", guess.B, guess.D, linkBands[1]);
  const pins = (l: typeof link1) => l as unknown as { a: Node; b: Node; along: Node[] };

  // What holds as it opens.
  const hinge = {
    // (A four-bar: its links apart, not one on the other.)
    "arm's pivots apart": must(atLeast(dist(A, B), mm(8))),
    "cup's pivots apart": must(atLeast(dist(C, D), mm(6))),
    // (The arm round its pivots out of the side: inside it, or in front of its face.)
    ...Object.fromEntries(armOutline.slice(2).map((p, k) => [`arm at ${k + 1} out of the side`, must(atLeast(max(p.x, p.z!), mm(0)))])),
    drive: must(is(turn, mul(open, deg(110)))),
    shut: open.at(0, must(is(du, mm(0))), must(is(dv, mm(0)))),
    "link 1 on the arm": must(coincide(pins(link1).a, A)),
    "link 1 in the cup": must(coincide(pins(link1).b, C)),
    "link 2 on the arm": must(coincide(pins(link2).a, B)),
    "link 2 in the cup": must(coincide(pins(link2).b, D)),
  };
  // The door's hinged edge clear of the side: in front of its face, or past its outer face.
  const corner = (k: number) => {
    const [x, , z] = placeIn((door as unknown as { corners: Node[] }).corners[k], self);
    return must(atLeast(max(z, sub(mm(-T), x)), mm(0)));
  };
  // Nothing of the hinge in the door's wood outside its bore: along each link, and round the arm's end.
  const clearOf = Object.fromEntries([
    ...[link1, link2].flatMap((l, i) => pins(l).along.map((p, k) => [`link ${i + 1} at ${k + 1} clear`, must(atLeast(clear(p, door, halfWidth(5.5, linkWidth / 2)), mm(0)))])),
    ...armOutline.slice(2).map((p, k) => [`arm at ${k + 1} clear`, must(atLeast(clear(p, door, halfWidth(cheeks[1], 0)), mm(0)))]),
  ]);
  return { open, du, dv, turn, door, side, arm, plate, link1, link2, ...hinge, "door's back corner clear of the side": corner(0), "door's front corner clear of the side": corner(3), ...clearOf };
});
