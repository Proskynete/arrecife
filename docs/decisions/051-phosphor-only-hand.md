# § 51 · Phosphor is the only hand, and the two sets of our own go

**Release:** 0.10.0 · **Status:** Reverses § 26 and half of § 29 · [index](README.md)

---

**System rule:** «the library ships no icons; what it ships is how an icon is
drawn». That is [§ 29](029-adopts-phosphor.md), and it was right about the half it named.

**What the code did:** it shipped two icon sets. `src/lib/glyphs.tsx` held
eighteen glyphs for the primitives — `Check`, `ChevronDown`, `Close`, `Spinner`,
the audio player's eight — drawn at a 1.75 stroke on a 16 grid. `src/social/`
held ten brand marks on a 24 grid, published twice, at `./social` and at
`./social/data`. `./icons` published `Icon` over Phosphor for everything else.

**What was wrong with it.** § 29 measured the discrepancy and left it: Phosphor's
`regular` is 0.0625em, the document says 0.0667em, and `glyphs.tsx` drew at
0.109em — three quarters heavier than both. The entry says so in as many words
and then says «aligning it restyles every primitive in the library and is its own
change». This is that change.

Three sets is not a stroke problem, it is a source problem. A `Select`'s chevron
and a `CaretDown` a project drew beside it are the same symbol at two weights on
the same screen, and nothing in the library could say which one was right —
because the library was drawing one of them.

**What made it decidable now** is that the projects had already gone. `links`
moved its footer marks to Phosphor and wrote the divergence down in
`Footer.astro`: «the marks are Phosphor, not `@eduardoalvarez/arrecife/social/data`
… every icon on the page is then one set at one weight». `eduardoalvarez.dev`
did the same in `site-footer.tsx`. That is the memo rule — if two consumers agree
on something, that IS the identity and the library records it — arriving as two
projects walking away from a subpath built for them.

**What it is now:** `lib/glyphs.tsx` and `src/social/` are deleted. Every glyph
the library draws comes from `@phosphor-icons/react` through `Icon`, and
`@phosphor-icons/react` moves from an optional peer dependency to a required one.

**And a third one that was not in either file.** `AudioPlayer` drew its own
waveform inline — five `<span>`s at heights `[35, 65, 100, 65, 35]`, a
`bg-accent` and an inline `style` — so it survived the first pass, which went
looking for imports of a glyph module and found none. It is Phosphor's
`Waveform` now, and the tell is how little the drawing changed: five rounded
vertical bars with the peak off centre is what `Waveform` already is. The
library was redrawing a Phosphor icon by hand.

`Waveform` and not `Equalizer`, which was the other candidate: an equaliser is
three columns of faders, which is a control you set, and this mark is not a
control. It sits next to «Narración de audio», it is `aria-hidden`, and what it
says is that there is something here to listen to. What IS kept from the
hand-drawn version is the opacity: playing is opaque, paused is not, and the
floating bar leans on that because its play button is 16px in the corner of a
phone.

**Why required and not optional.** The optional peer was honest while the library
had a set of its own to fall back on. It does not any more: a project that
imports `Alert` or `Select` and never draws an icon itself is still drawing
Phosphor. An optional peer that every consumer needs is a lie in the manifest, and
the failure it produces is a module resolution error in somebody else's build.

**What this costs, named rather than hidden.** Two of the five projects drew no
icons and now install a package. It is 4 KB of index and `sideEffects: false`, so
what ships is the eighteen the library draws — but it is a dependency they did not
have, and «it tree-shakes» is not the same as «it is free».

**Why `./social/data` goes and is not regenerated from Phosphor.** It existed for
`links`, an Astro that mounts no React and used to paste `<path d="…">` by hand —
[§ 42](042-glyphs-as-data.md). `links` does not consume it any more: it draws Phosphor
through `astro-icon` by Iconify name, which is the same set from the same source
with no shape crossing a package boundary. Regenerating the file from Phosphor's
own defs would put a third copy of those paths in the world to serve nobody.

**Action in the document:** the icon section says the system ships a minimum set
of inline glyphs for the controls, and it does not. Replace it with the rule that
holds now: the set is Phosphor's, `regular` is the line, `fill` is a brand or a
current state, `light` is furniture, and nothing in the system is hand-drawn
except the brand marks in `src/brand/`. The social row's «brands solid, functional
at 1.6» survives verbatim as `tone="current"` against `tone="action"`.
