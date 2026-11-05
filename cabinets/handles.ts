// Handles and knobs (fettled/hardware): each of the tables on a sample board, and the families said by their sizes.
//
// A handle is how it is fixed (a knob on one screw, a pull on two so far apart) and its grip: a knob turned from its
// foot to its top, or a block on a neck; a pull's bar on posts, a bar or rod bent up, across and down (a D pull; an
// arch, bent as round as it can be), or a hood over a flange (a cup pull). Its finish is its material.
//
// Each board is a ¾" MDF slab, a leaf: the handle is fitted in its middle, its pulls across it, screwed from its back by
// a pan head machine screw into each foot (M4, or 8-32 for those tapped so), as long as the board and the foot's tap
// take, in a hole bored at the thread's clearance. The front row is handles said by their sizes, as a script says one
// no table has; the row behind it, the tables' handles.

import { part, placed, plane, node, support, mm, inch, materials } from "fettled";
import { threads } from "fettled/fasteners";
import { sheets, panel } from "fettled/products";
import { leaf, mounted, centred, start, end, handles, knobs, pulls, section, type Handle } from "fettled/hardware";

/** A sample board 250 by 150 standing on its edge, its face toward −y, the handle in its middle; `k` boards along,
 *  `row` rows back. */
function board(name: string, h: Handle, k: number, row: number) {
  const slab = panel("slab", sheets.mdf3_4, { width: mm(250), length: mm(150) });
  const all = [start(), end()] as const;
  return leaf(name, {
    width: mm(250), height: mm(150), thickness: sheets.mdf3_4.thickness, x0: "left", y0: "bottom",
    fields: { slab }, pieces: [{ part: slab, x: all, y: all, back: 0, face: 19.05 }],
    fittings: [mounted(h, { across: centred(), up: centred() })],
    at: placed({ origin: [mm(300 * k), mm(300 * row), 0], x: [1, 0, 0], y: [0, 0, 1] }),
  });
}

/** Handles said by their sizes. */
const said: Record<string, Handle> = {
  longBar: pulls.bar({ cc: mm(192), projection: mm(38), bar: section.rect(mm(16), mm(8), { corner: mm(2) }), post: mm(12), overhang: mm(16), material: materials.zincBlack }),
  wire: pulls.d({ cc: inch(3), projection: mm(28), section: section.round(mm(6)), radius: mm(6), thread: threads.UNC8_32 }),
  bigKnob: knobs.round({ d: mm(38), height: mm(30), crown: mm(12), neck: mm(16), foot: mm(22), material: materials.brass }),
  flatArch: pulls.arch({ cc: mm(128), projection: mm(30), section: section.rect(mm(12), mm(5), { corner: mm(1) }), material: materials.stainless304 }),
};

export default part("handles and knobs", () => {
  const floor = [node(0, 0, 0), node(mm(1), 0, 0), node(0, mm(1), 0)];
  return {
    floor,
    ground: support(plane(floor[0], floor[1], floor[2])),
    tables: part("of the tables", Object.fromEntries(Object.entries(handles).map(([k, h], i) => [k, board(k, h, i, 1)]))),
    said: part("said by their sizes", Object.fromEntries(Object.entries(said).map(([k, h], i) => [k, board(k, h, i, 0)]))),
  };
});
