import type { ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { ArrowUpRight } from '../../lib/glyphs.tsx';
import { Text } from '../../primitives/typography.tsx';
import { Tarjeta, type TarjetaProps } from '../card-base.tsx';

export type LinkRowProps = Omit<TarjetaProps, 'children'> & {
  name: ReactNode;
  description?: ReactNode;
  /** Glifo SVG del destino. Nunca un emoji. */
  icon?: ReactNode;
  /** Marca el enlace como externo: añade la flecha y el `rel` seguro. */
  external?: boolean | undefined;
};

/**
 * Migrado desde `links/src/components/Card.astro`. El original escalaba la
 * tarjeta al 102 %, subía el título un píxel y giraba y agrandaba el icono en
 * hover — cuatro movimientos que el sistema no permite. Aquí el hover cambia el
 * borde y el color del icono, y nada más.
 */
export function LinkRow({
  name,
  description,
  icon,
  external = false,
  className,
  ...props
}: LinkRowProps) {
  const rel = external ? 'noopener noreferrer' : props.rel;
  const target = external ? '_blank' : props.target;

  return (
    <Tarjeta
      className={cn('px-step-md py-step-sm', className)}
      {...props}
      rel={rel}
      {...(target ? { target } : {})}
    >
      <span className="gap-step-sm flex items-center">
        {icon ? (
          <span className="text-text-muted group-hover:text-accent transition-standard shrink-0 text-2xl">
            {icon}
          </span>
        ) : null}

        <span className="min-w-0 flex-1">
          <Text as="span" variant="ui" className="group-hover:text-accent transition-standard block font-medium">
            {name}
          </Text>
          {description ? (
            <Text as="span" variant="label" tone="muted" className="block truncate">
              {description}
            </Text>
          ) : null}
        </span>

        {external ? (
          <ArrowUpRight
            className="text-text-muted group-hover:text-accent transition-standard shrink-0"
            aria-hidden="true"
          />
        ) : null}
      </span>
    </Tarjeta>
  );
}
