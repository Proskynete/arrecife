# § 22 · A dense icon size, for the one admin app

**Release:** 0.6.0 · [index](README.md)

---

**Document:** four control sizes — `sm 8/14 · md 12/22 · lg 15/30 · icon 42×42`.
**Code:** the same four, plus `icon-sm` at 32×32.

42 is the right measure for a control you hit with a thumb, and four of the five
projects are reading sites where that fits. `cursos` is the odd one out: it is
the only admin app of the set, with three actions per table row, and at 42 the
row grows with them. Before migrating it used 24 and 28.

**It is 32 and not 28**, which is the number that project actually had. 32 is
`sm`'s height, so a dense icon button lines up with a small text button and a
toolbar mixing the two stays on one baseline. 28 would have been a fifth height
that matches nothing else in the system.

The alternative the backlog proposed — a separate `IconAction` component with its
own scale, on the argument that a row action is not a page button — was not taken
for now. It is probably the better answer and it is a bigger change; a size on
the control that already exists unblocks the eight buttons without inventing a
second vocabulary for the same thing. If the admin grows enough that row actions
start needing their own hover, focus and spacing rules, that is when the separate
component earns its place.

**Action in the document:** add `icon-sm 32×32` to the controls table, with the
note that it is for dense UI and not a replacement for `icon`.

---
