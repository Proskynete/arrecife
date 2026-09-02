import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { MascotFace } from '../../brand/mascot.tsx';
import type { Face } from '../../brand/catalog.ts';
import { cn } from '../../lib/cn.ts';
import { CARD_SURFACE } from '../../variants/card.ts';
import { Text } from '../../primitives/typography.tsx';

/**
 * The mascot's most important rule, finally as code.
 *
 * `catalog.ts` and `page-header/index.tsx` both cited it — «that is why
 * `EmptyState` takes a face and `PageHeader` does not» — and the component did
 * not exist, so the rule lived in a comment about a ghost component. Once the
 * brand story started repeating the sentence, it was also a published promise.
 *
 * `expression` is MANDATORY and not optional: an empty state without a face is
 * half the component. It is the only place, alongside the 404, the server error,
 * course progress, celebration, the toast and the newsletter's «sin spam», where
 * a face may appear.
 */
export type EmptyStateProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  /** The face. Mandatory: without it this is a centred paragraph. */
  expression: Face;
  title: ReactNode;
  /** One line explaining what is missing or what to do. */
  description?: ReactNode;
  /** The action that gets you out of the empty state. Usually a tertiary button. */
  action?: ReactNode;
  /** Where the brand PNGs are served from. */
  basePath?: string | undefined;
};

/** 66px, from the document. It is illustration size, not page rhythm. */
const FACE = 'w-[66px] max-w-none';

export function EmptyState({
  expression,
  title,
  description,
  action,
  basePath,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(CARD_SURFACE, 'p-step-lg gap-step-sm flex flex-col items-center text-center', className)}
      {...props}
    >
      <MascotFace expression={expression} className={FACE} basePath={basePath} />

      <Text variant="ui" as="p" className="font-medium">
        {title}
      </Text>

      {description ? (
        <Text variant="label" tone="muted" as="p" className="max-w-measure font-normal">
          {description}
        </Text>
      ) : null}

      {action ? <div className="mt-step-xs">{action}</div> : null}
    </div>
  );
}
