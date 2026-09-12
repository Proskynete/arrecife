# § 60 · The fin can follow the theme, and the explicit value stays for fixed backgrounds

**Release:** 0.11.0 · [index](README.md)

---

**System rule:** «Dos variantes obligatorias: la aleta a dos azules sobre fondo
claro, y la silueta en espuma #EDF4F3 a una tinta sobre fondo oscuro.» `Isotype`
makes it a prop, and the audit in [`README.md`](README.md) lists «`Isotype` with a
mandatory `background`» among what was deliberately left alone.

**What the code did:** `background: 'dark' | 'light'`, defaulting to `dark`.

**What was wrong with it.** It is right when the background is fixed and it has
no answer for one that is not. On a site that switches theme, the call site has
to know which theme is on — and on the server nobody does — and when it guesses
wrong the mark does not look wrong: it is not there. No error, no warning, no gap
in the layout.

`cursos` had that happen when a surface changed mode. Its fix was to stop using
`Isotype`: `components/brand/logo.tsx` draws the same two PNGs, copied out of this
package by its own script, and lets `dark:hidden` and `hidden dark:block` choose.
It was not avoiding the library, it was avoiding the API.

**What it is now:** a third value, `auto`, on `Isotype` and on `Logo`. It
renders both fins. The foam one takes `light:hidden` and the two-blue one takes
`not-light:hidden`. The default is still `dark`.

**Why `light:` and not the `dark:` that `cursos` wrote.** In this system dark is
the default and it is declared by NOTHING: `dark:` only matches a declared
`data-theme="dark"`, so on a page with no attribute — dark by definition — a
`dark:hidden` never fires. `cursos`'s version works because `cursos` redefines
`dark` as its own `.dark` class. The library's has to read the library's
contract. In `cursos`, which is dark and declares no `data-theme`, `auto` shows
the foam fin, which is right; if it ever gets a light mode, it has to declare the
attribute for the tokens to switch anyway, and the fin comes with them.

**Why `not-light:hidden` and not `hidden light:block`.** `ThemeToggle` uses the
second form for its two icons. Here the visible fin keeps whatever `display` the
call site gives it. `scripts/theme-css.test.mjs` checks that Tailwind can
negate `light:` at all: if the variant ever became a form `not-` cannot turn
inside out, `not-light:hidden` would compile to nothing and both fins would show.

**Why it is not the default.** Because the explicit value is still the right
answer wherever the background is fixed — print, OG, a panel that keeps its mode
— and because `auto` has a limit that the explicit values do not. Custom
properties resolve to the nearest `data-theme`, which is how `CodeBlock`'s
island works. Variants do not: `light:` matches any descendant of a light
`data-theme`, even inside a dark island below it. So `auto` inside a dark panel
on a light page picks the page's fin. `ThemeToggle` has always had the same
limit. The one island in the system is `CodeBlock` and nobody puts a fin in a
code block; the brand catalogue's preview cards are islands too, which is why
the `auto` card there declares no theme. Making `auto` the default would also
put a second `<img>` into every existing call site.

**Why it is its own type.** `IsotypeBackground` is `Background | 'auto'` and
`Background` itself does not change, because the OG templates read `Background`
and Satori has no CSS to resolve `auto` with. A template knows its mode and has
to say it.

**What it costs, named.** The hidden fin is still downloaded — 14 KB or 21 KB.
With `auto` the props land on both `<img>`, an `id` or a `ref` included, so a
call site that has to reach THE image passes the background it is on. The `alt`
does not double: an image with `display: none` is out of the accessibility tree.

**Action in the document:** the manual's rule is two variants, one per
background. Add that on a surface that switches theme the mark carries both and
the theme picks, and that the explicit choice is for backgrounds that do not
switch. The checklist line «La aleta usa la variante correcta para el fondo»
stays true as written.
