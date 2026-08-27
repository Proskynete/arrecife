import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

export type RadioGroupProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>;
export type RadioGroupItemProps = ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>;

export function RadioGroup({ className, ...props }: RadioGroupProps) {
  return <RadioGroupPrimitive.Root className={cn('gap-sm grid', className)} {...props} />;
}

export function RadioGroupItem({ className, ...props }: RadioGroupItemProps) {
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        'rounded-pill border-border bg-surface size-5 shrink-0 cursor-pointer border',
        'transition-standard',
        'hover:border-hairline-hover',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[state=checked]:border-accent',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex size-full items-center justify-center">
        <span className="rounded-pill bg-accent block size-2.5" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}
