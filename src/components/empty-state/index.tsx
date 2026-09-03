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
 * `page` keeps that rule intact and `expression` stays MANDATORY there: an empty
 * state that IS the screen without a face is half the component. It is the only
 * place, alongside the 404, the server error, course progress, celebration, the
 * toast and the newsletter's «sin spam», where a face may appear.
 *
 * `inline` is the other situation, and it is a different one rather than a
 * smaller one: the hole inside a table page or a dashboard widget, competing with
 * a dozen elements around it. An admin panel has twenty of those on one screen,
 * and twenty faces is not the humour contract, it is a zoo. The variant carries
 * no face, and the type does not let one through. See `docs/decisions.md` § 27.
 */
type EmptyStateBase = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  title: ReactNode;
  /** One line explaining what is missing or what to do. */
  description?: ReactNode;
  /** The action that gets you out of the empty state. Usually a tertiary button. */
  action?: ReactNode;
};

export type EmptyStateProps = EmptyStateBase &
  (
    | {
        /** `page`, the default: the empty state IS the screen or the section, and it carries the face. */
        variant?: 'page' | undefined;
        /**
         * The face. Mandatory on `page` and impossible on `inline` — the props
         * are a union, so the generated table cannot show a per-variant «req.»
         * and the sentence has to carry it. Without it, `page` is a centred
         * paragraph.
         */
        expression: Face;
        /** Where the brand PNGs are served from. */
        basePath?: string | undefined;
        icon?: never;
      }
    | {
        /** `inline`: the hole inside a table or a widget. No face, and no way to pass one. */
        variant: 'inline';
        /**
         * A glyph above the line. It measures 1em and inherits `currentColor`,
         * like `Stat`'s: the project passes its own and sizes it, because the
         * system has no icon library and is not getting one.
         */
        icon?: ReactNode;
        expression?: never;
        basePath?: never;
      }
  );

/** 66px, from the document. It is illustration size, not page rhythm. */
const FACE = 'w-[66px] max-w-none';

export function EmptyState(props: EmptyStateProps) {
  if (props.variant === 'inline') {
    const { variant, title, description, action, icon, className, ...rest } = props;

    return (
      <div
        className={cn(
          'py-step-lg px-step-md gap-step-xs flex flex-col items-center text-center',
          className,
        )}
        {...rest}
      >
        {icon ? <span className="text-text-muted shrink-0">{icon}</span> : null}

        <Text variant="ui" tone="muted" as="p" className="max-w-measure">
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

  const { variant, title, description, action, expression, basePath, className, ...rest } = props;

  return (
    <div
      className={cn(CARD_SURFACE, 'p-step-lg gap-step-sm flex flex-col items-center text-center', className)}
      {...rest}
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
