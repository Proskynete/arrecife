import { CaretLeft, CaretRight, DotsThree } from '@phosphor-icons/react';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { Icon } from '../icons/index.tsx';

export function Pagination({ className, ...props }: ComponentPropsWithoutRef<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="Paginación"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

export function PaginationContent({ className, ...props }: ComponentPropsWithoutRef<'ul'>) {
  /*
    `flex-wrap` and centred, which is what a phone needs and what a wide screen
    never notices. Nine pages plus «Anterior» and «Siguiente» is eleven controls
    at 36px minimum each: 400px of row on a 360px screen, and without the wrap
    the whole page scrolls sideways to reach page 9.

    Wrapping and not scrolling, unlike `TabsList` two files over, and the
    difference is what the row IS. A tab list is one object and cutting it in
    half says the tabs are two groups; a pagination row is a list of
    interchangeable numbers, so a second line is just more of the same line.
  */
  return (
    <ul
      className={cn('gap-step-xs flex flex-row flex-wrap items-center justify-center', className)}
      {...props}
    />
  );
}

export function PaginationItem(props: ComponentPropsWithoutRef<'li'>) {
  return <li {...props} />;
}

export type PaginationLinkProps = ComponentPropsWithoutRef<'a'> & { isActive?: boolean };

export function PaginationLink({ className, isActive = false, ...props }: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'rounded-chip px-step-sm inline-flex h-9 min-w-9 cursor-pointer items-center justify-center',
        'font-sans text-ui text-text-secondary',
        'transition-standard',
        'hover:bg-surface hover:text-text-primary',
        'focus-ring',
        isActive && 'bg-surface-raised text-text-primary',
        className,
      )}
      {...props}
    />
  );
}

export function PaginationPrevious({ className, ...props }: PaginationLinkProps) {
  return (
    <PaginationLink aria-label="Página anterior" className={cn('gap-step-xs', className)} {...props}>
      <Icon as={CaretLeft} />
      Anterior
    </PaginationLink>
  );
}

export function PaginationNext({ className, ...props }: PaginationLinkProps) {
  return (
    <PaginationLink aria-label="Página siguiente" className={cn('gap-step-xs', className)} {...props}>
      Siguiente
      <Icon as={CaretRight} />
    </PaginationLink>
  );
}

export function PaginationEllipsis({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      aria-hidden="true"
      className={cn('text-text-muted flex size-9 items-center justify-center', className)}
      {...props}
    >
      <Icon as={DotsThree} />
    </span>
  );
}
