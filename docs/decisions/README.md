# Decisions · arrecife

What follows are the points where the code and the document do **not** say the
same thing, with the resolution and the reason. In every case the code wins:
these values have to be carried up to the *Design System* and the *Brand
Manual*, not the other way round.

Each entry says what there was, what stayed and why. If one of them is reverted,
**it is reverted with a new argument, not by forgetting** — and the old entry
keeps its file, marked in its own header, because the record of how a sound
argument reached the wrong place is the useful part.

## How this is organised

**One file per decision, named `NNN-slug.md`.** The number is the whole point:
it is global, it is never reused, and now it is also the filename's prefix, so
§ 45 is `045-signature-halo.md` and nothing — not a code comment, not a commit,
not this index — has to know which release closed it. That is what a reference
written as «§ 45 in `docs/decisions/`» resolves against: the folder, sorted.

It used to be one file per release, append-only, and the number lived inside.
That worked, and it asked every reference to carry a version it did not care
about: a code comment reading `docs/decisions/0.8.md § 45` says «0.8» to
somebody for whom the only true part is «45».

A decision keeps its number for ever, so a file is **never renumbered** and its
name is not rewritten to match a new title. `004b` is `4b` because § 4 grew a
second half that could not take § 5's number.

Each file's header carries the release that closed it and, when it has been
overruled, the entry that overruled it. Nothing is deleted: a reversed decision
keeps its file and says so.

| Release | Entries | What that round was about |
| --- | --- | --- |
| 0.6.0 | §§ 1–25, and § 4b | Tokens, contrast, the shape of a primitive |
| 0.7.0 | §§ 26–38 | Subpaths, Phosphor, the doctor |
| 0.8.0 | §§ 39–48 | Three removals, and why each one was built for nobody |
| 0.9.0 | §§ 49–50 | Two pieces built from a consumer that the consumer could not use |
| 0.10.0 | §§ 51–56 | The library stops drawing icons, and four things a phone already knew |
| 0.11.0 | §§ 57–60 | Four props a consumer had already written down in its own source |
| 0.12.0 | §§ 61–63 | One word of CSS, a footer that can credit the library, and a site that says which version it is |

`pnpm check:decisions` walks this folder and prints the actions still owed to a
canvas. It reports, it does not enforce: those actions land on a document this
repo cannot open.

## Every entry

Grouped by the release that closed it, because that grouping is what the prose
about each round was written for. The number is the address; the grouping is
just how to read the log as it happened.

### 0.6.0

The first twenty-five, plus § 4b. They were written in Spanish as
`docs/decisiones.md` and migrated with the rest of the repo in 0.6.0 — which is
why the oldest entries read as translations: they are.

This is the stretch where the system was still deciding what it was, so most of
the entries are about tokens, contrast and the shape of a primitive. Three of
them have been reversed since, and each says so in its own header.

- § 1 · [One control radius](001-control-radius.md)
- § 2 · [The card has no surface of its own](002-card-without-surface.md)
- § 3 · [The alert's radius](003-alert-radius.md)
- § 4 · [The alert tint in light mode](004-alert-tint-light-mode.md)
- § 4b · [The text over the tint cannot be the tint's color](004b-text-over-tint.md)
- § 5 · [The mono scale goes to 13, not 12.5](005-mono-scale-13.md)
- § 6 · [The category's border comes from the palette](006-category-border.md)
- § 7 · [The mono tertiary uses the scale, not 14px](007-mono-tertiary-scale.md)
- § 8 · [There was no danger button](008-no-danger-button.md) · Reversed in § 21
- § 9 · [The light gradients are invented, and composing them the obvious way was wrong](009-light-gradients.md)
- § 10 · [The badge scale breaks the 13px floor, on purpose](010-badge-scale-floor.md)
- § 11 · [The skeleton does move](011-skeleton-shimmer.md)
- § 12 · [The OG fin is not a parameter](012-og-fin-not-a-parameter.md)
- § 13 · [Two radii the document gives outside the scale](013-two-radii-outside-scale.md)
- § 14 · [The large button goes to 17](014-large-button-17.md)
- § 15 · [`cn` derives the scales, it no longer repeats them](015-cn-derives-scales.md)
- § 16 · [Page rhythm carries `step` in the name](016-step-prefix.md)
- § 17 · [The hero's pose CAN be centred, on a page that is only that](017-hero-centred-pose.md)
- § 18 · [The chart series palette is not in the document](018-chart-series-palette.md)
- § 19 · [The reading progress bar is not a progress bar](019-reading-progress-bar.md)
- § 20 · [The accordion DOES animate its height](020-accordion-height.md)
- § 21 · [There IS a danger button, outside a dialog](021-danger-button-outside-dialog.md)
- § 22 · [A dense icon size, for the one admin app](022-dense-icon-size.md)
- § 23 · [The footer's caret blinks](023-footer-caret.md) · Reversed in § 45
- § 24 · [The composed parts are reached with a slot, not with a selector](024-slots-not-selectors.md)
- § 25 · [Projects without React are served by `./variants`](025-variants-without-react.md)

### 0.7.0

Thirteen entries. The release where the library stopped being only components:
`./social` and `./icons` became subpaths, Phosphor was adopted as an optional
peer, and `npx arrecife` arrived for the two failures that produce no error.

Two of these — § 32 and § 34, on `SidebarNav` — are reversed in 0.8.0.

- § 26 · [The social icons are published twice, and they are not two ways of writing the same import](026-social-icons-twice.md) · Reversed in § 51
- § 27 · [The empty state has a second shape, and it carries no face](027-empty-state-inline.md)
- § 28 · [There is a third tone, and two of them are the same sand](028-third-tone-warm.md)
- § 29 · [The system adopts Phosphor, and it still ships no icons](029-adopts-phosphor.md) · Completed in § 51
- § 30 · [`Nav` needed one of the three things the backlog asked for](030-nav-compact-size.md)
- § 31 · [The neutral number stops being biolume, and the tone moves to the badge](031-stat-neutral-tone.md)
- § 32 · [The sidebar gets blocks, and the icon replaces the prompt](032-sidebar-groups.md) · Reversed in § 48
- § 33 · [The two silent failures get a command, not another paragraph](033-doctor-command.md)
- § 34 · [The collapsed rail gets in, and the reason it was ruled out is gone](034-sidebar-collapsed-rail.md) · Reversed in § 48
- § 35 · [The weight is an axis with three values, and none of them is `bold`](035-icon-tone-axis.md)
- § 36 · [Two actions on the document that were never carried over](036-two-unfinished-actions.md)
- § 37 · [The focus ring is one utility, at the offset the document actually gives](037-focus-ring-utility.md)
- § 38 · [The hero's year count is not unknown, and it is still not a token](038-hero-year-count.md)

### 0.8.0

Ten entries, and the shape of the release is in three of them: § 45, § 47 and
§ 48 all REMOVE something, and all for the same reason — the library had built
for a consumer it had not read.

They reverse §§ 23, 32 and 34. The reversed entries keep their files, marked:
what they argued is not what was wrong with them, and the record of how a sound
argument reached the wrong place is the part worth keeping.

- § 39 · [The table carries its own surface](039-table-surface.md)
- § 40 · [`NavItem asChild` was declared, typed and impossible to call](040-navitem-aschild.md)
- § 41 · [`ref` is a prop in React 19, and the types said otherwise](041-ref-as-prop.md)
- § 42 · [The glyphs are data, and the tenth one is ours](042-glyphs-as-data.md)
- § 43 · [The chart types take the names Recharts uses](043-chart-type-names.md)
- § 44 · [The footer's second shape, and why the first one is the default](044-footer-full-variant.md)
- § 45 · [The signature's mark is the halo, and the library had invented the blink](045-signature-halo.md)
- § 46 · [The doctor stops asking `links` for a directive it must not add](046-doctor-source-not-needed.md)
- § 47 · [The footer takes no loose links, and the columns are why](047-footer-columns.md)
- § 48 · [`SidebarNav` goes, and the entry criterion is why](048-sidebarnav-removed.md)

### 0.9.0

Two entries, and they are the same entry twice: a component decided something on
behalf of a project that already knew the answer, and the type gave the project
no way to say so.

Both were found the same way — a consumer sat down to adopt the piece the
previous release built for it, and could not. That is the useful part: § 44 and
§ 43 were both written FROM `cursos`, and both still shipped with a hole that
only appeared when `cursos` tried to use them.

- § 49 · [The signature prints a domain, and it is not always ours](049-signature-domain.md)
- § 50 · [The tooltip's formatter never reached the axis](050-chart-axis-formatter.md)

### 0.10.0

Six entries, and the first one is the release. The library stopped drawing icons
of its own.

The rest follow from reading the projects rather than from arguing from first
principles, which is the lesson § 45 left and the one this round actually
applied: `links` had already centred its footer on a phone, `eduardoalvarez.dev`
had already written down a bug in `ThemeToggle` in its own source, and both had
already moved their social marks to Phosphor without waiting for the library. In
each case the library was the one out of step.

- § 51 · [Phosphor is the only hand, and the two sets of our own go](051-phosphor-only-hand.md) · Reverses § 26 and half of § 29
- § 52 · [The alert's mark stops being a mono character](052-alert-icon-mark.md)
- § 53 · [The footer is centred on a phone, and `links` knew first](053-footer-centred-phone.md)
- § 54 · [Three rows that pushed the page sideways, and they do not get the same answer](054-three-overflow-rows.md)
- § 55 · [The toast's tone is a surface, not a hairline](055-toast-tone-surface.md)
- § 56 · [Storybook gets a way in, and the agent block is generated](056-storybook-setup-page.md)

### 0.11.0

Four entries, and they are the same entry four times. In each case the
component was the right one and a project could not use it because of one prop
that did not exist.

All four came out of `cursos` adopting 0.10.0 whole, and all four are the shape
the [0.9.0 entries](#090) already named: a piece built from a consumer that still
shipped with a hole only the consumer could find. Three of the four had been
written down in that consumer's own source, next to the code that worked around
them, before anybody here read them. That is § 45's lesson again — read the
project first — and this time the project had left notes.

All four are additive. Nobody using any of these components today sees a
difference.

- § 57 · [The page title's scale belongs to the screen, and the two admin apps agree on it](057-page-header-title-scale.md)
- § 58 · [A ranking with a hidden axis cannot scale to its own maximum](058-chart-value-max.md)
- § 59 · [The course card takes a cover and a closing row, and the title stays off the cover](059-course-card-cover.md)
- § 60 · [The fin can follow the theme, and the explicit value stays for fixed backgrounds](060-isotype-background-auto.md)

### 0.12.0

Three entries, and the first is one word of CSS. It is also the first entry in
this log that is not a discrepancy with a canvas: the document and the code
agreed on the four series colors all along, and what failed was whether the
values reached the browser. It is the same silent-failure family as the missing
`@source` and the token collision the doctor exists for — see
[§ 33](033-doctor-command.md) — and as the `--spacing-*` clash that
`scripts/theme-css.test.mjs` was written for. Nothing errors, nothing warns, and
what arrives is a person saying the screen looks empty.

The other two are about what this library says about ITSELF: a footer that can
credit it, and a published site that wears the mark its four projects had
already agreed on and prints the version it is describing. Both were settled by
reading those projects rather than by arguing here, and § 62 is off by default
for exactly that reason.

Nobody's code changes. There is no migration.

- § 61 · [The token set is emitted whole, because a token read by `var()` is asked for by no class](061-theme-static-tokens.md)
- § 62 · [The footer can credit the library, and it is off until a site asks](062-footer-built-with.md)
- § 63 · [The published site wears the projects' mark and prints the version it is](063-storybook-identity.md)

---

## What was NOT touched

The audit's list still stands: the three contrast corrections (light `textMuted`,
light `warning`, dark `error`), `Isotype` with a mandatory `background`, `Logo`
with no text prop, `Text` with no `font` prop, `CodeBlock` with its theme island,
`AudioPlayer` without movement, `check-tokens-purity.mjs` on every build and the
`data-theme` on the preview area in `brand.stories.tsx`.
