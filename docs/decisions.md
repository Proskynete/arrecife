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

## What was NOT touched

The audit's list still stands: the three contrast corrections (light `textMuted`,
light `warning`, dark `error`), `Isotype` with a mandatory `background`, `Logo`
with no text prop, `Text` with no `font` prop, `CodeBlock` with its theme island,
`AudioPlayer` without movement, `check-tokens-purity.mjs` on every build and the
`data-theme` on the preview area in `brand.stories.tsx`.
