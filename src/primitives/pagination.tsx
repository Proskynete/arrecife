import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { ChevronLeft, ChevronRight, Ellipsis } from '../lib/glyphs.tsx';

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
  return <ul className={cn('gap-xs flex flex-row items-center', className)} {...props} />;
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
        'rounded-chip px-sm inline-flex h-9 min-w-9 items-center justify-center',
        'font-sans text-ui text-text-secondary',
        'transition-standard',
        'hover:bg-surface hover:text-text-primary',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        isActive && 'bg-surface-raised text-text-primary',
        className,
      )}
      {...props}
    />
  );
}

export function PaginationPrevious({ className, ...props }: PaginationLinkProps) {
  return (
    <PaginationLink aria-label="Página anterior" className={cn('gap-xs', className)} {...props}>
      <ChevronLeft />
      Anterior
    </PaginationLink>
  );
}

export function PaginationNext({ className, ...props }: PaginationLinkProps) {
  return (
    <PaginationLink aria-label="Página siguiente" className={cn('gap-xs', className)} {...props}>
      Siguiente
      <ChevronRight />
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
      <Ellipsis />
    </span>
  );
}
