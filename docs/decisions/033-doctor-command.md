# § 33 · The two silent failures get a command, not another paragraph

**Release:** 0.7.0 · [index](README.md)

---

**Backlog:** the shadcn namespace collision «merece un aviso en la guía de
migración, o un check que la detecte», and the missing `@source` «un aviso en
desarrollo cuando una clase conocida no resuelve ahorraría el rato».
**Code:** `npx arrecife`, published as the package's `bin`.

**Why a command and not the paragraph the backlog offered first.** Both of these
already WERE a paragraph. The `@source` line has been in the README since 0.3.0
and was forgotten in `cursos` anyway — because until a project uses a component
and not just a token it does not need the line, so the paragraph is read a
version before it applies. This library exists because a rule that is only
written down drifts, and a rule that fails silently drifts fastest.

**What makes them worth a command is that neither produces an error.**

Without `@source`, Tailwind purges every class the components emit — `p-step-lg`,
`rounded-card`, `border-hairline` — because it does not scan `node_modules`. No
console error, no build warning, no undefined class. The component mounts,
undressed. It was the blog's E2E suite that caught it, not the build.

With shadcn's `@theme inline { --color-accent: var(--accent); }`, **88 classes
inside the library's own components** painted grey — 28 `text-accent`, 26
`outline-accent`, 15 `bg-accent`, 12 `border-accent`. shadcn's `--accent` is the
hover surface, `#17303E`; ours is the brand turquoise, `#35D6C0`. Buttons, focus
rings and badges came out the colour of a surface and it looked as though the
migration had achieved nothing.

**It reports the value on each side rather than just the name**, because four of
the five collisions are harmless. `background`, `border`, `warm` and `warm-hover`
collide with values both sides agree on; only `accent` breaks. A check that
failed on all five would be turned off in a week, and the four are still worth
saying out loud — they are a coincidence, not a contract.

**It computes the `@source` path from the SHEET and not from the project root**,
which is the half that gets written wrong: a stylesheet in `src/styles/` goes up
two levels. Two of the six tests exist only for that.

**It is a copy into `dist/` and not a tsup entry.** `doctor.mjs` imports nothing
outside `node:`, so there is nothing to bundle; running it through the bundler
would give it a chunk to depend on and a name that moves, and esbuild strips the
shebang. `check:exports` now checks `bin` too — a missing `main` is an import
error the moment somebody writes the import, and a missing `bin` is «command not
found» printed to a person who is already hunting something silently broken.

**Action in the document:** none. It describes nothing the identity documents
cover.

---
