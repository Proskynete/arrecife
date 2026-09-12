# § 44 · The footer's second shape, and why the first one is the default

**Release:** 0.8.0 · [index](README.md)

---

**System rule, twice already:** a component with two shapes is a discriminated
union where what was written before does not move. `EmptyState` has `page` as the
default and `inline` cannot be handed a face; `Nav` has `size`, with `default`
being the bar it always was.

**What stayed:** `Footer` takes `variant="full"`, and passing nothing renders
exactly what it rendered before.

**The default is not a preference, it is a count.** Three projects draw a footer.
`eduardoalvarez.dev` uses `Footer` in 56 lines and `links` replicates it in a
64-line Astro; both want what was already there. `cursos` wrote 197 lines by hand
and wants more. Changing the default shape would have broken the two that work to
serve the one that did not.

**What the full shape does that the default cannot express**: two blocks side by
side instead of stacked rows; columns with a mono heading in small caps; a
description under the brand; an action under the row of icons; and a signature
that is a link on the domain. And the columns are not a sitemap — two of the
three in `cursos` change with who is looking, «Administración» with panel and
metrics for an admin against «Cuenta» with my courses and my diplomas for
everybody else. A flat row of nine links cannot say that, which is why `columns`
is data the project builds and not a `children` the library walks.

**The union is what holds it up.** `columns`, `description`, `action` and
`linkAsChild` exist only on `full`. As loose optional props they would compose
into a third shape nobody designed and nothing describes: a footer with columns
and no description, or a description with no columns, laid out by whichever branch
happened to run.

**Where the signature goes, and the backlog was wrong about it.** The entry
described `cursos` as putting the signature above the block of columns, aligned
right, and said it came tested. `components/site-footer.tsx` does not do that: it
closes the footer with it, on its own row behind a hairline, centred below `sm`
and right-aligned above. The code is the reference — the entry says so itself —
and the code wins. It also happens to be the right answer for the documented
reason: in the default form the signature hangs off the first row that exists, and
with three columns above it that rule puts a 13px prompt level with a heading,
which is the sinking problem arrived at from the other end.

**`linkAsChild` is § 24's rule where it now bites.** A column turns data into
markup, so without a slot those links are reachable from a project only by
structure or by a style class, and a router's `Link` cannot be plugged in at all.
Same signature as `Breadcrumb`'s and `ArticleCard`'s, on purpose.

**Action in the document:** add the full footer to the footer's specification —
the two blocks, the columns with their mono heading, and the signature closing the
piece behind a hairline. Note that it is a second shape and not a replacement.

---
