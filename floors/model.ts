// Floors: each example of the topic set side by side. Each is a part of its own, a file in this folder,
// which opens by itself (as any part does) or may be copied out to start from.
//
// Floors, and what stands on them: a beam on posts, a loft on a beam, a second storey, a stairwell, an open-web
// floor, and what a floor and a roof are made of (fettled/framing).

import { part, place, placed, mm } from "fettled";
import beamOnBeam from "./beam-on-beam";
import loftOnABeam from "./loft-on-a-beam";
import secondStorey from "./second-storey";
import stairwellAndStairs from "./stairwell-and-stairs";
import whatAFloorAndARoofAreMadeOf from "./what-a-floor-and-a-roof-are-made-of";
import openWebFloor from "./open-web-floor";

export default part("floors", {
  beamOnBeam: place(beamOnBeam, placed({ origin: [mm(44), mm(914), 0] })),
  loftOnABeam: place(loftOnABeam, placed({ origin: [mm(4527), mm(0), 0] })),
  secondStorey: place(secondStorey, placed({ origin: [mm(10510), mm(0), 0] })),
  stairwellAndStairs: place(stairwellAndStairs, placed({ origin: [mm(0), mm(6877), 0] })),
  whatAFloorAndARoofAreMadeOf: place(whatAFloorAndARoofAreMadeOf, placed({ origin: [mm(5982), mm(6877), 0] })),
  openWebFloor: place(openWebFloor, placed({ origin: [mm(0), mm(13754), 0] })),
});
