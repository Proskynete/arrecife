import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { naming, tagline as taglines } from '../tokens/tokens.ts';
import { Isotype } from './isotype.tsx';
import { ASSETS_PATH, type Background } from './catalog.ts';

export type LogoProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  background?: Background | undefined;
  basePath?: string | undefined;
  /** Hides the wordmark and leaves only the fin, for very narrow bars. */
  isotypeOnly?: boolean | undefined;
  /**
   * Adds the tagline under the wordmark, separated from the fin by a divider.
   *
   * It is the shape the brand takes in the site's bar. The text comes from
   * `tagline.short` and cannot be passed as a prop, for the same reason as the
   * wordmark: a tagline hand-written across five projects is five taglines in
   * six months.
   */
  withTagline?: boolean | undefined;
};

/**
 * The wordmark comes from `naming.wordmark`, not from a hand-written string, and
 * it always reads «Eduardo Álvarez». The mascot is called Tiburoncín and its
 * name never appears inside the logo: there is no prop that changes the text.
 *
 * When the wordmark is hidden, the name still reaches the screen reader through
 * the isotype's `alt`. A logo with no accessible name is an invisible logo.
 */
export function Logo({
  background = 'dark',
  basePath = ASSETS_PATH,
  isotypeOnly = false,
  withTagline = false,
  className,
  ...props
}: LogoProps) {
  const withFin = (
    <Isotype
      background={background}
      basePath={basePath}
      alt={isotypeOnly ? naming.wordmark : ''}
      className={withTagline ? 'h-9 w-auto' : 'h-7 w-auto'}
    />
  );

  const wordmark = (
    <span className="text-ui font-display text-text-primary font-bold tracking-[-0.02em]">
      {naming.wordmark}
    </span>
  );

  if (isotypeOnly) {
    return (
      <span className={cn('gap-step-xs inline-flex items-center', className)} {...props}>
        {withFin}
      </span>
    );
  }

  if (withTagline) {
    return (
      <span className={cn('gap-step-sm inline-flex items-center', className)} {...props}>
        {withFin}
        {/*
          The divider is `hairline`, not `border`: it separates two parts of the
          same mark, not two controls. It is `aria-hidden` — a rule, not content.
        */}
        <span aria-hidden="true" className="bg-hairline h-8 w-px shrink-0" />
        <span className="flex min-w-0 flex-col">
          {wordmark}
          <span className="text-eyebrow font-mono text-text-muted uppercase">
            {taglines.short}
          </span>
        </span>
      </span>
    );
  }

  return (
    <span className={cn('gap-step-xs inline-flex items-center', className)} {...props}>
      {withFin}
      {wordmark}
    </span>
  );
}
