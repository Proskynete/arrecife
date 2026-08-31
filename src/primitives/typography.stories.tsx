import type { Meta, StoryObj } from '@storybook/react-vite';

import { Bloque, Nota, Pila } from '../../stories/utils.tsx';
import { Text } from './typography.tsx';

const VARIANTES = ['display', 'h1', 'h2', 'h3', 'body', 'ui', 'label', 'eyebrow'] as const;
const TONOS = ['primary', 'secondary', 'muted', 'accent', 'warm', 'success', 'warning', 'error'] as const;
const ETIQUETAS = ['h1', 'h2', 'h3', 'h4', 'p', 'span', 'strong', 'em', 'figcaption', 'li'] as const;

const meta = {
  title: 'Primitivos/Typography',
  component: Text,
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANTES,
      description: 'Escala tipográfica. Arrastra la familia, el peso, el interlineado y el tracking.',
      table: { defaultValue: { summary: 'body' } },
    },
    tone: {
      control: 'select',
      options: TONOS,
      description: 'Color, siempre desde un token.',
      table: { defaultValue: { summary: 'primary' } },
    },
    as: {
      control: 'select',
      options: ETIQUETAS,
      description: 'Etiqueta HTML. Por defecto, la que corresponde a la escala.',
      table: { defaultValue: { summary: 'según variant' } },
    },
    measure: {
      control: 'boolean',
      description: 'Corta la línea a 68ch.',
      table: { defaultValue: { summary: 'true en body' } },
    },
    asChild: { control: 'boolean', description: 'Renderiza el hijo en vez de crear un elemento.' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Toca las props en el panel de controles: `variant` cambia la escala, `tone` el
 * color y `as` la etiqueta que sale en el DOM, sin tocar ninguna de las otras dos.
 */
export const Playground: Story = {
  args: {
    variant: 'h2',
    tone: 'primary',
    children: 'Arquitectura que sobrevive al equipo que la escribió',
  },
};

const ESCALAS = [
  { variant: 'display', detalle: '76 / 0.96 / 800 / -0.035em · display', ejemplo: 'Escalar con criterio' },
  { variant: 'h1', detalle: '44 / 1.05 / 700 / -0.03em · display', ejemplo: 'Ayudo a equipos de ingeniería a escalar con criterio' },
  { variant: 'h2', detalle: '30 / 1.1 / 600 / -0.02em · display', ejemplo: 'Arquitectura que sobrevive al equipo que la escribió' },
  { variant: 'h3', detalle: '25 / 1.15 / 600 / -0.02em · display', ejemplo: 'Decisiones documentadas, no heredadas' },
  { variant: 'body', detalle: '18 / 1.75 / 400 · sans', ejemplo: 'El sistema no anima posición ni escala. Los estados se comunican con borde y color, no con movimiento, porque el movimiento es caro de leer y barato de abusar.' },
  { variant: 'ui', detalle: '15 / 1.6 / 400 · sans', ejemplo: 'Etiqueta de interfaz, quince píxeles' },
  { variant: 'label', detalle: '13 / 1.5 / 500 · sans', ejemplo: 'Etiqueta mínima, trece píxeles' },
  { variant: 'eyebrow', detalle: '12 · mono · tracking 0.12em · versalitas', ejemplo: 'sección' },
] as const;

export const Escalas: Story = {
  render: () => (
    <div className="flex flex-col">
      {ESCALAS.map(({ variant, detalle, ejemplo }) => (
        <div key={variant} className="border-hairline py-step-lg border-b last:border-b-0">
          <div className="gap-step-sm mb-step-sm flex flex-wrap items-baseline">
            <Text variant="eyebrow" tone="accent">
              {variant}
            </Text>
            <Text variant="label" tone="muted" className="font-mono">
              {detalle}
            </Text>
          </div>
          <Text variant={variant}>{ejemplo}</Text>
        </div>
      ))}
    </div>
  ),
};

export const Tonos: Story = {
  render: () => (
    <Pila>
      {TONOS.map((tone) => (
        <Text key={tone} variant="ui" tone={tone}>
          {tone} · el color sale del token, nunca de un hex
        </Text>
      ))}
    </Pila>
  ),
};

export const SemanticaYEstilo: Story = {
  name: 'Semántica y estilo',
  render: () => (
    <Pila>
      <Bloque titulo="lo mismo, dicho de dos maneras">
        <Text as="h2" variant="h2">
          Un h2 que se ve como un h2
        </Text>
        <Text as="h2" variant="h3" className="mt-step-md">
          Un h2 que se ve como un h3
        </Text>
      </Bloque>
      <Nota>
        `as` elige la etiqueta y `variant` elige la escala, y son independientes a
        propósito. Cuando un encabezado de segundo nivel tiene que verse más
        pequeño, la respuesta es bajarle la escala — no degradarlo a `h3` y
        mentirle al lector de pantalla sobre la jerarquía de la página.
      </Nota>
    </Pila>
  ),
};

export const Medida: Story = {
  render: () => (
    <div className="gap-step-lg flex flex-col">
      <Bloque titulo="body · 68ch por defecto">
        <Text variant="body">
          La medida máxima de cuerpo es 68ch y la pone el componente, no quien
          escribe la vista. Un párrafo que cruza toda una pantalla ancha obliga al
          ojo a buscar el principio del renglón siguiente, y ese salto es donde se
          pierde la línea. Esta caja no tiene ancho máximo: el corte lo hace el
          propio `Text`.
        </Text>
      </Bloque>
      <Bloque titulo="measure={false} · para celdas y tarjetas estrechas">
        <Text variant="body" measure={false}>
          Desactivarlo es para cuando el contenedor ya es más angosto que la
          medida y el corte estorba, no para ganar ancho.
        </Text>
      </Bloque>
    </div>
  ),
};

export const Reglas: Story = {
  render: () => (
    <Pila>
      <Bloque titulo="la familia va atada a la escala">
        <Text variant="body">
          Display es solo para titulares y números grandes, nunca para cuerpo. Por
          eso no hay una prop `font`: pedir cuerpo en display no es algo que se
          pueda escribir.
        </Text>
      </Bloque>
      <Bloque titulo="el peso y el tracking no se exponen">
        <Text variant="body">
          Vienen del token `--text-*`, con su interlineado. Poder ajustarlos por
          componente es exactamente como se deshace una escala tipográfica.
        </Text>
      </Bloque>
    </Pila>
  ),
};
