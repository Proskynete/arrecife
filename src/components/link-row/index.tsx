import type { ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { ArrowUpRight } from '../../lib/glyphs.tsx';
import { Text } from '../../primitives/typography.tsx';
import { CardShell, type CardShellProps } from '../card-base.tsx';

export type LinkRowProps = Omit<CardShellProps, 'children'> & {
  name: ReactNode;
  description?: ReactNode;
  /** The target's SVG glyph. Never an emoji. */
  icon?: ReactNode;
  /** Marks the link as external: adds the arrow and the safe `rel`. */
  external?: boolean | undefined;
};

/**
 * Migrated from `links/src/components/Card.astro`. The original scaled the card
 * to 102 %, lifted the title by a pixel and rotated and enlarged the icon on
 * hover — four movements the system does not allow. Here the hover changes the
 * border and the icon's color, and nothing else.
 */
export function LinkRow({
  name,
  description,
  icon,
  external = false,
  className,
  ...props
}: LinkRowProps) {
  const rel = external ? 'noopener noreferrer' : props.rel;
  const target = external ? '_blank' : props.target;

  return (
    <CardShell
      className={cn('px-step-md py-step-sm', className)}
      {...props}
      rel={rel}
      {...(target ? { target } : {})}
    >
      <span className="gap-step-sm flex items-center">
        {icon ? (
          <span className="text-text-muted group-hover:text-accent transition-standard shrink-0 text-2xl">
            {icon}
          </span>
        ) : null}

        <span className="min-w-0 flex-1">
          <Text as="span" variant="ui" className="group-hover:text-accent transition-standard block font-medium">
            {name}
          </Text>
          {description ? (
            <Text as="span" variant="label" tone="muted" className="block truncate">
              {description}
            </Text>
          ) : null}
        </span>

        {external ? (
          <ArrowUpRight
            className="text-text-muted group-hover:text-accent transition-standard shrink-0"
            aria-hidden="true"
          />
        ) : null}
      </span>
    </CardShell>
  );
}
