import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { Text } from '../../primitives/typography.tsx';

export type BlockquoteProps = Omit<ComponentPropsWithoutRef<'blockquote'>, 'cite'> & {
  children: ReactNode;
  /** Quién lo dijo. Se marca como `<cite>`. */
  author?: ReactNode;
  /** Dónde lo dijo: charla, artículo, conversación. */
  source?: ReactNode;
};

/**
 * La barra lateral es `accent`, que es el color interactivo, porque una cita es
 * la voz de otro entrando en el texto. No lleva comillas decorativas: los
 * glifos del sistema son SVG y una comilla de adorno no aporta nada que el
 * borde y la sangría no digan ya.
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
