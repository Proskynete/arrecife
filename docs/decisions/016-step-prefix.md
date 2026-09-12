# § 16 · Page rhythm carries `step` in the name

**Release:** 0.6.0 · [index](README.md)

---

**Document:** the spacing scale is `xs 8 · sm 12 · md 16 · lg 26 · xl 40`.
**Code:** the same five values, under the names `stepXs`…`stepXl`.

This is not a disagreement of judgement: it is a name clash with Tailwind, and
the values do not move by a pixel.

In Tailwind v4 the custom property's name **is** the API, and `--spacing-*` does
not only feed `p-*`, `m-*` and `gap-*`: it also resolves `w-*`, `h-*`, `max-w-*`,
`min-w-*`, `max-h-*`, `min-h-*`, `basis-*` and `size-*`, where it **beats** the
`--container-*` scale. Our steps were named exactly like that scale, so in any
project importing `theme.css`:

| Class | Tailwind | With arrecife 0.2.0 |
| --- | --- | --- |
| `max-w-sm` | 384px | **12px** |
| `max-w-md` | 448px | **16px** |
| `max-w-lg` | 512px | **26px** |
| `max-w-xl` | 576px | **40px** |

Redeclaring `--container-sm` and company does **not** fix it: it was tried, and
`--spacing-*` wins anyway. The only way out was for the library to stop using
those names.

The prefix follows the pattern `control` already had — a named group inside
`--spacing-*`, which yields `px-control-md` — so it does not introduce a new
shape: it extends one. `section` goes without a prefix because it clashes with
nothing.

**What to take away, which matters more than the rename:** nothing caught the
bug. Not the build, not the types, not Storybook, not the axe suite in both
modes. It lived in the gap between what the library **publishes** and what the
library **uses**: Arrecife does not write `max-w-sm` internally, so no story
could show it. It was found in production, on `cursos.eduardoalvarez.dev`, with a
hero paragraph coming out one word per line.

Hence the two new defences, and there are two because they are independent lines
of reasoning:

- `scripts/check-tokens-namespace.mjs` fails the build if one of our tokens
  stomps a name Tailwind reserves. The list of names is not written by hand: it
  is read from the installed version's `theme.css`, so a new Tailwind step gets
  detected when the dependency is updated.
- `scripts/theme-css.test.mjs` compiles Tailwind for real with the tokens on top
  and checks what each utility resolves to. It is the repo's first test that
  measures what is published and not what is used.

The guide for the projects consuming the library is in
[`../runbooks/migration-0.3.md`](../runbooks/migration-0.3.md).

**Action in the document:** none about the values. Note in the spacing table that
the utility is `p-step-md`, not `p-md`.

---
