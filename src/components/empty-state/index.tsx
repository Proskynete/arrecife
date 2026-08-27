import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { CaraDeMascota } from '../../brand/mascota.tsx';
import type { Cara } from '../../brand/catalogo.ts';
import { cn } from '../../lib/cn.ts';
import { SUPERFICIE_TARJETA } from '../../primitives/card.tsx';
import { Text } from '../../primitives/typography.tsx';

/**
 * La regla más importante de la mascota, por fin como código.
 *
 * `catalogo.ts` y `page-header/index.tsx` la citaban los dos —«por eso
 * `EmptyState` recibe una cara y `PageHeader` no»— y el componente no existía,
 * así que la regla vivía en un comentario sobre un componente fantasma. Desde
 * que la story de marca repite la frase, además, era una promesa publicada.
 *
 * `expresion` es OBLIGATORIA y no opcional: un estado vacío sin cara es la mitad
 * del componente. Es el único sitio, junto con el 404, el error de servidor, el
 * progreso de curso, la celebración, el toast y el «sin spam» del newsletter,
 * donde una cara puede aparecer.
 */
export type EmptyStateProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  /** La cara. Obligatoria: sin ella esto es un párrafo centrado. */
  expresion: Cara;
  title: ReactNode;
  /** Una línea explicando qué falta o qué hacer. */
  description?: ReactNode;
  /** La acción que saca del estado vacío. Normalmente un botón terciario. */
  action?: ReactNode;
  /** Dónde se sirven los PNG de la marca. */
  basePath?: string | undefined;
};

/** 66px, del documento. Es tamaño de ilustración, no ritmo de página. */
const CARA = 'w-[66px] max-w-none';

export function EmptyState({
  expresion,
  title,
  description,
  action,
  basePath,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(SUPERFICIE_TARJETA, 'p-lg gap-sm flex flex-col items-center text-center', className)}
      {...props}
    >
      <CaraDeMascota expresion={expresion} className={CARA} basePath={basePath} />

      <Text variant="ui" as="p" className="font-medium">
        {title}
      </Text>

      {description ? (
        <Text variant="label" tone="muted" as="p" className="max-w-measure font-normal">
          {description}
        </Text>
      ) : null}

      {action ? <div className="mt-xs">{action}</div> : null}
    </div>
  );
}
