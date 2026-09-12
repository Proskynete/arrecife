# § 23 · The footer's caret blinks

**Release:** 0.6.0 · **Status:** Reversed in § 45 · [index](README.md)

---

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

**REVERSED in § 45, and not because the argument above is wrong.** Everything in
this entry about what a terminal caret is still holds. What it never checked is
whether the signature it was describing already had a mark — and it did, in both
sites that draw it, and the mark was a halo. This entry reasoned its way to an
invention from first principles while the answer was sitting in two
`globals.css`. The `caret` utility is **gone**, not merely unused: see § 45.

Which takes the count in the paragraph above with it. The legibility half this
entry opened had exactly one member for its whole life, and with that member
removed the criterion is **one** again — progress or spatial continuity — and
there are **five** exceptions, the fifth being the halo of § 45.

**Action in the document:** none any more — see § 45, which carries the action
for the mark that replaced it.

---
