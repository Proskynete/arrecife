import * as LabelPrimitive from '@radix-ui/react-label';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

export type LabelProps = ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;

/**
 * La escala `label`: 13px, que es el mínimo absoluto en pantalla del sistema.
 *
 * Se atenúa junto al control cuando este está deshabilitado, para que la
 * pareja etiqueta-control se lea siempre como una sola unidad.
 */
export function Label({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      className={cn(
        'text-label font-sans text-text-secondary select-none',
        'peer-disabled:opacity-50 group-data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    />
  );
}
