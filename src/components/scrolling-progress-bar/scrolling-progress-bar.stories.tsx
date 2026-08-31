import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota } from '../../../stories/utils.tsx';
import { Text } from '../../primitives/typography.tsx';
import { ScrollingProgressBar } from './index.tsx';

const meta = {
  title: 'Componentes/ScrollingProgressBar',
  component: ScrollingProgressBar,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ScrollingProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const PARRAFOS = 12;

function Articulo() {
  return (
    <div className="gap-step-md max-w-content mx-auto flex flex-col">
      <Text as="h1" variant="h1">
        Escalar con criterio
      </Text>
      {Array.from({ length: PARRAFOS }, (_, i) => (
        <Text key={i} variant="body">
          Párrafo {i + 1}. Un equipo que crece sin criterio no se rompe por la
          arquitectura: se rompe por las decisiones que nadie escribió y que cada
          quien reconstruye distinto. La barra de arriba mide cuánto queda de
          esto, no cuánto falta para que algo termine.
        </Text>
      ))}
    </div>
  );
}

export const Basico: Story = {
  name: 'Básico',
  render: (args) => (
    <div className="-m-step-lg">
      <ScrollingProgressBar {...args} />
      <div className="p-step-lg">
        <Nota>
          Va `aria-hidden`. Un lector de pantalla ya sabe dónde está en el
          documento; anunciarle «37 %» en cada movimiento es ruido. Lo que es
          solo visual se declara como tal.
        </Nota>
        <Nota>
          El ancho no transiciona: `transition-standard` solo cubre color y
          borde, así que la barra sigue al scroll en vez de perseguirlo.
        </Nota>
        <Articulo />
      </div>
    </div>
  ),
};

/** El caso real: la barra sigue al artículo, no al documento. */
function ConArticuloAcotado() {
  const articulo = useRef<HTMLElement>(null);

  return (
    <div className="-m-step-lg">
      <ScrollingProgressBar target={articulo} />
      <div className="p-step-lg gap-step-xl flex flex-col">
        <Nota>
          Con una cabecera alta y un pie con enlaces, medir el documento entero
          marca el 100 % cuando todavía quedan dos párrafos. `target` acota la
          medida al artículo.
        </Nota>
        <article ref={articulo}>
          <Articulo />
        </article>
        <Nota>Esto de aquí abajo ya no cuenta para la barra.</Nota>
      </div>
    </div>
  );
}

export const ConObjetivo: Story = {
  name: 'Midiendo solo el artículo',
  render: () => <ConArticuloAcotado />,
};

export const Arena: Story = {
  name: 'Tono arena',
  args: { tone: 'warm' },
  render: (args) => (
    <div className="-m-step-lg">
      <ScrollingProgressBar {...args} />
      <div className="p-step-lg">
        <Nota>
          Arena para una lección de curso, que es donde el progreso de lectura y
          el progreso del curso comparten pantalla y conviene que hablen el mismo
          color.
        </Nota>
        <Articulo />
      </div>
    </div>
  ),
};
