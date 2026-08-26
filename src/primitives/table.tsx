import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

/** El contenedor scrollea en horizontal: la página nunca lo hace. */
export function Table({ className, ...props }: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="w-full overflow-x-auto">
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
        'px-sm h-10 text-left align-middle',
        'text-eyebrow font-mono text-text-muted uppercase',
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: ComponentPropsWithoutRef<'td'>) {
  return (
    <td className={cn('px-sm py-sm text-text-secondary align-middle', className)} {...props} />
  );
}

export function TableCaption({ className, ...props }: ComponentPropsWithoutRef<'caption'>) {
  return <caption className={cn('mt-sm text-label text-text-muted', className)} {...props} />;
}
