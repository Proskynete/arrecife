import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type RefObject } from 'react';

import { cn } from '../../lib/cn.ts';

/**
 * How much you have read. It is NOT `Progress` under another name.
 *
 * `Progress` measures a task: there is a known total, somebody started it and it
 * is going to finish. This measures a POSITION in a document, which can be
 * travelled in both directions and of which there is nothing to complete. That
 * is why it carries neither `role="progressbar"` nor an accessible value: it is
 * `aria-hidden`.
 *
 * That last part is deliberate and it is the decision worth defending. A screen
 * reader already knows where it is in the document, and announcing «37 %» every
 * time it moves is noise, not information. The bar is visual orientation, and
 * what is purely visual is declared as such.
 *
 * The width is written directly, with no transition: `transition-standard` only
 * covers color and border, so the bar follows the scroll instead of chasing it.
 *
 * The measurement happens inside `requestAnimationFrame`. Reading `scrollTop` in
 * the scroll handler forces a synchronous reflow on every event, and in a long
 * article that shows up in the scroll itself — the opposite of what this piece
 * is for.
 */
export type ScrollingProgressBarProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /**
   * The element being measured. Without it, the whole document.
   *
   * It is passed when the bar should follow ONLY the article: if the page has a
   * tall header and a footer full of links, measuring the document hits 100 %
   * while two paragraphs are still left.
   */
  target?: RefObject<HTMLElement | null> | undefined;
  /** Sand instead of biolume, to match course progress. */
  tone?: 'accent' | 'warm';
  /** Pins the bar to the top edge of the window. */
  sticky?: boolean;
};

export function ScrollingProgressBar({
  target,
  tone = 'accent',
  sticky = true,
  className,
  ...props
}: ScrollingProgressBarProps) {
  const [seek, setAvance] = useState(0);
  const pendingOne = useRef(0);

  useEffect(() => {
    const measure = () => {
      pendingOne.current = 0;

      const element = target?.current;
      // `getBoundingClientRect` and not `offsetTop`: that one is relative to the
      // `offsetParent`, and a single positioned ancestor — which any layout with
      // a `relative` above it has — is enough for the start not to be the
      // document's and for the bar to begin full.
      const start = element ? element.getBoundingClientRect().top + scrollY : 0;
      const height = element ? element.offsetHeight : document.documentElement.scrollHeight;

      // What is walkable is the content minus what already fits on screen.
      // Without subtracting the viewport, 100 % would only arrive when the last
      // line touches the top edge, and by then it was read a while ago.
      const walkable = height - innerHeight;
      if (walkable <= 0) {
        // It fits whole: there is nothing to traverse. Full if already past it.
        setAvance(scrollY >= start ? 100 : 0);
        return;
      }

      const walk = scrollY - start;
      setAvance(Math.min(100, Math.max(0, (walk / walkable) * 100)));
    };

    const onMove = () => {
      if (pendingOne.current) return;
      pendingOne.current = requestAnimationFrame(measure);
    };

    measure();
    addEventListener('scroll', onMove, { passive: true });
    addEventListener('resize', onMove);

    return () => {
      if (pendingOne.current) cancelAnimationFrame(pendingOne.current);
      removeEventListener('scroll', onMove);
      removeEventListener('resize', onMove);
    };
  }, [target]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        'h-1 w-full overflow-hidden',
        sticky && 'sticky top-0 z-40',
        className,
      )}
      {...props}
    >
      <div
        className={cn('h-full', tone === 'warm' ? 'bg-warm' : 'bg-accent')}
        style={{ width: `${seek}%` }}
      />
    </div>
  );
}
