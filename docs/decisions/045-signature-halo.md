# § 45 · The signature's mark is the halo, and the library had invented the blink

**Release:** 0.8.0 · [index](README.md)

---

**System rule:** the system does not animate, and § 23 admitted a fifth exception
— the footer's caret — on an argument written specifically for it.

**What stayed:** `pulse-accent`, the exception the CLI signature actually ends
in, and the `caret` utility is removed. § 23 is reversed, and the count goes
back to **five exceptions with one criterion** rather than up to six.

**The entry exists because of how § 23 got there.** It reasoned, correctly and
from first principles, about what a terminal caret is: a prompt whose caret does
not blink is a terminal that has hung, `step-end` because a real caret is on or
off, 1.06s because that is a VT100. Every sentence of it is true. What it never
did was look at what the signature it was describing already had.

**Both sites had a mark, and it was not a blink.** `cursos` has
`@keyframes cursor-ping` in `app/globals.css` and `eduardoalvarez.dev` has the
same keyframes in `src/assets/styles/base.css`, under the same name, with the
same 1.5s `ease-in-out`: a solid bar that grows a `box-shadow` ring out to 5px
and lets it fade. Two independent projects, one effect, written before this
library had a `Footer` at all.

**And the blog's copy is still there with nothing rendering it.** Its
`site-footer.tsx` imports `Footer` from the package, so the day it adopted the
component its signature started blinking and `.animate-cursor-ping` became dead
CSS in its own stylesheet. That is what this library replacing an identity it was
supposed to be recording looks like from the outside: not an argument anybody
lost, just an effect that quietly stopped being drawn.

So the direction is the one most of this repo's decisions take — `Nav`'s
`size="compact"`, `control.iconSm`, the sidebar rail all came UP from a project —
and this one had gone the other way without noticing.

**It is a new utility and not a setting on the old one.** § 23 argued the
caret's case ON `step-end`: easing it «turns a terminal into a pulsing dot, which
is the decoration the rule exists to keep out». A halo folded into `caret` would
be that paragraph contradicting itself under its own name. So the halo arrives as
`pulse-accent`, with its own name and its own reason.

**And `caret` goes.** It was kept for a first pass on the grounds that a terminal
caret is a real thing to want and that a published utility is not withdrawn the
day its one consumer changes its mind. Both halves are true and neither is a
reason here. It had no consumer to change its mind: nothing in the library drew
it after the footer stopped, no project ever wrote the class, and the argument
that justified it was reasoned from first principles about terminals instead of
read off the two sites that already had a signature. That is the exact failure
this entry is about — leaving the utility published leaves the invention in the
package under a label that makes it look like a feature. A motion exception in
this system is a thing something draws; one that nothing draws is not an
exception, it is a leftover.

It is a break for anyone who wrote `motion-safe:caret` by hand. Nobody did — the
four consuming projects were checked — and if someone had, the failure would have
been silent, which is the argument for removing it while the surface is still
small rather than after.

**Which criterion it lands on.** § 23 split the rule in two: four exceptions are
feedback about progress or spatial continuity, and the caret was legibility. The
halo is the progress half — a prompt that radiates says the terminal is live,
which is what the button spinner says and what a still mark cannot. It needed no
new criterion, which is the test a new exception has to pass, and it is the test
§ 23 waived for itself.

**The geometry came with it, and it is not a detail.** The mark is a 2px bar and
not the half-em block the library drew. A halo needs something thin to radiate
from: around a block the ring reads as a glowing rectangle, which is the shape
the bar exists to avoid. Height stays `1em` rather than `cursos`'s fixed 12px so
the mark tracks the text, and the radius is `rounded-pill` rather than Tailwind's
`rounded-sm` — on a 2px bar the two are indistinguishable, and `--radius-sm` is a
name consuming projects redefine, `cursos` and `blog-content-manager` both do.

**The one thing NOT copied is `motion-safe`.** `cursos`'s span animates
regardless of the setting. The blog's was guarded, every other exception in this
system is guarded, and at rest the bar is simply solid — a mark at rest, not a
mark that is missing. A project that wants to override that is overriding an
accessibility default, and it does not get to do it by the library forgetting.

**The colour is the token.** `cursos` wrote the halo against its own `--primary`,
which is a different teal and freezes to whichever mode was active; the blog
hardcoded `rgba(53, 214, 192, 0.7)`, which is this accent at 70 % and goes stale
the day the accent moves. `var(--color-accent)` is neither.

**What it costs.** `eduardoalvarez.dev` uses this `Footer`, so its signature
changes on upgrade — back to what that site drew before it migrated. It can also
delete its dead `cursor-ping` keyframes.

**And what it gives back is the rule's shape.** § 23 is the entry that split the
criterion in two so the caret could get in, and the legibility half it opened
never held anything else. With the caret gone there are **five** exceptions — the
button spinner, the side panel, the skeleton shimmer, the accordion height and
the halo — and all five are the same thing: feedback about progress or about
spatial continuity. **One criterion.** A sixth lands on it or it does not exist,
and «write a second criterion for it» stops being available, which is what § 23
did and what took two corrections to undo.

**Action in the document:** the motion section gets the halo as the signature's
mark, with its bar geometry, and the blinking caret comes out of the footer's
specification. The exception list is five with one criterion.

---
