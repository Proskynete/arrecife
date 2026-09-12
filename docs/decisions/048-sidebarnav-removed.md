# § 48 · `SidebarNav` goes, and the entry criterion is why

**Release:** 0.8.0 · [index](README.md)

---

**System rule, from «Decide whether it really gets in»:** it encodes an identity
rule, it has TWO OR MORE CONSUMERS, and it drags in no project infrastructure.
All three at once.

**What stayed:** `SidebarNav`, `SidebarGroup` and `SidebarItem` are removed —
593 lines, plus the `Recipes/Sidebar` composition built on them. § 32 and § 34
are reversed.

**It had the first and the third, and never the second.** The two projects it was
built for each have a sidebar of their own and prefer it: `cursos` uses shadcn's
`components/ui/sidebar.tsx`, `blog-content-manager` has
`src/components/sidebar/Sidebar.tsx`. Neither has ever imported this one. The
other two consumers are reading sites with no sidebar at all.

**The criterion was met on paper by counting the wrong thing.** «Two or more
consumers» was read as two projects that COULD use it — both admin surfaces
existed, both had navigation, so the box was ticked. What it means is two that
DO. A candidate is a hypothesis; a consumer is a fact, and the gap between them
is where a component like this lives for two releases before anyone notices it is
alone.

**§ 34 is the expensive half.** The collapsed rail went in on the strength of the
icon set adopted in § 29 — the reason it had been ruled out was «the system has
no navigation icons», and that stopped being true. The reasoning was sound and it
was answering the wrong question: whether the rail COULD be built, not whether
the project that wanted it was still waiting for it. It was not; it was building
its own.

**Both entries stay, marked rather than deleted, for the reason § 23 does.** What
they argued — a sidebar's sections need blocks, an icon says more than a `>` in a
12px rail — is not what was wrong. What was wrong is that nothing checked who was
going to draw it. This repo now has three of these in one release: the caret, the
loose links and this. All three are the same shape, and the shape has a name —
**the library building for a consumer it has not read.**

**What a project does now.** It builds the sidebar from `Nav` and `Sheet`, which
is what both of them already did, and what the recipe that went with this
demonstrated: `Sheet side="left"` IS the mobile drawer, and a component wrapping
the two is an alias with maintenance.

**Action in the document:** the admin's navigation section comes out of the
specification. What stays is the dosage rule from `../architecture/brand-manual.md` § 09, which
was never about this component.

---
