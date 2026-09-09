# Decisions · arrecife

What follows are the points where the code and the document do **not** say the
same thing, with the resolution and the reason. In every case the code wins:
these values have to be carried up to the *Design System* and the *Brand
Manual*, not the other way round.

Each entry says what there was, what stayed and why. If one of them is reverted,
**it is reverted with a new argument, not by forgetting** — and the old entry
stays, marked in its heading, because the record of how a sound argument reached
the wrong place is the useful part.

## How this is organised

One file per release, because the log is append-only and grows by rounds. **The
numbering is global and it is never reused**: § 45 is § 45 wherever it lives, so
every `README.md § N` reference ever written in a commit, a comment or a
PR still resolves. This index is how you find which file holds it.

| File | Entries | What that release was about |
| --- | --- | --- |
| [`0.6.md`](0.6.md) | §§ 1–25, and § 4b | Tokens, contrast, the shape of a primitive |
| [`0.7.md`](0.7.md) | §§ 26–38 | Subpaths, Phosphor, the doctor |
| [`0.8.md`](0.8.md) | §§ 39–48 | Three removals, and why each one was built for nobody |
| [`0.9.md`](0.9.md) | §§ 49–50 | Two pieces built from a consumer that the consumer could not use |
| [`0.10.md`](0.10.md) | §§ 51–56 | The library stops drawing icons, and four things a phone already knew |

`pnpm check:decisions` walks this folder and prints the actions still owed to a
canvas. It reports, it does not enforce: those actions land on a document this
repo cannot open.

## Every entry


**[`0.6.md`](0.6.md)**

- § 1 · [One control radius](0.6.md#1--one-control-radius)
- § 2 · [The card has no surface of its own](0.6.md#2--the-card-has-no-surface-of-its-own)
- § 3 · [The alert's radius](0.6.md#3--the-alerts-radius)
- § 4 · [The alert tint in light mode](0.6.md#4--the-alert-tint-in-light-mode)
- § 4b · [The text over the tint cannot be the tint's color](0.6.md#4b--the-text-over-the-tint-cannot-be-the-tints-color)
- § 5 · [The mono scale goes to 13, not 12.5](0.6.md#5--the-mono-scale-goes-to-13-not-125)
- § 6 · [The category's border comes from the palette](0.6.md#6--the-categorys-border-comes-from-the-palette)
- § 7 · [The mono tertiary uses the scale, not 14px](0.6.md#7--the-mono-tertiary-uses-the-scale-not-14px)
- § 8 · [There was no danger button · REVERSED in § 21](0.6.md#8--there-was-no-danger-button--reversed-in--21)
- § 9 · [The light gradients are invented, and composing them the obvious way was wrong](0.6.md#9--the-light-gradients-are-invented-and-composing-them-the-obvious-way-was-wrong)
- § 10 · [The badge scale breaks the 13px floor, on purpose](0.6.md#10--the-badge-scale-breaks-the-13px-floor-on-purpose)
- § 11 · [The skeleton does move](0.6.md#11--the-skeleton-does-move)
- § 12 · [The OG fin is not a parameter](0.6.md#12--the-og-fin-is-not-a-parameter)
- § 13 · [Two radii the document gives outside the scale](0.6.md#13--two-radii-the-document-gives-outside-the-scale)
- § 14 · [The large button goes to 17](0.6.md#14--the-large-button-goes-to-17)
- § 15 · [`cn` derives the scales, it no longer repeats them](0.6.md#15--cn-derives-the-scales-it-no-longer-repeats-them)
- § 16 · [Page rhythm carries `step` in the name](0.6.md#16--page-rhythm-carries-step-in-the-name)
- § 17 · [The hero's pose CAN be centred, on a page that is only that](0.6.md#17--the-heros-pose-can-be-centred-on-a-page-that-is-only-that)
- § 18 · [The chart series palette is not in the document](0.6.md#18--the-chart-series-palette-is-not-in-the-document)
- § 19 · [The reading progress bar is not a progress bar](0.6.md#19--the-reading-progress-bar-is-not-a-progress-bar)
- § 20 · [The accordion DOES animate its height](0.6.md#20--the-accordion-does-animate-its-height)
- § 21 · [There IS a danger button, outside a dialog](0.6.md#21--there-is-a-danger-button-outside-a-dialog)
- § 22 · [A dense icon size, for the one admin app](0.6.md#22--a-dense-icon-size-for-the-one-admin-app)
- § 23 · [The footer's caret blinks · REVERSED in § 45](0.6.md#23--the-footers-caret-blinks--reversed-in--45)
- § 24 · [The composed parts are reached with a slot, not with a selector](0.6.md#24--the-composed-parts-are-reached-with-a-slot-not-with-a-selector)
- § 25 · [Projects without React are served by `./variants`](0.6.md#25--projects-without-react-are-served-by-variants)

**[`0.7.md`](0.7.md)**

- § 26 · [The social icons are published twice, and they are not two ways of writing the same import · REVERSED in § 51](0.7.md#26--the-social-icons-are-published-twice-and-they-are-not-two-ways-of-writing-the-same-import)
- § 27 · [The empty state has a second shape, and it carries no face](0.7.md#27--the-empty-state-has-a-second-shape-and-it-carries-no-face)
- § 28 · [There is a third tone, and two of them are the same sand](0.7.md#28--there-is-a-third-tone-and-two-of-them-are-the-same-sand)
- § 29 · [The system adopts Phosphor, and it still ships no icons · COMPLETED in § 51](0.7.md#29--the-system-adopts-phosphor-and-it-still-ships-no-icons)
- § 30 · [`Nav` needed one of the three things the backlog asked for](0.7.md#30--nav-needed-one-of-the-three-things-the-backlog-asked-for)
- § 31 · [The neutral number stops being biolume, and the tone moves to the badge](0.7.md#31--the-neutral-number-stops-being-biolume-and-the-tone-moves-to-the-badge)
- § 32 · [The sidebar gets blocks, and the icon replaces the prompt · REVERSED in § 48](0.7.md#32--the-sidebar-gets-blocks-and-the-icon-replaces-the-prompt--reversed-in--48)
- § 33 · [The two silent failures get a command, not another paragraph](0.7.md#33--the-two-silent-failures-get-a-command-not-another-paragraph)
- § 34 · [The collapsed rail gets in, and the reason it was ruled out is gone · REVERSED in § 48](0.7.md#34--the-collapsed-rail-gets-in-and-the-reason-it-was-ruled-out-is-gone--reversed-in--48)
- § 35 · [The weight is an axis with three values, and none of them is `bold`](0.7.md#35--the-weight-is-an-axis-with-three-values-and-none-of-them-is-bold)
- § 36 · [Two actions on the document that were never carried over](0.7.md#36--two-actions-on-the-document-that-were-never-carried-over)
- § 37 · [The focus ring is one utility, at the offset the document actually gives](0.7.md#37--the-focus-ring-is-one-utility-at-the-offset-the-document-actually-gives)
- § 38 · [The hero's year count is not unknown, and it is still not a token](0.7.md#38--the-heros-year-count-is-not-unknown-and-it-is-still-not-a-token)

**[`0.8.md`](0.8.md)**

- § 39 · [The table carries its own surface](0.8.md#39--the-table-carries-its-own-surface)
- § 40 · [`NavItem asChild` was declared, typed and impossible to call](0.8.md#40--navitem-aschild-was-declared-typed-and-impossible-to-call)
- § 41 · [`ref` is a prop in React 19, and the types said otherwise](0.8.md#41--ref-is-a-prop-in-react-19-and-the-types-said-otherwise)
- § 42 · [The glyphs are data, and the tenth one is ours](0.8.md#42--the-glyphs-are-data-and-the-tenth-one-is-ours)
- § 43 · [The chart types take the names Recharts uses](0.8.md#43--the-chart-types-take-the-names-recharts-uses)
- § 44 · [The footer's second shape, and why the first one is the default](0.8.md#44--the-footers-second-shape-and-why-the-first-one-is-the-default)
- § 45 · [The signature's mark is the halo, and the library had invented the blink](0.8.md#45--the-signatures-mark-is-the-halo-and-the-library-had-invented-the-blink)
- § 46 · [The doctor stops asking `links` for a directive it must not add](0.8.md#46--the-doctor-stops-asking-links-for-a-directive-it-must-not-add)
- § 47 · [The footer takes no loose links, and the columns are why](0.8.md#47--the-footer-takes-no-loose-links-and-the-columns-are-why)
- § 48 · [`SidebarNav` goes, and the entry criterion is why](0.8.md#48--sidebarnav-goes-and-the-entry-criterion-is-why)

---

## What was NOT touched

The audit's list still stands: the three contrast corrections (light `textMuted`,
light `warning`, dark `error`), `Isotype` with a mandatory `background`, `Logo`
with no text prop, `Text` with no `font` prop, `CodeBlock` with its theme island,
`AudioPlayer` without movement, `check-tokens-purity.mjs` on every build and the
`data-theme` on the preview area in `brand.stories.tsx`.

**[`0.9.md`](0.9.md)**

- § 49 · [The signature prints a domain, and it is not always ours](0.9.md#49--the-signature-prints-a-domain-and-it-is-not-always-ours)
- § 50 · [The tooltip's formatter never reached the axis](0.9.md#50--the-tooltips-formatter-never-reached-the-axis)

**[`0.10.md`](0.10.md)**

- § 51 · [Phosphor is the only hand, and the two sets of our own go · REVERSES § 26 and half of § 29](0.10.md#51--phosphor-is-the-only-hand-and-the-two-sets-of-our-own-go--reverses--26-and-half-of--29)
- § 52 · [The alert's mark stops being a mono character](0.10.md#52--the-alerts-mark-stops-being-a-mono-character)
- § 53 · [The footer is centred on a phone, and `links` knew first](0.10.md#53--the-footer-is-centred-on-a-phone-and-links-knew-first)
- § 54 · [Three rows that pushed the page sideways, and they do not get the same answer](0.10.md#54--three-rows-that-pushed-the-page-sideways-and-they-do-not-get-the-same-answer)
- § 55 · [The toast's tone is a surface, not a hairline](0.10.md#55--the-toasts-tone-is-a-surface-not-a-hairline)
- § 56 · [Storybook gets a way in, and the agent block is generated](0.10.md#56--storybook-gets-a-way-in-and-the-agent-block-is-generated)
