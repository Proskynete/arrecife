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
 *
 * La firma va arriba a la derecha, al nivel de la PRIMERA fila que exista, no
 * al final del bloque. Es una decisión de composición y no de estilo: el pie
 * puede llevar marca, enlaces y redes, y colgar la firma de una fila concreta
 * la hunde en cuanto esa fila deja de ser la primera.
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
  /**
   * La fila de marca: la aleta y el wordmark, arriba del todo.
   *
   * Existe porque sin ella acababa metida en `children` con un `w-full` para
   * que se llevara su propia línea. Funcionaba y era un apaño: la marca no es
   * un enlace de texto más, y una ranura propia lo dice en el tipo.
   */
  brand?: ReactNode;
};

export function Footer({
  social,
  year = new Date().getFullYear(),
  children,
  brand,
  className,
  ...props
}: FooterProps) {
  const firma = (
    <Text variant="meta" tone="muted" as="p" className="ml-auto shrink-0">
      <span aria-hidden="true" className="text-accent">
        ${' '}
      </span>
      cd ~/{naming.domain}/{year}
    </Text>
  );

  /*
    Las filas del pie, en orden y sin las vacías. Se arman antes de pintar
    porque la firma va SIEMPRE en la primera que exista, y cuál es la primera
    depende de qué le pasen: con marca es la marca, sin marca son los enlaces, y
    con solo redes son los iconos.

    Es la diferencia entre «la firma va a la derecha» y «la firma va a la
    derecha del todo». Pegarla a la fila de redes —como estaba— la dejaba en la
    tercera línea en cuanto el pie tenía marca y enlaces encima, que es
    exactamente donde no va.
  */
  const filas = [
    brand ? (
      <div key="marca" className="flex items-center">
        {brand}
      </div>
    ) : null,

    children ? (
      <div key="enlaces" className="gap-step-md flex flex-wrap items-center">
        {children}
      </div>
    ) : null,

    social && social.length > 0 ? (
      // 18px de separación, del documento. No es un escalón de `spacing`:
      // es el ritmo de una fila de iconos, no el de una página.
      <ul key="redes" className="flex items-center gap-[18px]">
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
    ) : null,
  ].filter(Boolean);

  const [primera, ...resto] = filas;

  return (
    <footer className={cn('border-hairline w-full border-t', className)} {...props}>
      <div className="max-w-wide px-step-md py-step-xl gap-step-lg mx-auto flex flex-col">
        {/*
          `items-center` y no `items-start`: la firma es una línea de 13px y la
          marca mide 28, así que alinear por arriba la deja flotando alta. En
          pantalla estrecha `flex-wrap` la baja a su propia línea — ahí no hay
          ancho para las dos y apretarlas rompería la ruta, que es mono y no se
          puede truncar sin dejar de leerse.
        */}
        <div className="gap-step-md flex flex-wrap items-center">
          {primera ?? null}
          {firma}
        </div>

        {resto}
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
