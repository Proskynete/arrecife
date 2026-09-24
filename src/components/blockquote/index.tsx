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
 * The side bar is `warm`, 3px, and the text is italic, as the document draws it:
 * «cita con borde arena 3px, cursiva, sin fondo». Sand is the human accent —
 * quotes, categories, conversion — and biolume is the interactive one; a quote
 * in biolume read as a link that could not be clicked. It carries no decorative
 * quote marks: the border and the italic already say it is somebody's voice.
 */
export function Blockquote({ children, author, source, className, ...props }: BlockquoteProps) {
  return (
    <blockquote
      className={cn('border-warm pl-step-md my-step-lg border-l-3', className)}
      {...props}
    >
      <Text variant="body" tone="secondary" className="italic">
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
