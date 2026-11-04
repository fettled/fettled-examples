// Two boards and a flat flex between them: each board has a
// socket at one end, and the cable is connected socket to socket.
//
// A board (`board`) is a plate of FR-4, 65 by 30 and 1.6 thick, a hole at each corner to mount it by, and a socket
// for a flat flex 16 wide (`stripSocket`) on its top at one end, its mouth to that end: a strip leaves it along the board's
// x. Two are placed, the second turned to face back at the first, further on and higher, and turned a little about the
// way up. `connect` lays a strip out of the one's socket and into the other's: its pieces are found as near flat and as
// little fanned as that leaves them, none creased. The second board moves (its x, y and z free): drag it, and the cable
// follows.

import { part, node, placed, joints, hinted, stripSocket, connect, extrusion, polygon, circle, materials, mm, deg, cos, sin, type Frame } from "fettled";

/** A board 65 by 30 and 1.6 thick, a socket for a flat flex 16 wide on its top at its +x end, its mouth to that end. */
export function board(name: string, o: { at?: Frame } = {}) {
  const [l, w, t] = [65, 30, 1.6];
  const c = (x: number, y: number) => node(mm(x), mm(y), 0);
  const corners = [c(0, 0), c(l, 0), c(l, w), c(0, w)];
  const holes = [[3.5, 3.5], [l - 3.5, 3.5], [l - 3.5, w - 3.5], [3.5, w - 3.5]].map(([x, y]) => ({ centre: c(x, y), rim: c(x + 1.375, y) }));
  // (Its mouth 2 in from the end, on the middle across; its body 5 deep and thick, on the board's top.)
  const plug = stripSocket("socket", { width: mm(16), deep: mm(5), material: materials.PETG, at: placed({ origin: [mm(l - 2), mm(w / 2), mm(t + 2.5)] }) });
  return part(name, { corners, holes, socket: plug }, {
    at: o.at,
    kind: "solid",
    shapes: [extrusion(polygon(...corners), { holes: holes.map((h) => circle(h.centre, h.rim)), to: mm(t), material: materials.FR4 })],
  });
}

export default part("boards and a cable", () => {
  // (The second turned about the way up to face back at the first, and 15° more.)
  const turn = deg(195);
  const a = board("a");
  // (It moves: its x, y and z free from where it is placed, so it may be dragged, and the cable is found again.)
  const b = board("b", { at: placed({ origin: [mm(165), mm(45), mm(25)], x: [cos(turn), sin(turn), 0], y: [-sin(turn), cos(turn), 0], joint: joints.moves({ x: hinted(mm(0)), y: hinted(mm(0)), z: hinted(mm(0)) }) }) });
  return { a, b, cable: connect("cable", a.socket, b.socket, { thickness: mm(0.3), length: mm(80), pieces: 10, material: materials.ABS }) };
});
