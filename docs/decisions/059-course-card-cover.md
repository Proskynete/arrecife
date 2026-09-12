# § 59 · The course card takes a cover and a closing row, and the title stays off the cover

**Release:** 0.11.0 · [index](README.md)

---

**System rule:** rule 6 — «a card's hover changes the border from hairline to
hairlineHover and nothing else». And contrast is measured, not estimated.

**What the code did:** `CourseCard` took `title`, `summary`, `meta`, `status` and
`progress`.

**What was wrong with it.** `cursos`'s catalog card — the one on the home page
and on `/cursos` — draws four more things, and none of them had anywhere to go:
the cover, the average rating with stars and a count, the price in its currency,
and the programs the course belongs to. Migrating meant losing all four, so
`cursos` kept 126 lines in parallel with a component that did most of the same,
and wrote down why in `components/catalog/course-card.tsx`.

**What it is now:** two slots.

- `media`, at the top and bleeding to the card's edges. The card clips it to its
  own corners.
- `footer`, the closing row under `meta`. It sits at the bottom of the card, so a
  grid's price rows line up however long each summary is.

The programs fit in `meta` as it is.

**Why slots and not a cover URL, a rating and a price.** None of the three is
the identity's. The price comes formatted in a currency, and the library imposes
no locale — the same reason it takes dates already formatted. The rating is
drawn by a component the project already has. The cover is an image pipeline:
`next/image` in one project, a generated cover when there is no image. What IS
the identity's stays in the component: the title's scale and its hover, the sand
bar, the status badge.

**Why the title does not go over the cover.** `cursos` draws it in white on a
`from-black/85` gradient laid over the image. That is text on a photograph, and
its contrast depends on the photograph: it cannot be measured once and recorded,
and measuring is the only way contrast is decided here. It also sits outside the
tokens — `black` is not in the palette — and the card's hover, which turns the
title to accent, would be happening on top of a picture. The title stays in the
body at `h3`. When `cursos` migrates this is the visible difference, and it is
deliberate.

The same goes for its arrow, which moves `translate-x-0.5` on hover: rule 6 says
nothing moves. The cover does not zoom either.

**How the bleed is built, and what it costs.** The padding stays on the shell,
like every other card, and the cover cancels it with `-mx-step-lg -mt-step-lg`.
`overflow-hidden` goes on the shell only when there is a cover: it is what
rounds the cover's corners, and it clips the content and not the `<a>`, so the
focus ring — an outline three pixels outside — still shows. Measured in
Chromium: the cover spans exactly the card's box minus its 1px border, in both
modes. The trade is that a call site overriding the card's padding through
`className` moves the cover off the edge. The alternative was padding that lives
on the shell without a cover and on an inner box with one, which is two places
for the same thing.

**One type detail.** `<a>` has an HTML attribute called `media`, a string, and
intersected with the slot it made the slot accept only strings. It is left out of
`CourseCardProps`: no browser acts on it on an `<a>` and no project was passing
it.

**Checked before adding, as the backlog asked:** `blog-content-manager` has no
card of this shape — its one card with an image, `SlideCard`, is an Instagram
slide editor. So these slots have one consumer with a real case. For a component
that is already in, that is the bar: [§ 39](039-table-surface.md) turned down a
prop because nobody needed it, and here somebody does.

**Action in the document:** the design system has no course card with a cover.
Add one, and write down the two rules it carries: the title goes in the body and
not over the image, and the cover does not move on hover.
