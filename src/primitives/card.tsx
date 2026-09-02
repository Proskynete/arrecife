import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { Text } from './typography.tsx';

import { CARD_SURFACE } from '../variants/card.ts';


export function Card({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn(CARD_SURFACE, className)} {...props} />;
}

export function CardHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('gap-step-xs p-step-lg flex flex-col', className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentPropsWithoutRef<'h3'>) {
  return <Text as="h3" variant="h3" className={className} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <Text variant="ui" tone="secondary" className={className} {...props} />;
}

export function CardContent({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('px-step-lg pb-step-lg', className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('border-hairline px-step-lg py-step-md gap-step-sm flex items-center border-t', className)}
      {...props}
    />
  );
}
