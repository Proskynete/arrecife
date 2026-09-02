# AGENTS.md · Arrecife

Instructions for an agent working **inside** this repository.

If what you are doing is writing code in a project that **consumes** the library,
the document is `llms.txt`, not this one.

`CLAUDE.md` is a symlink to this file: there is one document and everybody reads
it.

---

## What this repo is

`@eduardoalvarez/arrecife`: the component library of Eduardo Álvarez's visual
identity. React 19, TypeScript, Tailwind v4, shadcn/ui on top of Radix, tsup,
Storybook. It is consumed by five projects, an Open Graph generator running on
Satori and an Astro site that mounts no React.

It exists for a concrete reason: those pieces were written separately in each
project and drifted apart. The highlighting palette lived for months with the
wrong color because the identity document was not greppable from the code.
Almost everything that follows is a defence against that class of failure.

The published Storybook is <https://arrecife.eduardoalvarez.dev>.

## The constraint that outranks everything else

**`src/tokens/` imports nothing.** Not React, not components, not third-party
CSS.

It is the only subpackage the five projects, Satori and a React-less Astro can
all consume. The moment a token ends up depending on a component, the library
stops being portable and `./og` and `./shiki` stop existing.

`src/theme/` lives under the same rule for the same reason: it is consumed by the
`<head>` of an Astro that mounts no React. It is not a token, so `check:tokens`
does not cover it; `check:exports` does, by following the imports of the
published `dist/`.

This is not a recommendation: `pnpm check:tokens` verifies it on every build,
ESLint says so in the editor, and `check:exports` checks that the portable
subpaths bring no React into the published `dist/`.

## Environment

```bash
pnpm install          # pnpm 11.20.0, Node >= 22.18.0
pnpm storybook        # generates the tokens and serves Storybook on 6006
```

**Use `pnpm`.** The repo has a `pnpm-workspace.yaml` and a pinned
`packageManager`; `npm install` or `yarn` break the lockfile.

| Command                             | What it does                                              |
| ----------------------------------- | --------------------------------------------------------- |
| `pnpm build`                        | token purity → tsup → `theme.css` → `llms.txt`            |
| `pnpm typecheck`                    | `tsc --noEmit`                                            |
| `pnpm lint`                         | ESLint, including the ban on literal hexes                |
| `pnpm test`                         | token regression + axe in **both** modes                  |
| `pnpm test:unit`                    | compiles Tailwind and checks what each utility resolves to |
| `pnpm test:dark` / `pnpm test:light`| axe over the stories, one mode each                       |
| `pnpm test:watch`                   | the suite in watch mode, dark                             |
| `pnpm check:tokens`                 | fails if `src/tokens/` imports anything from outside      |
| `pnpm check:namespace`              | fails if a token stomps a Tailwind name                   |
| `pnpm check:exports`                | verifies `dist/` holds what `exports` promises, that the portable subpaths bring no React, and that `"use client"` is on the client entries and only there |
| `pnpm check:llms`                   | fails if `llms.txt` does not match the types              |
| `pnpm check:release`                | validates the release-please configuration                |
| `pnpm build:tokens`                 | regenerates `dist/tokens/theme.css`                       |
| `pnpm build:llms`                   | regenerates `llms.txt`                                    |
| `pnpm build-storybook`              | builds Storybook into `storybook-static/`                 |

Before calling a change done: `pnpm lint`, `pnpm typecheck` and `pnpm test`. The
suite runs in a real Chromium and takes a while; do not skip it when the change
touches color, contrast or markup.

## Repo map

```
src/
  tokens/       tokens.ts is THE source. It imports nothing. Published at ./tokens
  primitives/   the 31 primitives on shadcn/Radix, each with its .stories.tsx beside it
  components/   the identity pieces, one folder per component
  brand/        logo, isotype, mascot and the PNG catalog
  social/       the nine social icons. Published at ./social, with no `"use client"`
  theme/        light/dark mode and `themeScript`. No React. Published at ./theme
  variants/     the cva definitions and the class constants. No React. Published at ./variants
  og/           Satori templates. No React. Published at ./og
  shiki/        the highlighting theme. No React. Published at ./shiki
  form/         the form layer. Published at ./form; asks for react-hook-form
  chart/        the chart chassis. Published at ./chart; asks for recharts
  lib/          cn and the inline glyphs. `lib/` is what is NOT published
stories/        stories that do not belong to a component (tokens, brand, og) and utils
scripts/        the generators and the checks
docs/           the identity documents and the llms.txt template
```

## Generated files: not edited by hand

| File                        | Generated by                                                        | Verified with                 |
| --------------------------- | ------------------------------------------------------------------- | ----------------------------- |
| `dist/tokens/theme.css`     | `scripts/build-tokens.mjs` from `tokens.ts`                          | regenerated on every build    |
| `llms.txt`                  | `scripts/build-llms.mjs` from the types and `docs/llms.template.md`  | `pnpm check:llms`             |
| `CHANGELOG.md`              | release-please, from the commits                                     | —                             |
| `package.json`'s `version`  | release-please                                                       | the workflow compares it with the tag |

If the prose of `llms.txt` needs changing, you edit `docs/llms.template.md` and
run `pnpm build:llms`. The component inventory is **not** touched: it comes out
of the TypeScript compiler, and that is the whole point.

---

## The language of the code

**The code is written in English**: identifiers, comments, error messages, logs,
documentation and commit messages. It was in Spanish until 0.6.0 and the whole
repo was migrated at once — a repo half in each language is worse than either.

The exception is **user-facing copy**, which stays in Spanish: the taglines in
`tokens.ts`, the default labels of `NewsletterForm` and `AvatarUpload`, the demo
content in the stories. All five consuming sites are in Spanish, and translating
those defaults would change what their users read.

So: `MascotFace`, `themeScript`, `faceList`, `gradient-hero` — but
`successMessage = 'Ya estás dentro…'`.

**An `aria-label` is user-facing copy, and it is the most user-facing string
there is**: it is what a screen reader says out loud. This is the half the 0.6.0
sweep got wrong, and it is worth spelling out because the mistake does not look
like one — `aria-label` reads as markup, so it gets swept along with the
identifiers. Eight strings went over: `Pagination`'s next link ended up saying
«Siguiente» on screen and announcing «Página next», which is also WCAG 2.5.3
Label in Name; `AudioPlayer`'s slider announced «Volume» surrounded by
«Silenciar» and «Progreso del audio»; `NewsletterForm`'s field label became
«Email electrónico», which is «correo electrónico» with half the phrase swapped;
`EventCalendar` ended with `./borrar` and `./cancel` in the same row.

**Nothing catches this.** `pnpm test` runs axe over every story, and axe checks
that a control HAS an accessible name, not which language it is in.
`label-content-name-mismatch` — the rule that would have caught the pagination
one — is not among the rules it runs. So the test for whether a string may be
translated is read, not run: **if a reader of a consuming site can see it or hear
it, it stays in Spanish.** Identifiers, comments, JSDoc, story names and the
`Note` blocks are documentation and go in English.

## How a component is created

A component is **two files**, always:

```
src/components/<name-in-kebab>/index.tsx
src/components/<name-in-kebab>/<name-in-kebab>.stories.tsx
```

Primitives go flat, with no folder: `src/primitives/badge.tsx` and
`src/primitives/badge.stories.tsx`.

### 1 · Decide whether it really gets in

The criterion has not changed since Phase 3: **it encodes an identity rule, it
has two or more consumers, and it drags in no project infrastructure.**

All three at once. A component that does a `POST` to an endpoint is
infrastructure: `NewsletterForm` is here because the `POST` was left out and the
component only takes `state` and emits `onSubmitEmail`.

### 2 · The pattern

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../lib/cn.ts';

/**
 * Why the component exists. Which rule of the system it encodes and which
 * alternative was ruled out. This block is read by a human in the repo and by an
 * agent in `llms.txt`: the generator extracts it, so the first sentence has to
 * stand on its own.
 */
const piece = cva('base classes', {
  variants: {
    variant: { … },
  },
  defaultVariants: { variant: 'primary' },
});

export type PieceProps = ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof piece> & {
    /** A prop of its own, with its one-line JSDoc. It shows up in the generated table. */
    icon?: ReactNode;
  };

export function Piece({ className, variant, icon, ...props }: PieceProps) {
  return <div className={cn(piece({ variant }), className)} {...props} />;
}
```

Rules of the pattern, all of them with a reason:

- **`export function`**, not a `const` with an arrow and not `forwardRef`. React
  19 passes `ref` as just another prop.
- **The props type is called `<Component>Props` and is exported.** The `llms.txt`
  generator looks it up by that name for the `Extends` line, and the consuming
  projects import it.
- **`className` is accepted and composed with `cn`**, always last so the call
  site can win.
- **`...props` is spread.** A component that swallows the element's attributes
  forces you to wrap it in a `div` at the call site.
- **`asChild`** whenever the component renders a link or a control: it is how the
  framework's `Link` gets plugged in without the library depending on a router.
- **A composed part that a project might need to reach gets a `…AsChild`.** When
  a component turns data into markup — `ArticleCard` turning strings into badges
  — that markup is unreachable from outside, and an E2E suite ends up selecting
  it by structure or by a style class. Neither is a contract. The slot receives
  the part's data and returns the element; the library keeps the classes and the
  rule. `linkAsChild` in `Breadcrumb` and `tagAsChild` in `ArticleCard` are the
  two precedents, and they have the same signature on purpose. See
  `docs/decisions.md` § 24.
- **JSDoc with the why, not the what.** `/** Primary button */` above `Button`
  informs nobody. The whole repo is written this way; keep it that way.
- **Reuse the primitives.** A component in `components/` that writes its own
  typography classes instead of using `Text` is duplicating the scale.
- **A cva goes in `src/variants/`, not in the component.** The component imports
  it and renders markup; the cva returns a string of classes and brings no React,
  which is what lets `./variants` be portable. If you write a new `cva()` inside
  a `.tsx`, `check:exports` will not stop you — nothing does — but the next
  project that only wants the classes pays for React to get them.
- **A heavy dependency goes in its own subpath**, as an optional peer dependency,
  never hanging off the root. `./form` asks for `react-hook-form` and `./chart`
  asks for `recharts`: if they hung off the main index, the four projects that
  use neither would have to install them anyway so their bundler could resolve an
  import they never execute. A new subpath is declared in `exports`, in
  `tsup.config.ts` — entry **and** `external` — and in the `ENTRIES` and
  `SECTIONS` of `scripts/build-llms.mjs`, or its components disappear from the
  inventory with nothing warning about it.

### 3 · Colors, sizes and spacing

Everything comes from a token, through its Tailwind utility:
`bg-surface-raised`, `text-h1`, `rounded-card`, `p-step-lg`, `gap-step-xs`,
`h-nav`, `max-w-content`.

- **Page rhythm carries `step`**: `p-step-md`, `gap-step-sm`, `py-step-xl`. It is
  not gratuitous verbosity. `xs, sm, md, lg, xl` are the names of Tailwind's
  `--container-*` scale, and a `--spacing-md` of ours was swallowing `max-w-md`
  in every consuming project with no trace. A `p-md` written today does not fail:
  it lands on the numeric scale and does nothing. See `docs/decisions.md` § 16.
- **Zero literal hexes.** ESLint blocks it across all of `src/**` except
  `src/tokens/tokens.ts`, which is where they live.
- **No arbitrary values** like `p-[13px]` or `text-[15px]`: if the value has no
  token, the question is whether it should have one, and that is decided
  beforehand.
- A new token goes into `tokens.ts`, comes out on its own in `theme.css` and is
  used through its utility. There is no intermediate step. If its name collides
  with a Tailwind one, `pnpm check:namespace` stops you: give it a group of its
  own, like `step` or `control`.
- **`danger` is a fill, `error` is text.** They are two different reds in dark
  mode and the same one in light, and the difference is what each has to read
  against: `error` against the page, `danger` against the ink it carries. A
  destructive button is `Button variant="destructive"`; an invalid field's border
  and message are `error`. Neither is a substitute for the other.
- **A destructive button is for the irreversible, and never inside an
  `AlertDialog`.** There the title, the focus on cancel and the no-close-on-
  outside already carry the gravity, and a red button on top of that is shouting.
  The variant exists for the destructive that has none of that around it — a
  table row, a toolbar. See `docs/decisions.md` § 21.

### 4 · Motion

**No entrance animations.** Modals, menus, tooltips and toasts appear where they
will stay. The `Switch` knob changes position without sliding.

The system's only transition is `transition-standard`, and by how the utility is
written it **can only animate color and border**.

There are **four declared exceptions**, all wrapped in `motion-safe` and all with
the same criterion: they are feedback about progress or about spatial continuity,
never decoration.

| Exception | Why |
| --- | --- |
| `Button loading` spinner | A loading button with no movement is indistinguishable from a disabled one |
| `Sheet`'s side panel | A panel entering from an edge slides by definition; held still it is an off-centre modal |
| `Skeleton`'s shimmer | A block that is still and a block that will never load look the same |
| `Accordion`'s height | Nothing appears: a gap opens and what is below shifts. With no transition it is a jump and you lose your place on the page |
| The footer's caret | A prompt whose caret does not blink is a terminal that has hung, and a still block reads as a typo |

The fifth is the one that splits the criterion in two. The first four are
feedback about **progress or spatial continuity**; the caret is neither, and it
gets in on the other half: **it is not decoration, it is what makes the piece
legible as what it is.** The spinner says «this is loading» rather than «this is
disabled»; the caret says «this is a prompt» rather than «this is a string with a
smudge».

A sixth has to land on one of those two, with the argument written in
`docs/decisions.md`, not because it looks better. See § 20 and § 23.

### 5 · Accessibility

- Explicit `cursor-pointer` on everything you press. Tailwind v4 removed it from
  the preflight, so a `<button>` without the class keeps the system arrow. Two
  deliberate exceptions: `Label`, which points at a control but is not the
  control, and the menu items of `Select` and `DropdownMenu`, which stay on
  `cursor-default` because a native menu does not show the pointing hand.
- Visible focus with `focus-visible:outline-2 outline-offset-2 outline-accent`.
- Every control with no text carries an `aria-label`. `Progress` requires `label`
  as a prop.
- No icon libraries: the glyphs are inline in `src/lib/glyphs.tsx`, they inherit
  `currentColor` and they measure 1em.

### 6 · The stories are not optional

`pnpm test` mounts **every story** in Chromium and runs axe over it with
`a11y: { test: 'error' }`, twice, once per mode. A story is at once the published
documentation and the test.

- One story per state, not just the resting one. Hover and focus are forced with
  `parameters: { pseudo: { hover: true } }`, without asking anybody to move a
  mouse over it.
- `title: 'Components/<Name>'` or `'Primitives/<Name>'`.
- Use the helpers in `stories/utils.tsx`: `Row`, `Stack`, `Block`, `Note`,
  `FieldLabel`. `Note` is where you write what to look at in that story.
- Disabling an axe rule needs a reason written beside it, in the specific story
  and never globally. The only precedent is `aria-hidden-focus` on open
  `Select`/`DropdownMenu`, which is a known disagreement between axe and Radix.

### 7 · If you touch a color

Contrast is **measured**, not estimated, and it is recorded in the PR. The suite
in both modes is the judge: putting `light.textMuted` back to its previous value
takes down eight stories with «insufficient color contrast of 4.24».

Two traps already documented, with their table in the README:

- **`surfaceRaised` is the worst case in both modes**, not `background`. It is
  where menus and active tabs live. `textMuted` over `surfaceRaised` gives 4.07
  in dark: `textSecondary` goes there.
- **A semantic color is not a text color over its own tint.** The tint at 8 % is
  a surface, so the text on top of it is a text token. The semantic color stays
  on the border and on the glyph.

### 8 · If you contradict the identity document

`docs/design-system.md` and `docs/brand-manual.md` are the consultable copy of
the Claude Design canvases. When the code and the document do not say the same
thing, the discrepancy is recorded in **`docs/decisions.md`** with what there
was, what stayed and why. It is not resolved silently and it is not left for
later.

---

## Code conventions

- **The code is written in English**: identifiers, comments, error messages,
  logs. User-facing copy stays in Spanish — see «The language of the code» above.
  Look at a neighbouring file before deciding.
- Single quotes, semicolons, 2 spaces, ~90 columns. There is no Prettier: follow
  the style of the file next to you.
- **Imports carry the extension**: `'../lib/cn.ts'`, `'./index.tsx'`. The repo has
  `allowImportingTsExtensions` and does it everywhere.
- **`import type`** for types. ESLint requires it (`consistent-type-imports`), and
  `verbatimModuleSyntax` is on.
- **`any` is banned** (`no-explicit-any` set to `error`).
- `tsconfig` runs strict in the long form: `exactOptionalPropertyTypes`,
  `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`. That is why
  an optional prop is declared `tags?: readonly string[] | undefined` and not
  just with the `?`: with `exactOptionalPropertyTypes`, passing an explicit
  `undefined` does not compile if the type does not allow it.
- Scripts go in `scripts/*.mjs`, with the why in the header and a final
  `console.log` beginning with `arrecife · `.

## Commits, PRs and publishing

Conventional Commits, lowercase and with no trailing period. **In English**, like
the rest of the repo. The PR title is validated by a workflow.

```
feat(components): Hero with the gradient and the corner pose
fix(badge): separate category, status and metric
docs(readme): the third contrast correction
```

Valid scopes, and the list is short on purpose: `tokens`, `primitives`,
`components`, `brand`, `social`, `theme`, `og`, `shiki`, `form`, `chart`,
`storybook`, `a11y`, `deps`, `deps-dev`, `ci`. **A change to the repo's process
goes without a scope** — `docs:`, `ci:`: there is no scope for «how we work», and
an invented one is rejected.

The rule governing the list: **a published subpath in `exports` is a scope.** It
is what `og` and `shiki` already did, it is why `theme`, `form` and `chart`
joined them in 0.4.0 instead of being split between `tokens` and `components`,
and it is why `social` joined in 0.6.0. A new scope with no subpath behind it
does have to be discussed.

Careful with one trap: the workflow validates the **PR title**, not the scopes of
the commits inside it. A `docs(agents):` buried in a PR titled `feat(tokens)!:`
passes the lint and reaches the CHANGELOG with a scope that does not exist. It
happened once already, in 0.3.0.

Branches follow the same vocabulary as the commit:
`type/description-in-english-with-hyphens` — `feat/spacing-with-step-prefix`,
`fix/deps-dev-scope`, `docs/documents-for-agents`.

### One commit is one reviewable unit

**A PR that touches many files is split into several commits.** Not one commit
per file and not one giant one: one commit per thing a reviewer can hold in their
head and accept or reject on its own.

It is not style. Three concrete things depend on it:

- **The review.** A diff of 170 files is not read, it is skimmed. Split into
  «the code», «the workflows», «the documents», each one gets read.
- **`git bisect`.** With one commit, bisect points at «everything» and the
  answer is useless. It is the tool that found the `--spacing-*` clash.
- **The revert.** Undoing one area is a `git revert` of one commit. Inside a
  monolithic commit it is surgery.

The split that works in this repo, in this order:

| Commit | What goes in it |
| --- | --- |
| the code | `src/`, `stories/`, `scripts/`, the configs, `llms.txt` and its template |
| the CI | `.github/` — workflows, actions, issue and PR templates |
| the process documents | `README.md`, `AGENTS.md` |
| the reference documents | `docs/` |
| the metadata | `package.json` fields that are not scripts or `exports` |

**Every commit leaves the tree green.** That is the constraint that decides where
the cut goes, and it is why the first row is one commit and not five: `stories/`
imports `src/`, and `scripts/build-tokens.mjs` reads `tokens.ts`, so a rename
that crosses them cannot be half-applied without `pnpm typecheck` or `pnpm build`
going red. When a change genuinely cannot be split any further, **the commit body
says why** — otherwise the next reader assumes it was laziness.

Within `src/` the same rule applies as soon as the change is not a cross-cutting
rename: a new component, its stories and the token it needs are three commits if
each one stands on its own, and one if they do not.

The types can differ between the commits of one PR — `feat(components)` for the
code and `ci:` for the workflow — as long as the PR title carries the one that
decides the version. See the trap two paragraphs above.

### How the version goes up

**Never edit `version` in `package.json` or `CHANGELOG.md` by hand.** Nor
`.release-please-manifest.json`. All three are written by release-please, and
editing them by hand puts the manifest out of step with the tag: the release
workflow compares the two and stops.

The version **is requested from the commit message**, and that is the only thing
that decides it:

| What you write in the commit | What comes out |
| ---------------------------- | -------------- |
| `fix(...)`, `perf(...)`      | patch · `0.3.0` → `0.3.1` |
| `feat(...)`                  | minor · `0.3.0` → `0.4.0` |
| `feat(...)!` + `BREAKING CHANGE:` footer | minor · `0.3.0` → `0.4.0` |
| `docs`, `ci`, `refactor`, `test`, `build` | **patch**, they cut a version too |
| `chore`, `style`             | nothing |

The fourth row is the surprising one and the one to keep in mind. In this repo
**`docs:` cuts a release**: two documentation commits in a row opened a
`chore(main): release 0.3.1`. It is not release-please's default behaviour, it
comes from our `changelog-sections`: **every type listed there without
`hidden: true` is releasable**, and `docs`, `ci`, `refactor`, `test` and `build`
are all there. The only hidden ones, and therefore the only mute ones, are
`chore` and `style`.

Hence a distinction to make when choosing the type:

- **Documentation that gets published** — `README.md`, `llms.txt`, the parts of
  `docs/` a consumer reads — goes as `docs:`, and cutting a patch is right:
  `llms.txt` travels inside the tarball, so the package really did change.
- **Documentation about the repo's process** — `AGENTS.md`, workflow notes — goes
  as `chore:`. It is not in `files`, so a `docs:` would publish to npm a package
  identical to the previous one except for the version number.

`release-please-config.json` has `bump-minor-pre-major: true`, so while we are on
`0.x` **a breaking change bumps the minor, not the major**. The `!` and the
footer are still mandatory: they do not change the number, but they are what
makes the CHANGELOG announce it as a break instead of hiding it among features.

A breaking change is written like this:

```
feat(tokens)!: page rhythm carries step, so it stops swallowing max-w-*

<the why, as in any commit in this repo>

BREAKING CHANGE: `p-md` becomes `p-step-md` and `spacing.md` becomes
`spacing.stepMd`. The values do not change. Migration in docs/migration-0.3.md.

<anything you like: nobody reads down here except whoever opens the commit>
```

**Only the FIRST PARAGRAPH of the footer reaches the CHANGELOG.** Whatever comes
after the first blank line is lost, and it is lost silently. Verified in 0.3.0:
the footer carried two tables and three warnings, and a single sentence came out
in the CHANGELOG.

Hence the two rules that matter:

1. **That paragraph has to stand on its own**, and it is written for whoever is
   going to migrate, not for whoever made the change. Exactly the essentials fit:
   what gets renamed, whether the values change, and where to go for the rest.
   Not one table, not one code example: they are not going to make it.
2. **The real migration goes in a document in `docs/`**, and the paragraph links
   it. It is not a consolation prize: the document exists before the release is
   cut, it can be linked from the README in the meantime, and it is not limited
   to one paragraph. `docs/migration-0.3.md` is the precedent.

`Co-Authored-By:` and other footers go at the very end, never in the middle of
the footer.

### `main` is protected

You do not push to `main`. Not with `--force`, not as the repo's owner: the
ruleset rejects the push before it lands. Everything goes in through a PR.

- **The six checks have to be green**: ESLint, `Build · Node 22.x`,
  `Build · Node 24.x`, `Accesibilidad y contraste`, `Formato de commit
  convencional` and `Escaneo de seguridad`. None of them has a `paths` filter, so
  all six run on every PR and none is left unreported.
- **A PR from outside needs @Proskynete's approval**, and only theirs:
  `CODEOWNERS` is `* @Proskynete` and the rule requires code-owner review, so
  anybody else's approval does not count.
- **The owner can merge their own PRs without approval**, because GitHub does not
  let you approve yourself and otherwise they would be stuck. The bypass is
  limited to `pull_request`: it is for merging, **not** for pushing to `main`. It
  is not automatic, it has to be asked for: `gh pr merge <n> --rebase --admin`, or
  the interface button that warns you are skipping the rule. A plain
  `gh pr merge` answers «the base branch policy prohibits the merge», and that is
  **not** something being broken: it is the rule doing its job.
- **Squash and rebase only.** The merge commit is disabled on the repo and the
  history is linear by rule. `main` has never had a merge commit.
- The branch deletes itself on merge.

If a check hangs or fails to report, the owner can force the merge from the
interface. It is the only way out, and it leaves a trace.

**Do not publish to npm by hand.** The workflow publishes with OIDC and generates
provenance.

**And do not deploy Storybook by hand either.** `release.yml`'s `deploy` job
builds it and uploads it to Vercel **after** npm publishes, and only then: the
site and the package have to tell the same version. That is why the Vercel
project is not connected to GitHub — the Git integration would build on every
push to `main` — and why the job uploads the already-built output with
`--prebuilt`, without Vercel executing anything. It needs `VERCEL_TOKEN` as a
secret and `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` as variables; if they are
missing, it warns and does not break the release.

## Mistakes that get made in this repo

In order of how often they actually happen:

1. Writing a hex or an arbitrary value «just for this one case». ESLint stops it;
   the fix is a token, not an `eslint-disable`.
2. Importing something in `src/tokens/`. It breaks `./og`, `./shiki` and the
   Astro site.
3. Adding an entrance animation because «it looks better». It does not get in.
4. Adding `lucide-react` or another icon library. All five projects pay for it;
   the glyph goes inline in `src/lib/glyphs.tsx`.
5. Changing props without regenerating `llms.txt`. `pnpm check:llms` stops it in
   CI.
6. Running the suite in one mode only. A color fails in one and passes in the
   other.
7. Adding a story with no states: hover and focus are forced, not trusted.
8. Writing a new component that already exists as a primitive under another name.
9. Writing `p-md` or `gap-sm` out of habit. The step is `p-step-md`, and the old
   name raises no error: it does nothing.
10. Writing an identifier or a comment in Spanish. Since 0.6.0 the code is in
    English; only user-facing copy stays in Spanish.
11. Translating user-facing copy into English while doing that. It is the same
    mistake from the other side and it happened eight times in 0.6.0, `aria-label`
    included. Nothing in CI catches it — see «The language of the code».
12. Dropping a whole PR into a single commit because «it is all the same
    change». It happened on the 0.6.0 migration: 171 files in one commit, which
    is a diff nobody reads and a bisect that points at everything. See «One
    commit is one reviewable unit».
