import { Slot } from '@radix-ui/react-slot';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { Text } from '../../primitives/typography.tsx';
import { naming } from '../../tokens/tokens.ts';

/**
 * El pie, y la firma CLI del sitio: `$ cd ~/eduardoalvarez.dev/2026`.
 *
 * El dominio sale de `naming.domain` y no de una cadena escrita a mano, por la
 * misma razón que el wordmark: si cambia, cambia en los cinco proyectos a la
 * vez.
 *
 * Los enlaces de redes son iconos SIN texto visible, así que `aria-label` no es
 * una mejora: es lo único que los hace legibles. Por eso es obligatorio en el
 * tipo y no una prop opcional que se olvide.
 */
export type Red = {
  /** Lo que reemplaza al texto visible. Obligatorio. */
  label: string;
  href: string;
  /**
   * El glifo, a 19px. Las marcas van en SÓLIDO (`fill`) y los iconos
   * funcionales en trazo de 1.6. Nunca un emoji.
   */
  icon: ReactNode;
};

export type FooterProps = ComponentPropsWithoutRef<'footer'> & {
  social?: readonly Red[];
  /** Año de la firma. */
  year?: number;
  /** Enlaces de texto: aviso legal, RSS, mapa del sitio. */
  children?: ReactNode;
};

export function Footer({
  social,
  year = new Date().getFullYear(),
  children,
  className,
  ...props
}: FooterProps) {
  return (
    <footer className={cn('border-hairline w-full border-t', className)} {...props}>
      <div className="max-w-wide px-step-md py-step-xl gap-step-lg mx-auto flex flex-col">
        {children ? <div className="gap-step-md flex flex-wrap items-center">{children}</div> : null}

        {social && social.length > 0 ? (
          // 18px de separación, del documento. No es un escalón de `spacing`:
          // es el ritmo de una fila de iconos, no el de una página.
          <ul className="flex items-center gap-[18px]">
            {social.map((red) => (
              <li key={red.href}>
                <a
                  href={red.href}
                  aria-label={red.label}
                  className={cn(
                    'text-text-muted hover:text-accent transition-standard block cursor-pointer text-[19px]',
                    'rounded-chip focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                  )}
                >
                  {red.icon}
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        <Text variant="meta" tone="muted" as="p">
          <span aria-hidden="true" className="text-accent">
            ${' '}
          </span>
          cd ~/{naming.domain}/{year}
        </Text>
      </div>
    </footer>
  );
}

export type FooterLinkProps = ComponentPropsWithoutRef<'a'> & {
  asChild?: boolean | undefined;
};

export function FooterLink({ asChild = false, className, ...props }: FooterLinkProps) {
  const Raiz = asChild ? Slot : 'a';
  return (
    <Raiz
      className={cn(
        'font-mono text-meta text-text-secondary hover:text-accent transition-standard cursor-pointer',
        'rounded-chip focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        className,
      )}
      {...props}
    />
  );
}
