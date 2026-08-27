import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

/**
 * Código en línea, dentro de prosa.
 *
 * Existe porque no existía: cada consumidor escribía `<code className="font-mono">`
 * a mano, y la story de marca lo hacía cuatro veces en un solo párrafo. Un
 * `<code>` suelto hereda el tamaño del párrafo, así que dentro de `body` (18px)
 * se veía un mono de 18px que el documento no tiene en ninguna parte.
 *
 * No es `CodeBlock`. El bloque es una isla de tema oscuro sobre casco con barra
 * y botón de copiar; esto es una palabra dentro de una frase, y por eso se queda
 * en la superficie de la página en vez de invertir el tema.
 */
export type CodeProps = ComponentPropsWithoutRef<'code'>;

export function Code({ className, ...props }: CodeProps) {
  return (
    <code
      className={cn(
        'rounded-chip border-hairline bg-surface-raised border',
        'font-mono text-meta text-text-primary',
        'px-1 py-0.5',
        className,
      )}
      {...props}
    />
  );
}
