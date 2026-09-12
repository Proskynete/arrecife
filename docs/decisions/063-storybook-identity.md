# § 63 · The published site wears the projects' mark and prints the version it is

**Release:** 0.12.0 · [index](README.md)

---

**System rule:** none. This is documentation architecture, like
[§ 56](056-storybook-setup-page.md), and it is recorded for the same reason that
one was: the published Storybook is the only part of this library most people
will ever look at.

**What the code did:** the site wore Storybook's pink default favicon, and the
Getting started page said nothing about which version it was describing.

**What was wrong with the favicon.** A tab is the one place a documentation site
identifies itself with no words, and this one identified itself as somebody
else's tool. The four consuming projects had already settled what the mark is,
and the agreement is total: `eduardoalvarez.dev` and `blog-content-manager` serve
the SAME `favicon.ico`, byte for byte, and `links` and `cursos` serve the same
drawing as a PNG at 192 and 256 — the foam fin on abyss.

**What it is now:** that file. `.storybook/public/favicon.ico` is a copy of the
one two of those projects already share, with the 192px PNG beside it for a
retina tab. Nothing was redrawn: this is a case where reading the projects
answered the question outright, which is the lesson [§ 45](045-signature-halo.md)
left and the one [§ 53](053-footer-centred-phone.md) applied.

**Why it is not in `assets/`.** `files` in `package.json` ships `assets`, so a
favicon put there would be published to npm inside every install. The favicon of
a documentation site is not part of the package's surface. `.storybook/public` is
a second static directory and says whose it is by where it sits.

**Why the icon is declared and not discovered.** Storybook does pick a root
`/favicon.ico` out of a static directory on its own. That is a behaviour of the
builder, not a contract, and it costs two lines in `managerHead` to say outright
— against a failure that looks like nothing: the site quietly wearing the pink
default again after an upgrade, on a page nobody opens to check. It goes on the
MANAGER and not in `preview-head.html`, which is the `<head>` of the story iframe
and has no tab of its own.

**The version is read from `package.json` and never typed.** It is the one number
on that page that goes stale by itself, and it would go stale silently:
release-please writes `package.json` on every release and has no reason to touch
a story, so a hand-written «v0.11.0» is wrong the day after it is written and
looks exactly as right as it did the day before. That is the failure this whole
repository is built against — see [§ 15](015-cn-derives-scales.md) for the same
argument about a list kept in sync by hand.

It costs the package nothing: the stories are not published, `resolveJsonModule`
was already on, and the import resolves at build time.

**Where it is shown.** Beside the wordmark, as a `neutral` badge, and NOT inside
the install snippet. The snippet is what a reader copies, and a version pinned
into something copied is how a project ends up installing whatever was current
when the page happened to be read.

**And the number is true because of the deploy order.** `release.yml` builds and
uploads the Storybook AFTER npm publishes, which is why the Vercel project is not
connected to git — the integration would rebuild on every push to `main` and the
site would print a version that is not on npm yet. That ordering existed already;
this page is the first thing that depends on it.

**Action in the document:** none. The mark is the manual's own foam fin at a size
the manual already covers, and the version badge is an API surface of the
documentation site rather than of the identity.
