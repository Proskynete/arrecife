import { Slot } from '@radix-ui/react-slot';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { Text } from '../../primitives/typography.tsx';

/**
 * «En esta página». El índice del artículo largo.
 *
 * Es un `<nav>` con nombre accesible propio, no una lista suelta: en una página
 * que ya tiene la barra del sitio y las migas, un tercer grupo de enlaces sin
 * nombre es indistinguible de los otros dos para quien navega por landmarks.
 *
 * El activo se marca con `aria-current`, no solo con color — la sección en la
 * que estás no puede comunicarse únicamente con bioluz.
 */
export type Entrada = {
  /** El ancla, con `#`. */
  href: string;
  label: ReactNode;
  /** Sangra la entrada. Solo dos niveles: h2 y h3. */
  nested?: boolean | undefined;
};

export type TableOfContentsProps = Omit<ComponentPropsWithoutRef<'nav'>, 'children'> & {
  items: readonly Entrada[];
  /** El título del bloque. */
  title?: ReactNode;
  /** Ancla de la sección visible. */
  activeHref?: string | undefined;
  linkAsChild?: ((props: { href: string; children: ReactNode }) => ReactNode) | undefined;
};

export function TableOfContents({
  items,
  title = 'En esta página',
  activeHref,
  linkAsChild,
  className,
  ...props
}: TableOfContentsProps) {
  return (
    <nav aria-label={typeof title === 'string' ? title : 'En esta página'} className={cn('gap-sm flex flex-col', className)} {...props}>
      <Text variant="eyebrow" tone="muted" as="p">
        {title}
      </Text>

      <ul className="border-hairline gap-xs flex flex-col border-l">
        {items.map((item) => {
          const activo = item.href === activeHref;
          const clases = cn(
            'px-sm -ml-px block border-l',
            'font-sans text-label transition-standard',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
            'cursor-pointer',
            item.nested && 'pl-lg',
            activo
              ? 'border-accent text-accent'
              : 'border-transparent text-text-secondary hover:text-text-primary',
          );

          return (
            <li key={item.href}>
              {linkAsChild ? (
                <Slot className={clases} aria-current={activo ? 'location' : undefined}>
                  {linkAsChild({ href: item.href, children: item.label })}
                </Slot>
              ) : (
                <a href={item.href} className={clases} aria-current={activo ? 'location' : undefined}>
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
