# § 54 · Three rows that pushed the page sideways, and they do not get the same answer

**Release:** 0.10.0 · [index](README.md)

---

**System rule:** none. The document specifies components at the width it draws
them at.

**What the code did:** `Nav`'s item list, `TabsList` and `PaginationContent` were
all a single unwrapped row. On a 360px screen each is wider than the viewport, and
what a reader gets is not a clipped component — it is horizontal scroll on the
whole document, with the nav bar's `sticky` making it worse.

**What it is now**, and the three answers are different on purpose:

| | | why |
| --- | --- | --- |
| `Nav` | scrolls | the row is one object; splitting the sections across two lines under a 64px bar changes what the bar IS |
| `TabsList` | scrolls | a tab list is one control. Wrapped, the second line reads as a second group of tabs |
| `PaginationContent` | wraps | a list of interchangeable numbers. A second line is more of the same line |

**What made each one work is not the overflow class.** `Nav`'s `<ul>` needed
`w-max`, or inside a scroller it shrinks to the width available and squashes six
mono labels instead of overflowing them. `TabsList`'s triggers needed `shrink-0`
for the same reason from the other side — they were giving up width first and the
labels ran out of their own pills. In both cases `overflow-x-auto` alone changed
nothing visible, which is the kind of fix that looks applied and is not.

**Why `Nav` does not hide its items below a breakpoint**, which is the obvious
answer and the wrong one for a library. Hiding navigation is only safe if
something else exposes it, and that something is a drawer the project owns —
`eduardoalvarez.dev` composes one out of `Sheet` and puts it in `actions`. A `Nav`
that hid its own items would leave every consumer without a drawer with no
navigation at all, and it would do it silently. The library cannot ship the drawer
either: it needs the project's route list and its router.

**What this leaves open, and it belongs to the project.** `eduardoalvarez.dev`
renders both — the item row AND the drawer trigger — at every width, so on a
phone it now shows a scrolling nav next to a hamburger. That is a composition
bug in that project and the fix is one `hidden sm:block` around its `NavLinks`.
The library cannot make that decision for it.

**Action in the document:** the components are specified at one width. Say what
each of the three does when there is not enough of it: the nav row and the tab
list scroll, the pagination row wraps and centres.
