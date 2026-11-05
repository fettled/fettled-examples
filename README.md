# fettled examples

Examples for [fettled](https://app.fettled.xyz): things that are built, written as part scripts in TypeScript. Each
is checked as it is drawn: how its members meet, what carries what, and whether it holds.

To try one, open it in the app at [app.fettled.xyz](https://app.fettled.xyz), which comes with these examples. You can
also add this repository there from the projects page. The app runs and checks the scripts. They import `fettled`,
which the app provides, so outside it an editor will not find that module.

There is a folder for each topic. Each example in it is a part file of its own, whose default export is its part. It
opens by itself, as any part does, and it can be copied out to start from. The folder's `model.ts` sets them all side
by side, so opening the folder shows the whole topic. It imports each example and places it, as a project's model does
its parts.

| Topic | What its examples show |
|---|---|
| [joinery/](joinery) | How members meet: butt, cope, mitre, lap, housing, birdsmouth, mortise and tenon, tube onto timber |
| [walls/](walls) | Walls as legs (`fettled/walls`), each made of its build-up (framing, sheathing, gypsum board, siding, a brick veneer): a shed, an L, a lean-to, a shed clad in brick and siding |
| [floors/](floors) | A second storey, a stairwell, an open-web floor, what a floor and a roof are made of |
| [roofs/](roofs) | Hips, valleys, a dormer, a girder truss, trusses of your own, the truss types |
| [as-built/](as-built) | Taped, surveyed, scanned or already made, and the rest found to suit (and the table library) |
| [sheet/](sheet) | A folded bracket (a library part, as another model includes one), a sheet bracket on a T-slot rail, welded seams |
| [volumes/](volumes) | Extrusions ended on faces, a revolve, a sweep, a loft, a carve, a clearance, sweeps bent round their corners (a downpipe, a cable), ribbon cables bent without stretching (laid by hand, found from where they plug in, and connected board to board) |
| [mechanisms/](mechanisms) | A four-bar linkage (doors and drawers opening until they meet something: cabinets/) |
| [cabinets/](cabinets) | Frameless kitchen cabinets (`fettled/cabinets`): slab, shaker and glass fronts, doors and drawers through their ranges, a run under a counter |
| [products/](products) | The building products of the tables (`fettled/products`): bricks and blocks, sheet goods, tiles, sidings and trims |

There are also whole things, each a file (with its sidecars, where it has them):
- [garage-as-built.ts](garage-as-built.ts);
- [garage-truss.ts](garage-truss.ts), fitted to tapes, with its shape in [garage-truss-shape.ts](garage-truss-shape.ts);
- [bike.ts](bike.ts), [road-bike.ts](road-bike.ts) and [kids-trike.ts](kids-trike.ts);
- [pickup-truck.ts](pickup-truck.ts), [photo-toy-brick.ts](photo-toy-brick.ts) and
  [a-roof-fitted-to-a-photo.ts](a-roof-fitted-to-a-photo.ts), each fitted to photos;
- [site-template.ts](site-template.ts), a site's criteria to fill in.

[parts/](parts) has parts read from 3D models.

The photos the photo examples are fitted to are not copied here. Each script links its photo on Wikimedia Commons, and
says the licence that photo is under. Products named in the scripts are named only to say what is modelled.

The examples are under the MIT licence ([LICENSE](LICENSE)).
