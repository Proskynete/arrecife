# § 56 · Storybook gets a way in, and the agent block is generated

**Release:** 0.10.0 · [index](README.md)

---

**System rule:** none. This is documentation architecture.

**What the code did:** Storybook published fifty component pages and no page that
said how to get one of them onto a screen. That answer lived in `README.md` and
in `llms.txt`, which are two files somebody reading the published site does not
have open.

**What was wrong with it.** The three things that actually stop an adoption are
all setup and none of them is discoverable from a component page: the second
`@import` without which every class silently resolves to nothing, the font names
that fall back with no console error, and `@source`, without which Tailwind purges
the library's classes out of the build. All three fail QUIETLY, which is why a
component page cannot warn about them — the component looks broken instead.

**What it is now:** `Arrecife/Getting started`, pinned first in the sidebar by
`storySort`, holding the install and nothing about any component. And on every
component's documentation page, a generated «Using it with an agent» block.

**Why the agent block is generated and not written.** The alternative is the same
paragraph in fifty `*.stories.tsx` files, which drifts the first time an import
path changes — the exact failure this library exists to prevent, reproduced inside
it. It is built from the two facts the docs page already holds: the story's
`title`, which says which subpath the component is published at, and its
`component`, which says what the import is called.

**What the prompt says, and what it deliberately does not.** One instruction —
read `llms.txt` first — and a list of the four mistakes an agent makes on its
own. It does not paste the component's API into the prompt: `llms.txt` is
generated from the TypeScript compiler on every build and travels inside the
tarball, so the agent already has the real thing on disk. A pasted API is a copy,
and a copy goes stale.

**The cost, since it is a real one.** `parameters.docs.page` REPLACES the default
page rather than extending it, so `.storybook/docs-page.tsx` re-lists Storybook's
five default blocks. If Storybook adds a sixth, it does not appear until that file
is updated, and nothing will say so.

**Action in the document:** none. It is documentation architecture and the
canvases have nothing to say about it.
