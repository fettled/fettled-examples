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
// it goes into down as it left the camera: connected socket to socket (`connect`), its ten pieces free. Its folds and
// rulings are found for where the sockets are, as near flat and as little fanned as that leaves them, none creased
// (nowhere bent tighter than half its thickness): an S down and out, aside as it goes.

import { part, placed, strip, stripSocket, connect, materials, mm, deg } from "fettled";

export default part("ribbon cables", () => {
  const laid = strip("laid", {
    width: mm(16),
    thickness: mm(0.3),
    length: mm(150),
    pieces: [{ fold: deg(70) }, { fold: deg(-40), to: deg(25) }, { fold: deg(-60), to: deg(25) }, { fold: deg(0), to: deg(-15) }, { fold: deg(80), to: deg(0) }],
    material: materials.ABS,
    at: placed({ origin: [mm(-120), 0, 0] }),
  });

  // (Each socket in the frame of a strip in it: its x the way a strip leaves it. The camera's: the cable leaves it down,
  // across it along x, its top toward −y. The Pi's: the cable goes into it down, so its x is up, across it along x.)
  const camera = stripSocket("camera", { width: mm(16), deep: mm(4), material: materials.PETG, at: placed({ x: [0, 0, -1], y: [1, 0, 0] }) });
  const pi = stripSocket("pi", { width: mm(16), deep: mm(4), material: materials.PETG, at: placed({ origin: [mm(30), mm(45), mm(-70)], x: [0, 0, 1], y: [-1, 0, 0] }) });
  const routed = connect("routed", camera, pi, { thickness: mm(0.3), length: mm(120), pieces: 10, material: materials.ABS });

  return {
    laid,
    camera,
    pi,
    routed,
  };
});
