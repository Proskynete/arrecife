import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { Text } from '../../primitives/typography.tsx';

/**
 * Una sola cabecera en dos escalas, no dos componentes.
 *
 * El hero del portafolio y el de cursos resultaron ser el mismo esqueleto —
 * eyebrow en acento, titular, párrafo acotado — con distinto tamaño. Separarlos
 * en `Hero` y `PageHeader` habría duplicado la misma regla en dos sitios y
 * habría dejado la puerta abierta a que se separaran con el tiempo.
 *
 * `display` para portadas, `page` para cabeceras de sección.
 *
 * No recibe cara de la mascota, ni en una escala ni en la otra: las caras van en
 * estados vacíos, confirmaciones, errores, progreso de curso y celebración.
 *
 * Renderiza un `<header>`, y va DENTRO de `<main>`. Un `<header>` que cuelga
 * directamente del `<body>` se convierte en landmark `banner`, y entonces
 * compite con la cabecera del sitio: dos banners en una página es un fallo de
 * accesibilidad. Dentro de `<main>` no es landmark y sí es la cabecera del
 * contenido, que es lo que este componente es.
 */
const cabecera = cva('gap-step-sm flex flex-col', {
  variants: {
    size: {
      display: 'py-section',
      page: 'py-step-xl',
    },
  },
  defaultVariants: { size: 'page' },
});

export type PageHeaderProps = Omit<ComponentPropsWithoutRef<'header'>, 'title'> &
  VariantProps<typeof cabecera> & {
    title: ReactNode;
    /** Mono, versalitas, en acento. Es la sección a la que pertenece la página. */
    eyebrow?: ReactNode | undefined;
    description?: ReactNode | undefined;
    /**
     * Ranura para las llamadas a la acción. Si aquí va un botón de conversión,
     * es el único de la pantalla.
     */
    action?: ReactNode | undefined;
    /** Nivel del titular. `h1` salvo que la página ya tenga uno. */
    as?: 'h1' | 'h2' | undefined;
  };

export function PageHeader({
  title,
  eyebrow,
  description,
  action,
  size,
  as = 'h1',
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header className={cn(cabecera({ size }), className)} {...props}>
      {eyebrow ? (
        <Text variant="eyebrow" tone="accent" as="p">
          {eyebrow}
        </Text>
      ) : null}

      <Text as={as} variant={size === 'display' ? 'display' : 'h1'} className="max-w-measure">
        {title}
      </Text>

      {description ? (
        <Text variant="body" tone="secondary">
          {description}
        </Text>
      ) : null}

      {action ? <div className="gap-step-sm mt-step-sm flex flex-wrap items-center">{action}</div> : null}
    </header>
  );
}
