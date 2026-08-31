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
 * borde inferior derecho. Eso es la variante `cabecera`, que es el defecto.
 *
 * En móvil no hay borde por el que sangrar, así que la pose baja al flujo, bajo
 * los botones. No es un `hidden` en pantalla pequeña: la pose es el 40 % de la
 * personalidad del hero.
 *
 * La otra variante es `centrado`, y existe porque la regla de arriba tiene un
 * caso donde no aplica. «Nunca centrada» se escribió contra el hero de una
 * página con más contenido debajo: ahí una mascota centrada bajo el titular es
 * una ilustración de portada, no una cabecera. Pero una página de enlaces es
 * centrada de extremo a extremo y la mascota es el protagonista, no el remate.
 * Ese proyecto se saltaba `Hero` entero por esto, que es peor: una regla
 * declarada y con nombre se discute; una copia del degradado en otro repo se
 * desincroniza. La pose va ARRIBA del titular, no debajo, para que siga sin
 * leerse como la ilustración que cierra un bloque de texto.
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
  /**
   * `cabecera` sangra la pose por la esquina; `centrado` la pone arriba y
   * centra el texto, para una página que es solo esto.
   */
  variant?: 'cabecera' | 'centrado';
};

export function Hero({
  title,
  eyebrow,
  description,
  action,
  pose,
  basePath,
  variant = 'cabecera',
  className,
  ...props
}: HeroProps) {
  const centrado = variant === 'centrado';

  return (
    <section
      className={cn(
        'degradado-hero rounded-panel border-hairline relative overflow-hidden border',
        // 44 arriba, 40 a los lados y abajo. Del documento.
        'px-step-xl pt-[44px] pb-step-xl',
        className,
      )}
      {...props}
    >
      {centrado && pose ? (
        <Mascota
          pose={pose}
          basePath={basePath}
          className="mb-step-md mx-auto w-48 md:w-56"
        />
      ) : null}

      <div
        className={cn(
          'gap-step-md flex flex-col',
          centrado ? 'items-center text-center' : 'md:max-w-[62%]',
        )}
      >
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

        {action ? (
          <div
            className={cn(
              'gap-step-sm mt-step-xs flex flex-wrap items-center',
              centrado && 'justify-center',
            )}
          >
            {action}
          </div>
        ) : null}
      </div>

      {!centrado && pose ? (
        <Mascota
          pose={pose}
          basePath={basePath}
          className={cn(
            // En móvil, en el flujo y bajo los botones. Desde md, sangrando por
            // la esquina inferior derecha.
            'mt-step-lg mx-auto w-40',
            'md:mt-0 md:absolute md:right-0 md:-bottom-4 md:mx-0 md:w-64',
          )}
        />
      ) : null}
    </section>
  );
}
