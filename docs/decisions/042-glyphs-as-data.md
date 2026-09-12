# § 42 · The glyphs are data, and the tenth one is ours

**Release:** 0.8.0 · [index](README.md)

---

**System rule:** a consumer that mounts no React still consumes the system.
`./variants` publishes the class vocabulary for it and the brand catalogue
publishes the PNGs as data. The glyphs published only as React components.

**What stayed:** `src/social/data.ts` holds every shape, imports nothing and is
published at `@eduardoalvarez/arrecife/social/data`. The React components are
drawn from it. A `Website` glyph joins the catalogue, taking it to ten.

**The gap was the library's own blind spot.** `links` has zero dependencies on
`react`, `react-dom` or `@astrojs/react`; its four components are `.astro` and
its `check:replica` fails the build when its class vocabulary drifts from the
package's. What it could not replicate was a SHAPE, so `SocialGlyph.astro`
carried four `<path d="…">` pasted by hand — and `cursos` had six of them in its
footer until 0.7.0. Hand-pasted vector paths going stale across projects is
precisely the failure the highlighting palette taught, happening inside the one
consumer the library had no answer for.

**The shapes are structured, not a blob of markup.** Both renderers have to walk
them: JSX needs elements and `socialSvg` needs text, and neither is derivable
from the other without parsing. Three tags cover the whole catalogue — `path`,
`circle` and `rect` — and a fourth is a decision, not a refactor.

**Each glyph is exported on its own as well as in the record**, and that is not
API noise. `index.tsx` names the individual consts, so `import { LinkedIn }` still
costs one shape and not ten; reaching for `socialGlyphs` or for `socialSvg` names
all of them and is honestly the price of iterating a catalogue.

**The `kind` travels with the shape.** It used to be a choice between two wrapper
components in `index.tsx` — `Brand` or `Functional` — and picking the wrong one
was a one-word mistake nothing would have caught. Whether a mark is somebody
else's silhouette or a symbol the system draws is a fact about the mark.

**The tenth glyph.** The footer of `cursos` links to the personal site next to six
brand marks, and a personal site is not a social network: none of the nine fitted.
It borrowed Phosphor's `Globe`, and the problem was never that the glyph is
stroked — this catalogue draws four of its ten with a line, and the blog's footer
already mixes `Email` and `Rss` in among the brands. The problem is that an
outside set brings its own weight and its own margins. `Website` is drawn to this
catalogue's proportions: r 9.25 leaves the 2.75 of margin `Email`'s rectangle
leaves, and the meridian bulges to 37 % of the sphere's half-width, which is what
keeps it from reading as a vertical line at 19px.

**Action in the document:** add `Website` to the social set, as the fourth
functional glyph. Note that the set is now ten and that the shapes are published
as data as well as as components.

---
