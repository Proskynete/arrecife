# § 21 · There IS a danger button, outside a dialog

**Release:** 0.6.0 · [index](README.md)

---

**§ 8, and it stood for four versions:** «none of the document's 987 lines shows
a destructive one». `AlertDialog` still documents that its confirm button is not
red, because what communicates the gravity is the text.

**What changed:** the palette was decided, and with it the argument. The variant
is back as `destructive` and `destructiveOutline`.

The old rule was written against a **dialog**, and there it is still correct: a
title explains what is about to happen, focus starts on cancel and clicking
outside does not close it. The context does the work, and a red button on top of
all that is shouting.

It stops being correct in a **table row**. `cursos` has eight destructive buttons
in row actions and toolbars, next to «Editar» and «Duplicar», with nothing around
them doing that work. Rendered as `secondary` — which is where they landed on
migration — «Eliminar curso» looked exactly like «Cancelar», and the only thing
separating them was the word. That is not «the system does not shout», that is
the system not saying anything.

The palette, and it is not `error`:

| | dark | light |
| --- | --- | --- |
| fill | `#F4736B` | `#C0392B` |
| hover | `#F78D86` | `#A32F22` |
| ink | `#2B0A08` | `#FFF6F4` |

`error` is a TEXT color: it has to read against a dark surface, so it sits
mid-red. `danger` is a FILL: what has to read is the ink on top of it, so it goes
lighter. It is the same split as `accent` and `accentOn`. In light mode the two
land on the same hex, and that is not an oversight either — over paper, a red
dark enough to carry white ink is also the red that reads as text.

Measured, not estimated:

| | dark | light |
| --- | --- | --- |
| ink over fill | 6.53 | 5.11 |
| ink over hover | 7.92 | 6.61 |
| fill over background | 6.71 | 4.87 |
| fill over surface | 5.94 | 5.44 |
| fill over surfaceRaised | 4.91 | **4.50** |

The last cell is exactly on the AA line, which is where every light semantic in
this palette already sits. It matters because it is the outline variant's border
and text, and `surfaceRaised` is where a toolbar lives.

**`destructiveOutline` fills on hover, and that is a second exception**, to
«secondary is never filled». It is declared here rather than discovered later: a
destructive that looks identical to a secondary until you read it is the problem
the variant exists to fix. At rest it is still only border and text.

**What was NOT adopted from the specification:** the explicit disabled pair
(`#4A2422` fill, `#8A5F5C` ink). Two reasons, and the second is the one that
decides it. The system has one uniform disabled treatment, `disabled:opacity-50`,
and no other variant carries its own. And the specification only gives the dark
values — a token with no light counterpart is a token that lies in half the
projects, which is exactly § 2. If the uniform treatment turns out not to be
enough for a red, the light pair gets decided and both come in together.

**Action in the document:** add the danger palette and the two variants, with the
rule that they are for the irreversible and never for «cancel».

---
