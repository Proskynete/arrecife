import { CheckCircle, Info, Warning, XCircle } from '@phosphor-icons/react';
import { type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../lib/cn.ts';
import { Icon } from '../icons/index.tsx';

import { alertVariants as alert } from '../variants/alert.ts';

/** For the glyph only. The title is `textPrimary`: see the note above. */
const colorGlyph = {
  accent: 'text-accent',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
} as const;

/**
 * Phosphor, and this is the one place the CLI aesthetic gives ground.
 *
 * The four used to be mono CHARACTERS — ✦ ✓ ! ✕ — on the document's rule that
 * an alert's mark belongs to the same family as the `❯` in the code block's bar
 * and the `$` in the footer's signature. That rule is kept where it describes a
 * PROMPT: `~/` in `Nav`, `./` on a nav item, `$` in the signature. It is dropped
 * here, because an alert's mark is not a prompt — it is the one thing on the
 * block that says which of the four this is, and a `!` and a `✕` at 15px are two
 * glyphs of one stroke telling apart a warning from a failure.
 *
 * They are the outlined pair on purpose, not `…Fill`: `tone="action"` is the
 * system's line and an alert's mark is not a state within a set. See
 * `docs/decisions/0.10.md` § 52.
 */
const GLYPH = {
  accent: Info,
  success: CheckCircle,
  warning: Warning,
  error: XCircle,
} as const;

export type AlertProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> &
  VariantProps<typeof alert> & {
    title?: ReactNode;
    /**
     * Replaces the variant's glyph. Never an emoji: if you need something else,
     * it is `<Icon as={…} />` from `@eduardoalvarez/arrecife/icons`.
     */
    icon?: ReactNode;
  };

export function Alert({
  className,
  variant,
  emphasis,
  title,
  icon,
  children,
  ...props
}: AlertProps) {
  const tone = variant ?? 'accent';

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(alert({ variant, emphasis }), className)}
      {...props}
    >
      <div className="gap-step-sm flex items-start">
        {/*
          The glyph sits on the first line of the title, so the span carries the
          same `text-ui` and `leading-normal` the text does and centres the icon
          inside that box. `items-center` on a one-line box IS top alignment, and
          it stays right when the alert has no title and the body wraps.
        */}
        <span
          className={cn('text-ui flex h-[1lh] shrink-0 items-center leading-normal', colorGlyph[tone])}
        >
          {icon ?? <Icon as={GLYPH[tone]} />}
        </span>

        <div className="min-w-0 flex-1">
          {title ? (
            <p className="mb-step-xs text-text-primary font-medium">{title}</p>
          ) : null}
          {children ? <div className="max-w-measure">{children}</div> : null}
        </div>
      </div>
    </div>
  );
}

