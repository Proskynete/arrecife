/**
 * The brand catalog: which pieces of Tiburoncín exist and what their file is
 * called. Pure data, no React, so the OG templates and any script can read it
 * too.
 *
 * Adding a new piece means dropping the PNG into `assets/brand/` and adding one
 * line here. The type updates itself and autocomplete offers it immediately.
 */

/**
 * The faces. They are used only in empty states, confirmations, errors, course
 * progress and celebration — never in a hero, pricing, services, contact or CV.
 * That is why `EmptyState` takes a face and `PageHeader` does not.
 */
export const faces = {
  annoyed: 'face-annoyed.png',
  confused: 'face-confused.png',
  hearts: 'face-hearts.png',
  laughing: 'face-laughing.png',
  shades: 'face-shades.png',
  waiting: 'face-waiting.png',
  wink: 'face-wink.png',
} as const;

/** Full-body poses. */
export const poses = {
  desk: 'pose-desk.png',
  'laptop-coffee': 'pose-laptop-coffee.png',
  peek: 'pose-peek.png',
  surf: 'pose-surf.png',
} as const;

/**
 * The fin, in its two variants.
 *
 * The fin's body is nearly black, so on a dark background the two-blue variant
 * disappears. `foam` is the single-ink silhouette — 94 % of its pixels are
 * `#EDF4F3`, which is the foam token — and it is the one that reads over abyss.
 */
export const fins = {
  /** Two blues. For light backgrounds. */
  color: 'fin.png',
  /** Single-ink silhouette. For dark backgrounds. */
  foam: 'fin-foam.png',
} as const;

/**
 * The assigned use of each face, from the manual's inventory.
 *
 * This is not loose documentation: it is the part of the humour contract that
 * can be written as data. The manual assigns a situation to each face, and
 * without this the choice was made by eye at every call site — which is how
 * `annoyed` ends up on a confirmation and `hearts` on an error.
 *
 * One is missing: the manual lists eight faces and `head-5` (surprise ·
 * destructive confirmation) has no PNG in `assets/brand/`. When it arrives, it
 * goes in here and in `faces` at the same time.
 */
export const faceUsage = {
  wink: 'Forms, a friendly footnote',
  waiting: 'No results, waiting state',
  laughing: 'Success, subscription confirmed',
  shades: 'Module or course completed',
  hearts: 'Gratitude, article OG',
  confused: '404, page not found',
  annoyed: 'Server error, build failure',
} as const satisfies Record<keyof typeof faces, string>;

export type Face = keyof typeof faces;
export type Pose = keyof typeof poses;
export type Fin = keyof typeof fins;

/** Which background the piece will sit on. It decides which fin is used. */
export type Background = 'dark' | 'light';

/**
 * Where the PNGs are served from. `/brand` by default, which is where they
 * already live in all five projects (`public/brand/`), so there is nothing to
 * configure.
 */
export const ASSETS_PATH = '/brand';

export const faceList = Object.keys(faces) as readonly Face[];
export const poseList = Object.keys(poses) as readonly Pose[];
