import type { Meta, StoryObj } from '@storybook/react-vite';

import { Bloque, Fila, Nota } from '../../../stories/utils.tsx';
import { scriptTema } from '../../tema/index.ts';
import { ThemeToggle } from './index.tsx';

const meta = {
  title: 'Componentes/ThemeToggle',
  component: ThemeToggle,
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  name: 'Básico',
  render: (args) => (
    <div>
      <Fila>
        <ThemeToggle {...args} />
      </Fila>
      <Nota>
        En Storybook el tema lo manda la toolbar, así que pulsar aquí lo cambia y
        el selector de arriba se queda donde estaba. En un proyecto real no hay
        dos fuentes: manda `data-theme` del {'<html>'}.
      </Nota>
      <Nota>
        El icono que se ve es el de DESTINO: en oscuro el sol, en claro la luna.
        Los dos están en el DOM siempre y el que sobra lo esconde la variante
        `light:`, que es lo que evita que el servidor y el cliente discrepen.
      </Nota>
      <Nota>
        El nombre accesible es «Cambiar de tema» y no cambia con el modo. Decir
        «cambiar a claro» sería más informativo y sería falso la mitad de las
        veces: el HTML lo fija el servidor, que no sabe qué eligió quien lee.
      </Nota>
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: (args) => <ThemeToggle {...args} />,
};

export const Focus: Story = {
  parameters: { pseudo: { focusVisible: true } },
  render: (args) => <ThemeToggle {...args} />,
};

export const Variantes: Story = {
  render: () => (
    <div>
      <Bloque titulo="secondary · el defecto">
        <ThemeToggle />
      </Bloque>
      <Bloque titulo="tertiary · para una cabecera sin cajas">
        <ThemeToggle variant="tertiary" />
      </Bloque>
      <Nota>
        Hereda las variantes de `Button` porque es un botón, no una pieza nueva.
        `conversion` no está pensado para esto: se gasta una vez por pantalla y
        no es en el control de tema.
      </Nota>
    </div>
  ),
};

export const ElScript: Story = {
  name: 'El script del <head>',
  render: () => (
    <div className="gap-step-md flex flex-col">
      <Nota>
        Lo difícil no es el botón: es que la primera pintura salga ya con el tema
        correcto. Esto va INLINE en el {'<head>'}, antes de las hojas de estilo, y
        se importa de `@eduardoalvarez/arrecife/tema`, que no trae React.
      </Nota>
      <pre
        data-theme="dark"
        className="rounded-card bg-brand-hull p-step-md text-chip text-text-primary overflow-x-auto font-mono"
      >
        {scriptTema}
      </pre>
      <Nota>
        La última línea es la que se olvidaba en los dos proyectos: las
        transiciones de vista de Astro reemplazan el {'<html>'} entero, así que sin
        `astro:after-swap` el tema se pierde al navegar.
      </Nota>
    </div>
  ),
};
