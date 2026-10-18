/**
 * The brand pieces on disk against the catalog that names them.
 *
 * `catalog.ts` is typed, so a pose that does not exist will not compile — but
 * the type only knows the STRING. Nothing checked that `pose-surf.svg` is in
 * `assets/brand/`, and a wrong extension ships as a broken image in five
 * projects with a clean build behind it.
 *
 * The SVG half exists because of the first export that went through it.
 * Illustrator writes an XMP packet and a C2PA manifest into `<metadata>` — 124 KB
 * of `pose-surf.svg`'s 162, an embedded JPEG thumbnail included — and leaves the
 * `xmlns:c2pa` declaration on the root tag after the metadata is stripped. With
 * that one attribute there, Satori read the image's width as 0 and the pose
 * vanished from the OG card. No error, no warning: an empty corner. The browser
 * draws the same file without complaint, so the story suite cannot see it.
 * See `docs/decisions/` § 76.
 */
import { readdir, readFile } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { faces, fins, poses } from '../src/brand/catalog.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const folder = resolve(root, 'assets', 'brand');

const named = [...Object.values(faces), ...Object.values(poses), ...Object.values(fins)];
const onDisk = await readdir(folder);
const svgs = onDisk.filter((file) => extname(file) === '.svg');

describe('brand assets', () => {
  it('has a file for every piece the catalog names', () => {
    expect(named.filter((file) => !onDisk.includes(file))).toEqual([]);
  });

  it('holds nothing the catalog does not name', () => {
    // A PNG left behind after its SVG arrives is the case this is for: two files
    // for one piece is two sources of truth, and the bitmap is the one that drifts.
    expect(onDisk.filter((file) => !named.includes(file))).toEqual([]);
  });

  describe.each(svgs)('%s', (file) => {
    it('carries no editor metadata', async () => {
      const svg = await readFile(resolve(folder, file), 'utf8');
      expect(svg).not.toMatch(/<metadata[\s>]/);
    });

    it('declares a viewBox and only the svg and xlink namespaces on its root', async () => {
      const svg = await readFile(resolve(folder, file), 'utf8');
      const tag = svg.match(/<svg\b[^>]*>/)?.[0] ?? '';
      expect(tag).toMatch(/\bviewBox="[^"]+"/);
      const namespaces = [...tag.matchAll(/\bxmlns(?::([\w-]+))?=/g)].map((m) => m[1] ?? '');
      expect(namespaces.filter((prefix) => prefix !== '' && prefix !== 'xlink')).toEqual([]);
    });
  });
});
