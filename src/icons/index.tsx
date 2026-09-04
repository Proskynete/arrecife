import type { Icon as PhosphorIcon, IconProps as PhosphorIconProps, IconWeight } from '@phosphor-icons/react';

import { cn } from '../lib/cn.ts';

/**
 * The system adopts `@phosphor-icons/react`, and this is the whole of what
 * «adopts» means: an optional peer dependency, and one place that fixes what a
 * call site was getting wrong on its own.
 *
 * WHY IT IS HERE AT ALL. The position used to be that the system has no icons.
 * That was right for what the library was — five reading sites, where
 * `lib/glyphs.tsx` covers everything a primitive needs — and it stopped being
 * right when an admin panel arrived. Measured across the four consumers, the one
 * admin app imports 89 distinct icons in 229 places and the other three import
 * 9, 0 and 0. Seventy-seven of the 89 are domain icons for a course admin —
 * `GraduationCap`, `TicketPercent`, `Webhook` — and no design system was ever
 * going to ship them. The set is not the problem.
 *
 * WHAT WAS ACTUALLY BROKEN is that nobody said how they should be DRAWN, so they
 * were sized by hand in five different ways — `size-4` twenty-six times, then
 * `size-3.5`, `size-3`, `size-6`, `size-7` — with no rule behind any of them.
 *
 * WHY PHOSPHOR AND NOT A STROKE-WIDTH SET. Phosphor bakes the weight into the
 * path instead of exposing `strokeWidth`, and its `regular` lands almost exactly
 * on the one stroke the identity document names. Measured on `Minus`, whose
 * regular path is a bar of radius 8 on a 256 grid:
 *
 *   phosphor regular   16/256  = 0.0625em
 *   the document       1.6/24  = 0.0667em   «funcionales en trazo 1.6»
 *
 * Six per cent apart, which is no pixel on any screen. Nothing has to be derived
 * and no number has to be invented: `regular` IS the system's line.
 *
 * THE SIZE IS 1em, which is Phosphor's own default and also the rule every icon
 * in this library already follows. An icon beside `text-label` is 13px and
 * beside `text-ui` is 15px, and nobody picks a number.
 *
 * THE WEIGHT IS AN AXIS, AND IT IS THE ONLY ONE AN ICON HAS. There are three
 * roles and `tone` is how you name them; the weights themselves are not a prop,
 * because Phosphor's other three — `thin`, `bold`, `duotone` — say nothing this
 * system means. See `TONE_WEIGHT` below and `docs/decisions.md` § 35.
 *
 * `lib/glyphs.tsx` is the outlier and it is NOT reconciled here: it draws at
 * 1.75 on a 16 grid, which is 0.109em — three quarters heavier than both the
 * document and this. Aligning it restyles every primitive in the library and is
 * its own change. See `docs/decisions.md` § 29.
 *
 * IN NEXT, IMPORT FROM `@phosphor-icons/react/ssr` inside a Server Component.
 * Phosphor's default build reads `IconContext` through `useContext`, and a hook
 * in a Server Component throws — it ships no `"use client"` to stop you. The
 * `/ssr` entry is the same icons without the context read. This wrapper works
 * with either.
 */
export type IconTone = 'action' | 'current' | 'quiet';

export type IconProps = Omit<PhosphorIconProps, 'size' | 'weight' | 'ref'> & {
  /** The Phosphor icon itself, passed as a component: `<Icon as={Books} />`. */
  as: PhosphorIcon;
  /**
   * WHAT THE ICON IS DOING, which is what picks the weight. Three values, and
   * there is no fourth: `action` is the default and the system's line, `current`
   * is the one of a set you are on, `quiet` is furniture that is not a control.
   * `weight` is deliberately not a prop — see `TONE_WEIGHT`.
   */
  tone?: IconTone | undefined;
  /**
   * The accessible name. WITHOUT it the icon is decorative and gets
   * `aria-hidden`, which is the right default: most icons sit beside their own
   * label and announcing them twice is noise.
   *
   * If the icon is inside a button with no text, the name belongs on the BUTTON
   * and not here — that is what `Button size="icon"` asks for.
   */
  label?: string | undefined;
};

/** Phosphor's own name for the system's line. It is what `tone="action"` resolves to. */
export const ICON_WEIGHT: IconWeight = 'regular';

/**
 * The three roles, and the weight each one is drawn at. This is the whole of the
 * weight axis: Phosphor ships six and this system reads three, because the other
 * three — `thin`, `bold`, `duotone` — have no role behind them here.
 *
 * `current` is the one that earns the axis. A sidebar's active item already
 * carries `aria-current="page"` and paints itself biolume, and colour alone is
 * the one channel WCAG 1.4.1 says may not carry meaning by itself. A filled
 * glyph is the second channel, and it survives a forced-colours mode where the
 * biolume does not.
 *
 * `quiet` is for the icon that is not a control and not a state — a marker in a
 * metadata row, a bullet that happens to be a shape. At `regular` it competes
 * with the text it is annotating; at `light` it sits under it.
 */
export const TONE_WEIGHT: Record<IconTone, IconWeight> = {
  action: ICON_WEIGHT,
  current: 'fill',
  quiet: 'light',
};

export function Icon({ as: Glyph, tone = 'action', label, className, ...props }: IconProps) {
  return (
    <Glyph
      size="1em"
      weight={TONE_WEIGHT[tone]}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      focusable="false"
      className={cn('shrink-0', className)}
      {...props}
    />
  );
}
