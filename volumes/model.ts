// Volumes: each example of the topic set side by side. Each is a part of its own, a file in this folder,
// which opens by itself (as any part does) or may be copied out to start from.
//
// Solids beyond members and plates: an extrusion ended on a face, a revolve, a sweep, a loft, a block carved by
// another, and a clearance kept between faces (docs/volumes-plan.md).

import { part, place, placed, mm } from "fettled";
import bracketExtrudedToAPlate from "./bracket-extruded-to-a-plate";
import wheelOnAnAxle from "./wheel-on-an-axle";
import railSweptAlongAPlate from "./rail-swept-along-a-plate";
import taperedPlinth from "./tapered-plinth";
import wheelWell from "./wheel-well";
import clearance from "./clearance";

export default part("volumes", {
  bracketExtrudedToAPlate: place(bracketExtrudedToAPlate, placed({ origin: [mm(1), mm(0), 0] })),
  wheelOnAnAxle: place(wheelOnAnAxle, placed({ origin: [mm(116), mm(0), 0] })),
  railSweptAlongAPlate: place(railSweptAlongAPlate, placed({ origin: [mm(171), mm(4), 0] })),
  taperedPlinth: place(taperedPlinth, placed({ origin: [mm(311), mm(20), 0] })),
  wheelWell: place(wheelWell, placed({ origin: [mm(0), mm(110), 0] })),
  clearance: place(clearance, placed({ origin: [mm(101), mm(90), 0] })),
});
