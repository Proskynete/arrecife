import { Slot } from '@radix-ui/react-slot';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { Text } from '../../primitives/typography.tsx';

/**
 * La barra lateral del admin del blog.
 *
 * El `▸` lo pone el componente, igual que el `./` de `NavItem` y el `~` del
 * breadcrumb: es la misma estética CLI y la misma decisión — el formato es parte
 * de la pieza, no una convención que haya que recordar. Va `aria-hidden`.
 *
 * El pie lleva la versión y la rama (`v5.0.1 · main`) en la escala `meta`. No es
 * decoración: en un admin es lo primero que se pregunta cuando algo se ve raro.
 */
export type SidebarItemProps = ComponentPropsWithoutRef<'a'> & {
  active?: boolean | undefined;
  asChild?: boolean | undefined;
  /** Contador a la derecha: borradores pendientes, media sin usar. */
  badge?: ReactNode;
};

export function SidebarItem({
  active = false,
  asChild = false,
  badge,
  className,
  children,
  ...props
}: SidebarItemProps) {
  const Raiz = asChild ? Slot : 'a';

  return (
    <li>
      <Raiz
        aria-current={active ? 'page' : undefined}
        className={cn(
          'rounded-chip px-step-sm gap-step-xs flex cursor-pointer items-center py-1.5',
          'font-mono text-meta transition-standard',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          // El activo es fondo `surfaceRaised` y tinta primaria, igual que
          // `TabsTrigger`. NO bioluz: `tokens.ts` lo dice explícito — acento
          // claro pasa sobre background y sobre surface, pero sobre
          // surfaceRaised mide 4.2 y no es color de texto ahí. El acento se
          // queda en el `▸`, que es decorativo y le aplica el umbral de 3:1.
          active
            ? 'bg-surface-raised text-text-primary'
            : 'text-text-secondary hover:text-text-primary hover:bg-surface-raised',
          className,
        )}
        {...props}
      >
        <span aria-hidden="true" className={active ? 'text-accent' : 'text-text-muted'}>
          ▸
        </span>
        <span className="min-w-0 flex-1 truncate">{children}</span>
        {badge ? <span className="text-text-muted shrink-0">{badge}</span> : null}
      </Raiz>
    </li>
  );
}

export type SidebarNavProps = ComponentPropsWithoutRef<'nav'> & {
  /** Encabezado del panel. */
  title?: ReactNode;
  /** Versión y rama, al pie. */
  version?: ReactNode;
  branch?: ReactNode;
};

export function SidebarNav({
  title,
  version,
  branch,
  children,
  className,
  ...props
}: SidebarNavProps) {
  const pie = [version, branch].filter(Boolean);

  return (
    <nav
      aria-label={typeof title === 'string' ? title : 'Administración'}
      className={cn(
        'border-hairline bg-surface p-step-sm gap-step-sm flex h-full flex-col border-r',
        className,
      )}
      {...props}
    >
      {title ? (
        <Text variant="eyebrow" tone="muted" as="p" className="px-step-sm">
          {title}
        </Text>
      ) : null}

      <ul className="gap-0.5 flex flex-1 flex-col">{children}</ul>

      {pie.length > 0 ? (
        <Text variant="meta" tone="muted" as="p" className="border-hairline px-step-sm pt-step-sm border-t">
          {pie.map((p, i) => (
            <span key={i}>
              {i > 0 ? <span aria-hidden="true"> · </span> : null}
              {p}
            </span>
          ))}
        </Text>
      ) : null}
    </nav>
  );
}
