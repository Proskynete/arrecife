# docs

Three folders, and the split is by **what you came here to do**.

| Folder | You are here to… | Holds |
| --- | --- | --- |
| [`architecture/`](architecture/README.md) | look up what the system IS | The Design System and the Brand Manual, as consulted from the code |
| [`decisions/`](decisions/README.md) | find out WHY it is that way | 62 entries where the code and a document disagreed, and who won — one file each, `NNN-slug.md` |
| [`runbooks/`](runbooks/README.md) | upgrade a project | One migration guide per release that broke something |

## The two files that are not in a folder

`llms.template.md` is not documentation — it is the **input to a generator**.
`scripts/build-llms.mjs` reads it, splices in the component inventory it gets
from the TypeScript compiler, and writes `llms.txt` at the repo root. Editing
`llms.txt` by hand does nothing: `pnpm check:llms` fails on the next build.

So the prose you want to change is in here, and the tables are not yours to
touch. It sits at this level because filing a build input under `architecture/`
would say it is a document, and the first person to edit `llms.txt` instead
would be following that filing.

## Which document is for whom

There are three audiences and they get three different files, none of which is
in this folder:

- **An agent working INSIDE this repo** reads [`../AGENTS.md`](../AGENTS.md).
  `CLAUDE.md` is a symlink to it: one document, everybody reads it.
- **An agent working in a project that CONSUMES the library** reads
  [`../llms.txt`](../llms.txt). It travels in the tarball, because that agent
  never sees this repo — it sees `node_modules/@eduardoalvarez/arrecife/`.
- **A person** reads [`../README.md`](../README.md).

The folders here are what all three point AT when they need the reason behind a
value.
