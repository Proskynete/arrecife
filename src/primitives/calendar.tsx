import { es } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import type { ComponentProps } from 'react';

import { cn } from '../lib/cn.ts';
import { ChevronLeft, ChevronRight } from '../lib/glyphs.tsx';

export type CalendarProps = ComponentProps<typeof DayPicker> & {
  /**
   * Stretches the calendar to fill its container's whole width, with the cells
   * splitting it evenly.
   *
   * Off, the calendar measures whatever its cells measure — 36px each — and that
   * is what you want inside a `Popover`, where stretching it would leave a huge
   * bubble. On, it is a planner's month view, which fills the page.
   *
   * With several months, each takes an equal fraction of the width.
   */
  fullWidth?: boolean | undefined;
};
/**
 * A navigable month calendar, on top of `react-day-picker`.
 *
 * It is the library's only heavy dependency and it was let in knowingly: the
 * content planner's calendar cannot be solved with the native control. For
 * picking a date inside a form there is `DateField`, which drags nothing along.
 *
 * `animate` stays off — that is its default — so the month change does not
 * slide. Days are marked with color and border, like everything else.
 *
 * The language defaults to Spanish because all five projects are; it is changed
 * by passing another date-fns `locale`.
 *
 * It does not ship the library's `style.css`: every class comes from here, so
 * the consumer need not import third-party CSS or fight its specificity.
 */
export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  fullWidth = false,
  ...props
}: CalendarProps) {
  const day = [
    'relative p-0 text-center',
    fullWidth ? 'h-9 flex-1' : 'size-9',
    'text-ui font-sans text-text-primary',
  ].join(' ');

  const dayButton = [
    fullWidth ? 'h-9 w-full' : 'size-9',
    'rounded-chip inline-flex items-center justify-center',
    'transition-standard cursor-pointer',
    'hover:bg-surface-raised',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' ');

  const navigation = [
    'size-8 rounded-chip inline-flex items-center justify-center',
    'text-text-secondary transition-standard cursor-pointer',
    'hover:bg-surface-raised hover:text-text-primary',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
    'disabled:pointer-events-none disabled:opacity-50',
  ].join(' ');

  return (
    <DayPicker
      locale={es}
      showOutsideDays={showOutsideDays}
      className={cn('font-sans', className)}
      classNames={{
        // `relative` is mandatory: the navigation is absolutely positioned
        // against the root, and without this it anchors to the first positioned
        // ancestor — or to the viewport — and the arrows end up at the page edges.
        root: cn('relative', fullWidth ? 'w-full' : 'w-fit'),
        months: cn('gap-step-md flex flex-col sm:flex-row', fullWidth && 'w-full'),
        month: cn('gap-step-sm flex flex-col', fullWidth && 'min-w-0 flex-1'),
        month_caption: 'h-8 flex items-center justify-center',
        caption_label: 'text-ui font-sans font-medium text-text-primary capitalize',
        nav: 'absolute inset-x-0 top-0 flex items-center justify-between',
        button_previous: navigation,
        button_next: navigation,
        month_grid: 'w-full border-collapse',
        weekdays: cn('flex', fullWidth && 'w-full'),
        // `textMuted` does not go over `surfaceRaised` — 4.07:1 — and a calendar
        // inside a Popover lives exactly there.
        weekday: cn(
          'h-9 text-eyebrow font-mono text-text-secondary uppercase flex items-center justify-center',
          fullWidth ? 'flex-1' : 'w-9',
        ),
        week: 'flex w-full',
        day: day,
        day_button: dayButton,
        today: 'text-accent font-medium',
        // Days from neighbouring months are dimmed, but not below AA:
        // `textSecondary` at 85 % gives 5.09:1 in the worst case, which is over
        // `surfaceRaised`. At 75 % it no longer passes in light mode.
        outside: 'text-text-secondary opacity-85',
        disabled: 'opacity-50',
        hidden: 'invisible',
        selected: '[&_button]:bg-accent [&_button]:text-accent-on [&_button]:hover:bg-accent-hover',
        range_start: '[&_button]:bg-accent [&_button]:text-accent-on [&_button]:rounded-r-none',
        range_middle: '[&_button]:bg-surface-raised [&_button]:text-text-primary [&_button]:rounded-none',
        range_end: '[&_button]:bg-accent [&_button]:text-accent-on [&_button]:rounded-l-none',
        footer: 'text-label font-sans text-text-secondary pt-step-sm',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...rest }) =>
          orientation === 'left' ? <ChevronLeft {...rest} /> : <ChevronRight {...rest} />,
      }}
      {...props}
    />
  );
}
