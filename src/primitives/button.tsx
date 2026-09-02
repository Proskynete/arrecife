import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../lib/cn.ts';
import { Spinner } from '../lib/glyphs.tsx';

/**
 * The system's FOUR variants, and only those four.
 *
 * Brand rule 2, as code rather than as documentation: in light mode the primary
 * button cannot be biolume or sand, so it switches to solid hull. There is no
 * literal hex anywhere — `brand.hull` is a token, and the hover reuses
 * `textSecondary` instead of inventing a `hullHover`.
 *
 * Brand rule 3: `conversion` appears ONCE per screen. That is documented in the
 * story and not enforced at runtime: two conversion buttons on one page are a
 * design problem, not an error that should take the render down.
 *
 * `secondary` is NEVER filled. It is border and text: at rest, hover hairline
 * and foam; on hover, both move to biolume. A filled secondary is a badly tinted
 * primary, and that is what this file used to do.
 *
 * `tertiary` is the system's CLI aesthetic: mono, `./action →` format, no box.
 * It shows up on every card, so it is not a generic `ghost` under another name —
 * the text format is part of the variant.
 *
 * There is no danger variant. The system's error lives in alerts and in field
 * validation, not in a red button. If a real one is ever needed, it goes into
 * the document first and in here second.
 */
const button = cva(
  [
    'inline-flex cursor-pointer items-center justify-center gap-step-xs whitespace-nowrap select-none',
    'rounded-control font-sans font-medium',
    'transition-standard',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-accent text-accent-on hover:bg-accent-hover',
          'light:bg-brand-hull light:text-accent-on light:hover:bg-text-secondary',
        ],
        conversion: 'bg-warm text-warm-on hover:bg-warm-hover',
        secondary: [
          'border-hairline-hover border bg-transparent text-text-primary',
          'hover:border-accent hover:text-accent',
        ],
        tertiary: [
          'bg-transparent font-mono font-normal text-text-secondary',
          'hover:text-accent hover:underline hover:underline-offset-4',
        ],
      },
      size: {
        sm: 'h-8 px-control-sm text-label',
        md: 'h-10 px-control-md text-ui',
        lg: 'h-12 px-control-lg text-lead',
        /** A 42×42 square, no text. `aria-label` is mandatory on it. */
        icon: 'size-control-icon p-0',
      },
    },
    compoundVariants: [
      /**
       * The tertiary has no box: neither horizontal padding nor control height.
       * It goes here rather than as `px-0` on the variant so it beats the size's
       * `px-*` without depending on the order cva concatenates classes in.
       */
      { variant: 'tertiary', size: ['sm', 'md', 'lg'], class: 'h-auto px-0' },
    ],
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export type ButtonProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof button> & {
    /** Renders the child instead of a `<button>`, to wrap a link. */
    asChild?: boolean;
    /** Disables and announces `aria-busy`. Incompatible with `asChild`. */
    loading?: boolean;
    /** SVG glyph before the text. Hidden while loading. */
    icon?: ReactNode;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  icon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  if (asChild) {
    return (
      <Slot className={cn(button({ variant, size }), className)} {...props}>
        {children}
      </Slot>
    );
  }

  return (
    <button
      className={cn(button({ variant, size }), className)}
      disabled={disabled === true || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  );
}

export { button as buttonVariants };
