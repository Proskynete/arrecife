import { Slot } from '@radix-ui/react-slot';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';

/**
 * La barra del sitio: 64px, abismo al 86 % y desenfoque de 14px detrás.
 *
 * Es composición de página y no un primitivo, pero vive en la librería por una
 * razón concreta: la estética CLI de los items —mono, formato `./sección`— es lo
 * primero que se desincroniza cuando cinco proyectos la reescriben cada uno por
 * su cuenta.
 *
 * Renderiza `<header>` colgando directamente del `body`, así que ES el landmark
 * `banner` del sitio. Por eso `PageHeader` va dentro de `<main>` y no es
 * landmark: dos banners en una página son un fallo de accesibilidad.
 */
export type NavProps = ComponentPropsWithoutRef<'header'> & {
  /** El logo, a la izquierda. */
  brand?: ReactNode;
  /** Los items de sección, en el centro. */
  children?: ReactNode;
  /** Acciones a la derecha: conversión, cambio de tema, buscar. */
  actions?: ReactNode;
};

export function Nav({ brand, children, actions, className, ...props }: NavProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full',
        // abismo al 86 % con 14px de desenfoque detrás. El alfa va sobre el
        // token, así que sigue el modo: en claro es papel al 86 %.
        'bg-background/86 backdrop-blur-[14px]',
        'border-hairline border-b',
        className,
      )}
      {...props}
    >
      <div className="max-w-wide px-step-md h-nav gap-step-lg mx-auto flex items-center">
        {brand ? <div className="shrink-0">{brand}</div> : null}

        {children ? (
          <nav aria-label="Principal" className="min-w-0 flex-1">
            <ul className="gap-step-md flex items-center">{children}</ul>
          </nav>
        ) : (
          <div className="flex-1" />
        )}

        {actions ? <div className="gap-step-sm flex shrink-0 items-center">{actions}</div> : null}
      </div>
    </header>
  );
}

export type NavItemProps = ComponentPropsWithoutRef<'a'> & {
  /** Sección actual: bioluz con subrayado de 1px. */
  active?: boolean | undefined;
  /** Renderiza el hijo en vez de un `<a>`, para el `Link` del enrutador. */
  asChild?: boolean | undefined;
};

/**
 * El `./` lo pone el componente, no quien lo usa.
 *
 * Es la misma decisión que el botón terciario: el formato es parte de la pieza,
 * no una convención que haya que recordar en cinco proyectos. Va `aria-hidden`,
 * así que un lector de pantalla anuncia «artículos» y no «punto barra
 * artículos».
 */
export function NavItem({ active = false, asChild = false, className, children, ...props }: NavItemProps) {
  const Raiz = asChild ? Slot : 'a';

  return (
    <li>
      <Raiz
        aria-current={active ? 'page' : undefined}
        className={cn(
          'font-mono text-meta transition-standard cursor-pointer',
          'rounded-chip focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          active
            ? 'text-accent underline decoration-1 underline-offset-4'
            : 'text-text-secondary hover:text-accent',
          className,
        )}
        {...props}
      >
        <span aria-hidden="true" className="text-text-muted">
          ./
        </span>
        {children}
      </Raiz>
    </li>
  );
}
