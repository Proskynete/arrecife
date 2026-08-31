import { useSyncExternalStore, type ComponentPropsWithoutRef } from 'react';

import { cn } from '../../lib/cn.ts';
import { Luna, Sol } from '../../lib/glyphs.tsx';
import { Button, type ButtonProps } from '../../primitives/button.tsx';
import { alternarTema, escucharTema, temaActual, type Tema } from '../../tema/index.ts';

/**
 * El control que faltaba. La librería definía todo el sistema de temas y no
 * exponía lo que lo cambia, así que dos proyectos lo reimplementaban.
 *
 * Lo difícil no es el botón: es que la primera pintura no parpadee y que la
 * elección sobreviva a la navegación. Eso vive en `@eduardoalvarez/arrecife/tema`,
 * que no importa React —lo consume un Astro que no monta ninguno— y de ahí sale
 * `scriptTema`, que va inline en el `<head>`. Sin ese script, este botón
 * funciona y aun así se ve el fogonazo en cada carga.
 *
 * Los DOS iconos se renderizan siempre y el que sobra lo esconde el CSS con la
 * variante `light:`. No es una optimización: es lo que evita que el servidor y
 * el cliente discrepen. El servidor no sabe qué tema eligió quien va a leer, así
 * que cualquier icono que elija en el HTML tiene la mitad de probabilidades de
 * ser el equivocado, y corregirlo al hidratar es el parpadeo otra vez.
 *
 * El nombre accesible NO dice a qué modo se va. Sería más informativo y sería
 * una mentira la mitad del tiempo por lo mismo de arriba: el HTML del servidor
 * lo fija antes de saber el tema. «Cambiar de tema» es cierto siempre.
 */
export type ThemeToggleProps = Omit<ComponentPropsWithoutRef<'button'>, 'onClick'> & {
  /** Nombre accesible. El botón no tiene texto visible, así que es lo único que lo nombra. */
  label?: string;
  /** Se dispara con el tema que quedó puesto, por si el proyecto quiere anotarlo. */
  onThemeChange?: ((tema: Tema) => void) | undefined;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
};

export function ThemeToggle({
  label = 'Cambiar de tema',
  onThemeChange,
  variant = 'secondary',
  size = 'icon',
  className,
  ...props
}: ThemeToggleProps) {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      aria-label={label}
      // 19px, el mismo tamaño de icono que los enlaces del footer.
      className={cn('[&_svg]:size-[19px]', className)}
      onClick={() => onThemeChange?.(alternarTema())}
      {...props}
    >
      {/* El de destino, no el del estado actual: se pulsa para ir al otro. */}
      <Sol className="light:hidden" />
      <Luna className="hidden light:block" />
    </Button>
  );
}

/**
 * El tema puesto ahora mismo, para un proyecto que necesite ramificar en React
 * —un logo distinto por modo, una imagen que no tiene versión clara—.
 *
 * Es `useSyncExternalStore` y no un `useState` con un efecto detrás porque el
 * tema es exactamente eso: un estado que vive fuera de React, en un atributo del
 * `<html>` que puede cambiar sin que React se entere. Escribirlo con un efecto
 * que llama a `setState` en el montaje es el patrón que dispara un render en
 * cascada y que la regla `set-state-in-effect` señala con razón.
 *
 * `getServerSnapshot` devuelve `'dark'` porque en el servidor no hay `document`.
 * El primer render del cliente coincide con el del servidor y el valor real
 * entra después, que es la misma discrepancia de hidratación que `ThemeToggle`
 * evita renderizando los dos iconos.
 *
 * De ahí la regla de uso: si lo que ramifica es SOLO estilo, esto no hace falta
 * y la variante `light:` es mejor — no re-renderiza nada. Esto es para cuando
 * cambia el contenido.
 */
export function useTema(): Tema {
  return useSyncExternalStore(suscribirse, temaActual, servidor);
}

const suscribirse = (avisar: () => void) => escucharTema(() => avisar());
const servidor = (): Tema => 'dark';
