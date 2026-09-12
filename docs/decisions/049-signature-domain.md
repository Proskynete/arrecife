# § 49 · The signature prints a domain, and it is not always ours

**Release:** 0.9.0 · [index](README.md)

---

**System rule:** the wordmark and the domain come from `naming`, so that a change
lands in all five projects at once. See the [0.6.0 entries](README.md#060) for
where that rule came from.

**What the code did:** `Signature` printed `naming.domain` —
`eduardoalvarez.dev` — with no way to say otherwise, and `variant="full"` always
draws its own signature. There was no opting out.

**What was wrong with it.** The rule is right for the sites that ARE
`eduardoalvarez.dev`. It is wrong for the ones that are not, and there are two:
`cursos` lives on `cursos.eduardoalvarez.dev` and `links` on its own host. Both
printed their real domain by hand, in production, before this component existed.

Adopting `Footer variant="full"` in `cursos` would have changed
`$ cd ~/cursos.eduardoalvarez.dev/2026` into `$ cd ~/eduardoalvarez.dev/2026`.
Nothing in the type says that happens, nothing fails, and the result is a site
signing with its parent's domain — in a footer, next to the legal links, which
is the one place on a site where saying which site you are is the job.

**What it is now:** `domain` is an optional prop on both shapes, defaulting to
`naming.domain`. A project that passes nothing gets exactly what it got before.

**Why a domain and not a signature slot.** Handing the whole line to the project
gives back the drift the component exists to prevent: the `$`, the `cd ~/`, the
year and the mark are the identity's, and four projects rewriting them by hand is
where the format goes out of sync. What varies between sites is one string, so
one string is what the prop takes.

**Why this was not caught in 0.8.0.** § 44 designed the full shape from `cursos`'s
footer and read its layout, its columns and its mark. It did not read the one
line it was replacing at the bottom — the signature was treated as the part that
was already solved, because the library had been drawing it since 0.6.0. It was
solved for the consumer it was written for.

**The general form.** A constant is safe to bake into a component when it is a
property of the SYSTEM. `naming.domain` is a property of one SITE in the system,
and the tell was already there: `cursos` and `links` had both written their own,
which is a project disagreeing with a token twice.

**Action in the document:** say that the signature's domain is the site's own and
not the identity's, and that `naming.domain` is the default rather than the
value. The signature section currently prints one domain as if there were one
site.
