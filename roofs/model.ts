// Roofs: each example of the topic set side by side. Each is a part of its own, a file in this folder,
// which opens by itself (as any part does) or may be copied out to start from.
//
// Roofs (fettled/roofs, fettled/trusses): hips, valleys, a dormer, a saltbox, raised heels, a girder carrying
// hung commons, a roof over part of a building, trusses of your own, and the standard truss types side by side.

import { part, place, placed, mm } from "fettled";
import hipRoof from "./hip-roof";
import roofThatTurnsACorner from "./roof-that-turns-a-corner";
import dormer from "./dormer";
import saltbox from "./saltbox";
import roofOfParts from "./roof-of-parts";
import raisedHeelTrusses from "./raised-heel-trusses";
import girderTrussCarryingCommons from "./girder-truss-carrying-commons";
import roofOverPart from "./roof-over-part";
import flatRoofOnTrussesOfYourOwn from "./flat-roof-on-trusses-of-your-own";
import trussGallery from "./truss-gallery";

export default part("roofs", {
  hipRoof: place(hipRoof, placed({ origin: [mm(0), mm(0), 0] })),
  roofThatTurnsACorner: place(roofThatTurnsACorner, placed({ origin: [mm(10620), mm(3353), 0] })),
  dormer: place(dormer, placed({ origin: [mm(23272), mm(305), 0] })),
  saltbox: place(saltbox, placed({ origin: [mm(33790), mm(0), 0] })),
  roofOfParts: place(roofOfParts, placed({ origin: [mm(305), mm(12164), 0] })),
  raisedHeelTrusses: place(raisedHeelTrusses, placed({ origin: [mm(13973), mm(11859), 0] })),
  girderTrussCarryingCommons: place(girderTrussCarryingCommons, placed({ origin: [mm(24898), mm(11554), 0] })),
  roofOverPart: place(roofOverPart, placed({ origin: [mm(0), mm(26154), 0] })),
  flatRoofOnTrussesOfYourOwn: place(flatRoofOnTrussesOfYourOwn, placed({ origin: [mm(10315), mm(26746), 0] })),
  trussGallery: place(trussGallery, placed({ origin: [mm(19), mm(36624), 0] })),
});
