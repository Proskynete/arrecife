# § 26 · The social icons are published twice, and they are not two ways of writing the same import

**Release:** 0.7.0 · **Status:** Reversed in § 51 · [index](README.md)

---

**What there was:** one export, `export * as social` from the root, with the
reason written above it — one of the nine is called `X`, and an `export const X`
at the root of a component library collides with anything.

The reason was right and it stays. What was missing is that it only ever
considered the NAME, and the shape turned out to matter more.

**What broke.** `blog-content-manager` swapped its two hand-drawn brand SVGs for
the library's and the Next build died at prerender:

```
Error: Element type is invalid: expected a string (for built-in components)
or a class/function (for composite components) but got: undefined
Error occurred prerendering page "/"
```

The component behind it is a **Server** Component rendering
`<social.LinkedIn className="h-6 w-6" />`.

**It is not the `"use client"` bug, which lands in this same release.** That one
was the published `dist` not carrying the directive at all, so Next evaluated
Radix on the server. This is the opposite side of the same boundary: the directive turns the MODULE into a client module, but
what crosses into a Server Component is a client reference **per export**. The
properties of a plain object are not exports, so from the server `social` is one
reference and `social.LinkedIn` is `undefined` — and `undefined` as an element
type is exactly the error above.

It only shows up in Next with the App Router. In Astro the frontmatter resolves
at build time and there is no boundary to cross, which is why
`eduardoalvarez.dev` has been rendering `social.GitHub` in its footer without
noticing.

**What stayed:** a subpath of its own, `./social`, with the nine icons loose —
and the root keeps the namespace, unchanged.

The backlog asked only for the loose exports, at the root, beside the namespace.
That fixes the name resolution and **not the problem**: the root carries
`"use client"`, so a Server Component importing a loose `LinkedIn` from it still
opens a client boundary — for two `<svg>` with no state — and pays for the whole
barrel to get there. The subpath is what actually fixes it, because it carries no
directive: the icon renders on the server and ships no client JS. Measured on the
built `dist`, `./social` pulls 5.6 KB and imports nothing but
`react/jsx-runtime`; the root is 116 KB.

So the two are not redundant and the documentation does not present them as
taste:

| Form | When |
| --- | --- |
| `import { LinkedIn } from '@eduardoalvarez/arrecife/social'` | Always, unless you are iterating the catalogue. Mandatory from a Server Component |
| `import { social } from '@eduardoalvarez/arrecife'` | Iterating the catalogue — a footer that maps its links to `social[name]` |

`X` is still `X` in the subpath, and it still collides. The difference is that
there you asked for icons and the fix is one word: `import { X as XIcon }`. At
the root you asked for the library, and the collision arrives with something you
did not ask for. That is why the namespace does not go away.

**A third category in `check:exports`.** `./social` renders React, so it can
never be portable, and it must not be a client entry either — that is the whole
point. The directive check only looked at `PORTABLE`, so it had nothing to say
about it, and adding it to `CLIENT_ENTRIES` by mistake would have quietly undone
the fix. It now checks every subpath: the directive is on `CLIENT_ENTRIES` and
nowhere else, which is what its own docstring already claimed.

**`lib/` is what is NOT published.** The file moved from `src/lib/social.tsx` to
`src/social/index.tsx`, which is the same rule every other subpath already
follows. It also sharpens the sentence next to it: `lib/glyphs.tsx` stays inside
because `lib/` is the inside, not because somebody remembers to leave it there.

**Action in the document:** none. Nothing about the drawing rule changes — brands
solid, functional at 1.6 stroke, 1em, `currentColor`.

---
