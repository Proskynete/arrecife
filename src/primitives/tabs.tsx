import * as TabsPrimitive from '@radix-ui/react-tabs';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

export type TabsProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;

export function Tabs({ className, ...props }: TabsProps) {
  return <TabsPrimitive.Root className={cn('gap-step-md flex flex-col', className)} {...props} />;
}

export function TabsList({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn('rounded-control bg-surface gap-step-xs inline-flex items-center p-1', className)}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'rounded-chip px-step-sm inline-flex h-8 cursor-pointer items-center justify-center whitespace-nowrap',
        'font-sans text-label text-text-secondary',
        'transition-standard',
        'hover:text-text-primary',
        'focus-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[state=active]:bg-surface-raised data-[state=active]:text-text-primary',
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        'focus-ring',
        className,
      )}
      {...props}
    />
  );
}
