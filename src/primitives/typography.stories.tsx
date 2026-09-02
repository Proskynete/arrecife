import type { Meta, StoryObj } from '@storybook/react-vite';

import { Block, Note, Stack } from '../../stories/utils.tsx';
import { Text } from './typography.tsx';

const VARIANTS = ['display', 'h1', 'h2', 'h3', 'body', 'ui', 'label', 'eyebrow'] as const;
const TONES = ['primary', 'secondary', 'muted', 'accent', 'warm', 'success', 'warning', 'error'] as const;
const LABELS = ['h1', 'h2', 'h3', 'h4', 'p', 'span', 'strong', 'em', 'figcaption', 'li'] as const;

const meta = {
  title: 'Primitives/Typography',
  component: Text,
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANTS,
      description: 'Type scale. It brings the family, the weight, the line height and the tracking.',
      table: { defaultValue: { summary: 'body' } },
    },
    tone: {
      control: 'select',
      options: TONES,
      description: 'Color, always from a token.',
      table: { defaultValue: { summary: 'primary' } },
    },
    as: {
      control: 'select',
      options: LABELS,
      description: 'HTML tag. Defaults to whichever one matches the scale.',
      table: { defaultValue: { summary: 'per variant' } },
    },
    measure: {
      control: 'boolean',
      description: 'Clamps the line to 68ch.',
      table: { defaultValue: { summary: 'true on body' } },
    },
    asChild: { control: 'boolean', description: 'Renders the child instead of creating an element.' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Play with the props in the controls panel: `variant` changes the scale, `tone`
 * the color and `as` the tag that reaches the DOM, without touching the other
 * two.
 */
export const Playground: Story = {
  args: {
    variant: 'h2',
    tone: 'primary',
    children: 'Arquitectura que sobrevive al equipo que la escribió',
  },
};

const SCALES = [
  { variant: 'display', detail: '76 / 0.96 / 800 / -0.035em · display', example: 'Escalar con criterio' },
  { variant: 'h1', detail: '44 / 1.05 / 700 / -0.03em · display', example: 'Ayudo a equipos de ingeniería a escalar con criterio' },
  { variant: 'h2', detail: '30 / 1.1 / 600 / -0.02em · display', example: 'Arquitectura que sobrevive al equipo que la escribió' },
  { variant: 'h3', detail: '25 / 1.15 / 600 / -0.02em · display', example: 'Decisiones documentadas, no heredadas' },
  { variant: 'body', detail: '18 / 1.75 / 400 · sans', example: 'El sistema no anima posición ni escala. Los estados se comunican con borde y color, no con movimiento, porque el movimiento es caro de leer y barato de abusar.' },
  { variant: 'ui', detail: '15 / 1.6 / 400 · sans', example: 'Label de interfaz, quince píxeles' },
  { variant: 'label', detail: '13 / 1.5 / 500 · sans', example: 'Label mínima, trece píxeles' },
  { variant: 'eyebrow', detail: '12 · mono · tracking 0.12em · versalitas', example: 'sección' },
] as const;

export const Scales: Story = {
  render: () => (
    <div className="flex flex-col">
      {SCALES.map(({ variant, detail, example }) => (
        <div key={variant} className="border-hairline py-step-lg border-b last:border-b-0">
          <div className="gap-step-sm mb-step-sm flex flex-wrap items-baseline">
            <Text variant="eyebrow" tone="accent">
              {variant}
            </Text>
            <Text variant="label" tone="muted" className="font-mono">
              {detail}
            </Text>
          </div>
          <Text variant={variant}>{example}</Text>
        </div>
      ))}
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <Stack>
      {TONES.map((tone) => (
        <Text key={tone} variant="ui" tone={tone}>
          {tone} · the color comes from the token, never from a hex
        </Text>
      ))}
    </Stack>
  ),
};

export const SemanticsAndStyle: Story = {
  name: 'Semantics and style',
  render: () => (
    <Stack>
      <Block title="the same thing, said two ways">
        <Text as="h2" variant="h2">
          Un h2 que se ve como un h2
        </Text>
        <Text as="h2" variant="h3" className="mt-step-md">
          Un h2 que se ve como un h3
        </Text>
      </Block>
      <Note>
        `as` picks the tag and `variant` picks the scale, and they are independent
        on purpose. When a second-level heading has to look smaller, the answer is
        to lower its scale — not to demote it to `h3` and lie to the screen reader
        about the page hierarchy.
      </Note>
    </Stack>
  ),
};

export const Measure: Story = {
  render: () => (
    <div className="gap-step-lg flex flex-col">
      <Block title="body · 68ch by default">
        <Text variant="body">
          El sistema fija la medida máxima del cuerpo en 68ch, y la pone el
          componente y no quien escribe la vista. Un párrafo que cruza una
          pantalla ancha obliga al ojo a buscar el principio del renglón
          siguiente, y ese salto es donde se pierde la línea. Esta caja no tiene
          ancho máximo: el corte lo hace el propio `Text`.
        </Text>
      </Block>
      <Block title="measure={false} · for cells and narrow cards">
        <Text variant="body" measure={false}>
          Desactivarlo es para cuando el contenedor ya es más angosto que la
          medida y el corte estorba, no para ganar ancho.
        </Text>
      </Block>
    </div>
  ),
};

export const Rules: Story = {
  render: () => (
    <Stack>
      <Block title="the family is bound to the scale">
        <Text variant="body">
          Display es solo para titulares y números grandes, nunca para cuerpo.
          Por eso no hay una prop `font`: pedir cuerpo en display no es algo que
          se pueda escribir.
        </Text>
      </Block>
      <Block title="weight and tracking are not exposed">
        <Text variant="body">
          Vienen del token `--text-*`, con su interlineado. Poder ajustarlos por
          componente es exactamente como se deshace una escala tipográfica.
        </Text>
      </Block>
    </Stack>
  ),
};
