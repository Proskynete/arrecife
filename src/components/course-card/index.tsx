import type { ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { Badge } from '../../primitives/badge.tsx';
import { Progress } from '../../primitives/progress.tsx';
import { Text } from '../../primitives/typography.tsx';
import { CardShell, type CardShellProps } from '../card-base.tsx';

/**
 * `media` is left out of the shell's props because `<a>` already has an
 * attribute by that name — a media query for the linked resource, a string —
 * and intersected with the slot it would make the slot accept only strings.
 * No browser acts on it and no project was passing it.
 */
export type CourseCardProps = Omit<CardShellProps, 'children' | 'title' | 'media'> & {
  title: ReactNode;
  summary?: ReactNode;
  /** Level, duration, number of lessons: whatever the project wants to list. */
  meta?: readonly ReactNode[] | undefined;
  /** Status label: «próximamente», «gratis», «nuevo». */
  status?: ReactNode;
  /**
   * Percentage completed. It only makes sense for someone already enrolled;
   * when passed, the bar goes in sand, which is the color of course progress.
   */
  progress?: number | undefined;
  /**
   * The cover, at the top and bleeding to the card's edges, with `alt=""`: the
   * whole card is one link and `title` already names it.
   *
   * The project owns the element — an `<img>`, a framework's `Image`, a
   * generated cover — and its ratio; the card clips it to its own corners. An
   * `alt` that repeats the title makes a screen reader say the course twice
   * before anything else.
   */
  media?: ReactNode;
  /**
   * The closing row, under `meta`: the rating, the price, whatever the project
   * sells the course with. It sits at the bottom of the card, so the rows of a
   * grid line up whatever the length of each summary.
   */
  footer?: ReactNode;
};

/**
 * The course, as a card that links to it.
 *
 * `media` and `footer` are slots rather than props for a cover URL, a rating
 * and a price, because none of those three is the identity's. The price comes
 * formatted in a currency the library does not know, the rating is drawn by a
 * component the project already has, and the cover is an image pipeline. What
 * IS the identity's stays here: the title's scale and its hover, the sand bar,
 * the status badge. See `docs/decisions/0.11.md` § 59.
 *
 * The title does NOT go over the cover. It stays in the body at `h3`, with the
 * hover every other card has. Text on a photograph needs a scrim, and a scrim's
 * contrast depends on the photograph: it cannot be measured once and recorded,
 * which is the only way contrast is decided in this system.
 *
 * And the cover does not move on hover. Rule 6 is the border and nothing else:
 * no zoom, no scale, no displacement.
 */
export function CourseCard({
  title,
  summary,
  meta,
  status,
  progress,
  media,
  footer,
  className,
  ...props
}: CourseCardProps) {
  const hasProgress = typeof progress === 'number';

  return (
    // `overflow-hidden` only with a cover: it is what rounds the cover's top
    // corners to the card's. It clips the content and not the `<a>` itself, so
    // the focus ring — an outline three pixels outside — still shows.
    <CardShell
      className={cn('p-step-lg', media ? 'overflow-hidden' : null, className)}
      {...props}
    >
      <article className="gap-step-sm flex h-full flex-col">
        {media ? (
          // The bleed is the card's own padding, negated. A call site that
          // changes the padding through `className` has to change this too, and
          // that is the trade for keeping the padding on the shell like every
          // other card instead of in a second place only when there is a cover.
          <div className="-mx-step-lg -mt-step-lg mb-step-xs">{media}</div>
        ) : null}

        {status ? (
          <div>
            <Badge variant="warm">{status}</Badge>
          </div>
        ) : null}

        <Text as="h3" variant="h3" className="group-hover:text-accent transition-standard">
          {title}
        </Text>

        {summary ? (
          <Text variant="ui" tone="secondary" className="line-clamp-3">
            {summary}
          </Text>
        ) : null}

        {meta && meta.length > 0 ? (
          <Text variant="label" tone="muted" as="p" className="gap-step-xs flex flex-wrap items-center">
            {meta.map((m, i) => (
              <span key={i} className="gap-step-xs flex items-center">
                {i > 0 ? <span aria-hidden="true">·</span> : null}
                {m}
              </span>
            ))}
          </Text>
        ) : null}

        {hasProgress ? (
          <div className="gap-step-xs mt-auto flex flex-col pt-step-sm">
            <Progress value={progress} tone="warm" label={`Progreso del curso: ${progress}%`} />
            <Text variant="label" tone="muted" as="p">
              {progress}% cursado
            </Text>
          </div>
        ) : null}

        {footer ? (
          // Only one of the two takes `mt-auto`. Two auto margins in one column
          // split the free space between them, and the progress bar would float
          // halfway down the card.
          <div
            className={cn(
              'gap-step-sm pt-step-sm flex flex-wrap items-center justify-between',
              hasProgress ? null : 'mt-auto',
            )}
          >
            {footer}
          </div>
        ) : null}
      </article>
    </CardShell>
  );
}
