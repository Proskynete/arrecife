import * as SelectPrimitive from '@radix-ui/react-select';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { Check, ChevronDown, ChevronUp } from '../lib/glyphs.tsx';

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        'gap-sm px-sm flex h-10 w-full items-center justify-between',
        'rounded-control border-border bg-surface border',
        'font-sans text-ui text-text-primary',
        'transition-standard',
        'hover:border-hairline-hover',
        'focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[placeholder]:text-text-muted',
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="text-text-muted" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

/** Sin animación de entrada: el menú aparece, no se despliega. */
export function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        className={cn(
          'relative z-50 max-h-96 min-w-32 overflow-hidden',
          'rounded-panel border-border bg-surface-raised shadow-standard border',
          'text-text-primary font-sans',
          position === 'popper' && 'w-full min-w-[var(--radix-select-trigger-width)]',
          className,
        )}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="text-text-secondary flex h-6 items-center justify-center">
          <ChevronUp />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="text-text-secondary flex h-6 items-center justify-center">
          <ChevronDown />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectLabel({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn('px-sm text-eyebrow font-mono text-text-secondary py-1.5 uppercase', className)}
      {...props}
    />
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        'rounded-chip px-sm relative flex h-9 w-full cursor-default items-center pr-8 select-none',
        'text-ui text-text-secondary transition-standard',
        'data-[highlighted]:bg-surface data-[highlighted]:text-text-primary',
        'data-[state=checked]:text-text-primary',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="text-accent absolute right-2 flex items-center">
        <Check />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export function SelectSeparator({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator className={cn('bg-hairline my-1 h-px', className)} {...props} />
  );
}
