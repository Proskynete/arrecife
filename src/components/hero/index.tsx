import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { Mascota } from '../../brand/mascota.tsx';
import type { Pose } from '../../brand/catalogo.ts';
import { cn } from '../../lib/cn.ts';
import { Text } from '../../primitives/typography.tsx';

/**
 * UNO por sitio. Es la única pieza del sistema que se gasta como el botón de
 * conversión, y por la misma razón: si hay dos, no hay ninguno.
 *
 * Degradado, radio de panel, texto al 62 % del ancho y la pose sangrando por el
 * borde inferior derecho. NUNCA centrada: una mascota centrada bajo un titular
 * es una ilustración de portada, y esto es una cabecera.
 *
 * En móvil no hay borde por el que sangrar, así que la pose baja al flujo, bajo
 * los botones. No es un `hidden` en pantalla pequeña: la pose es el 40 % de la
 * personalidad del hero.
 *
 * El degradado viene de `--gradient-hero`, así que sigue el modo. No hay ángulo
 * escrito a mano en ningún proyecto.
 */
export type HeroProps = Omit<ComponentPropsWithoutRef<'section'>, 'title'> & {
  title: ReactNode;
  /** Mono, versalitas, en acento. */
  eyebrow?: ReactNode;
  description?: ReactNode;
  /** Los botones. Aquí va el único `conversion` de la pantalla. */
  action?: ReactNode;
  /** La pose de Tiburoncín. Sin ella el hero es un panel con texto. */
  pose?: Pose | undefined;
  basePath?: string | undefined;
};

export function Hero({
  title,
  eyebrow,
  description,
  action,
  pose,
  basePath,
  className,
  ...props
}: HeroProps) {
  return (
    <section
      className={cn(
        'degradado-hero rounded-panel border-hairline relative overflow-hidden border',
        // 44 arriba, 40 a los lados y abajo. Del documento.
        'px-xl pt-[44px] pb-xl',
        className,
      )}
      {...props}
    >
      <div className="gap-md flex flex-col md:max-w-[62%]">
        {eyebrow ? (
          <Text variant="eyebrow" tone="accent" as="p">
            {eyebrow}
          </Text>
        ) : null}

        <Text as="h1" variant="display">
          {title}
        </Text>

        {description ? (
          <Text variant="body" tone="secondary">
            {description}
          </Text>
        ) : null}

        {action ? <div className="gap-sm mt-xs flex flex-wrap items-center">{action}</div> : null}
      </div>

      {pose ? (
        <Mascota
          pose={pose}
          basePath={basePath}
          className={cn(
            // En móvil, en el flujo y bajo los botones. Desde md, sangrando por
            // la esquina inferior derecha.
            'mt-lg mx-auto w-40',
            'md:mt-0 md:absolute md:right-0 md:-bottom-4 md:mx-0 md:w-64',
          )}
        />
      ) : null}
    </section>
  );
}
