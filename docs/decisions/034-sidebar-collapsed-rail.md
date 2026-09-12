# § 34 · The collapsed rail gets in, and the reason it was ruled out is gone

**Release:** 0.7.0 · **Status:** Reversed in § 48 · [index](README.md)

---

**Backlog:** «Lo que NO se puede componer es el rail plegado a solo iconos, y el
motivo no es el contenedor: el sistema no tiene iconos de navegación […] Un rail
plegado con la inicial de cada sección es peor que no plegarlo.»
**Code:** `SidebarNav` takes `collapsed` and `onCollapsedChange`.

**The premise was right and it expired.** That entry ruled out the rail on one
argument, and it was a good one: with no icons, a collapsed sidebar shows each
section's initial, and eleven letters in a column is worse than not collapsing.
§ 29 removed the premise — `SidebarItem` takes an `icon`, and the panel story has
eleven of them.

**The toggle's own glyph comes from `lib/glyphs.tsx` and not from Phosphor.**
`SidebarNav` lives in the root barrel, and the root must not depend on an
optional peer: a project that installs no icon set still gets the button. There
was nothing to add either — `ChevronLeft` and `ChevronRight` were already in the
minimum set, and a chevron pointing at the edge it folds into is the plainest
thing a collapse control can be. The file did not grow, which is the promise it
makes.

**It is controlled and there is no uncontrolled mode.** This state is almost
always persisted — a cookie, `localStorage`, a user preference — and an internal
state would fight the one the project already keeps. It is the same line the
library draws everywhere else: `NewsletterForm` takes `state` and does no `POST`,
`Nav` takes `actions` and knows nothing about sessions.

`onCollapsedChange` is also what makes the toggle appear. `collapsed` alone is a
rail with no way out of it, which is a legitimate layout and not an accident.

**It does not transition.** The system's only transition animates colour and
border, and a rail that slides open is the entrance animation this library does
not have. It is the same call as the `Switch` knob, which changes position
without moving.

**The names survive the collapse.** Collapsed, an item's label goes to `sr-only`
and is not removed — a rail of bare glyphs with no accessible name is a list of
links called «enlace, enlace, enlace», and the person who most needs the label is
the one who cannot see the icon that replaced it. The group labels do the same,
so «lista Ventas, 3 elementos» still gets announced; visually the block becomes a
rule.

**The widths are tokens and the component owns them, but only when it can
collapse.** `size.sidebar` at 256 and `size.sidebarRail` at 56 — the rail is
`navCompact`'s height, so a panel's bar and its rail meet in a square corner
instead of a step. The layout beside a collapsible sidebar has to reserve one of
the two and cannot know which; a sidebar that never collapses is still just a box
the layout sizes, and nothing about it changes.

**`brand` is hidden in the rail and `mark` takes its place.** A wordmark does not
fit in 56px and the component cannot trim somebody else's markup, so it asks for
the other one rather than guessing.

**`user` is a slot**, for the same reason `Nav`'s user menu goes in `actions`: an
avatar needs a session and a sign-out route.

**Action in the document:** add the rail to the admin's description in § 09 —
«barra lateral de 256, rail de 56 a solo iconos».

---
