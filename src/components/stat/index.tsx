import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { CARD_SURFACE } from '../../primitives/card.tsx';
import { Progress } from '../../primitives/progress.tsx';
import { Text } from '../../primitives/typography.tsx';

/**
 * A large metric: the number in the `stat` scale and its name underneath.
 *
 * The document's rule is not one of style, it is one of semantics: «biolume for
 * the neutral and sand ONLY when the number is the problem». A 12 of
 * applications is a datum; a 0 of design systems is the problem the talk is
 * about. That is why `tone` is not an open palette — there are two values and
 * they mean different things.
 *
 * The reading order is icon + title, the big number, and the standfirst below.
 * The number goes in the MIDDLE and not at the end on purpose: it is what people
 * came to read, and a two-line standfirst between the title and the figure
 * buries it. The top says what it is about, the middle says how much, and the
 * bottom holds the nuance only someone who stops will read.
 */
export type StatProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  /** The number, already formatted. The library imposes no locale. */
  value: ReactNode;
  /** What is being counted. It goes in mono small caps. */
  label: ReactNode;
  /** `alerta` only when the number IS the problem. */
  tone?: 'neutral' | 'alerta';
  /** With `progress`, the metric reads as progress and adds the bar. */
  progress?: number | undefined;
  /**
   * Glyph beside the title, at 1em. It inherits `currentColor`, so it follows
   * the title's tone and does not have to be tinted separately.
   */
  icon?: ReactNode;
  /**
   * The standfirst: the nuance the number alone does not give. «12 aplicaciones»
   * does not say whether that is a lot, and this is where that gets said.
   */
  description?: ReactNode;
};

export function Stat({
  value,
  label,
  tone = 'neutral',
  progress,
  icon,
  description,
  className,
  ...props
}: StatProps) {
  return (
    <div className={cn(CARD_SURFACE, 'p-step-lg gap-step-xs flex flex-col', className)} {...props}>
      <Text variant="eyebrow" tone="muted" as="p" className="gap-step-xs flex items-center">
        {icon ? (
          // `aria-hidden` is not needed: the system's glyphs already carry it.
          // What IS needed is that it does not shrink next to a long title,
          // because a squashed icon reads as a different icon.
          <span className="shrink-0">{icon}</span>
        ) : null}
        {label}
      </Text>

      <Text variant="stat" as="p" tone={tone === 'alerta' ? 'warm' : 'accent'}>
        {value}
      </Text>

      {description ? (
        <Text variant="ui" tone="secondary" as="p">
          {description}
        </Text>
      ) : null}

      {typeof progress === 'number' ? (
        <Progress
          value={progress}
          tone={tone === 'alerta' ? 'warm' : 'accent'}
          label={`${label}: ${progress}%`}
          className="mt-step-sm"
        />
      ) : null}
    </div>
  );
}
