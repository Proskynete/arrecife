# Migrating to arrecife 0.3.0

0.3.0 renames the five spacing steps. It is a breaking change and it is the fix
for a bug that had been silently breaking the consuming projects since 0.1.0.

Read it all before touching anything: **half the work is not renaming classes, it
is finding out which widths you had broken without knowing.**

---

## What was happening

In Tailwind v4, `--spacing-*` does not only feed `p-*`, `m-*` and `gap-*`. It
also resolves `w-*`, `h-*`, `max-w-*`, `min-w-*`, `max-h-*`, `min-h-*`, `basis-*`
and `size-*` — and there it **beats** the `--container-*` scale.

The tokens declared the steps as `xs, sm, md, lg, xl`, which are exactly the
names of that scale. On importing `tokens/theme.css`, ours eclipsed Tailwind's:

```css
/* From the compiled CSS of a project on arrecife 0.2.0 */
.max-w-xl { max-width: var(--spacing-xl) }   /* 40px */
.max-w-sm { max-width: var(--spacing-sm) }   /* 12px */
```

| Class | Tailwind | With arrecife 0.2.0 |
| --- | --- | --- |
| `max-w-sm` | 384px | **12px** |
| `max-w-md` | 448px | **16px** |
| `max-w-lg` | 512px | **26px** |
| `max-w-xl` | 576px | **40px** |

Nothing warned. It is not a compilation error and not a warning: the class
exists, the CSS is valid and the browser happily applies 12px. It was found on
`cursos.eduardoalvarez.dev`, with the hero paragraph coming out one word per
line.

Redeclaring `--container-sm` and company in the project does **not** fix it: it
was tried, and `--spacing-*` wins resolution anyway. The only way out was for the
library to stop using those names.

---

## What changes

The five steps now carry `step` in the name. **The values do not move by a
pixel.**

| Before | Now | Value |
| --- | --- | --- |
| `--spacing-xs` | `--spacing-step-xs` | 8px |
| `--spacing-sm` | `--spacing-step-sm` | 12px |
| `--spacing-md` | `--spacing-step-md` | 16px |
| `--spacing-lg` | `--spacing-step-lg` | 26px |
| `--spacing-xl` | `--spacing-step-xl` | 40px |

In the utilities: `p-md` → `p-step-md`, `gap-sm` → `gap-step-sm`, `py-xl` →
`py-step-xl`, `mb-lg` → `mb-step-lg`.

In the TypeScript object, for Satori templates and generators: `spacing.md` →
`spacing.stepMd`.

**What does NOT change:** `--spacing-section`, `--spacing-nav`,
`--spacing-control-sm|md|lg|icon`, every `--container-*`, `--radius-*`,
`--text-*` and `--color-*`. None of them clashed with anything.

---

## How to migrate

### 1 · Rename the spacing classes

The prefixes affected are all the padding, margin and gap ones: `p px py pt pr pb
pl`, `m mx my mt mr mb ml`, `gap gap-x gap-y`, `space-x space-y`.

```bash
# Review the result before trusting it: the pattern also touches comments.
rg -l --glob '!node_modules' -e '\b(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|space-x|space-y)-(xs|sm|md|lg|xl)\b' \
  | xargs sed -i '' -E 's/\b(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|space-x|space-y)-(xs|sm|md|lg|xl)\b/\1-step-\2/g'
```

Watch out for two things:

- **`sm:` and `md:` are breakpoint variants**, not steps. The pattern above does
  not touch them because it requires a `-` in front, but if you write your own,
  bear it in mind.
- **A `size="md"` or a `variant="lg"` in JSX is not a class.** The pattern does
  not touch those either, for the same reason.

An old name left unmigrated raises **no error**: `p-md` lands on Tailwind's
numeric scale, generates nothing and the element ends up with no padding. Look
for them after migrating:

```bash
rg --glob '!node_modules' -e '\b(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap)-(xs|sm|md|lg|xl)\b'
```

### 2 · Check your `max-w-*`, and this is the part that matters

If your project uses `max-w-xs|sm|md|lg|xl`, `min-w-*`, `w-*`, `h-*`, `basis-*`
or `size-*` with those names, **they were worth the spacing step, not Tailwind's**.
On updating they go back to their correct value on their own, so those blocks are
going to change width — to what they always should have measured.

It is not a regression: it is what the design asked for. But look at them,
because somebody may have compensated for the broken width with an `mx-auto`, a
`w-full` or an arbitrary value that is now redundant.

```bash
rg --glob '!node_modules' -e '\b(max-w|min-w|max-h|min-h|w|h|basis|size)-(3xs|2xs|xs|sm|md|lg|xl)\b'
```

Careful: `w-md`, `h-lg`, `basis-sm` and `size-md` **do not exist in Tailwind**.
They only worked because our `--spacing-*` was inventing them. On updating they
stop generating CSS: replace them with the numeric scale (`w-64`), with a real
`max-w-*`/`min-w-*` or with a library token (`max-w-content`, `max-w-measure`,
`h-nav`).

### 3 · Rebuild and compare

Rebuild the CSS and look at the output, not at the browser: that is where the
difference shows unambiguously.

```bash
rg -n '^\s*\.max-w-(sm|md|lg|xl)' -A1 dist/output.css
# It has to say var(--container-sm), not var(--spacing-sm)
```

---

## While you are at it: the font names

Unrelated to the above, but it bites just as quietly.

The tokens declare the families **by exact name**:

| Utility | Name the token asks for |
| --- | --- |
| `font-display` | `"Bricolage Grotesque"` |
| `font-sans` | `"Geist"` |
| `font-mono` | `"JetBrains Mono"` |

Two projects had them registered in their `@font-face` as
`"Bricolage Grotesque Variable"` and `"Geist Variable"` — the name several font
packages publish them under. With that alias, the display and the mono fall back
to the system font without a single console warning.

An `@font-face`'s `font-family` is an alias the project chooses: change it to the
name in the table and that is it.

```css
@font-face {
  font-family: "Bricolage Grotesque"; /* NOT "Bricolage Grotesque Variable" */
  src: url("/fonts/bricolage-grotesque.woff2") format("woff2-variations");
  font-weight: 200 800;
  font-display: swap;
}
```

---

## So it does not happen again

Nothing caught the bug: not the build, not the types, not Storybook, not the axe
suite in both modes. It lived in the gap between what the library **publishes**
and what the library **uses** — Arrecife does not write `max-w-sm` internally, so
no story could show it.

0.3.0 adds two defences, and there are two because they are independent lines of
reasoning:

- `pnpm check:namespace` (`scripts/check-tokens-namespace.mjs`) fails the build
  if a token stomps a name Tailwind reserves. The list is not written by hand: it
  is read from the installed version's `theme.css`.
- `pnpm test:unit` (`scripts/theme-css.test.mjs`) compiles Tailwind for real with
  the tokens on top and checks what each utility resolves to.

The detail of the decision is in [`decisions.md`](decisions.md) § 16.
