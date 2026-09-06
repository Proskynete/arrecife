# Runbooks

**What to DO, in order.** One guide per release that broke something, written for
whoever is upgrading a consuming project — not for whoever made the change.

| Runbook | Breaks | The short version |
| --- | --- | --- |
| [`migration-0.8.md`](migration-0.8.md) | 4 | `Table` draws its own surface, `Footer` takes no `children`, `caret` and `SidebarNav` are removed |
| [`migration-0.7.md`](migration-0.7.md) | 1 | `Stat`'s `tone="alerta"` becomes `tone="alert"` |
| [`migration-0.6.md`](migration-0.6.md) | many | The whole public API moved to English |
| [`migration-0.5.md`](migration-0.5.md) | 1 | — |
| [`migration-0.3.md`](migration-0.3.md) | 1 | Page rhythm carries `step`: `p-md` becomes `p-step-md` |

There is no `migration-0.4.md` and no `migration-0.2.md`: those releases broke
nothing.

## Why a release note is not enough

Only the FIRST PARAGRAPH of a `BREAKING CHANGE:` footer reaches the CHANGELOG,
and it is lost silently after that — verified in 0.3.0, where the footer carried
two tables and three warnings and one sentence came out. So the paragraph says
what renames, whether the values change and where to go; **the real migration is
a file in here**, and it exists before the release is cut.

## Run this first

```bash
npx arrecife
```

It catches the two failures that produce no error at all: a missing `@source`,
which silently purges the library's classes, and a token of yours redefining one
of ours. Every runbook from 0.7 on opens with it.
