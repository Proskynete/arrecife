import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { fins, ASSETS_PATH, type Background } from './catalog.ts';

/**
 * Which background the fin sits on, or `auto` to let the theme decide.
 *
 * It is its own type and not a third member of `Background`, because
 * `Background` is also what the OG templates read, and Satori has no CSS to
 * resolve `auto` with: a template knows its mode and has to say it.
 */
export type IsotypeBackground = Background | 'auto';

export type IsotypeProps = Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'alt'> & {
  /**
   * Which background it sits on, or `auto` on a site that switches theme: both
   * fins are rendered and CSS shows the one that reads. Deciding is mandatory
   * even though it has a default: the fin's body is nearly black, so the
   * two-blue variant disappears over abyss.
   *
   * Use `dark` or `light` when the background does not follow the theme. A
   * panel that stays dark in both modes is a fixed background, and `auto` would
   * pick the page's fin instead of the panel's.
   */
  background?: IsotypeBackground | undefined;
  basePath?: string | undefined;
  /** Alt text. Empty when the isotype accompanies text that already names it. */
  alt?: string | undefined;
};

/**
 * The fin, in the variant its background asks for.
 *
 * `auto` renders both and lets the `light:` variant choose, which is what
 * `ThemeToggle` already does with its two icons and for the same reason: the
 * server does not know the theme, and a fin picked in JavaScript would be wrong
 * on the first paint half the time. `cursos` had written exactly this by hand
 * after a surface changed mode and its fin vanished — not looked wrong: vanished,
 * with no error and no gap in the layout. See `docs/decisions/0.11.md` § 60.
 *
 * Dark is the system default, so the foam fin is the one shown unless
 * `data-theme="light"` says otherwise, and the two-blue one hides everywhere
 * else. `not-light:hidden` rather than `hidden light:block`: the visible fin
 * keeps whatever `display` the call site gave it.
 *
 * What it costs: the hidden image is still downloaded, 14 or 21 KB. And with
 * `auto` the props land on BOTH `<img>` — an `id` or a `ref` included — so a
 * call site that needs to reach the one image passes the background it is on.
 * The `alt` does not double: an image with `display: none` is out of the
 * accessibility tree.
 */
export function Isotype({
  background = 'dark',
  basePath = ASSETS_PATH,
  alt = '',
  className,
  ...props
}: IsotypeProps) {
  const fin = (file: string, mode?: string) => (
    <img
      src={`${basePath}/${file}`}
      alt={alt}
      width={147}
      height={111}
      className={cn('h-8 w-auto select-none', className, mode)}
      {...props}
    />
  );

  if (background === 'auto') {
    return (
      <>
        {fin(fins.foam, 'light:hidden')}
        {fin(fins.color, 'not-light:hidden')}
      </>
    );
  }

  return fin(background === 'dark' ? fins.foam : fins.color);
}
