import * as SeparatorPrimitive from '@radix-ui/react-separator';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

export type SeparatorProps = ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>;

/**
 * `hairline`, no `border`: una división entre contenidos es sutil por
 * definición. Para delimitar un control existe `border`, que es otro token.
 */
export function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      orientation={orientation}
      decorative={decorative}
      className={cn(
        'bg-hairline shrink-0',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...props}
    />
  );
}
