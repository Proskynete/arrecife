# Migrating to 0.14.0

One breaking change, and it does not touch the API: four brand pieces are SVG
now, and the library asks for them by their new names.

No import changes and no prop changes. `tsc` has nothing to say, the build stays
green, and a project that skips this gets broken images. That is why it is a
break.

The argument is in [`../decisions/`](../decisions/README.md#0140), § 76.

---

## Run this first

```bash
npx arrecife
```

It does not check images — nothing does at build time — but every runbook from
0.7 on opens with it, and the two silent failures it does catch are worth the
second.

## The breaking change

### Copy the four SVGs into `public/brand/`, and delete their PNGs

| Before | After |
| --- | --- |
| `fin.png` | `fin.svg` |
| `pose-laptop-coffee.png` | `pose-laptop-coffee.svg` |
| `pose-peek.png` | `pose-peek.svg` |
| `pose-surf.png` | `pose-surf.svg` |

They ship in the package, so the copy comes from there:

```bash
cp node_modules/@eduardoalvarez/arrecife/assets/brand/{fin,pose-laptop-coffee,pose-peek,pose-surf}.svg public/brand/
rm public/brand/{fin,pose-laptop-coffee,pose-peek,pose-surf}.png
```

A project that serves the pieces from somewhere other than `public/brand/`
passes `basePath` already; the copy goes wherever that points.

**Delete the PNGs; do not keep them «just in case».** The library will never ask
for them again, and a file nobody requests is a file nobody notices going stale.

### If you wrote one of those names by hand

`Mascot`, `Isotype`, `Logo` and the OG templates read the name from the catalog,
so they follow on their own. A literal string does not:

```bash
grep -rnE "(fin|pose-(laptop-coffee|peek|surf))\.png" src
```

Anything it finds either switches to the catalog or to the `.svg` name:

```diff
- <img src="/brand/pose-surf.png" alt="" />
+ <Mascot pose="surf" />
```

### If your OG generator loads the images itself

Satori renders these SVGs — verified on all four with `satori` and
`@resvg/resvg-js`. But a generator that reads the file and builds a data URI by
hand usually hard-codes the type:

```diff
- `data:image/png;base64,${buf.toString('base64')}`
+ `data:image/svg+xml;base64,${buf.toString('base64')}`
```

With the wrong type the image is decoded as PNG and comes out empty, with no
error.

## What looks different and is not a bug

The SVGs are a redraw, not a trace, and each comes with proportions of its own:
the fin's box is 103×88 instead of 147×111, `surf` is taller for its width and
`laptop-coffee` wider. Where your own layout gives a pose a height and lets the
width follow, look at it — a wider pose takes more room than it used to.

The library's own OG templates already account for it: each pose is fitted into
a box anchored to its corner, so none of them can grow into the headline or the
signature. Nothing to do there.

## What stays PNG

The seven faces, `pose-desk` and `fin-foam`. They are being vectorized and will
change name the same way when they arrive — each of those releases carries a
runbook like this one.
