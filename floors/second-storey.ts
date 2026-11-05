// A second storey: walls standing on a floor.
//
// A storey is stacking, not a number. The ground floor's walls stand at nothing; the floor rests on their top, its
// deck of 23/32" plywood over its joists; the upper walls stand on its deck; Fink trusses sit on the upper walls. Each
// is joined to what it rests on (`join(f.underside, ground.top)`, `join(upper.base, f.top)`): nothing above the ground
// floor is given a height, each slides up and down only and is found where it rests. Make the lower walls taller, or
// the joists deeper, and everything above goes up with them.
//
// Walls 12' by 16' (their outsides), 8' tall, of 2x4 at 16"; the floor's joists 2x10 at 16" along the 12'; the trusses
// across the 12', 6 in 12, 12" past the walls, every 24". The floor's dead load 10 psf (its deck's weight in that,
// weighed as its sheets) and live load 40 psf.

import { part, node, free, plane, support, areaLoad, cases, layers, placed, joints, frame, join, add, sub, div, lumber, nominal, DFL, inch, ft, mm, psf } from "fettled";
import { floor, fink, joists } from "fettled/framing";
import { row } from "fettled/runs";
import { perimeter, framing } from "fettled/walls";
import { sheets, panels } from "fettled/products";

const stud = lumber(nominal["2x4"], DFL.No2);
const joist = lumber(nominal["2x10"], DFL.No2);
const [wide, deep, height] = [ft(12), ft(16), ft(8)];
// (A storey of walls on their outsides' corners, where it stands.)
const storey = (name: string, at?: ReturnType<typeof placed>) =>
  perimeter(name, { corners: [node(0, 0, 0), node(wide, 0, 0), node(wide, deep, 0), node(0, deep, 0)], legs: { height, build: [framing(stud, { spacing: inch(16) })] }, at });

export default part("a second storey", () => {
  const ground = storey("ground");
  // The floor: its joists along the 12' (its y along the walls' x, its x back from the far end), sliding up and down
  // to rest on the ground floor's walls; its deck over them.
  const f = floor("floor", { width: deep, length: wide, at: placed({ origin: [0, deep, 0], x: [0, -1, 0], y: [1, 0, 0] }), build: [panels(sheets.ply23_32), joists(joist, { spacing: inch(16) })] });
  // The upper walls: standing on the deck. (How far they rise, for the trusses on them.)
  const lift = free(mm(0));
  const upper = storey("upper", placed({ joint: joints.slider([0, 0, 1], lift) }));
  // The trusses: each across the 12', its heels at the walls' outsides, its bottom chord's underside on the upper
  // walls' plates; its pieces centred on its line, every 24" along the 16'.
  const roof = part("roof", (r) => {
    const lines = row(deep, inch(24), stud.thickness);
    const z = add(lift, height, div(stud.depth, 2));
    const heels = lines.map((y) => [node(0, sub(y, div(stud.thickness, 2)), z), node(wide, sub(y, div(stud.thickness, 2)), z)]);
    const trusses = heels.map((h) => fink("truss", { span: wide, pitch: 6 / 12, overhang: inch(12), stock: stud, at: frame(h[0], { x: h[1], y: r.y }) }));
    return { heels, trusses };
  });
  const slab = [node(0, 0, 0), node(mm(1), 0, 0), node(0, mm(1), 0)];
  return {
    ground,
    floor: f,
    lift,
    upper,
    storeys: [join(f.underside, ground.top), join(upper.base, f.top)],
    roof,
    slab,
    bears: support(plane(slab[0], slab[1], slab[2])),
    // (Its dead load but its deck's, which its sheets weigh: 10 psf in all.)
    dead: areaLoad(f, sub(psf(10), layers(sheets.ply23_32).pressure), cases.dead),
    live: areaLoad(f, psf(40), cases.live),
  };
});
