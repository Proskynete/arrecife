# § 46 · The doctor stops asking `links` for a directive it must not add

**Release:** 0.8.0 · [index](README.md)

---

**System rule, from § 33:** the two silent failures get a command. `npx arrecife`
checks that a project importing the tokens declares the `@source` Tailwind needs
to see inside `node_modules`.

**What stayed:** the `@source` is required only when the project imports a subpath
that BRINGS MARKUP. Importing the tokens is no longer treated as the same thing
as rendering a component.

**It earned its salary and it overreached in the same week.** In
`blog-content-manager` it found both failures at once — no `@source` and a
stomped `--color-accent` — which had been mounting the library's components
unstyled and grey for months. In `links` it asked for a directive that project
must not have: nothing there renders a library component, everything is an Astro
replica guarded by `check:replica`, and adding the line takes the stylesheet from
**16 KB to 52 KB**, measured, all of it generating classes for markup that does
not exist.

**The distinction is which subpath is imported.** `./tokens` and `./theme` are
values. `./social/data` is shapes. `./variants` does hand back Tailwind classes
and still needs nothing, which is the case worth spelling out: the project writes
those classes into its OWN files, and those are files Tailwind already scans. What
`@source` buys is visibility into `node_modules`, and a project on those subpaths
renders nothing there. The root barrel, `./brand`, `./social`, `./icons`, `./form`
and `./chart` do.

**A note and not silence.** A project on the portable subpaths is told the line is
not needed and why, because «no output» and «checked, and you are fine» are
different answers and the second is the one a person running a doctor is asking
for.

**And it names the import.** The message points at the file and the specifier that
proved markup is being rendered. «Add an `@source`» is an instruction; «`app/page.tsx`
imports the root barrel, so add an `@source`» is the reason, and the reason is what
decides whether the next project understands when it needs the line.

**Action in the document:** none. It is a check, not an identity decision.

---
