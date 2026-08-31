import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type RefObject } from 'react';

import { cn } from '../../lib/cn.ts';

/**
 * Cuánto llevas leído. NO es `Progress` con otro nombre.
 *
 * `Progress` mide una tarea: hay un total conocido, alguien la empezó y va a
 * terminar. Esto mide una POSICIÓN en un documento, que se puede recorrer en
 * los dos sentidos y de la que no hay nada que completar. Por eso no lleva
 * `role="progressbar"` ni valor accesible: va `aria-hidden`.
 *
 * Eso último es deliberado y es la decisión que hay que defender. Un lector de
 * pantalla ya sabe dónde está en el documento y anunciarle «37 %» cada vez que
 * se mueve es ruido, no información. La barra es orientación visual, y lo que
 * es solo visual se declara como tal.
 *
 * El ancho se escribe directamente, sin transición: `transition-standard` solo
 * cubre color y borde, así que la barra sigue al scroll en vez de perseguirlo.
 *
 * La medición va dentro de `requestAnimationFrame`. Leer `scrollTop` en el
 * manejador de scroll fuerza un reflujo síncrono en cada evento, y en un
 * artículo largo eso se nota en el propio scroll — el efecto contrario al que
 * busca la pieza.
 */
export type ScrollingProgressBarProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /**
   * El elemento que se mide. Sin él, el documento entero.
   *
   * Se pasa cuando la barra debe seguir SOLO al artículo: si la página tiene
   * una cabecera alta y un pie con enlaces, medir el documento marca el 100 %
   * cuando todavía quedan dos párrafos.
   */
  target?: RefObject<HTMLElement | null> | undefined;
  /** Arena en vez de bioluz, para igualar el progreso de curso. */
  tone?: 'accent' | 'warm';
  /** Pega la barra al borde superior de la ventana. */
  sticky?: boolean;
};

export function ScrollingProgressBar({
  target,
  tone = 'accent',
  sticky = true,
  className,
  ...props
}: ScrollingProgressBarProps) {
  const [avance, setAvance] = useState(0);
  const pendiente = useRef(0);

  useEffect(() => {
    const medir = () => {
      pendiente.current = 0;

      const elemento = target?.current;
      // `getBoundingClientRect` y no `offsetTop`: aquel es relativo al
      // `offsetParent`, y basta un ancestro posicionado —lo tiene cualquier
      // maquetación con un `relative` por encima— para que el inicio no sea el
      // del documento y la barra empiece llena.
      const inicio = elemento ? elemento.getBoundingClientRect().top + scrollY : 0;
      const alto = elemento ? elemento.offsetHeight : document.documentElement.scrollHeight;

      // Lo recorrible es el contenido menos lo que ya cabe en pantalla. Sin
      // restar la ventana, el 100 % solo llegaría cuando la última línea toca
      // el borde superior, y para entonces hace rato que se leyó.
      const recorrible = alto - innerHeight;
      if (recorrible <= 0) {
        // Cabe entero: no hay nada que recorrer. Lleno si ya se pasó de largo.
        setAvance(scrollY >= inicio ? 100 : 0);
        return;
      }

      const recorrido = scrollY - inicio;
      setAvance(Math.min(100, Math.max(0, (recorrido / recorrible) * 100)));
    };

    const alMoverse = () => {
      if (pendiente.current) return;
      pendiente.current = requestAnimationFrame(medir);
    };

    medir();
    addEventListener('scroll', alMoverse, { passive: true });
    addEventListener('resize', alMoverse);

    return () => {
      if (pendiente.current) cancelAnimationFrame(pendiente.current);
      removeEventListener('scroll', alMoverse);
      removeEventListener('resize', alMoverse);
    };
  }, [target]);

  return (
    <div
      aria-hidden="true"
      className={cn(
        'h-1 w-full overflow-hidden',
        sticky && 'sticky top-0 z-40',
        className,
      )}
      {...props}
    >
      <div
        className={cn('h-full', tone === 'warm' ? 'bg-warm' : 'bg-accent')}
        style={{ width: `${avance}%` }}
      />
    </div>
  );
}
