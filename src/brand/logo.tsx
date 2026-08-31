import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { naming, tagline as lemas } from '../tokens/tokens.ts';
import { Isotipo } from './isotipo.tsx';
import { RUTA_ASSETS, type Fondo } from './catalogo.ts';

export type LogoProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  sobre?: Fondo | undefined;
  basePath?: string | undefined;
  /** Oculta el wordmark y deja solo la aleta, para barras muy estrechas. */
  soloIsotipo?: boolean | undefined;
  /**
   * Añade el lema bajo el wordmark, separado de la aleta por una divisoria.
   *
   * Es la forma que toma la marca en la barra del sitio. El texto sale de
   * `tagline.corto` y no se puede pasar por prop, por lo mismo que el wordmark:
   * un lema escrito a mano en cinco proyectos son cinco lemas en seis meses.
   */
  conLema?: boolean | undefined;
};

/**
 * El wordmark sale de `naming.wordmark`, no de una cadena escrita a mano, y
 * siempre dice «Eduardo Álvarez». La mascota se llama Tiburoncín y no aparece
 * escrita dentro del logo: no hay ninguna prop que permita cambiar el texto.
 *
 * Cuando se oculta el wordmark, el nombre sigue llegando al lector de pantalla
 * por el `alt` del isotipo. Un logo sin nombre accesible es un logo invisible.
 */
export function Logo({
  sobre = 'oscuro',
  basePath = RUTA_ASSETS,
  soloIsotipo = false,
  conLema = false,
  className,
  ...props
}: LogoProps) {
  const conAleta = (
    <Isotipo
      sobre={sobre}
      basePath={basePath}
      alt={soloIsotipo ? naming.wordmark : ''}
      className={conLema ? 'h-9 w-auto' : 'h-7 w-auto'}
    />
  );

  const wordmark = (
    <span className="text-ui font-display text-text-primary font-bold tracking-[-0.02em]">
      {naming.wordmark}
    </span>
  );

  if (soloIsotipo) {
    return (
      <span className={cn('gap-step-xs inline-flex items-center', className)} {...props}>
        {conAleta}
      </span>
    );
  }

  if (conLema) {
    return (
      <span className={cn('gap-step-sm inline-flex items-center', className)} {...props}>
        {conAleta}
        {/*
          La divisoria es `hairline` y no `border`: separa dos partes de la misma
          marca, no dos controles. Va `aria-hidden` — es una raya, no contenido.
        */}
        <span aria-hidden="true" className="bg-hairline h-8 w-px shrink-0" />
        <span className="flex min-w-0 flex-col">
          {wordmark}
          <span className="text-eyebrow font-mono text-text-muted uppercase">
            {lemas.corto}
          </span>
        </span>
      </span>
    );
  }

  return (
    <span className={cn('gap-step-xs inline-flex items-center', className)} {...props}>
      {conAleta}
      {wordmark}
    </span>
  );
}
