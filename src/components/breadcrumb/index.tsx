import { Slot } from '@radix-ui/react-slot';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';

/**
 * La ruta como una ruta: `~ / artículos / cómo-escalar-un-equipo`.
 *
 * El `~` no es decoración ni un icono de casa: es el home del sistema de
 * archivos, y por eso el breadcrumb es mono y no sans. Los separadores van en
 * `border` (#22414F), que es el token más tenue que sigue leyéndose como línea.
 *
 * El último tramo es la página actual, así que no es un enlace y lleva
 * `aria-current="page"`. Es la diferencia entre una miga de pan accesible y
 * cuatro enlaces seguidos, uno de los cuales no va a ninguna parte.
 */
export type Migaja = {
  label: ReactNode;
  /** Sin `href`, el tramo es texto. El último nunca debería llevarlo. */
  href?: string | undefined;
};

export type BreadcrumbProps = Omit<ComponentPropsWithoutRef<'nav'>, 'children'> & {
  items: readonly Migaja[];
  /** Destino del `~`. Por defecto, la raíz del sitio. */
  homeHref?: string;
  /** Etiqueta accesible del `~`, que si no se lee como una tilde suelta. */
  homeLabel?: string;
  /**
   * Renderiza los enlaces con el hijo, para enchufar el `Link` de Next o Astro.
   * Recibe cada `href` en el `props` del Slot.
   */
  linkAsChild?: ((props: { href: string; children: ReactNode }) => ReactNode) | undefined;
};

const ENLACE =
  'transition-standard hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded-chip cursor-pointer';

export function Breadcrumb({
  items,
  homeHref = '/',
  homeLabel = 'Inicio',
  linkAsChild,
  className,
  ...props
}: BreadcrumbProps) {
  const enlace = (href: string, contenido: ReactNode) =>
    linkAsChild ? (
      <Slot className={ENLACE}>{linkAsChild({ href, children: contenido })}</Slot>
    ) : (
      <a href={href} className={ENLACE}>
        {contenido}
      </a>
    );

  return (
    <nav aria-label="Ruta" className={cn('font-mono text-meta text-text-muted', className)} {...props}>
      <ol className="gap-xs flex flex-wrap items-center">
        <li>{enlace(homeHref, <span aria-label={homeLabel}>~</span>)}</li>

        {items.map((item, i) => {
          const ultimo = i === items.length - 1;
          return (
            <li key={i} className="gap-xs flex items-center">
              <span aria-hidden="true" className="text-border">
                /
              </span>
              {item.href && !ultimo ? (
                enlace(item.href, item.label)
              ) : (
                <span aria-current={ultimo ? 'page' : undefined} className="text-text-secondary">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
