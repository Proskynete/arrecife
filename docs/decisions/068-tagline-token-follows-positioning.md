# § 68 · The tagline token follows § 65, because the header reads it and nobody can override it

**Release:** 0.12.3 · [index](README.md)

---

**System rule:** `tagline` in `src/tokens/tokens.ts` holds «Ayudo a equipos de
ingeniería a escalar con criterio» (`long`), «Ayudo a equipos a escalar con
criterio» (`short`) and «Helping engineering teams scale with judgment» (`en`).
The Design System canvas prints the same sentence in the hero, the logo sample
and the default OG card.

**What there was:** § 65 retired that positioning everywhere a project writes
its own copy, and the five projects were updated. The token was missed because
no project writes it: `Logo withTagline` renders `tagline.short` and, by design
(§ 63), takes no prop to replace it. So eduardoalvarez.dev's header kept saying
«Ayudo a equipos a escalar con criterio» under a site that says the opposite
everywhere else. The OG template also falls back to `tagline.short` when a card
has no description.

**What it is now:**

| Key | Text |
| --- | --- |
| `short` | Technical Lead · Spec-Driven Development |
| `long` | Enseño a construir software con IA sin dejar de entender lo que hacemos. |
| `en` | I teach how to build software with AI without losing sight of what we build. |

`short` and `long` are the two lines of the bajada approved in § 65. `en` is a
translation of `long`, approved by the author on 24 Sep 2026.

The Storybook had the old positioning in its sample data too, and a Storybook
sample is the first thing a consuming project copies:

- The type scale, the tokens page, `PageHeader`, getting-started, the progress
  bar, the README and `llms.txt` printed «Escalar con criterio» as example
  text. They now print the lema.
- `Hero`, `PageHeader` and `Nav` presented the author as a consultancy
  (eyebrow «consultoría», «Trabajo con equipos que crecieron más rápido que su
  arquitectura», «Agenda una llamada»). They now use the bajada, the site's own
  hero paragraph and «Ver los cursos» — sand is for courses, talks and mentoring.
- `Blockquote`, `TalkCard` and `Table` attributed invented talks to him
  («Escalar sin romper el equipo, JSConf 2025», a NerdearLA talk). They now use
  his real talks (CaribeConf 2026, Tech School 2025) and a quote from his about
  page. `ArticleCard` and `Breadcrumb` use one of his real articles.
- The `Accordion` FAQ was a consultancy's; it now answers questions about the
  newsletter, the courses and the talks.
- `AuthorCard`'s example bio is the approved bio.

**Why:** a token is the one place where copy cannot drift across projects, which
is exactly why a stale token drifts all of them at once.

**Action in the document:** none. Applied on the Design System canvas on 24 Sep
2026: the hero, the interior page header, the newsletter title and the default
OG card carry the new copy.
