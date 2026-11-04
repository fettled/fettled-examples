// Ribbon cables, bent without stretching: one laid by hand,
// and one found from where its ends are plugged in.
//
// A strip (`strip`) is a band whose middle is not stretched as it bends: a flat flex, a ribbon cable. It is laid in
// pieces, each exactly a cylinder, a cone or flat: turned by its fold about the straight line across it where it starts
// (its first ruling), its rulings fanning to where it ends. A ruling square across bends it as a sheet bends; one aslant
// bends it round an axis aslant, which twists it as it goes on; rulings that fan turn it aside, as a cone does. Its
// edges are straight in the flat, and where pieces meet they are tangent: no creases, nothing faceted.
//
// The first is laid by hand along a simple way: a bend square across it, a fan that bends it aside, a bend aslant, a
// flat fan, and a bend back square at its end. Each piece is said, so nothing is found.
//
// The second is a camera's cable, 16 wide and 0.3 thick (a Raspberry Pi camera's, fifteen ways at a millimetre), 120
// long: from the camera's socket, down from the bottom of its board, to the Pi's, 70 below, 30 across and 45 out, which
// it goes into down as it left the camera. Its ten pieces are free, and where its end is is said: in the Pi's socket,
// along it and across it as the socket is. Its folds and rulings are found as near flat and as little fanned as that
// leaves them, none creased (nowhere bent tighter than half its thickness): an S down and out, aside as it goes.

import { part, node, placed, strip, coincide, must, extrusion, polygon, materials, mm, deg } from "fettled";

export default part("ribbon cables", () => {
  const laid = strip("laid", {
    width: mm(16),
    thickness: mm(0.3),
    length: mm(150),
    pieces: [{ fold: deg(70) }, { fold: deg(-40), to: deg(25) }, { fold: deg(-60), to: deg(25) }, { fold: deg(0), to: deg(-15) }, { fold: deg(80), to: deg(0) }],
    material: materials.ABS,
    at: placed({ origin: [mm(-120), 0, 0] }),
  });

  // (A socket, in the frame of the cable where it is in it: its x along the cable, its y across, its z up from its top.
  // Its body, 22 across and 5 thick, 4 along the cable: behind where the cable leaves it (`from`), or past where it goes
  // in. The camera's: the cable leaves it down, across it along x, its top toward −y. The Pi's: the cable goes in down,
  // across it along y, its top toward x.)
  const socket = (name: string, origin: [number, number, number], x: [number, number, number], y: [number, number, number], from: boolean) => {
    const [a, b] = from ? [-4, 0] : [0, 4];
    const c = (u: number, v: number) => node(mm(u), mm(v), mm(-2.5));
    const corners = [c(a, -11), c(b, -11), c(b, 11), c(a, 11)];
    return part(name, { o: node(0, 0, 0), ahead: node(mm(16), 0, 0), left: node(0, mm(16), 0), corners }, {
      at: placed({ origin: [mm(origin[0]), mm(origin[1]), mm(origin[2])], x, y }),
      kind: "solid",
      shapes: [extrusion(polygon(...corners), { from: mm(-2.5), to: mm(2.5), material: materials.PETG })],
    });
  };
  const camera = socket("camera", [0, 0, 0], [0, 0, -1], [1, 0, 0], true);
  const pi = socket("pi", [30, 45, -70], [0, 0, -1], [1, 0, 0], false);
  const routed = strip("routed", { width: mm(16), thickness: mm(0.3), length: mm(120), pieces: 10, material: materials.ABS, at: placed({ x: [0, 0, -1], y: [1, 0, 0] }) });

  return {
    laid,
    camera,
    pi,
    routed,
    plugged: { o: must(coincide(routed.end.o, pi.o)), ahead: must(coincide(routed.end.ahead, pi.ahead)), left: must(coincide(routed.end.left, pi.left)) },
  };
});
