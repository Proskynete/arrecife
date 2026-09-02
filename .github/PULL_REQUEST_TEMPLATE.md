## What changes

<!-- One or two sentences. What looks different after this. -->

## Why

<!-- The reason, not the change. If it comes from the Design System or the Brand
     Manual, cite the section; if it contradicts the document, say so here and
     record it in docs/decisions.md. -->

## Checks

- [ ] `pnpm lint` and `pnpm typecheck` pass
- [ ] `pnpm test` passes in **both** modes (a color only fails in one)
- [ ] The stories cover the new states, not just the resting one
- [ ] If it touches color: the contrast is **measured**, not estimated, and recorded
- [ ] If it touches `tokens.ts`: `pnpm check:tokens` is still green
- [ ] If it contradicts the document: it is in `docs/decisions.md` with its reason

## Screenshots

<!-- In both modes if the change is visual. The switch is in the Storybook
     toolbar. -->
