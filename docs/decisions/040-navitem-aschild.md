# § 40 · `NavItem asChild` was declared, typed and impossible to call

**Release:** 0.8.0 · [index](README.md)

---

**System rule:** `asChild` is how the framework's `Link` gets plugged in without
the library depending on a router. It is in the pattern every component follows.

**What stayed:** `children` goes through Radix's `Slottable`.

**It failed 100 % of the time.**

    Slot failed to slot onto its children.
    Expected a single React element child or `Slottable`.

`NavItem` wraps `children` with its own `<span aria-hidden>./</span>`, and with
brackets on top of that when the item is active. So `Slot` was handed three or
four children where it takes one, and there was no way to call the prop that
worked.

**What makes it worth an entry is how it passed.** `tsc` was green and `pnpm
build` was green, because neither of them looks at the SHAPE of what a component
puts inside a Slot. It broke at render, in the consuming project, which is the
most expensive place to find anything. Meanwhile `cursos` used `<NavItem href>`
bare, and that link cost a full page load instead of a client transition.

`Slottable` exists for exactly this: it marks which child the router's `Link`
replaces and leaves the component's own decoration alone. It renders as a plain
fragment when the root is an `<a>`, so the non-`asChild` path is unchanged.

**Where else this shape exists.** `FooterLink` and `SidebarItem` pass `children`
straight through with nothing of their own around it, so `Slot` gets its one
child and they were never affected. The rule is narrower than «components with
`asChild`»: it is «components with `asChild` that add nodes of their own», and
`NavItem` was the only one.

**Action in the document:** none. It is a bug, not an identity decision.

---
