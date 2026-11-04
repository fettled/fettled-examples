// Mechanisms: each example of the topic set side by side. Each is a part of its own, a file in this folder,
// which opens by itself (as any part does) or may be copied out to start from.
//
// Things that move: a linkage closed by its lengths and angles, and joints with ranges, each opened until what
// moves first meets something on the way.

import { part, place, placed, mm } from "fettled";
import fourBar from "./four-bar";

export default part("mechanisms", {
  fourBar: place(fourBar, placed({ origin: [mm(5), mm(6), 0] })),
});
