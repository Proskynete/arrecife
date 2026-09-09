import { CircleNotch } from '@phosphor-icons/react';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../lib/cn.ts';
import { Icon } from '../icons/index.tsx';

import { buttonVariants as button } from '../variants/button.ts';

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
      {/*
        The spinner is the first of the five declared exceptions to «no
        movement», and since 0.10.0 it is Phosphor's `CircleNotch` rather than a
        hand-drawn arc: the ring and its gap are the same shape, drawn at the
        weight `tone="action"` resolves to. The spin is ours and stays behind
        `motion-safe`.
      */}
      {loading ? <Icon as={CircleNotch} className="motion-safe:animate-spin" /> : icon}
      {children}
    </button>
  );
}

