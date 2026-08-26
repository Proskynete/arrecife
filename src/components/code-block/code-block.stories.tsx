import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota, Pila } from '../../../stories/utils.tsx';
import { CodeBlock } from './index.tsx';

const EJEMPLO = `import { tokens } from '@eduardoalvarez/arrecife/tokens';

export const og = {
  fondo: tokens.colors.dark.background,
  tinta: tokens.colors.dark.textPrimary,
};`;

const meta = {
  title: 'Componentes/CodeBlock',
  component: CodeBlock,
  args: { language: 'ts', children: EJEMPLO, copyText: EJEMPLO },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Pila>
      <CodeBlock {...args} />
      <Nota>
        Cambia el modo en la toolbar: el bloque no cambia. `brand.hull` es el
        fondo de los bloques de código en los dos temas, así que la raíz declara
        `data-theme="dark"` y toda la tinta de dentro pasa a la paleta oscura. Es
        la única isla de tema invertido del sistema.
      </Nota>
    </Pila>
  ),
};

export const SinCopiar: Story = {
  name: 'Sin botón de copiar',
  args: { copyText: undefined },
  render: (args) => (
    <Pila>
      <CodeBlock {...args} />
      <Nota>
        Sin `copyText` no hay botón. Un botón de copiar que no copia es peor que
        no tenerlo.
      </Nota>
    </Pila>
  ),
};

export const SinLenguaje: Story = {
  name: 'Sin lenguaje',
  args: { language: undefined },
  render: (args) => <Pila><CodeBlock {...args} /></Pila>,
};
