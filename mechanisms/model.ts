// Mechanisms: each example of the topic set side by side. Each is a part of its own, a file in this folder,
// which opens by itself (as any part does) or may be copied out to start from.
//
// Things that move: a linkage closed by its lengths and angles, and joints with ranges, each opened until what
// moves first meets something on the way.

import { part, place, placed, mm } from "fettled";
import fourBar from "./four-bar";
import lidAndItsStop from "./lid-and-its-stop";
import drawer from "./drawer";

export default part("mechanisms", {
  fourBar: place(fourBar, placed({ origin: [mm(5), mm(6), 0] })),
  lidAndItsStop: place(lidAndItsStop, placed({ origin: [mm(311), mm(10), 0] })),
  drawer: place(drawer, placed({ origin: [mm(451), mm(0), 0] })),
});
