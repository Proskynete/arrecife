import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { Text } from './typography.tsx';

/**
 * The system's surface container, and the only definition of what a card is:
 * `surface`, `hairline` border, card radius.
 *
 * The cards with a domain — `ArticleCard`, `TalkCard`, `CourseCard`, `LinkRow` —
 * reuse these same classes, so if the radius or the border changes, it changes
 * in all of them at once.
 *
 * The document gave the card a background of its own, `#0B1620`, a fourth
 * surface level between abyss and trench. It is not here: it has no counterpart
 * in light mode, and a surface without a counterpart is a token that lies in
 * half the projects. The card is `surface`, and the document is corrected — see
 * `docs/decisions.md`.
 *
 * The padding really was wrong: the document asks for 26 (`lg`) and this had 16
 * (`md`).
 */
export const CARD_SURFACE = 'rounded-card border-hairline bg-surface border';

/** The hover from rule 6: the border only. Applied where the card is clickable. */
export const CARD_HOVER = 'transition-standard hover:border-hairline-hover';

export function Card({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn(CARD_SURFACE, className)} {...props} />;
}

export function CardHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('gap-step-xs p-step-lg flex flex-col', className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentPropsWithoutRef<'h3'>) {
  return <Text as="h3" variant="h3" className={className} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <Text variant="ui" tone="secondary" className={className} {...props} />;
}

export function CardContent({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('px-step-lg pb-step-lg', className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('border-hairline px-step-lg py-step-md gap-step-sm flex items-center border-t', className)}
      {...props}
    />
  );
}
