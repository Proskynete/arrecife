import { type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../lib/cn.ts';

import { alertVariants as alert } from '../variants/alert.ts';

/** For the glyph only. The title is `textPrimary`: see the note above. */
const colorGlyph = {
  accent: 'text-accent',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
} as const;

/**
 * Mono glyphs, never emoji. They are characters and not SVG because the document
 * asks for them in the mono family: they are part of the CLI aesthetic, same as
 * the `❯` in the code block's bar.
 */
const GLYPH = {
  accent: '✦',
  success: '✓',
  warning: '!',
  error: '✕',
} as const;

export type AlertProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> &
  VariantProps<typeof alert> & {
    title?: ReactNode;
    /**
     * Replaces the variant's mono glyph. Never an emoji: if you need something
     * else, it is an SVG from `glyphs`.
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
        <span
          aria-hidden="true"
          className={cn('font-mono text-ui leading-normal select-none', colorGlyph[tone])}
        >
          {icon ?? GLYPH[tone]}
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

