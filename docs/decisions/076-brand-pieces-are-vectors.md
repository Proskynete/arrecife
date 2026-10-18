# § 76 · Tiburoncín becomes vector, one piece at a time, and a piece is one file

**Release:** 0.14.0 · [index](README.md)

---

**System rule:** the brand manual's colophon — «Los assets de la mascota son
mapas de bits: la siguiente versión de este manual llega cuando estén
vectorizados. Hasta entonces, no se usan en bordado, pin ni print sobre 200 mm.»

**What there was:** thirteen PNGs in `assets/brand/`, consolidated from the five
projects in Phase 2, byte-for-byte what each of them already served.

**What there is now:** the designer is vectorizing the set. Four pieces arrived
first — the two-blue fin and the `laptop-coffee`, `peek` and `surf` poses — and
they replace their PNGs in the catalog. The PNGs are deleted, not kept beside
them. The rest of the faces and poses are on their way, and every new face will
arrive as SVG only.

**Why the PNG goes the moment the SVG lands.** Keeping both reads as caution and
is the failure this library exists to prevent: two files for one piece is two
sources of truth, and the one nobody looks at drifts. The highlighting palette
lived for months with the wrong color for exactly that reason. The catalog names
one file per piece, and since this release `scripts/brand-assets.test.mjs` fails
on a file in `assets/brand/` the catalog does not name — so a PNG left behind
breaks the build instead of shipping quietly.

**Why it is not a breaking change in the code and is one in the projects.** The
API does not move: `<Mascot pose="surf" />` is still that, and the type is the
same. What moves is the URL the library asks for — `/brand/pose-surf.svg` instead
of `/brand/pose-surf.png` — and the five projects serve those files from their
own `public/brand/`. A project that upgrades without copying the new files gets
broken images, with no error at build time. That is why the release carries the
`!` and a runbook: see [`../runbooks/migration-0.14.md`](../runbooks/migration-0.14.md).

**The shape changes, because it is a redraw and not a trace.** Each SVG comes
with proportions of its own: the fin goes from 147×111 to 103×88, `surf` from
1.22 wide-to-tall to 1.05, and `laptop-coffee` from 1.25 to 1.43, with a laptop
that now carries three stickers. That is why `Isotype` declares a size per
variant instead of one for both.

It broke one thing that a height alone used to hold. The OG templates sized a
pose by its height, and `laptop-coffee` at the course template's 430 came out
617 wide — past the 560 reserve and on top of the signature's fin. Each pose is
fitted into a box now, `contain` and anchored to its corner: 536×430 in the
course template, 590×470 in the talk one, where 590 is the widest any PNG pose
came out. Satori writes it as `preserveAspectRatio`, and it was checked by
rendering every pose in both templates through Satori before and after. `surf`
and `peek` land exactly where they did; `desk`, still a PNG, is 4 % smaller in
the course card, because at 560 it was touching the headline.

**The export trap, and the test that keeps it out.** Illustrator writes an XMP
packet and a C2PA content-credentials manifest into `<metadata>`: 124 KB of
`pose-surf.svg`'s 162, an embedded JPEG thumbnail included. The metadata is
stripped on the way in. Stripping it leaves the `xmlns:c2pa` declaration on the
root tag, and with that one attribute Satori measured the image's width as 0 and
the pose disappeared from the OG card — no error, an empty corner. The browser
draws the same file without complaint, so the story suite could never have seen
it. `scripts/brand-assets.test.mjs` now rejects any SVG with `<metadata>`, with no
`viewBox`, or with a namespace on its root other than `svg` and `xlink`.

**What stays bitmap, for now:** the seven faces, `pose-desk` and the foam fin.
They move under the same rule when their SVGs arrive: the file goes in, the line
in `catalog.ts` changes, the PNG goes out, in one commit.

**Action in the document:** the manual's colophon. The fin and three of the four
poses are vector as of this release; the restriction on embroidery, pins and
print over 200 mm applies only to the pieces still listed above as bitmap. The
colophon's promise — a new manual version when the set is vectorized — becomes
due when the last PNG leaves `assets/brand/`.
