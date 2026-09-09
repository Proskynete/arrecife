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
      className={cn(
        'rounded-control bg-surface gap-step-xs inline-flex max-w-full items-center p-1',
        // The triggers are `whitespace-nowrap` — a tab whose label wraps stops
        // reading as a tab — so on a narrow screen the list is wider than the
        // page and takes the whole document with it. It SCROLLS instead: the
        // list keeps hugging its content up to the width available and gives up
        // the overflow to itself rather than to the page. Every tab stays
        // reachable, and reaching one by keyboard scrolls it into view on its
        // own because focus does that.
        'overflow-x-auto',
        className,
      )}
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
        // `shrink-0` is what makes the list's `overflow-x-auto` work: without it
        // the triggers give up their width first and the labels run out of their
        // own pills instead of the row scrolling.
        'rounded-chip px-step-sm inline-flex h-8 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap',
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
