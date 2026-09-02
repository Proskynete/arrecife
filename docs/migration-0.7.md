# Migrating to 0.7.0 — the backlog batch

Thirteen points from the consuming projects' backlog, from `"use client"` to the
footer's caret. Three of them break something, and all three break loudly: the
type checker catches every one at the call site.

If you are coming from 0.5.x, read [`migration-0.6.md`](migration-0.6.md) first
— that one moved the whole API to English, and it is the bigger of the two.

---

## The three breaking changes

### 1 · `themeScript` is a function

```diff
- <script is:inline set:html={themeScript} />
+ <script is:inline set:html={themeScript()} />
```

TypeScript catches this in both consumers: `set:html` and `__html` both expect a
string, and a function is not one. It cannot fail silently.

While you are there, this is the reason the prop exists:

```astro
<!-- This site IS dark. The OS is not consulted. -->
<script is:inline set:html={themeScript({ base: 'dark' })} />
```

All five of these projects are dark by decision, and until now the library gave
them no way to say so — which is why they kept their own `public/theme.js`. A
stored choice still wins over `base`, so the toggle keeps working: it sets what
happens when nobody has chosen yet.

`preferredTheme` and `watchTheme` take the same option. If you pass `base` to the
script, pass it to those too, or you get the OS sneaking back in through the
other two doors.

### 2 · The root ships `"use client"`

Nothing to add. Something to **remove**.

If your Next project wrapped the library in adapters of its own marked
`"use client"` — `components/ui/button.tsx`, `components/ui/badge.tsx` — those
are what the missing directive forced. They still work, and they keep costing:
in `cursos` they were 272 KB of client chunk, paid even by a `Badge` that is a
`<span>` with no interaction.

```diff
- // components/ui/badge.tsx
- 'use client';
- export { Badge } from '@eduardoalvarez/arrecife';
```

Import from the library directly. A Server Component can do it now.

And if what you actually wanted were the classes and not the component, that is
what `./variants` is for — it carries no directive, so nothing crosses to the
client:

```tsx
import { buttonVariants, CARD_SURFACE } from '@eduardoalvarez/arrecife/variants';

<a className={buttonVariants({ variant: 'tertiary' })} href="/cursos">./ver_cursos →</a>
```

**In Astro and in plain Vite nothing changes.** The directive is a string literal
at the top of a module; Rollup may warn `Module level directives cause errors
when bundled` and that is the whole of it.

### 3 · `TalkCardProps` is a union

A `TalkCard` with `resources` is not a link, because an `<a>` inside an `<a>` is
invalid HTML. The type says so:

```tsx
// Compiles: the card is the link.
<TalkCard href="/charlas/escalar" title="…" event="JSConf" />

// Compiles: the resources are the links.
<TalkCard title="…" event="JSConf" resources={<><a href="#slides">./slides</a></>} />

// Does not compile, and should not.
<TalkCard href="/charlas/escalar" resources={…} />
```

Only code that spreads a props object typed as `TalkCardProps` and then adds
`href` conditionally needs narrowing. Every call site that passes `href` and
nothing else is unchanged.

---

## What you can delete

This release exists to remove things from the projects, not to add them. Per
project:

| Project | What comes out |
| --- | --- |
| `cursos` | The `"use client"` adapters around `Button` and `Badge`, and the 272 KB with them |
| `links` | The copied class vocabulary in `LinkRow.astro` and `Footer.astro`, and `scripts/check-replica-drift.mjs` with it |
| `eduardoalvarez.dev` | `public/theme.js`, the hand-drawn bell, and the four `NewsletterForm` workarounds |

The four workarounds, specifically:

```diff
- // The pose, positioned absolutely with room reserved by hand
- <div className="relative md:pr-[330px]">
-   <NewsletterForm … />
-   <Mascot pose="desk" className="absolute right-0 …" />
- </div>
+ <NewsletterForm … aside={<Mascot pose="desk" />} />

- // Finding the form with a ref to reset it
- const box = useRef<HTMLDivElement>(null);
- useEffect(() => { if (ok) box.current?.querySelector('form')?.reset(); }, [ok]);
+ // resetOnSuccess is on by default. Nothing to write.

- // Clearing the notice by relying on the event bubbling
- <NewsletterForm onInput={() => setError(null)} … />
+ <NewsletterForm onFieldChange={() => setError(null)} … />

- // One alert for the whole form, losing the second message
+ <NewsletterForm fieldErrors={{ name: …, email: … }} … />
```

And the bell:

```diff
- import { Bell } from '../icons/bell.tsx';
+ import { social } from '@eduardoalvarez/arrecife';
+ // <social.Newsletter />
```

---

## What is new and breaks nothing

- **`Button variant="destructive"`** and **`destructiveOutline`**. For the
  irreversible only, and never inside an `AlertDialog` — there the confirm button
  stays as it was, because the title, the focus on cancel and the
  no-close-on-outside already carry the gravity. See
  [`decisions.md`](decisions.md) § 21.
- **`Button size="icon-sm"`**, 32×32, for a table row. It does not replace
  `icon`, which is still 42 and is still what a page action uses.
- **`ArticleCard`'s `tagAsChild`**, so an E2E suite can reach the tags without
  selecting by structure or by a style class:

  ```tsx
  <ArticleCard tagAsChild={({ tag }) => <span data-testid={`tag-${tag}`}>{tag}</span>} … />
  ```

- **`TalkCard`'s `resources`**, **`NewsletterForm`'s `aside`**,
  **`resetOnSuccess`**, **`onFieldChange`** and **`fieldErrors`**.
- **`social.Newsletter`**, the bell.
- **The footer's caret**, which blinks. It arrives on its own — there is no prop
  and nothing to turn on. Behind `motion-safe`, so a reader who asked for less
  motion sees it solid.

## What did not change

Every colour, size, radius and contrast ratio that already existed. The three new
tokens — `danger`, `dangerHover`, `dangerOn` — are additions, and every existing
one is untouched. The suite passes identically in both modes before and after.
