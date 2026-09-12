# § 62 · The footer can credit the library, and it is off until a site asks

**Release:** 0.12.0 · [index](README.md)

---

**System rule:** none, and that is the first thing worth writing down. Neither
the design system nor the brand manual has a «built with» line, because until
now there was no library to credit.

**What the code did:** `Footer` had no way to say where it came from, and no
project had written one by hand. All four consumers were read before this was
built — `eduardoalvarez.dev`, `links`, `cursos` and `blog-content-manager` — and
none of them credits anything. The only «powered by» in the four is Giphy's, in
a dialog that is not ours.

**What it is now:** `builtWith`, a boolean on both shapes. It draws «Creado con
Arrecife ♥» as the footer's last line, linking to the library's own Storybook.

**Why it is OFF by default, which is the whole decision.** On by default, this
line appears in five production footers the next time each of them bumps a
version — a line none of those sites wrote, asked for or would see coming in a
patch. That is the move [§ 45](045-signature-halo.md) is about: the library had
replaced a mark those sites already drew, on an argument built here rather than
read there. The argument for a credit is a good one and it is still an argument
made in this repo about somebody else's footer. A site that wants it passes one
prop.

It is also the entry criterion read honestly. A component gets in when it
encodes an identity RULE with two or more consumers; a credit line encodes
neither today. What it is is an option, and an option is allowed to have no
consumer yet as long as nothing has to pay for it — which off-by-default is
exactly what guarantees.

**Why a boolean and not a slot.** The string and the destination are the
library's. A `ReactNode` here would be an invitation to «Hecho con Arrecife» on
one site and «Creado con» on the next, which is the drift this package exists to
remove — the same reason the `./` in a footer column is put there by the
component and not typed by whoever writes the label.

**Why it goes under the signature, and what was tried first.** The first version
put it at the very bottom of the footer, on the argument that a «built with» line
is the last thing in a footer everywhere else on the web. Rendered, that is not
what it looks like: alone under a full-width block, as far from the signature as
the layout allows, reading as a stray line rather than as part of anything.

Under the signature the two say the same kind of thing — the signature names the
site, the credit names what built it, and both are the page talking about itself
rather than about its content. Stacking them is one placement for both shapes,
which was the point of the original argument and is better served here: whichever
edge a shape puts the signature on, the credit is under it.

The alignment belongs to the block that holds both and not to either line, so
they cannot come apart at one breakpoint and not the other: centred while the
footer is a stacked column, pinned to the signature's edge from `sm` up. That
also moved `shrink-0` from the signature to the block, which is the flex item
now — the path is mono and cannot be truncated without ceasing to read as a
path.

**The heart is Phosphor's `Heart`, not ❤️.** The obvious objection is that the
sentence was written with the emoji in it, and the answer is not consistency for
its own sake: an emoji is a DIFFERENT DRAWING on every operating system, so the
one mark that says which library built the page would be a different mark per
visitor. The library has drawn in one hand since
[§ 51](051-phosphor-only-hand.md) and `Icon` fixes the glyph at 1em, so it tracks
the 13px line it sits on instead of whatever the platform font decides. It
carries no `label`: the sentence reads whole without it, so it is decorative and
`Icon` hides it.

It needs `inline`, and it is the only icon in the library that does. Tailwind's
preflight sets `svg { display: block }`, which is right for every other icon here
because every other icon sits in a flex row; this is the first one inside a
sentence, and as a block it took a line of its own underneath the text. Fixed at
this call site and not in `Icon`, whose base class lays out every icon in five
projects, for a failure that is visible the instant anybody looks at it.

**The word is underlined, and the suite is why.** A link inside a line of text
has to be distinguishable from that text by something other than colour, or
carry 3:1 against it — WCAG 1.4.1, which axe reports as `link-in-text-block`.
Both candidate colours fail: `textSecondary` on `textMuted` is 1.7:1 and the
accent on `textMuted` is 1.85:1, and the axe suite named both numbers before the
line ever existed outside this repo. So the second signal is the underline, at
`decoration-1 underline-offset-4` — which is not invented here either: it is what
`NavItem` draws on the section you are on and what `Button variant="link"` draws
on hover.

This is the second time this round that the story suite caught something no
review would have. It is the argument for the rule that every state gets a story.

**Where the URL lives.** `naming.libraryUrl`, beside `naming.domain`, for the
reason the domain is there: one string, five projects. It is the same URL as
`homepage` in `package.json` and it cannot be derived from it, because
`src/tokens/` imports nothing — the constraint that outranks everything else
here. So `check:exports` compares the two on every build. Without that check,
moving the Storybook would update what npm prints and leave five production
footers pointing at the old address, and the only way to find out would be for
somebody to click.

**Action in the document:** the manual has no rule for crediting the library, and
it now has a component that can. Add a line saying the credit is optional, that
it is the footer's last line, and that its mark is Phosphor's filled `Heart` in
biolume and never an emoji.
