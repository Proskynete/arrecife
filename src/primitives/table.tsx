import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

/**
 * The table, and the surface it sits on. The two are one piece.
 *
 * The container has always scrolled horizontally so the PAGE never does. What it
 * did not carry was a shape, and that turned out to be the same omission twice:
 * `TableRow` tints a `<tr>` on hover, a `<tr>` is a rectangle, and nothing
 * clipped it — so every project wrapped the table in its own `rounded-xl border`
 * and the hover of the header row and of the last row spilled out through the
 * rounded corner. The fix from outside is `overflow-hidden` on that wrapper, and
 * it worked exactly as far as somebody remembering it: five tables in `cursos`
 * had it and the nine in `blog-content-manager` did not.
 *
 * So the surface comes with the table. `rounded-card` and `border-hairline` are
 * the same two the system already gives a card — a table IS a panel of content,
 * not a bare grid — and the clip comes free with the scroll: an element with
 * `overflow-x: auto` clips its content to the border box, corners included. The
 * hover cannot spill because there is nowhere left to spill to, and fourteen
 * copies of the same `div` stop existing.
 *
 * There is NO background token on it, and that is not an oversight: `TableRow`'s
 * hover is `bg-surface`, so painting the container `surface` too would make the
 * hover invisible. The table sits on the page and the row lifts off it, which is
 * the direction the tint was written for.
 *
 * `className` reaches the `<table>` and not the container, which is the trap
 * `Nav`'s `size` documents: a `rounded-none` passed from the call site does
 * nothing, silently. There is one shape on purpose — fourteen call sites wanted
 * the same one — and a second gets a prop when a second consumer exists, not
 * before. See `docs/decisions.md` § 39.
 *
 * THE `tabIndex` IS NOT DECORATION and it is not new behaviour dressed up as
 * markup. A region you can pan with a mouse has to be reachable with a keyboard
 * — WCAG 2.1.1 — and a table of text contains nothing focusable to land on, so
 * without it a keyboard user simply cannot read the columns that are off screen.
 * It has been true since the container started scrolling; it went unseen because
 * no story had more columns than width, and the first one that did failed axe on
 * `scrollable-region-focusable` at once.
 *
 * It is unconditional because the alternative is worse. Whether the table
 * overflows depends on the viewport, so the only way to set this correctly at
 * render is to measure in an effect and re-measure on resize — a ResizeObserver
 * on every table in the system to avoid a tab stop. A stop that scrolls nothing
 * is a small cost; a region a keyboard cannot reach is content that is not there.
 */
export function Table({ className, ...props }: ComponentPropsWithoutRef<'table'>) {
  return (
    <div tabIndex={0} className="rounded-card border-hairline focus-ring w-full overflow-x-auto border">
      <table
        className={cn('w-full caption-bottom border-collapse font-sans text-ui', className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }: ComponentPropsWithoutRef<'thead'>) {
  return <thead className={cn('[&_tr]:border-hairline [&_tr]:border-b', className)} {...props} />;
}

export function TableBody({ className, ...props }: ComponentPropsWithoutRef<'tbody'>) {
  return <tbody className={className} {...props} />;
}

export function TableFooter({ className, ...props }: ComponentPropsWithoutRef<'tfoot'>) {
  return (
    <tfoot
      className={cn('border-hairline bg-surface text-text-secondary border-t', className)}
      {...props}
    />
  );
}

export function TableRow({ className, ...props }: ComponentPropsWithoutRef<'tr'>) {
  return (
    <tr
      className={cn(
        'border-hairline transition-standard border-b last:border-b-0',
        'hover:bg-surface data-[state=selected]:bg-surface-raised',
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: ComponentPropsWithoutRef<'th'>) {
  return (
    <th
      className={cn(
        'px-step-sm h-10 text-left align-middle',
        'text-eyebrow font-mono text-text-muted uppercase',
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: ComponentPropsWithoutRef<'td'>) {
  return (
    <td className={cn('px-step-sm py-step-sm text-text-secondary align-middle', className)} {...props} />
  );
}

/**
 * The caption, at the bottom and INSIDE the surface.
 *
 * It carries its own horizontal padding, which the cells get from `px-step-sm`
 * and it used to get from nobody: with no border drawn around the table it read
 * as a line under a grid, and with one it would sit flush against the left edge.
 * The bottom padding is the same reasoning — a caption touching the border below
 * it reads as an overflow, not as a caption.
 */
export function TableCaption({ className, ...props }: ComponentPropsWithoutRef<'caption'>) {
  return (
    <caption
      className={cn('px-step-sm pt-step-sm pb-step-sm text-label text-text-muted', className)}
      {...props}
    />
  );
}
