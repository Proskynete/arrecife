# § 68 · The tagline token follows § 65, because the header reads it and nobody can override it

**Release:** unreleased · [index](README.md)

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
translation of `long`; no English positioning was approved in the interview.

The Storybook samples that printed the old sentence as example text (the type
scale and the tokens page) now print the lema, and `AuthorCard`'s example bio is
taken from the approved bio instead of «liderazgo técnico, plataforma y la era
de la IA».

**Why:** a token is the one place where copy cannot drift across projects, which
is exactly why a stale token drifts all of them at once.

**Action in the document:** on the Design System canvas — in «Secciones de
página», hero: eyebrow «Technical Lead · Spec-Driven Development», bajada
«Enseño a construir software con IA sin dejar de entender lo que hacemos.», the
paragraph «Aquí reúno lo que voy aprendiendo sobre Spec-Driven Development,
desarrollo con IA y liderar un equipo de desarrollo: artículos, charlas y la
newsletter mensual, sin spam.», buttons «Leer artículos» and «Sobre mí»; internal
page header: bajada «Artículos sobre Spec-Driven Development, desarrollo con IA y
lo que voy aprendiendo liderando un equipo.», context «Cuento lo que hice, lo que
me salió mal y lo que aprendimos con mi equipo.»; newsletter title «Artículos
sobre Spec-Driven Development y desarrollo con IA»; the logo sample and the
default OG card read «Technical Lead · Spec-Driven Development».
