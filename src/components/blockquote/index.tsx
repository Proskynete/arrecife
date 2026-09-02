import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { Text } from '../../primitives/typography.tsx';

export type BlockquoteProps = Omit<ComponentPropsWithoutRef<'blockquote'>, 'cite'> & {
  children: ReactNode;
  /** Who said it. Marked up as `<cite>`. */
  author?: ReactNode;
  /** Where they said it: a talk, an article, a conversation. */
  source?: ReactNode;
};

/**
 * The side bar is `accent`, the interactive color, because a quotation is
 * somebody else's voice entering the text. It carries no decorative quote marks:
 * the system's glyphs are SVG, and an ornamental quote adds nothing the border
 * and the indent do not already say.
 */
export function Blockquote({ children, author, source, className, ...props }: BlockquoteProps) {
  return (
    <blockquote
      className={cn('border-accent pl-step-md my-step-lg border-l-2', className)}
      {...props}
    >
      <Text variant="body" tone="secondary">
        {children}
      </Text>

      {author || source ? (
        <footer className="mt-step-sm">
          <Text variant="label" tone="muted" as="span">
            {author ? <cite className="not-italic">{author}</cite> : null}
            {author && source ? ' · ' : null}
            {source}
          </Text>
        </footer>
      ) : null}
    </blockquote>
  );
}
