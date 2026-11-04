// Products: each example of the topic set side by side. Each is a part of its own, a file in this folder, which opens
// by itself (as any part does) or may be copied out to start from.
//
// The building products of the tables (fettled/products): bricks and blocks, sheet goods, tiles, and profiles
// (sidings, panelling, soffits, trims), each with its source, of a material of the tables, weighed by its body and
// drawn as its material looks. They are what the walls' build-ups, brickwork, siding and cabinets are made of.

import { part, place, placed, mm } from "fettled";
import bricksAndBlocks from "./bricks-and-blocks";
import sheetGoods from "./sheet-goods";
import tiles from "./tiles";
import profiles from "./profiles";

export default part("products", {
  bricksAndBlocks: place(bricksAndBlocks, placed({ origin: [0, 0, 0] })),
  sheetGoods: place(sheetGoods, placed({ origin: [0, mm(700), 0] })),
  tiles: place(tiles, placed({ origin: [0, mm(1500), 0] })),
  profiles: place(profiles, placed({ origin: [0, mm(2300), 0] })),
});
