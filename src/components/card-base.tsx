import { Slot } from '@radix-ui/react-slot';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../lib/cn.ts';
import { HOVER_TARJETA, SUPERFICIE_TARJETA } from '../primitives/card.tsx';

/**
 * El casco compartido de las tarjetas. No se publica: existe para que la regla 6
 * viva en un solo sitio.
 *
 * «Los estados se comunican con borde y color, no con movimiento. El hover de
 * una tarjeta cambia el borde de hairline a hairlineHover y nada más.» Ni
 * escala, ni elevación, ni desplazamiento del título.
 */
export const TARJETA = [
  'group block cursor-pointer',
  SUPERFICIE_TARJETA,
  HOVER_TARJETA,
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
];

export type TarjetaProps = ComponentPropsWithoutRef<'a'> & {
  /**
   * Renderiza el hijo en vez de un `<a>`. Es como se enchufa el `Link` de Next
   * o de Astro sin que la librería dependa de ningún enrutador.
   */
  asChild?: boolean | undefined;
  children: ReactNode;
};

export function Tarjeta({ asChild = false, className, children, ...props }: TarjetaProps) {
  const Raiz = asChild ? Slot : 'a';
  return (
    <Raiz className={cn(TARJETA, className)} {...props}>
      {children}
    </Raiz>
  );
}
