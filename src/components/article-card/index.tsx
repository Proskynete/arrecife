import type { ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { CategoryBadge } from '../../primitives/badge.tsx';
import { Text } from '../../primitives/typography.tsx';
import { CardShell, type CardShellProps } from '../card-base.tsx';

export type ArticleCardProps = Omit<CardShellProps, 'children' | 'title'> & {
  title: ReactNode;
  /** Standfirst. Clamped to two lines so the grid does not fall out of line. */
  excerpt?: ReactNode;
  /** Date already formatted by the project: the library imposes no locale. */
  date?: ReactNode;
  /** The `<time>` element's `datetime` value, in ISO. */
  dateTime?: string | undefined;
  readingMinutes?: number | undefined;
  tags?: readonly string[] | undefined;
  /**
   * The headline level. `h3` by default: a lone card in a grid does not earn a
   * level its position does not give it.
   *
   * Restricted to two values on purpose. The listing page — where the cards ARE
   * the section's main heading — needs `h2`, and that intent was lost with a
   * constant; opening it up to `h4` or `h5`, on the other hand, is an invitation
   * to skip levels, which is the failure the constant was preventing.
   */
  headingLevel?: 2 | 3;
};

/**
 * The metadata line uses `meta` and not `eyebrow`: `18 ago 2026 · 8 min de
 * lectura` is a datum, not an overline, and in small caps it was neither.
 *
 * The tags are the CATEGORY family — a lowercase sand pill — not the status one.
 * A slug is something you read as `engineering-culture`.
 */
export function ArticleCard({
  title,
  excerpt,
  date,
  dateTime,
  readingMinutes,
  tags,
  headingLevel = 3,
  className,
  ...props
}: ArticleCardProps) {
  const meta = [
    date ? <time key="date" dateTime={dateTime}>{date}</time> : null,
    readingMinutes ? <span key="lectura">{readingMinutes} min de lectura</span> : null,
  ].filter(Boolean);

  return (
    <CardShell className={cn('p-step-lg', className)} {...props}>
      <article className="gap-step-sm flex h-full flex-col">
        {meta.length > 0 ? (
          <Text variant="meta" tone="muted" as="p" className="gap-step-xs flex items-center">
            {meta.map((m, i) => (
              <span key={i} className="gap-step-xs flex items-center">
                {i > 0 ? <span aria-hidden="true">·</span> : null}
                {m}
              </span>
            ))}
          </Text>
        ) : null}

        <Text
          as={headingLevel === 2 ? 'h2' : 'h3'}
          variant="h3"
          className="group-hover:text-accent transition-standard"
        >
          {title}
        </Text>

        {excerpt ? (
          <Text variant="ui" tone="secondary" className="line-clamp-2">
            {excerpt}
          </Text>
        ) : null}

        {tags && tags.length > 0 ? (
          <div className="gap-step-xs mt-auto flex flex-wrap pt-step-sm">
            {tags.map((t) => (
              <CategoryBadge key={t}>{t}</CategoryBadge>
            ))}
          </div>
        ) : null}
      </article>
    </CardShell>
  );
}
