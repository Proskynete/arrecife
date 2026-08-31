import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Legend, ResponsiveContainer, Tooltip } from 'recharts';

import { cn } from '../lib/cn.ts';
import { Text } from '../primitives/typography.tsx';

/**
 * El chasis de las gráficas: contenedor, tooltip y leyenda con el vocabulario
 * del sistema. Recharts pinta; esto decide cómo se ve.
 *
 * Se publica en `@eduardoalvarez/arrecife/chart` y NO en la raíz. Recharts pesa,
 * y solo uno de los cinco proyectos dibuja métricas: colgarlo del índice
 * principal obligaría a los otros cuatro a instalarlo para que su bundler
 * resolviera un import que nunca ejecutan. Es dependencia de pares OPCIONAL, por
 * el mismo criterio con el que `./og` y `./shiki` se mantienen sin React.
 *
 * Lo que esta capa aporta —y lo que se perdía copiando el `chart.tsx` de shadcn
 * en cada proyecto— son tres cosas que se desincronizan solas:
 *
 *   1. La paleta de series sale de `tokens.series` y sigue el modo. Son cuatro
 *      y se distinguen por tono, no por luminosidad.
 *   2. La rejilla, los ejes y el cursor usan `hairline` y `textMuted`, no los
 *      grises por defecto de Recharts, que no son de esta identidad.
 *   3. El tooltip aparece donde va a quedarse: `isAnimationActive` apagado en
 *      todas partes, porque el sistema no anima posición.
 *
 * Las piezas de datos —`BarChart`, `Line`, `XAxis`— NO se reexportan. Son la API
 * de Recharts, el proyecto ya la conoce y envolverlas sería una capa de nombres
 * que hay que mantener sincronizada con la versión de la librería.
 */

/**
 * El color de la serie `indice`, como custom property.
 *
 * Devuelve `var(--color-serie-N)` y no el hexadecimal: leído en JS, el hex sería
 * el del modo que había cuando se montó el componente y no cambiaría al alternar
 * el tema. La variable la resuelve el navegador en cada pintura.
 *
 * Da la vuelta pasadas las cuatro. Que dos series compartan color es un fallo
 * visible, y es la señal correcta: la gráfica tiene más categorías de las que
 * esta identidad sabe distinguir, y lo que toca es agrupar en «otros».
 */
export function colorDeSerie(indice: number): string {
  return `var(--color-serie-${(Math.abs(indice) % 4) + 1})`;
}

/** Las cuatro, en orden, para pasárselas de golpe a un `Pie` con `Cell`. */
export const COLORES_DE_SERIE = [0, 1, 2, 3].map(colorDeSerie);

export type ChartContainerProps = Omit<ComponentPropsWithoutRef<'figure'>, 'title'> & {
  /**
   * Qué muestra la gráfica, en una frase. Obligatorio, como el `label` de
   * `Progress`: un `<svg>` de barras sin nombre accesible no es «una gráfica sin
   * etiqueta», es una región vacía.
   */
  label: string;
  /**
   * Lo que la gráfica dice, en palabras. Va en un `figcaption` oculto
   * visualmente.
   *
   * No sustituye a la gráfica: la capa de accesibilidad de Recharts ya permite
   * recorrer los puntos con el teclado. Es el titular —«sube de 24 a 52 con una
   * caída en mayo»— que ningún recorrido punto a punto da.
   */
  summary?: ReactNode;
  /** Alto en píxeles. Recharts necesita uno concreto para medir. */
  height?: number;
  children: ReactNode;
};

/**
 * Envuelve la gráfica en un `<figure>` con nombre accesible y le da a Recharts
 * el alto concreto que necesita para medirse.
 *
 * El `<figure>` NO lleva `role`: ya tiene el suyo implícito, y ponerle `group`
 * encima es un rol no permitido para el elemento —axe lo señala—. Lo que sí
 * lleva es `aria-label`, que es lo que lo nombra.
 *
 * Y el contenido NO va `aria-hidden`. Fue lo primero que se intentó, con el
 * argumento de que anunciar cada tick no cuenta lo que la gráfica cuenta, y está
 * mal por dos motivos: la capa de accesibilidad de Recharts hace la gráfica
 * recorrible con el teclado, y esconder un subárbol que contiene elementos
 * enfocables es una violación por sí misma —el foco entra en algo que no existe
 * para quien escucha—. El resumen se suma a eso, no lo reemplaza.
 */
export function ChartContainer({
  label,
  summary,
  height = 320,
  className,
  children,
  ...props
}: ChartContainerProps) {
  return (
    <figure
      aria-label={label}
      className={cn(
        'w-full',
        // La rejilla y los ejes, con los tokens del sistema en vez de los grises
        // por defecto de Recharts. Van como variantes de descendiente porque los
        // nodos los pinta la librería y no hay dónde ponerles una clase.
        '[&_.recharts-cartesian-grid_line]:stroke-hairline',
        '[&_.recharts-cartesian-axis-line]:stroke-hairline',
        '[&_.recharts-cartesian-axis-tick_text]:fill-text-muted',
        '[&_.recharts-cartesian-axis-tick_text]:font-mono',
        '[&_.recharts-cartesian-axis-tick_text]:text-chip',
        '[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-surface-raised',
        '[&_.recharts-curve.recharts-tooltip-cursor]:stroke-hairline-hover',
        '[&_.recharts-sector]:outline-none',
        '[&_.recharts-surface]:overflow-visible',
        className,
      )}
      {...props}
    >
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>

      {summary ? <figcaption className="sr-only">{summary}</figcaption> : null}
    </figure>
  );
}

/**
 * El `Tooltip` de Recharts con los defectos del sistema: sin animación y con el
 * cursor teñido de `surfaceRaised`.
 *
 * Se pasa `content={<ChartTooltipContent />}` para la caja.
 */
export function ChartTooltip(props: ComponentPropsWithoutRef<typeof Tooltip>) {
  return <Tooltip isAnimationActive={false} {...props} />;
}

export function ChartLegend(props: ComponentPropsWithoutRef<typeof Legend>) {
  return <Legend {...props} />;
}

/**
 * Lo que Recharts le pasa a un `content`, declarado aquí en corto.
 *
 * Los tipos de Recharts para esto son abiertos y arrastran genéricos que no
 * aportan nada al sitio de uso; `any` está prohibido en el repo, así que se
 * declara lo que de verdad se lee y el valor se trata como `unknown`.
 */
export type ChartPayloadItem = {
  name?: string | number | undefined;
  value?: unknown;
  color?: string | undefined;
  dataKey?: string | number | undefined;
};

export type ChartTooltipContentProps = {
  active?: boolean | undefined;
  payload?: readonly ChartPayloadItem[] | undefined;
  label?: ReactNode;
  /** Formatea el valor. Sin ella se imprime tal cual: la librería no impone locale. */
  formatter?: ((valor: unknown, item: ChartPayloadItem) => ReactNode) | undefined;
  /** Oculta el encabezado, para una gráfica de una sola categoría. */
  hideLabel?: boolean;
  className?: string;
};

/**
 * La caja del tooltip. Es una tarjeta del sistema —`surface`, borde de control,
 * sombra estándar— y no la caja blanca de Recharts, que en modo oscuro es un
 * rectángulo blanco encima de un panel oscuro.
 *
 * El punto de color es un cuadrado de 8px, no un círculo: es la misma marca que
 * usa la leyenda, y en 8 píxeles un círculo y un cuadrado se distinguen peor
 * entre sí que dos colores de la paleta.
 */
export function ChartTooltipContent({
  active,
  payload,
  label,
  formatter,
  hideLabel = false,
  className,
}: ChartTooltipContentProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      className={cn(
        'rounded-card border-border bg-surface shadow-standard p-step-sm gap-step-xs flex flex-col border',
        className,
      )}
    >
      {hideLabel || label === undefined || label === null ? null : (
        <Text as="p" variant="meta" tone="muted">
          {label}
        </Text>
      )}

      <ul className="gap-step-xs flex flex-col">
        {payload.map((item, i) => (
          <li key={`${String(item.dataKey ?? item.name ?? i)}`} className="gap-step-xs flex items-center">
            <span
              aria-hidden="true"
              className="rounded-chip size-2 shrink-0"
              style={{ backgroundColor: item.color ?? colorDeSerie(i) }}
            />
            <Text as="span" variant="label" tone="secondary" className="font-normal">
              {item.name}
            </Text>
            <Text as="span" variant="label" className="ml-auto font-mono tabular-nums">
              {formatter ? formatter(item.value, item) : String(item.value ?? '')}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  );
}

export type ChartLegendContentProps = {
  payload?: readonly ChartPayloadItem[] | undefined;
  className?: string;
};

/** La leyenda con la misma marca cuadrada del tooltip y la escala `label`. */
export function ChartLegendContent({ payload, className }: ChartLegendContentProps) {
  if (!payload || payload.length === 0) return null;

  return (
    <ul className={cn('gap-step-md pt-step-sm flex flex-wrap items-center justify-center', className)}>
      {payload.map((item, i) => (
        <li key={`${String(item.dataKey ?? item.value ?? i)}`} className="gap-step-xs flex items-center">
          <span
            aria-hidden="true"
            className="rounded-chip size-2 shrink-0"
            style={{ backgroundColor: item.color ?? colorDeSerie(i) }}
          />
          <Text as="span" variant="label" tone="secondary" className="font-normal">
            {item.value as ReactNode}
          </Text>
        </li>
      ))}
    </ul>
  );
}
