import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { Check, Minus } from '../lib/glyphs.tsx';

export type CheckboxProps = ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        'rounded-chip border-border bg-surface size-5 shrink-0 cursor-pointer border',
        'text-accent-on transition-standard',
        'hover:border-hairline-hover',
        'focus-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[state=checked]:border-accent data-[state=checked]:bg-accent',
        'data-[state=indeterminate]:border-accent data-[state=indeterminate]:bg-accent',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-[13px]">
        {props.checked === 'indeterminate' ? <Minus /> : <Check />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
