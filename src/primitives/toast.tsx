import { CheckCircle, WarningCircle, X } from '@phosphor-icons/react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { Icon } from '../icons/index.tsx';

export const ToastProvider = ToastPrimitive.Provider;
export const ToastAction = ToastPrimitive.Action;

export function ToastViewport({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      className={cn(
        'gap-step-sm p-step-lg fixed right-0 bottom-0 z-50 flex max-h-screen w-full flex-col-reverse',
        'sm:max-w-[420px] sm:flex-col',
        className,
      )}
      {...props}
    />
  );
}

/**
 * THE TONE IS A SURFACE, NOT A LINE, and that is what 0.10.0 changed.
 *
 * It used to be `bg-surface` for all three and the whole difference between a
 * confirmation and a failure was `border-success/40` against `border-error/40`:
 * two hairlines at 40 % opacity, on a box that floats over whatever page it
 * happens to land on, with no mark on it and the text in `textSecondary`. At the
 * size a toast actually appears at, that is not a colour — it is two greys.
 *
 * What it is now is the recipe `Alert` already carries and had already argued:
 * the semantic colour SOLID on the border and at 10 % as a tint, which is
 * `emphasis="strong"` in `variants/alert.ts`. That variant exists for the alert
 * that has to read UNDER a form field, and a toast has the same problem from the
 * other side — it reads over content it did not choose, so the subtle 8 %/22 %
 * recipe is not enough on its own.
 *
 * THE TINT RIDES ON A GRADIENT and not on `background-color`, which is the one
 * odd line here. A toast has to be OPAQUE: it floats, and `bg-success/10` alone
 * would let the article underneath show through it. `bg-surface` paints the
 * opaque ground and the flat `linear-gradient` paints the tint on top of it, in
 * one element, without a wrapper or a `::before` that would need its own
 * stacking context. The two `from-`/`to-` stops are the same colour on purpose:
 * it is a fill, not a gradient.
 *
 * MEASURED over the resulting surface, dark then light, worst case of the two:
 *
 *   text-text-primary over the success tint   14.9   14.6
 *   text-text-secondary over the success tint  8.4    7.1
 *   the border against the tint                4.2    3.6   (3:1 graphical)
 *
 * The body stays `textSecondary` and the title `textPrimary`, which is the same
 * split `Alert` uses and for the same reason: a semantic colour is not a text
 * colour over its own tint.
 */
const toast = cva(
  [
    'gap-step-md p-step-md pr-10 relative flex w-full items-start justify-between',
    'rounded-card border bg-surface shadow-standard',
    'font-sans text-ui text-text-secondary',
  ],
  {
    variants: {
      variant: {
        neutral: 'border-border',
        success: 'border-success bg-linear-to-b from-success/10 to-success/10',
        error: 'border-error bg-linear-to-b from-error/10 to-error/10',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

/**
 * The mark, and `neutral` deliberately has none.
 *
 * A toast with no tone is a receipt — «Guardado» — and a glyph on it says
 * nothing the sentence does not. The other two are the ones a reader has to tell
 * apart at a glance and often out of the corner of an eye, so they get the
 * second channel: WCAG 1.4.1 is exactly the rule that colour alone may not carry
 * the difference, and until now colour alone is all there was.
 *
 * They are the same two `Alert` draws, minus `Info` and `Warning`, because
 * `Toaster` publishes three shapes and not four. `WarningCircle` and not
 * `XCircle`: an error toast is a report, and the ✕ reads as the close button it
 * is sitting two centimetres away from.
 */
const GLYPH = {
  neutral: null,
  success: CheckCircle,
  error: WarningCircle,
} as const;

const GLYPH_COLOR = {
  neutral: '',
  success: 'text-success',
  error: 'text-error',
} as const;

export type ToastProps = ComponentPropsWithoutRef<typeof ToastPrimitive.Root> &
  VariantProps<typeof toast>;

/** No slide-in: the toast appears where it will stay. */
export function Toast({ className, variant, children, ...props }: ToastProps) {
  const tone = variant ?? 'neutral';
  const Mark = GLYPH[tone];

  return (
    <ToastPrimitive.Root className={cn(toast({ variant }), className)} {...props}>
      {Mark ? (
        <span className={cn('text-ui flex h-[1lh] shrink-0 items-center leading-normal', GLYPH_COLOR[tone])}>
          <Icon as={Mark} />
        </span>
      ) : null}
      {children}
      <ToastPrimitive.Close
        aria-label="Cerrar"
        className={cn(
          'rounded-chip text-text-muted absolute top-3 right-3 flex size-7 cursor-pointer items-center justify-center',
          'transition-standard',
          'hover:bg-surface-raised hover:text-text-primary',
          'focus-ring',
        )}
      >
        <Icon as={X} />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}

export function ToastTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof ToastPrimitive.Title>) {
  return (
    <ToastPrimitive.Title
      className={cn('text-text-primary mb-1 font-medium', className)}
      {...props}
    />
  );
}

export function ToastDescription({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof ToastPrimitive.Description>) {
  return <ToastPrimitive.Description className={cn('max-w-measure', className)} {...props} />;
}
