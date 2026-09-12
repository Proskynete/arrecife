# § 9 · The light gradients are invented, and composing them the obvious way was wrong

**Release:** 0.6.0 · [index](README.md)

---

The document gives the two dark gradients and no light ones:

```
hero    linear-gradient(160deg, #091319 60%, #0d2129 100%)
section linear-gradient(150deg, #10202b 0%, #0d2129 100%)
```

They are already tokens (`gradient.dark`), and `#0D2129` lives inside `tokens.ts`
as a private constant of the gradient: it is neither a surface nor a text color,
so it does not enter the palette.

**The first composition took the same angles and the same stops** and put
`surfaceRaised` wherever the dark one used `deep`. That is the obvious move and
it was wrong three times over, because **the light palette is not the dark one
turned upside down**: in dark the raised surface is the lightest of the three, in
light it is the darkest. Paper does not behave like a screen.

| | from → to | ΔL\* | direction |
| --- | --- | --- | --- |
| dark `hero` | `#091319` → `#0D2129` | **11.46** | lifts away from the base |
| dark `section` | `#10202B` → `#0D2129` | **0.11** | — |
| light `hero`, composed | `#F6F2EA` → `#EFE9DE` | 3.06 | **sank below it** |
| light `section`, composed | `#FFFFFF` → `#EFE9DE` | 7.47 | — |

**One · the direction inverted.** The dark hero brightens toward its far corner.
The composed light one darkened toward its far corner. Same angle, same stop
percentages, opposite reading.

**Two · the sweep landed on the wrong block.** In dark the hero carries the
movement and the section has none. In light it came out the other way round, with
the section sweeping more than twice the hero.

**Three, and this is the one that is not a matter of taste: it put text below
AA.** `surfaceRaised` is the light palette's worst surface — the README's own
contrast section says so — and light `accent` reads **4.21** on it against
**4.55** on the page, `warm` **4.19** against **4.53**. Both clear 4.5 where they
start and neither clears it where the gradient ends. A hero that ends on
`surfaceRaised` therefore makes a token's contrast **a function of where in the
panel the text happens to sit**, which is not something a token can promise.
`Hero` puts an `accent` eyebrow directly on this gradient.

**Nothing was going to catch it.** axe does not evaluate text over a gradient —
it needs a resolvable background color — so `pnpm test` passed it in both modes
for four versions, and the contrast table in the README measured every token
against `background` and `surfaceRaised` as flat surfaces, which is where the
pair is fine and where the gradient is not.

**What they are now.** Both light blocks sweep between `background` and
`surface`, and neither touches `surfaceRaised`:

```
hero    linear-gradient(160deg, #F6F2EA 60%, #FFFFFF 100%)
section linear-gradient(150deg, #FFFFFF 0%, #F6F2EA 100%)
og      linear-gradient(145deg, #F6F2EA 55%, #FFFFFF 100%)
```

4.40 L\* each, the hero lifting the way the dark one does, and **the darkest
point of either block is `background`** — the surface every light-mode contrast
value in this repo is already ratified against. The guarantee that buys is the
whole point and it is flat: a token that passes on the page passes everywhere on
both blocks, at any angle, at any point of the sweep. It stops depending on
layout. `scripts/theme-css.test.mjs` asserts the stops, and asserts the dark ones
verbatim so a future rewrite of the light side cannot take them along.

**A finding about the document, on the way past.** The dark `section` gradient
moves **0.11 L\***, which is one hundredth of a perceptible step: it is a
gradient in the document and a solid `bg-surface` panel on screen. It has been
that way since the beginning and nobody noticed, which is what happens to a value
nobody measures. It is not touched here — it is the document's, it ships in four
projects, and changing it is a visible change to the newsletter block in every
one of them.

**Action in the document:** ratify the three light values above, and decide what
the dark `section` gradient is for: at 0.11 L\* it either wants a real second
stop or it wants to stop being a gradient.

---
