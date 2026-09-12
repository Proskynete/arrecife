# § 52 · The alert's mark stops being a mono character

**Release:** 0.10.0 · [index](README.md)

---

**System rule:** the CLI aesthetic is typographic. The `❯` in the code block's
bar, the `$` in the footer signature, the `~/` in the nav and the `./` on a nav
item are characters in the mono family, not icons, and that is what makes the
system read like a terminal.

**What the code did:** `Alert` drew its four marks the same way — `✦` for accent,
`✓` for success, `!` for warning, `✕` for error — as mono characters in the
semantic colour.

**What was wrong with it.** The rule describes a PROMPT and an alert's mark is not
one. A prompt is decoration that says «this is a terminal» and carries no meaning;
an alert's mark is the only thing on the block that says which of the four this
is, and at 15px `!` and `✕` are two glyphs of one stroke doing that job. Colour
is the other channel and WCAG 1.4.1 is precisely the rule that colour may not
carry it alone.

**What it is now:** `Info`, `CheckCircle`, `Warning` and `XCircle`, at
`tone="action"`.

**Where the line is drawn, because this is the entry that will be cited to move
it further.** The four marks were the only mono glyphs in this system carrying
MEANING. `~/`, `./`, `$` and `❯` carry none — remove any of them and nothing
about the page becomes ambiguous — so they stay, and an argument that «the alert
went, so the prompt can go» is not this entry.

**Why the outlined pair and not `…Fill`.** `tone` names what an icon is doing.
An alert's mark is not a state within a set, so it is not `current`; picking
`fill` because it reads heavier is choosing a weight by hand, which is the thing
`tone` exists to prevent.

**Action in the document:** the alert section specifies the four mono characters.
Replace them with the four Phosphor names, and keep the sentence that the mark is
the semantic colour while the title is not — that half was right and § 4b already
argued it.
