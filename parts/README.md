# Parts from 3D models

The models parts are made from, for the examples beside this folder and the tests:

- [block-m4.step](block-m4.step): a block 20 by 12 by 10 mm with a 4.3 mm hole through it, drawn for these examples
  (its STEP entities laid out as those of Foxtrot's `cube_hole.step`, MIT OR Apache-2.0). It is
  [block-m4.ts](block-m4.ts), beside it, which [sheet-bracket.ts](../sheet/sheet-bracket.ts) bolts a bracket to.
- [wheel-200.obj](wheel-200.obj): a wheel 200 mm across (a solid of revolution drawn for these examples; no maker's
  wheel). The tests make a part of the polyhedron its mesh bounds.

`fettled part` writes a part of the part core from a 3D model, its body exactly where it can be read:

```bash
fettled part parts/block-m4.step parts/block-m4.ts --core 6061-T6
fettled part parts/wheel-200.obj wheel-200.ts --core ABS --units mm
```

Of a STEP file, each of its pieces exactly where it can be read, else its box (said in the file); of an OBJ or an STL,
the polyhedron its mesh bounds. `--units` is what one unit of a mesh is (`mm`, `cm`, `m`, `in`; a STEP file says its
own). `--view` serves the part's folder and says the link to a page of it.
