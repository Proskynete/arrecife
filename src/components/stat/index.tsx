import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { ChevronDown, ChevronUp, Minus } from '../../lib/glyphs.tsx';
import { cn } from '../../lib/cn.ts';
import { CARD_SURFACE } from '../../variants/card.ts';
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
 *
 * `delta` and `spark` sit with the number and not with the standfirst, because
 * both are about the number: how it moved and what shape the movement had. The
 * order survives — top what, middle how much, bottom the nuance.
 */
export type StatProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  /** The number, already formatted. The library imposes no locale. */
  value: ReactNode;
  /** What is being counted. It goes in mono small caps. */
  label: ReactNode;
  /**
   * `alert` ONLY when the number is the problem, and `achievement` when it is
   * the opposite — the diplomas issued, the modules finished. The two paint the
   * same sand today and they are still two names: a system that names by meaning
   * cannot make «this is bad» the only way to say «this stands out». See
   * `docs/decisions.md` § 28.
   */
  tone?: 'neutral' | 'alert' | 'achievement';
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
  /** How the number moved since last time. */
  delta?: StatDelta | undefined;
  /**
   * The number's shape over time, under it. A `ReactNode` and not a data prop:
   * a sparkline needs a charting library, and this component lives in the barrel
   * that four projects install. The one project that draws them passes its own,
   * exactly like `icon`.
   */
  spark?: ReactNode;
};

export type StatDelta = {
  /**
   * Already formatted — «+12 esta semana», «↑8 %». The library imposes no
   * locale, same as `value`.
   */
  value: ReactNode;
  /**
   * Which way it moved. It picks the GLYPH and never the colour, because a rise
   * is not automatically good: «+12 alumnos» and «+12 errores» point the same
   * way and mean opposite things. Whether the number matters is `tone`'s job,
   * and it is a decision the call site has already made.
   */
  direction: 'up' | 'down' | 'flat';
};

/** The arrow, and the word a screen reader hears in its place. */
const DELTA = {
  up: { glyph: ChevronUp, label: 'sube' },
  down: { glyph: ChevronDown, label: 'baja' },
  flat: { glyph: Minus, label: 'sin cambio' },
} as const;

export function Stat({
  value,
  label,
  tone = 'neutral',
  progress,
  icon,
  description,
  delta,
  spark,
  className,
  ...props
}: StatProps) {
  const DeltaGlyph = delta ? DELTA[delta.direction].glyph : null;

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

      <Text variant="stat" as="p" tone={tone === 'neutral' ? 'accent' : 'warm'}>
        {value}
      </Text>

      {delta && DeltaGlyph ? (
        <Text variant="label" tone="secondary" as="p" className="gap-step-xs flex items-center">
          <span className="sr-only">{DELTA[delta.direction].label} </span>
          <DeltaGlyph className="shrink-0" />
          {delta.value}
        </Text>
      ) : null}

      {spark ? <div className="mt-step-xs">{spark}</div> : null}

      {description ? (
        <Text variant="ui" tone="secondary" as="p">
          {description}
        </Text>
      ) : null}

      {typeof progress === 'number' ? (
        <Progress
          value={progress}
          tone={tone === 'neutral' ? 'accent' : 'warm'}
          label={`${label}: ${progress}%`}
          className="mt-step-sm"
        />
      ) : null}
    </div>
  );
}
