// Joinery: each example of the topic set side by side. Each is a part of its own, a file in this folder,
// which opens by itself (as any part does) or may be copied out to start from.
//
// How members meet: the shape of each joint (a butt, a cope, a mitre, a lap, a housing, a birdsmouth, a mortise
// and tenon) apart from how it is fastened, and that the shape does not ask what the members are (docs/joinery.md).
//
// (Each is analysed as it says, side by side as alone: the cope and the tube onto timber as frames, the rest carried
// down.)

import { part, place, placed, mm } from "fettled";
import butt from "./butt";
import cope from "./cope";
import miter from "./miter";
import lap from "./lap";
import housed from "./housed";
import birdsmouth from "./birdsmouth";
import tubeOntoTimber from "./tube-onto-timber";
import mortiseAndTenon from "./mortise-and-tenon";

export default part("joinery", {
  butt: place(butt, placed({ origin: [mm(44), mm(44), 0] })),
  cope: place(cope, placed({ origin: [mm(1908), mm(-14), 0] })),
  miter: place(miter, placed({ origin: [mm(3453), mm(44), 0] })),
  lap: place(lap, placed({ origin: [mm(5037), mm(0), 0] })),
  housed: place(housed, placed({ origin: [mm(19), mm(1489), 0] })),
  birdsmouth: place(birdsmouth, placed({ origin: [mm(1781), mm(1406), 0] })),
  tubeOntoTimber: place(tubeOntoTimber, placed({ origin: [mm(2991), mm(1299), 0] })),
  mortiseAndTenon: place(mortiseAndTenon, placed({ origin: [mm(4854), mm(1299), 0] })),
});
