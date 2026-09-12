# § 47 · The footer takes no loose links, and the columns are why

**Release:** 0.8.0 · [index](README.md)

---

**System rule, from the entry criterion:** a shape gets in when it has two or
more consumers. The footer's row of loose text links had none.

**What stayed:** `children` comes off `FooterProps` — omitted from the element's
props, so it does not compile — and `FooterLink` is removed. A footer's link list
is `variant="full"`'s columns.

**Nobody drew it, and that is the finding.** `eduardoalvarez.dev` passes `brand`
and `social` and nothing else. `links` is an Astro replica: fin, wordmark, the
glyph row, the prompt. `cursos` has three columns — aprendizaje, cuenta, legal —
which is exactly what a flat row cannot say. The only place the loose links were
ever rendered is this library's own stories, and a story is not a consumer.

**And where it did fit, the columns are better at the job.** A row cannot say
which block a link belongs to, so a screen reader walks nine links instead of
jumping to «Legal» by heading — which is the argument § 44 already made for the
columns being data. It also made whoever wrote the label type the `./` prefix
themselves: the stories that go with this entry read `./rss` and `./aviso-legal`,
hand-typed, while the columns put that prefix in for you and mark it
`aria-hidden`. Two renderings of one idea, one of them worse, kept side by side
because nothing forced a choice.

**What it is not.** This is not «the default shape loses something». The default
shape is brand, icons and signature, and that is exactly what the two sites that
use it pass. What goes is a third row neither of them ever filled.

The row assembly stays a list at two entries rather than collapsing into a
conditional. What it encodes is «the signature goes in the first row, whichever
it is», and that does not stop being the rule because the list got shorter.

**Action in the document:** the footer's specification loses the row of loose
links. The link list is the full shape's columns.

---
