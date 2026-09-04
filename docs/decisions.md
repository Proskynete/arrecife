# Decisions · arrecife

What follows are the points where the code and the document do **not** say the
same thing, with the resolution and the reason. In every case on this page the
code wins: these values have to be carried up to the *Design System* and the
*Brand Manual*, not the other way round.

Each entry says what there was, what stayed and why. If one of them is reverted,
it is reverted with a new argument, not by forgetting.

---

## 1 · One control radius

**Document:** `sm 8 · md 10 · lg 12`.
**Code:** `radius.control` (10) at all three sizes.

Stepping the radius by size demands three radius tokens for a two-pixel
difference. A single control radius is easier to defend and much easier to keep
in sync across five projects.

What **was** wrong and got corrected is the horizontal padding, which now comes
from the document: `control.sm 14 · control.md 22 · control.lg 30`. They are in
`tokens.ts` as a group of their own and not inside `spacing`, because 14, 22 and
30 do not compose with 8/12/16/26/40 and must not be offered as loose margins.

**Action in the document:** remove the radius stepping from the button table.

---

## 2 · The card has no surface of its own

**Document:** «card · bg `#0B1620` over trench, or trench over abyss».
**Code:** the card is `surface`, and `#0B1620` does not enter as a token.

A fourth surface level with no light-mode counterpart is a token that lies in
half the projects: the generator emits both palettes, so a key that only exists
in `dark` keeps the dark value when the page is in light mode. The document does
not give the light equivalent either.

What **was** wrong and got corrected is the padding: the document's cards carry
26 (`lg`) and `CardHeader` was setting 16 (`md`). It changed in `Card*` and in
the three domain cards.

**Action in the document:** delete `#0B1620` from the cards section.

---

## 3 · The alert's radius

**Document:** `r12`.
**Code:** `radius.card` (14).

12 is none of the system's five radii (`chip 6 · control 10 · card 14 · panel 16
· pill 999`). Between introducing a sixth radius for one piece and using the card
one — which is what an alert is: a block of surface with content — the card one
wins.

**Action in the document:** change `r12` to «card radius» in the alerts section.

---

## 4 · The alert tint in light mode

**Document:** «background at 8 % of the semantic color, border at 22 %»,
calculated over abyss. The audit suspected that over paper the 8 % would be
invisible and that a second table would be needed for light mode.

**Measured.** Contrast of the tint against the page background:

| tone | 8 % dark | 8 % light |
|---|---|---|
| accent | 1.149 | 1.106 |
| success | 1.116 | 1.121 |
| warning | 1.126 | 1.109 |
| error | **1.067** | 1.120 |

Light mode does **not** need a second table: it holds up as well as or better
than dark across all four tones. The suspicion ran the other way round.

The system's only weak point is `error` over abyss, 1.067, the faintest of the
eight tints, which leans entirely on the 22 % border.

**Action in the document:** note that the 8/22 recipe holds in both modes, and
that dark `error` is the edge case.

---

## 4b · The text over the tint cannot be the tint's color

**Found while implementing point 4**, not in the audit. The accessibility suite
in light mode took it down in five stories.

The alert's title and the status badge's text were in the semantic color, on top
of a background at 8 % of that same color. In light mode that can never pass AA:
the light semantics are calibrated to pass **just** over paper, so tinting the
background with them sinks them below 4.5.

| tone | over paper | over its own 8 % tint | `textPrimary` over the tint |
|---|---|---|---|
| accent | 4.55 | **4.12** | 14.82 |
| warm | 4.54 | **4.11** | 14.85 |
| success | 5.80 | 5.17 | 14.63 |
| warning | 4.88 | **4.40** | 14.78 |
| error | 4.87 | **4.35** | 14.64 |

No alpha fixes it: the problem is putting the color on top of itself.

**Resolution:** the tint is a **surface**, so the text on top of it is a text
token. The alert's title goes in `textPrimary` and the semantic color stays where
it is not text — the border and the glyph — which is all the document ever asked
of it. The glyph is decorative and `aria-hidden`, so the 3:1 threshold applies to
it and not 4.5.

The status badge, on top of that, carries a **solid** border instead of the
alert's 22 %: at 13px and two words wide, the border is the only thing saying
which tone it is, and at 22 % it did not get there.

**Action in the document:** note that a semantic color is not a text color over
its own tint, in either mode.

---

## 5 · The mono scale goes to 13, not 12.5

**Document:** metadata mono at 12.5px.
**Code:** `typeScale.meta` at 13px.

`limits.minScreenPx` is 13 and `textMuted` has «never below 13px» written on it.
This scale is exactly where muted metadata gets written — dates, reading minutes,
file names — so putting it at 12.5 would have made its most common use illegible
by half a pixel.

By the same argument the document's other two half-pixels do not get in: the card
excerpt at 15.5 uses `ui` (15) and inline code at 13.5 uses `meta` (13).

**Action in the document:** raise the metadata mono scale to 13.

---

## 6 · The category's border comes from the palette

**Document:** border `#4A3A25`.
**Code:** `warm/28`.

`#4A3A25` is sand at 28 % over abyss (`#4A3C2B`, two points apart in green and
six in blue). A literal hex for what is already a token with alpha is one token
too many, and the literal would have no light-mode equivalent either: the same
rule at 28 % gives dark sand over paper, which is what is wanted.

**Action in the document:** replace the hex with «sand at 28 %».

---

## 7 · The mono tertiary uses the scale, not 14px

**Document:** JetBrains Mono 14px.
**Code:** the button size's scale — `text-ui` (15) on `md`, `text-label` (13) on
`sm`.

It is point 5's argument again: a new step for a one-pixel difference turns the
scale into a list of sizes. The text format (`./action →`) IS part of the variant
and IS in the code.

**Action in the document:** give the tertiary in the control's scale, not in an
absolute size.

---

## 8 · There was no danger button · REVERSED in § 21

> **This rule no longer holds.** `Button` has `destructive` and
> `destructiveOutline` since 0.6.0. The entry stays because the file's contract
> is that a reversal comes with a new argument and not by forgetting — the new
> argument is in § 21. What survives of this one is the half that was right:
> inside an `AlertDialog` the confirm button is still not red.

What it said, and why it said it: none of the document's 987 lines shows a
destructive button, and the system's error lives in the alerts and in field
validation. The `danger` variant that was in the code was deleted, and the exit
was written into the entry — «if the blog admin needs a real destructive button,
it goes into the document **first** and in here second».

That is exactly the road it came back by. The palette was decided outside the
code, and then the variant was written.

**Action in the document:** none — § 21 carries it. This entry is kept for the
route it records, not for anything the document still owes.

---

## 9 · The light gradients are invented

The document gives the two dark gradients and no light ones:

```
hero    linear-gradient(160deg, #091319 60%, #0d2129 100%)
section linear-gradient(150deg, #10202b 0%, #0d2129 100%)
```

They are already tokens (`gradient.dark`), and `#0D2129` lives inside `tokens.ts`
as a private constant of the gradient: it is neither a surface nor a text color,
so it does not enter the palette.

The light ones (`gradient.light`) are composed from the light palette with the
same angles and the same stops, because otherwise the hero goes flat in light
mode. **It is the only thing on this page pending ratification rather than
correction:** they are new values, not a correction to the document.

**Action in the document:** decide the two light gradients — or confirm the
composed ones.

---

## 10 · The badge scale breaks the 13px floor, on purpose

**Document:** category mono 11.5, status sans 12.5/500.
**Code:** `typeScale.chip` (11.5) and `typeScale.tag` (12.5).

`limits.minScreenPx` is 13, and in point 5 of this same page that floor won. Here
it loses, and the difference is what is being measured: the floor protects TEXT —
what you read inside a sentence — and a one-word pill is not running text, it is
a mark. Contrast, which is the part that is not negotiable, is still measured and
still passes AA: plankton 5.57:1 over abyss.

At 13 the three families grew past the size of a small button and outweighed the
title they accompany.

**Action in the document:** none. The document was right.

---

## 11 · The skeleton does move

**Document:** 1.4s linear shimmer.
**Code:** it had it still, with the written argument that «the system does not
animate».

The document wins. It is the THIRD and last motion exception, alongside the
button spinner and the side panel, and all three pass the same filter: they are
feedback about PROGRESS, not about state. A block that is still and a block that
will never load look exactly the same.

It sits behind `motion-safe`, so it switches itself off for anyone who asked for
less motion, and `still` turns it off by hand for long lists — twenty rows
sweeping at once are a strobe, not a load.

**Action in the document:** none, but it would help if the document said there
are three exceptions and which ones.

---

## 12 · The OG fin is not a parameter

The document warns about it itself: «it is the easiest mistake to make in a
generator, because the background is a parameter». Foam in the three dark
templates, two blues in the course one.

In `src/og/templates.ts` the fin is chosen by the template's mode, not by whoever
calls it. It is the same decision as `Isotype` with `background`: there is no way
to ask for the bad combination.

A second detail of the same grid: the mascot is **anchored** to the edge instead
of occupying a column. With the mascot competing for width, the headline was left
with a third of the canvas and truncated mid-word instead of the document's three
lines.

**Action in the document:** none.

---

## 13 · Two radii the document gives outside the scale

`r8` for the player's container and `r12` for the alert. The system's five radii
are `chip 6 · control 10 · card 14 · panel 16 · pill 999`.

The alert uses `card` (point 3) and the player uses `control`, which is the
closest to 8. Neither introduces a sixth radius.

**Action in the document:** give both in radius names, not in pixels.

---

## 14 · The large button goes to 17

**Document:** the three button sizes carry text at 13.5 / 15 / **17**px.
**Code:** `sm` uses `label` (13), `md` uses `ui` (15) and `lg` uses `lead` (17).

The step gets in. What justifies it is not the button: it is that the document
uses 17 TWICE and in different pieces — «lg 15px 30px r12» with 17px text, and
«h1 44/700 · **deck 17px** · context paragraph 15px» on interior pages. One use
would not have justified splitting the gap between `ui` (15) and `body` (18); two
did.

**Action in the document:** none.

---

## 15 · `cn` derives the scales, it no longer repeats them

This is not a divergence from the document: it is a bug that `cn.ts` itself had
predicted and that came true.

`tailwind-merge` does not know Arrecife's scale, and `text-` is ambiguous between
size and color. Undeclared, `text-tag` looks like a COLOR, so in
`cn('text-tag', 'text-text-primary')` the last one wins and the size disappears:
the class stays written in the component and never reaches the DOM.

`cn.ts` maintained the list «by hand and on purpose», and it drifted within a
single session: `stat`, `meta`, `tag`, `chip` and `lead` went into `typeScale`
and not into that list. All five were being dropped in any piece that also asked
for a tone — which is nearly all of them. **The badges rendered at an inherited
16px instead of 12.5**, and `ArticleCard`'s metadata line had been broken since
it moved to `meta`.

Same story with `px-control-*`: not being in the `px` group, it did not conflict
with the tertiary's `px-0` and the CSS order won rather than the intent.

The groups are now derived from `tokens.ts` with `Object.keys`. Adding a step can
no longer be forgotten here, because there is nothing to add here.

**Lesson, and it goes to the team's document before the design one:** a list that
has to be kept in sync by hand with another list ends up out of sync. If it can
be derived, derive it.

**Action in the document:** none. It is an implementation decision and it changes
nothing anyone reads on a canvas.

---

## 16 · Page rhythm carries `step` in the name

**Document:** the spacing scale is `xs 8 · sm 12 · md 16 · lg 26 · xl 40`.
**Code:** the same five values, under the names `stepXs`…`stepXl`.

This is not a disagreement of judgement: it is a name clash with Tailwind, and
the values do not move by a pixel.

In Tailwind v4 the custom property's name **is** the API, and `--spacing-*` does
not only feed `p-*`, `m-*` and `gap-*`: it also resolves `w-*`, `h-*`, `max-w-*`,
`min-w-*`, `max-h-*`, `min-h-*`, `basis-*` and `size-*`, where it **beats** the
`--container-*` scale. Our steps were named exactly like that scale, so in any
project importing `theme.css`:

| Class | Tailwind | With arrecife 0.2.0 |
| --- | --- | --- |
| `max-w-sm` | 384px | **12px** |
| `max-w-md` | 448px | **16px** |
| `max-w-lg` | 512px | **26px** |
| `max-w-xl` | 576px | **40px** |

Redeclaring `--container-sm` and company does **not** fix it: it was tried, and
`--spacing-*` wins anyway. The only way out was for the library to stop using
those names.

The prefix follows the pattern `control` already had — a named group inside
`--spacing-*`, which yields `px-control-md` — so it does not introduce a new
shape: it extends one. `section` goes without a prefix because it clashes with
nothing.

**What to take away, which matters more than the rename:** nothing caught the
bug. Not the build, not the types, not Storybook, not the axe suite in both
modes. It lived in the gap between what the library **publishes** and what the
library **uses**: Arrecife does not write `max-w-sm` internally, so no story
could show it. It was found in production, on `cursos.eduardoalvarez.dev`, with a
hero paragraph coming out one word per line.

Hence the two new defences, and there are two because they are independent lines
of reasoning:

- `scripts/check-tokens-namespace.mjs` fails the build if one of our tokens
  stomps a name Tailwind reserves. The list of names is not written by hand: it
  is read from the installed version's `theme.css`, so a new Tailwind step gets
  detected when the dependency is updated.
- `scripts/theme-css.test.mjs` compiles Tailwind for real with the tokens on top
  and checks what each utility resolves to. It is the repo's first test that
  measures what is published and not what is used.

The guide for the projects consuming the library is in
[`migration-0.3.md`](migration-0.3.md).

**Action in the document:** none about the values. Note in the spacing table that
the utility is `p-step-md`, not `p-md`.

---

## 17 · The hero's pose CAN be centred, on a page that is only that

**Document and code, until now:** «the pose bleeds off the bottom-right corner,
NEVER centred. A centred mascot under a headline is a cover illustration, and
this is a header».

**What stayed:** the rule is still the default — `variant="header"` — and
`variant="centered"` is added alongside it.

The rule was written against the hero of a page with more content below it, and
there it is correct. `links` is not that page: it is centred end to end, it has
nothing else, and the mascot is the protagonist and not the flourish. That
project was not arguing with the rule, **it was skipping `Hero` entirely**, which
is the worst possible outcome: it ended up with a copy of the gradient in another
repository, which is exactly the kind of drift this library exists because of.

A rule with a name can be argued with; a copy cannot. The variant puts the pose
ABOVE the headline and not below it, which is what keeps it out of the case the
rule forbids: it does not close a block of text, it heads one.

**Action in the document:** note the exception and its condition — a full page,
with no content after it — not the variant on its own.

---

## 18 · The chart series palette is not in the document

**Document:** it says nothing. There are no charts in the canvases.

**What stayed:** `tokens.series`, four colors per mode, none of them new.

`cursos` draws metrics with Recharts, and with no token every chart picks its own
colors: it is the highlighting palette failure again, under another name. The
alternative — not putting charts in the library — leaves the problem standing,
because the project is going to draw them anyway.

The four are biolume, sand, `brand.body` and plankton. Three decisions behind
them:

- **Four, not five and not seven.** It is the same criterion as the syntax
  palette, which is also four on purpose: the system communicates with color and
  border, not with chromatic noise. `seriesColor` wraps around past the fourth,
  and two series sharing a color is the correct signal — there are too many
  categories.
- **They are told apart by hue, not by lightness.** Teal, orange, blue and grey.
  Biolume and `success` would have given two nearly identical greens in light
  mode, and two indistinguishable series for anyone who cannot separate red from
  green.
- **`brand.body` belongs here and not in the highlighting**, by the same rule read
  the right way round: the system restricts it to fill and never to text, and a
  chart series is fill. In the highlighting it measured 4.2:1 and stayed out.

The threshold that applies is the graphical-object one, 3:1 against the
background, not the text one. The worst of the eight values is `brand.body` over
paper, 3.9:1.

**Action in the document:** add the series palette and the four-color rule.

---

## 19 · The reading progress bar is not a progress bar

**What stayed:** `ScrollingProgressBar` is `aria-hidden` and has no
`role="progressbar"`.

`Progress` measures a task: there is a total, somebody started it and it is going
to finish. The reading bar measures a POSITION in a document, which is travelled
in both directions and of which there is nothing to complete. Announcing «37 %»
to somebody who already knows where they are in the document is noise, not
information.

It is the opposite decision to `ChartContainer`'s, and it is worth seeing why
they do not contradict each other. There too `aria-hidden` was tried, with the
same argument — «each tick does not tell what the chart tells» — and it was
wrong: the chart **is** the content and it also contains focusable elements, so
hiding it puts focus into something that does not exist for whoever is listening.
The reading bar is not content and has nothing focusable inside it. The suite is
the proof: the version with `aria-hidden` on the chart container took down three
stories with `aria-hidden-focus`.

**Action in the document:** none.

---

## 20 · The accordion DOES animate its height

**System rule:** «no entrance animations». Mistake nº 3 on `AGENTS.md`'s list is
literally «adding an entrance animation because it looks better».

**What there was:** `Accordion` landed in 0.4.0 unanimated, citing that rule, and
noting that Radix publishes `--radix-accordion-content-height` precisely to
animate it and that it was not being used here.

**What stayed:** the height is animated, behind `motion-safe`, with
`--duration-standard` and `--ease-standard`.

The argument that changed the decision is not aesthetic. In a disclosure
**nothing appears**: a gap opens, and everything below the accordion shifts.
Without a transition that shift is a jump of one or two hundred pixels, and
whoever just clicked loses their place on the page — which is exactly the harm
the «no movement» rule exists to prevent. Applying it here turned it against its
own reason.

It is the same category as the second exception, the side panel: «a panel
entering from an edge slides by definition». A disclosure that reveals content
pushes what is below it by definition.

It introduces neither a new timing nor a new curve, and `motion-safe` turns it
off for anyone who asked for less motion: there the panel still appears where it
will stay.

With this one there are **four** declared exceptions: the button spinner, the
side panel, the skeleton shimmer and the accordion. All four are feedback about
PROGRESS or about spatial continuity; none of them is decoration.

**Action in the document:** note the fourth exception alongside the other three.

---

## 21 · There IS a danger button, outside a dialog

**§ 8, and it stood for four versions:** «none of the document's 987 lines shows
a destructive one». `AlertDialog` still documents that its confirm button is not
red, because what communicates the gravity is the text.

**What changed:** the palette was decided, and with it the argument. The variant
is back as `destructive` and `destructiveOutline`.

The old rule was written against a **dialog**, and there it is still correct: a
title explains what is about to happen, focus starts on cancel and clicking
outside does not close it. The context does the work, and a red button on top of
all that is shouting.

It stops being correct in a **table row**. `cursos` has eight destructive buttons
in row actions and toolbars, next to «Editar» and «Duplicar», with nothing around
them doing that work. Rendered as `secondary` — which is where they landed on
migration — «Eliminar curso» looked exactly like «Cancelar», and the only thing
separating them was the word. That is not «the system does not shout», that is
the system not saying anything.

The palette, and it is not `error`:

| | dark | light |
| --- | --- | --- |
| fill | `#F4736B` | `#C0392B` |
| hover | `#F78D86` | `#A32F22` |
| ink | `#2B0A08` | `#FFF6F4` |

`error` is a TEXT color: it has to read against a dark surface, so it sits
mid-red. `danger` is a FILL: what has to read is the ink on top of it, so it goes
lighter. It is the same split as `accent` and `accentOn`. In light mode the two
land on the same hex, and that is not an oversight either — over paper, a red
dark enough to carry white ink is also the red that reads as text.

Measured, not estimated:

| | dark | light |
| --- | --- | --- |
| ink over fill | 6.53 | 5.11 |
| ink over hover | 7.92 | 6.61 |
| fill over background | 6.71 | 4.87 |
| fill over surface | 5.94 | 5.44 |
| fill over surfaceRaised | 4.91 | **4.50** |

The last cell is exactly on the AA line, which is where every light semantic in
this palette already sits. It matters because it is the outline variant's border
and text, and `surfaceRaised` is where a toolbar lives.

**`destructiveOutline` fills on hover, and that is a second exception**, to
«secondary is never filled». It is declared here rather than discovered later: a
destructive that looks identical to a secondary until you read it is the problem
the variant exists to fix. At rest it is still only border and text.

**What was NOT adopted from the specification:** the explicit disabled pair
(`#4A2422` fill, `#8A5F5C` ink). Two reasons, and the second is the one that
decides it. The system has one uniform disabled treatment, `disabled:opacity-50`,
and no other variant carries its own. And the specification only gives the dark
values — a token with no light counterpart is a token that lies in half the
projects, which is exactly § 2. If the uniform treatment turns out not to be
enough for a red, the light pair gets decided and both come in together.

**Action in the document:** add the danger palette and the two variants, with the
rule that they are for the irreversible and never for «cancel».

---

## 22 · A dense icon size, for the one admin app

**Document:** four control sizes — `sm 8/14 · md 12/22 · lg 15/30 · icon 42×42`.
**Code:** the same four, plus `icon-sm` at 32×32.

42 is the right measure for a control you hit with a thumb, and four of the five
projects are reading sites where that fits. `cursos` is the odd one out: it is
the only admin app of the set, with three actions per table row, and at 42 the
row grows with them. Before migrating it used 24 and 28.

**It is 32 and not 28**, which is the number that project actually had. 32 is
`sm`'s height, so a dense icon button lines up with a small text button and a
toolbar mixing the two stays on one baseline. 28 would have been a fifth height
that matches nothing else in the system.

The alternative the backlog proposed — a separate `IconAction` component with its
own scale, on the argument that a row action is not a page button — was not taken
for now. It is probably the better answer and it is a bigger change; a size on
the control that already exists unblocks the eight buttons without inventing a
second vocabulary for the same thing. If the admin grows enough that row actions
start needing their own hover, focus and spacing rules, that is when the separate
component earns its place.

**Action in the document:** add `icon-sm 32×32` to the controls table, with the
note that it is for dense UI and not a replacement for `icon`.

---

## 23 · The footer's caret blinks

**System rule:** «no entrance animations», and the four exceptions are all
feedback about PROGRESS or about spatial continuity. This one is neither, so it
needs a different argument or it does not get in.

**What stayed:** the CLI signature — `$ cd ~/eduardoalvarez.dev/2026` — ends in a
block caret that blinks, behind `motion-safe`.

The argument is legibility, not decoration. The signature is a prompt: that is
the whole point of it being mono, of the `$` being in accent, and of it sitting
in a footer instead of a `<p>` saying «© 2026». A prompt whose caret does not
blink is a terminal that has hung, and a still block at the end of a line reads
as a stray character — several people asked whether it was a typo on the site it
comes from.

So the criterion the other four share splits in two, and this one lands on the
other half: **it is not decoration, it is what makes the piece legible as what it
is.** The spinner says «this is loading» rather than «this is disabled»; the
caret says «this is a prompt» rather than «this is a string with a smudge».

`step-end` and not a fade, and this part is not a detail: a real caret is on or
off. Easing it turns a terminal into a pulsing dot, which is the decoration the
rule exists to keep out. 1.06s is the cadence of a VT100, and of the site this
comes from.

Behind `motion-safe`, where it stays solid. That is a caret at rest and not a
missing one — unlike the skeleton, which loses information when its shimmer goes,
this loses none.

It is `aria-hidden`, for the same reason as the `$`: it is the prompt, not the
text. A screen reader announces the path and stops.

With this there are **five** declared exceptions: the button spinner, the side
panel, the skeleton shimmer, the accordion height and the footer caret. Four are
feedback about progress or continuity; the fifth is legibility. A sixth needs to
land on one of those two, written down, before it exists.

**Action in the document:** add the caret to the footer's specification, and note
that the exception list is now five with two criteria and not one.

---

## 24 · The composed parts are reached with a slot, not with a selector

**Backlog point 10, and it was the only entry left from the original list.**
`ArticleCard` receives `tags` as strings and turns them into badges, so a project
with an E2E suite had no way to reach one: it selected by structure —
`article > div > span` — or by a style class. The second already broke the blog's
suite once, because a style class is not a contract; it changes when the style
changes.

**What stayed:** `tagAsChild`, a slot per part. The library keeps the classes and
the rule — a tag is a category pill, and that does not become negotiable — and
hands over the element and its attributes.

    tagAsChild={({ tag }) => <span data-testid={`tag-${tag}`}>{tag}</span>}

**The two alternatives, and why not.** Documenting the DOM shape as a stable
contract costs no code today and freezes the markup forever: every later refactor
becomes a breaking change, and nothing verifies the promise — it breaks without a
single check noticing. Putting `data-*` attributes in the library is cheaper to
consume and it is test scaffolding shipped in the product: an attribute nobody
renders for a reason, that cannot be removed once a suite depends on it.

**The shape is not new.** `linkAsChild` already had it in `Breadcrumb` and
`TableOfContents`, so this is one idiom for «the project supplies the element,
the library supplies the styling» and not a second one doing the same thing under
another name. It generalises: the next composed part that needs reaching gets a
`…AsChild` with the same signature.

**Where it was not needed.** `Nav` and `SidebarNav` already take their items as
children and export `NavItem` and `SidebarItem`, so the parts were reachable
already. `CourseCard` takes `meta` and `status` as nodes. `ArticleCard`'s tags
were the only genuinely closed part, which is why this is one prop and not a
sweep.

**Action in the document:** none. It is an API decision, not an identity one.

---

## 25 · Projects without React are served by `./variants`

**Backlog point 12** asked for a way out for `links`, which ships no framework
JavaScript and was replicating `LinkRow` and `Footer` in Astro by copying the
class vocabulary. Two options were on the table: export the class strings as
constants, or publish a framework-free subpackage.

**What stayed:** the first one, and only for the classes that carry identity.
`./variants` publishes `buttonVariants`, `badgeVariants`,
`categoryBadgeVariants`, `textVariants`, `alertVariants`, `avatarVariants`,
`CARD`, `CARD_SURFACE` and `CARD_HOVER`, with no React.

**What is deliberately NOT in it:** the layout classes of each component —
`px-step-md py-step-sm`, `max-w-wide`, `gap-[18px]`. Those are what `links` still
copies, and copying them is fine. What drifts is identity: color, radius,
gradient, hover. That is what happened the one time it did drift — the hero
gradient sat at `55%` and `#e9eeea` against the token's `60%` and `#EFE9DE` — and
all of it is importable now.

Pulling the layout out too would mean a second list of constants kept in step
with the component by hand, with nothing verifying they match. That is § 15
exactly, and § 15 is the entry that says a list maintained by hand against
another list ends up out of sync.

**Per-component subpaths** — `@eduardoalvarez/arrecife/link-row` and company —
stay unbuilt. They solve a different problem, the one the backlog measured when
`ScrollingProgressBar` added 332 KB by being hydrated from the barrel, and
`./variants` takes most of the urgency out of it: what a project usually wants to
import on its own are the classes, not the component. If a hydrated island
actually needs one component and pays for thirty, that is when they earn their
thirty-odd `tsup` entries.

**Action in the document:** none.

---

## 26 · The social icons are published twice, and they are not two ways of writing the same import

**What there was:** one export, `export * as social` from the root, with the
reason written above it — one of the nine is called `X`, and an `export const X`
at the root of a component library collides with anything.

The reason was right and it stays. What was missing is that it only ever
considered the NAME, and the shape turned out to matter more.

**What broke.** `blog-content-manager` swapped its two hand-drawn brand SVGs for
the library's and the Next build died at prerender:

```
Error: Element type is invalid: expected a string (for built-in components)
or a class/function (for composite components) but got: undefined
Error occurred prerendering page "/"
```

The component behind it is a **Server** Component rendering
`<social.LinkedIn className="h-6 w-6" />`.

**It is not the `"use client"` bug, which lands in this same release.** That one
was the published `dist` not carrying the directive at all, so Next evaluated
Radix on the server. This is the opposite side of the same boundary: the directive turns the MODULE into a client module, but
what crosses into a Server Component is a client reference **per export**. The
properties of a plain object are not exports, so from the server `social` is one
reference and `social.LinkedIn` is `undefined` — and `undefined` as an element
type is exactly the error above.

It only shows up in Next with the App Router. In Astro the frontmatter resolves
at build time and there is no boundary to cross, which is why
`eduardoalvarez.dev` has been rendering `social.GitHub` in its footer without
noticing.

**What stayed:** a subpath of its own, `./social`, with the nine icons loose —
and the root keeps the namespace, unchanged.

The backlog asked only for the loose exports, at the root, beside the namespace.
That fixes the name resolution and **not the problem**: the root carries
`"use client"`, so a Server Component importing a loose `LinkedIn` from it still
opens a client boundary — for two `<svg>` with no state — and pays for the whole
barrel to get there. The subpath is what actually fixes it, because it carries no
directive: the icon renders on the server and ships no client JS. Measured on the
built `dist`, `./social` pulls 5.6 KB and imports nothing but
`react/jsx-runtime`; the root is 116 KB.

So the two are not redundant and the documentation does not present them as
taste:

| Form | When |
| --- | --- |
| `import { LinkedIn } from '@eduardoalvarez/arrecife/social'` | Always, unless you are iterating the catalogue. Mandatory from a Server Component |
| `import { social } from '@eduardoalvarez/arrecife'` | Iterating the catalogue — a footer that maps its links to `social[name]` |

`X` is still `X` in the subpath, and it still collides. The difference is that
there you asked for icons and the fix is one word: `import { X as XIcon }`. At
the root you asked for the library, and the collision arrives with something you
did not ask for. That is why the namespace does not go away.

**A third category in `check:exports`.** `./social` renders React, so it can
never be portable, and it must not be a client entry either — that is the whole
point. The directive check only looked at `PORTABLE`, so it had nothing to say
about it, and adding it to `CLIENT_ENTRIES` by mistake would have quietly undone
the fix. It now checks every subpath: the directive is on `CLIENT_ENTRIES` and
nowhere else, which is what its own docstring already claimed.

**`lib/` is what is NOT published.** The file moved from `src/lib/social.tsx` to
`src/social/index.tsx`, which is the same rule every other subpath already
follows. It also sharpens the sentence next to it: `lib/glyphs.tsx` stays inside
because `lib/` is the inside, not because somebody remembers to leave it there.

**Action in the document:** none. Nothing about the drawing rule changes — brands
solid, functional at 1.6 stroke, 1em, `currentColor`.

---

## 27 · The empty state has a second shape, and it carries no face

**Document:** `docs/design-system.md` — «estado vacío · una cara a 66px + título
15px/500 + explicación 13.5px muted». `docs/brand-manual.md` § 09 — «Admin del
blog · Solo la aleta. Sin caras salvo estados vacíos».
**Code:** two variants. `page` is the document's, unchanged and still with the
face mandatory. `inline` has no face and the type does not let one through.

**What the count said.** In `cursos` there are 19 files with an empty state
written by hand and 3 that use `EmptyState`. In `blog-content-manager`, 18 by
hand. The admin panel alone holds 20 distinct messages, and reading them is the
whole argument:

> Aún no hay alumnos · No hay entregas pendientes · No hay lecciones en esta
> página · No hay reportes que coincidan · Sin actividad en el rango

None of those is a screen. They are the hole in a table page and the hole in a
dashboard widget, and there are a dozen of them at once. The component asked for
`expression`, so every one of them was written by hand instead — which is exactly
the copy this library exists to delete.

**Why this does not contradict the manual, and where it bends it.** The manual
grants the empty state its face; it does not say that every region labelled
«nothing here» is an empty state. Its sentence about the admin — «no faces except
empty states» — is a limit on WHERE a face may appear on that surface, and it was
written imagining the empty state as an event on a screen. Twelve of them at once
was not the picture. The design system's line is the one that genuinely bends:
it describes one empty state, and now there are two.

The rule the manual is protecting survives intact, and it is the one that
matters: **the humour lives where the reader has stopped evaluating you.** A face
in a table row is not humour, it is a mascot in a spreadsheet.

**Why a union and not an optional `expression`.** The backlog offered both and
the optional prop is the smaller change. It is also the one that fails: an
optional face puts the decision back at every call site, and «decided at every
call site» is what produced 37 hand-written empty states and a `faceUsage` table
nobody was reading. With the union, `variant="inline"` does not accept
`expression` at all — the wrong thing is not a mistake you can make, which is the
same reason `TalkCardProps` is a union.

`page` is the default, so every call site written before this keeps its face and
nothing breaks.

**Why `inline` draws no box.** Every project invented the same one — a dashed
border with a small glyph — and it is not in the system. Two reasons it stays
out. A dashed stroke appears nowhere else, and «it looks better» is not an
argument this repo takes. And the placement makes it redundant: `inline` goes
inside a `Card` or a `Table` cell, both of which already draw the region, so a
second border is noise and a second border in a different stroke is a second
idiom. What makes it quiet is the muted tone and the absence of a surface — not a
smaller size. The type comes from the same scale as `page`, one step down.

The glyph is an `icon?: ReactNode` the project passes and sizes, at 1em and in
`currentColor`, exactly like `Stat`'s. The system still has no icon library.

**A collateral in ESLint.** `no-unused-vars` gains `ignoreRestSiblings: true`.
`const { variant, ...rest } = props` is how a prop is kept OUT of the spread, and
«`...props` is spread» is a rule of the component pattern: a variant that reaches
the DOM is an unknown attribute and a React warning. Without the option the only
way to strip one is a cast, which re-adds every prop the signature just took out.

**A collateral in the stories.** `Where the faces go` was teaching `annoyed` for
the 404 and `confused` for the server error — swapped against `faceUsage` — and
`hearts` for a completed course, where the data says `shades`. The story right
above it says the data exists «so the choice is not made by eye at every call
site». It was being made by eye one story later, in the published Storybook.

**Action in the document:** add the second shape to the design system's empty
state line — «hueco de tabla o widget · sin cara, sin superficie, glifo opcional
del proyecto + línea 15px muted». The brand manual needs no change: its rule is
about where a face may appear, and this adds no place.

---

## 28 · There is a third tone, and two of them are the same sand

**Document:** `docs/design-system.md` — «biolume para lo neutro y arena SOLO
cuando el número es el problema».
**Code:** three tones. `neutral` is biolume, and `alert` AND `achievement` are
both sand.

**What the count said.** `cursos` draws 10 KPI cards and keeps its own component
for them. Two of the ten count diplomas and completed modules. There was no tone
for that, so they were being painted with `alerta`, which gets the colour right —
both lean to sand — and the meaning exactly backwards.

That is the failure this library exists to prevent, arriving from the other side.
The system names by meaning; making «this is bad» the only way to say «this
stands out» is naming by drawing with extra steps.

**Why not `success`.** Two reasons, and the first is already written into
`tokens.ts`: in light mode `success` and `accent` are two nearly identical
greens, which is why the chart series palette skips `success` and picks
`brand.body` instead. The second is that the manual already answers it — § 09
assigns `cursos` «caras en progreso y celebración · arena». Celebration is sand
in this identity, not green.

**Where it bends the document.** The design system says sand ONLY for the
problem case, and «only» is now false. The rule underneath it survives, and it is
the one worth keeping: **sand is for the number that is not just a number.** A 0
of design systems and 248 diplomas are both numbers you are meant to stop on;
neither is a datum like «12 aplicaciones». The document's sentence named one half
of that and the code needed both.

Two names for one colour is not a redundancy, it is the point: the API is the
meaning, the colour is the implementation, and the day the identity gives
celebration its own value there is already a name to hang it on.

**`alerta` → `alert`.** The one public API value the 0.6.0 English sweep did not
reach, and `llms.txt` was publishing it — so an agent reading the document from a
consuming project wrote Spanish into a library that had decided it would not have
any. It is a genuine break, since `Stat` shipped in 0.5.0, and it goes with the
`!` and the footer.

**`delta` is data and `direction` never picks a colour.** The prop could have
been a free `ReactNode` and the project would format it; the data shape exists so
the system can hold one rule. That rule is not «up is green». «+12 alumnos» and
«+12 errores» point the same way and mean opposite things, so the arrow says
which way and `tone` says whether it matters — a judgement the call site has
already made. The glyph is `aria-hidden` and «sube», «baja» or «sin cambio» goes
to the screen reader in its place, because colour and shape are not channels a
screen reader has.

The glyphs are `ChevronUp`, `ChevronDown` and `Minus`, which `lib/glyphs.tsx`
already had. It did not grow: that is the promise it makes.

**`spark` is a slot, and there is no `Sparkline` component.** The backlog said
the sparkline is the piece that brings weight and that `./chart` would be its
home if it entered. It does not enter. The admission criterion is «it encodes an
identity rule, it has two or more consumers, and it drags in no project
infrastructure», and exactly one project draws sparklines — so by the repo's own
rule it is not a component yet. A `ReactNode` slot costs the barrel nothing and
unblocks all ten cards today, which is the same answer `icon` already gives. If a
second project starts drawing them, that is when it earns its place in `./chart`.

**Action in the document:** add the third value to the `Stat` line — «arena para
`alert` y para `achievement`; biolume para lo neutro» — and note that sand covers
both the number that is the problem and the number that is the reward.

---

## 29 · The system adopts Phosphor, and it still ships no icons

**Document:** neither the design system nor the brand manual mentions an icon
set. The only stroke either of them names is the footer's — «marcas en sólido,
funcionales en trazo 1.6».
**Code:** `@phosphor-icons/react` is an optional peer dependency, `./icons`
publishes an `Icon` wrapper, and `lib/glyphs.tsx` is unchanged and still
unpublished.

**The position that no longer holds.** «The system has no icons» was right for
what the library was — five reading sites, where `glyphs.tsx` covers everything a
primitive needs — and it stopped being right when an admin panel arrived. Counted
across the four consumers:

| Project | Distinct | Imports | Used once |
| --- | --- | --- | --- |
| `cursos` | 89 | 229 | 39 |
| `blog-content-manager` | 9 | 9 | 9 |
| `eduardoalvarez.dev` | 0 | 0 | — |
| `links` | 0 | 0 | — |

**The set was never the problem.** Seventy-seven of the 89 are domain icons for a
course admin — `GraduationCap`, `Ticket`, `Webhook`, `FlaskConical` — and no
design system was ever going to ship them. **What was broken is that nobody said
how they should be DRAWN**, so they were sized by hand in five ways: `size-4`
twenty-six times, then `size-3.5`, `size-3`, `size-6` and `size-7`, with no rule
behind any of them.

**Why Phosphor and not a stroke-width set.** Phosphor bakes the weight into the
path instead of exposing `strokeWidth`, and its `regular` lands almost exactly on
the one stroke the document names. Measured on the `Minus` path itself, whose
regular form is a bar of radius 8 on a 256 grid:

| | Line | As a fraction of the rendered size |
| --- | --- | --- |
| phosphor `regular` | 16 on a 256 grid | **0.0625em** |
| the document | 1.6 on a 24 grid | **0.0667em** |
| phosphor `light` | 12 on a 256 grid | 0.0469em |
| phosphor `bold` | 24 on a 256 grid | 0.0938em |
| `lib/glyphs.tsx` | 1.75 on a 16 grid | 0.109em |

Six per cent apart, which is no pixel on any screen. **Nothing had to be derived
and no number had to be invented**: `regular` IS the system's line. That is the
whole argument for this set over one that exposes a stroke width, where the
number would have had to be chosen and defended.

Two independent sources agree on it: the identity document, and the design canvas
the panel was drawn from — its sidebar and its KPI cards are Phosphor at
`regular`.

**`lib/glyphs.tsx` is the outlier, and it is NOT reconciled here.** At 0.109em it
is three quarters heavier than both the document and Phosphor's regular, and it
was never argued anywhere — it is what a 1.75 stroke happens to be on a 16 grid.
Aligning it would restyle every primitive in the library, which is a visible
change to every story in both modes and is its own decision. It is recorded here
so the next reader knows it is a known gap and not an oversight.

**The size is 1em**, which is Phosphor's own default and also the rule every icon
in this library already follows. Beside `text-label` it is 13px, beside `text-ui`
15px, and nobody picks a number.

**In Next, import from `@phosphor-icons/react/ssr` inside a Server Component.**
Phosphor's default build reads `IconContext` through `useContext`, and a hook in a
Server Component throws — and it ships **no** `"use client"` to stop you, so the
failure arrives at render rather than at build. The `/ssr` entry is the same icons
without the context read, and `Icon` works with either. This is better than the
alternative it replaces: an icon set whose every icon is a client component has no
escape hatch at all. It is the same boundary § 26 is about, seen from the side
where there is a way out.

**It is a subpath with an optional peer**, by the rule that already governs
`./form` and `./chart`: a heavy dependency never hangs off the root. The two
projects with zero icons install nothing and pay nothing.

**AN ICON IS NOT ILLUSTRATION, and adopting a set changed nothing about that.**
It is worth writing because the two had never had to be told apart before — until
this entry the library had one kind of drawing in it, and now it has two.

| | Tiburoncín | An icon |
| --- | --- | --- |
| What it is | the mascot: faces, poses, the fin | functional vocabulary |
| Where it lives | `./brand`, and the PNGs in `assets/` | `./icons`, from a third-party set |
| Who decides it | the brand manual, by surface — § 09 | the call site, wherever a control needs a label it cannot spell |
| Where it may appear | empty states, confirmations, errors, course progress, celebration. Nowhere else | anywhere |

Neither substitutes for the other in either direction. An icon does not get to
stand in for a face in an empty state, which is why `EmptyState`'s `page` variant
still demands an `expression` and § 31's `inline` variant takes an `icon` and
refuses a face at the type level. And a face is not a control's label: it carries
tone, not meaning.

The manual's dosage is untouched by any of this. It was written about
illustration and it still governs illustration; a set of functional glyphs is a
category it never described and never restricted.

**Action in the document:** add an icon line to the design system — «iconos de
interfaz · Phosphor a 1em y peso `regular`, que es el mismo trazo 1.6 escrito en
otra retícula · los glifos internos van más pesados y hay que igualarlos».

---

## 30 · `Nav` needed one of the three things the backlog asked for

**Backlog:** `cursos` keeps its own header because `Nav` lacks a `~/` brand
prefix, a user menu, and a 56px height.
**Code:** one new prop, `size="compact"`. The other two were already there.

The entry exists because two of the three asks were wrong, and «we looked and it
was already covered» is worth writing down — otherwise the next reader implements
them.

**The `~/` prefix already exists**, and in a place the backlog did not look:
`Nav` renders it before the section list, `aria-hidden`, in mono muted. What
`cursos` wants is a different placement — `~/cursos` as the WORDMARK — and
`brand` is a `ReactNode` slot, so that composes today with no library change. The
two placements are not a contradiction: the manual's rule is that section titles
take the path format, and both do.

**The user menu is project infrastructure**, which is the third clause of the
criterion that decides what enters here: «it encodes an identity rule, it has two
or more consumers, and it drags in no project infrastructure». A user menu needs
a session, an avatar and a sign-out route. `actions` already takes it, and the
backlog's real complaint — «cada consumidor vuelve a decidir el orden y el
tamaño» — has one consumer, so there is nothing to converge on yet.

**The height was real, and not for the reason given.** `Nav` is 64px and `cursos`
is 56. The backlog framed it as a missing value; the actual defect is that the
height was **not overridable at all**. `h-nav` sits on the inner container and
`className` reaches the `<header>` and stops there, so a project passing `h-14`
got nothing, silently — the same class of failure as `p-md` landing on the
numeric scale. That is why it is a prop.

**56 is not «smaller because it looks better».** At 64 the header of an app shell
competes with the rail beside it for the same corner, and together they eat the
top of the content area. It is the same argument as § 22's `icon-sm`: the one
admin app of the five is denser than the four reading sites, and the answer is a
second value on the control that exists rather than a second component.

**A token, and the line that was missing.** `size.navCompact` went into
`tokens.ts` and did NOT come out of `build-tokens.mjs`, because the `size` group
is written line by line — two of its members are `--spacing-*` and two are
`--container-*`, so it cannot be looped. `h-nav-compact` resolved to nothing and
the bar silently kept its 64. `scripts/theme-css.test.mjs` now asserts the
utility, which is the check that exists for exactly this.

**A story the suite refused.** Showing both heights side by side meant two `Nav`s
on one page, and `Nav` renders the site's `banner` landmark — axe failed it with
`landmark-no-duplicate-banner`, which is the rule the component's own JSDoc
already states. The story was dropped and the reason written into a `Note`.

**Two projects keep their own header, and that is still fine.**
`eduardoalvarez.dev` keeps its by decision — a mascot fin, a two-line logotype,
Algolia search, a mobile drawer, all of it Astro islands — and the backlog
already recorded that no change is needed for it. `cursos` can now be built out
of `Nav`, `brand` and `actions` without one.

**Action in the document:** add the second bar height — «barra · 64px, o 56 en un
shell con barra lateral».

---

## 31 · The neutral number stops being biolume, and the tone moves to the badge

**Document:** `docs/design-system.md` — «biolume para lo neutro y arena SOLO
cuando el número es el problema».
**Code:** a neutral number is primary ink. Sand still paints the number for
`alert` and `achievement`; biolume moved to the icon badge and the sparkline.

**What changed underneath the rule.** That sentence was written for a card with a
number and a label in it — which is what `Stat` was. It now also has an icon
badge and a sparkline, and both of them carry the tone. A biolume number on top
of a biolume badge and a biolume line is the third accent in a card the size of a
postcard, and the thing you came to read stops being the loudest thing in it.

**The half of the rule that matters survives untouched.** `alert` and
`achievement` still paint the NUMBER sand, so sand still means «this number is
not just a number» — the problem, or the reward. What moved is only the neutral
case, and neutral had no meaning to carry: it was biolume because the card had
nowhere else to put the brand colour.

Primary ink is also the best contrast in the card by a distance, and the figure is
the one thing in it that is always read.

**The icon is a badge in the opposite corner**, not a glyph before the title.
That is not decoration either: in a panel row the eyebrow is a different length
in every card, so an inline icon puts the only coloured mark on a different x
each time. Pinned to the corner it lands on a grid, and the row reads as a row.

**The circle is the tint pattern the system already has.** `bg-accent/10` is a
SURFACE and the colour stays on the glyph — that is § 4b, and it is also what
keeps it legal: a glyph is a graphical object at 3:1, where accent over its own
tint does not clear text's 4.5. Nothing new was measured because nothing new was
invented.

**The sparkline is `mt-auto`.** In a grid the cards stretch to the tallest, and a
line that sits wherever the standfirst happens to end turns a row of ten into a
sawtooth. Pinned to the bottom edge of the padding box, the lines share a
baseline across the row.

**Action in the document:** update the `Stat` line — «el número en tinta primaria;
biolume va en el badge del icono y en la sparkline · arena en el número para
`alert` y `achievement`».

---

## 32 · The sidebar gets blocks, and the icon replaces the prompt

**Document:** `docs/brand-manual.md` § 09 gives the admin its dosage — «Solo la
aleta. Sin caras salvo estados vacíos» — and says nothing about how its
navigation is structured.
**Code:** `SidebarGroup`, an `icon` on `SidebarItem`, and a `brand` slot on
`SidebarNav`.

**What forced it.** `SidebarNav` was built for a blog admin with four sections.
The course admin has eleven, in three natural blocks — content, students, sales —
and eleven flat items is where a sidebar stops being readable. The fix for that
is not a scrollbar, it is saying what the blocks are.

**The icon REPLACES the `▸` and does not join it.** Two marks before a label is
one more than the eye needs. The prompt is there to say «this is a place you can
go», and a section glyph says the same thing better — so where there is a glyph
the prompt has no job left. A sidebar with no icons keeps it, which is the
reading sites' case and the reason it is not simply deleted.

**The group label is a paragraph and not a heading**, which is the only part of
this with an accessibility argument. A sidebar is navigation, not content: a
heading here lands in the page's document outline between the page's own, and a
screen-reader user walking headings ends up in the furniture. What the label does
instead is name a nested list through `aria-labelledby`, so the announcement is
«lista Ventas, 3 elementos» rather than one list of eleven.

**`brand` does not replace `title`.** `title` is the eyebrow AND the `<nav>`'s
accessible name when it is a string; a logo is not an accessible name, so a panel
that uses `brand` passes `aria-label` instead. The slot carries what is actually
shared — the rhythm and the hairline under it — and leaves the wordmark to the
project, because every panel spells its own name differently.

**Action in the document:** none. Nothing about the mascot's dosage, the colours
or the type changes; this is structure the document never described.

---

## 33 · The two silent failures get a command, not another paragraph

**Backlog:** the shadcn namespace collision «merece un aviso en la guía de
migración, o un check que la detecte», and the missing `@source` «un aviso en
desarrollo cuando una clase conocida no resuelve ahorraría el rato».
**Code:** `npx arrecife`, published as the package's `bin`.

**Why a command and not the paragraph the backlog offered first.** Both of these
already WERE a paragraph. The `@source` line has been in the README since 0.3.0
and was forgotten in `cursos` anyway — because until a project uses a component
and not just a token it does not need the line, so the paragraph is read a
version before it applies. This library exists because a rule that is only
written down drifts, and a rule that fails silently drifts fastest.

**What makes them worth a command is that neither produces an error.**

Without `@source`, Tailwind purges every class the components emit — `p-step-lg`,
`rounded-card`, `border-hairline` — because it does not scan `node_modules`. No
console error, no build warning, no undefined class. The component mounts,
undressed. It was the blog's E2E suite that caught it, not the build.

With shadcn's `@theme inline { --color-accent: var(--accent); }`, **88 classes
inside the library's own components** painted grey — 28 `text-accent`, 26
`outline-accent`, 15 `bg-accent`, 12 `border-accent`. shadcn's `--accent` is the
hover surface, `#17303E`; ours is the brand turquoise, `#35D6C0`. Buttons, focus
rings and badges came out the colour of a surface and it looked as though the
migration had achieved nothing.

**It reports the value on each side rather than just the name**, because four of
the five collisions are harmless. `background`, `border`, `warm` and `warm-hover`
collide with values both sides agree on; only `accent` breaks. A check that
failed on all five would be turned off in a week, and the four are still worth
saying out loud — they are a coincidence, not a contract.

**It computes the `@source` path from the SHEET and not from the project root**,
which is the half that gets written wrong: a stylesheet in `src/styles/` goes up
two levels. Two of the six tests exist only for that.

**It is a copy into `dist/` and not a tsup entry.** `doctor.mjs` imports nothing
outside `node:`, so there is nothing to bundle; running it through the bundler
would give it a chunk to depend on and a name that moves, and esbuild strips the
shebang. `check:exports` now checks `bin` too — a missing `main` is an import
error the moment somebody writes the import, and a missing `bin` is «command not
found» printed to a person who is already hunting something silently broken.

**Action in the document:** none. It describes nothing the identity documents
cover.

---

## 34 · The collapsed rail gets in, and the reason it was ruled out is gone

**Backlog:** «Lo que NO se puede componer es el rail plegado a solo iconos, y el
motivo no es el contenedor: el sistema no tiene iconos de navegación […] Un rail
plegado con la inicial de cada sección es peor que no plegarlo.»
**Code:** `SidebarNav` takes `collapsed` and `onCollapsedChange`.

**The premise was right and it expired.** That entry ruled out the rail on one
argument, and it was a good one: with no icons, a collapsed sidebar shows each
section's initial, and eleven letters in a column is worse than not collapsing.
§ 29 removed the premise — `SidebarItem` takes an `icon`, and the panel story has
eleven of them.

**The toggle's own glyph comes from `lib/glyphs.tsx` and not from Phosphor.**
`SidebarNav` lives in the root barrel, and the root must not depend on an
optional peer: a project that installs no icon set still gets the button. There
was nothing to add either — `ChevronLeft` and `ChevronRight` were already in the
minimum set, and a chevron pointing at the edge it folds into is the plainest
thing a collapse control can be. The file did not grow, which is the promise it
makes.

**It is controlled and there is no uncontrolled mode.** This state is almost
always persisted — a cookie, `localStorage`, a user preference — and an internal
state would fight the one the project already keeps. It is the same line the
library draws everywhere else: `NewsletterForm` takes `state` and does no `POST`,
`Nav` takes `actions` and knows nothing about sessions.

`onCollapsedChange` is also what makes the toggle appear. `collapsed` alone is a
rail with no way out of it, which is a legitimate layout and not an accident.

**It does not transition.** The system's only transition animates colour and
border, and a rail that slides open is the entrance animation this library does
not have. It is the same call as the `Switch` knob, which changes position
without moving.

**The names survive the collapse.** Collapsed, an item's label goes to `sr-only`
and is not removed — a rail of bare glyphs with no accessible name is a list of
links called «enlace, enlace, enlace», and the person who most needs the label is
the one who cannot see the icon that replaced it. The group labels do the same,
so «lista Ventas, 3 elementos» still gets announced; visually the block becomes a
rule.

**The widths are tokens and the component owns them, but only when it can
collapse.** `size.sidebar` at 256 and `size.sidebarRail` at 56 — the rail is
`navCompact`'s height, so a panel's bar and its rail meet in a square corner
instead of a step. The layout beside a collapsible sidebar has to reserve one of
the two and cannot know which; a sidebar that never collapses is still just a box
the layout sizes, and nothing about it changes.

**`brand` is hidden in the rail and `mark` takes its place.** A wordmark does not
fit in 56px and the component cannot trim somebody else's markup, so it asks for
the other one rather than guessing.

**`user` is a slot**, for the same reason `Nav`'s user menu goes in `actions`: an
avatar needs a session and a sign-out route.

**Action in the document:** add the rail to the admin's description in § 09 —
«barra lateral de 256, rail de 56 a solo iconos».

---

## 35 · The weight is an axis with three values, and none of them is `bold`

**Document:** «funcionales en trazo 1.6», which is one stroke and no second one.
**Code:** `Icon` takes a `tone` — `action` · `current` · `quiet` — and the weight
follows from it. `weight` is not a prop.

**What § 29 left half-done.** That entry answered «which set» and «drawn how» and
it answered them well: `regular` IS the document's 1.6, measured and not derived.
What it did not do is notice that it had settled a DEFAULT and written it down as
a CONSTANT. The generated documentation says «Do not change the weight either» in
so many words, and by the time the sidebar had icons in it that sentence was
already false — the active item needed something the default could not say.

**`current` is what earns the axis, and the argument is not taste.** A sidebar
item that is the one you are on already carries `aria-current="page"` and paints
itself biolume. Colour on its own is the single channel WCAG 1.4.1 says may not
carry meaning, so the state was resting on one channel and a landmark attribute
nobody sees. A filled glyph is the second visible channel, and it is the one that
survives `forced-colors`, where the biolume is replaced by the system palette and
the distinction disappears. It costs nothing: Phosphor already ships the fill.

**`quiet` is the opposite problem.** In a metadata row — a date, a reading time,
a tag count — the icon is not the point of the line, and at `regular` it draws as
heavy as the text it is annotating. `light` is 12 on a 256 grid = 0.0469em, a
quarter under the system line, which is enough to put it behind the text without
it disappearing.

| `tone` | Weight | Line | What it is |
| --- | --- | --- | --- |
| `action` · default | `regular` | 0.0625em | A control, or the label of one |
| `current` | `fill` | — | The one of a set you are on |
| `quiet` | `light` | 0.0469em | Furniture: not a control, not a state |

**Three and not six, and `weight` is not a prop.** Phosphor ships `thin`,
`light`, `regular`, `bold`, `fill` and `duotone`. Three of them have a role here
and three do not: `thin` is `light` with less of it, `duotone` needs a second
colour this system has no token for, and **`bold` is the emphasis step a
`strokeWidth` set would have offered** — which this system does not want, because
it emphasises with colour and has since the first button. Exposing `weight`
alongside `tone` would have given two ways to say the same thing and one way to
say three things that mean nothing, which is exactly the failure § 26's JSDoc is
about on the other subpath.

`ICON_WEIGHT` stays exported. It is no longer «the weight», it is what
`tone="action"` resolves to, and it is still the right thing to reach for when a
project draws a Phosphor icon directly instead of through the wrapper.

**It repealed four sentences, and three of them were in generated files.** The
handoff was written against the code and against § 21, § 22 and § 29 and all of
that held; what nobody re-read was the documentation, where
`docs/llms.template.md` said «Do not change the weight either» and «at the
system's size and weight» in the singular, `AGENTS.md` said «fixes the size at
1em and the weight at `regular`», and the `Icons/Icon` weight story opposed
`light · regular · bold` — putting the one weight the decision rules out in the
middle of the exhibit. The edits go in `docs/llms.template.md`, never in
`llms.txt`, which `scripts/build-llms.mjs` writes. **This is the same failure
mode as § 15 and as § 22's forgotten row**: two places that have to agree, living
in different files, with nothing checking that they do.

**Action in the document:** the icon line § 29 already asked for gains a second
half — «peso por rol · `regular` funcional, `fill` para el elemento actual,
`light` para lo que acompaña».

---

## 36 · Two actions on the document that were never carried over

Not a discrepancy between code and document: a discrepancy between a decision and
its own action. Both are recorded here because they were found in an audit rather
than by anyone reading the entry that asked for them, which is the point.

**§ 22 asked for a row and never got it.** The entry closes with «Action in the
document: add `icon-sm 32×32` to the controls table». The code has had it since:
it is in `tokens.control.iconSm`, in `buttonVariants` and in the generated props
table. The canvas still lists four sizes — «sm 8/14 · md 12/22 · lg 15/30 · icono
42×42» — so a reader who trusts the document and builds an admin toolbar reaches
for 42 and gets the row height the size exists to avoid.

**§ 29's icon line is still pending too**, and § 35 above has now added a second
half to it before the first half was ever written down.

**Why they are not fixed here.** `docs/design-system.md` is a **verbatim**
transcription of the canvas, and its own header says translating or editing it
would break the one property it exists for: that a drift like the Shiki theme's
`#E05252` can be caught by grepping the copy against the source. Editing the copy
to match the code inverts that — the next drift would be invisible because the
copy would already agree. **The canvas is the source, so the canvas is where
these two go**, and the transcription is re-extracted afterwards.

**The durable half of the fix is a script, and it is in this change.** Every
entry ends in «Action in the document» — that is what § 8 and § 15 were fixed
for — and **twenty-four of them are still asking for a change to a canvas**, with
nothing anywhere that listed them. An action was only as durable as whoever last
read the entry it was buried in, and § 22's sat in the middle of this file for
thirteen entries.
`pnpm check:decisions` collects the lines and prints them.

**It reports, it does not enforce**, and that is not a compromise: the actions
land on a canvas the script cannot open, so it can say what is outstanding and it
cannot say whether it was done. It exits 0 on the list. The one thing it DOES
fail on is its own contract — an entry with no action line at all — because the
line exists to force the question «and what does the document have to say now»,
and «none» is a valid answer that still has to be written down. **It found three
on its first run**: § 8, § 15 and this entry, all of which had simply ended
without asking. That is the same class of gap it was built for, one level up.

**Action in the document:** none. Both actions above belong to § 22 and § 29 and
are listed under those; this entry is the record that they were dropped, not a
new request.

---

## 37 · The focus ring is one utility, at the offset the document actually gives

**Document:** «focus ring 2px #35D6C0 + offset 3px», given once, on the primary
button.
**Code, until now:** `focus-visible:outline-2 focus-visible:outline-offset-2
focus-visible:outline-accent`, copied verbatim to twenty-eight call sites in
twenty-four files. Offset **2**, everywhere.

**Nobody decided on 2.** That is the entire finding. There is no entry arguing it
down from 3, no contrast measurement behind it and no note anywhere — the first
component was written at 2 and the next twenty-seven were written by copying the
first. Three consecutive audits reported it and it did not move, because «change
the focus ring» meant twenty-eight edits that had to agree, which is the shape of
a task that stays on a list.

**It is one utility for the reason § 15 already gives.** A list kept in sync by
hand with another list ends up out of sync; twenty-eight copies are twenty-eight
chances to write the twenty-ninth at offset 2 again, and nothing was comparing
them to anything. `focus-ring` lives in `build-tokens.mjs` beside
`transition-standard`, and `scripts/theme-css.test.mjs` asserts what it compiles
to — including that it is `outline-offset: 3px` and not 2, which is the assertion
that did not exist for three revisions.

**The conversion button is the one that changes colour**, and this is the half
that is an interpretation rather than a transcription. The document specifies the
ring once, on the primary button, in biolume; it does not say what happens on the
sand one, and the canvas's own drawing of it does not survive the extraction into
`design-system.md` — the SVGs come out as «SVG». `conversion` is the system's
only sand fill — «Solo un botón arena por pantalla» — and a biolume ring three
pixels off a sand button puts both of the brand's accents inside the same glance,
which is the one place in the system where they meet with nothing between them.
`focus-ring-warm` sets **only** the colour, so the width and the offset stay in
one place and cannot drift apart.

Two things make it safe to take rather than defer. It changes no contrast
obligation: at offset 3 the ring sits on the page background, not on the button,
so both colours are measured against the same surface they already pass against.
And it is one class in one variant — if the canvas turns out to show a biolume
ring on the sand button, deleting `focus-ring-warm` from `button.ts` is the whole
revert.

**`avatar.tsx` keeps its classes written out.** Its focus lives on a hidden input
and the ring is drawn by the label through `has-[:focus-visible]:`, which is a
different selector from the one the utility nests. It moved to offset 3 with the
rest; it is the known outlier and it is one site, not twenty-eight.

**Action in the document:** none. The offset is a correction TO the code — the
document was right and had been right for three revisions. The sand ring is the
one thing that needs ratifying: confirm it, or say the ring is biolume on every
variant and `focus-ring-warm` comes out.

---

## What was NOT touched

The audit's list still stands: the three contrast corrections (light `textMuted`,
light `warning`, dark `error`), `Isotype` with a mandatory `background`, `Logo`
with no text prop, `Text` with no `font` prop, `CodeBlock` with its theme island,
`AudioPlayer` without movement, `check-tokens-purity.mjs` on every build and the
`data-theme` on the preview area in `brand.stories.tsx`.
