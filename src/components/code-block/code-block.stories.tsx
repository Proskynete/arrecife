import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota, Pila } from '../../../stories/utils.tsx';
import { sintaxis } from '../../tokens/tokens.ts';
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


/**
 * Andamiaje de la story, no de la librería. En producción el resaltado lo hace
 * Shiki en build con `@eduardoalvarez/arrecife/shiki`; aquí el fragmento va
 * marcado a mano para poder ver la paleta sin traerse el resaltador.
 */
const T = ({ c, children }: { c: string; children: string }) => (
  <span style={{ color: c }}>{children}</span>
);

export const Resaltado: Story = {
  name: 'La paleta de sintaxis',
  args: { language: 'ts', copyText: undefined },
  render: (args) => (
    <Pila>
      <CodeBlock {...args}>
        <T c={sintaxis.comentario}>{'// El tema sale de tokens.sintaxis\n'}</T>
        <T c={sintaxis.palabraClave}>{'import'}</T>
        {' { '}
        <T c={sintaxis.identificador}>{'arrecife'}</T>
        {' } '}
        <T c={sintaxis.palabraClave}>{'from'}</T>{' '}
        <T c={sintaxis.literal}>{"'@eduardoalvarez/arrecife/shiki'"}</T>
        <T c={sintaxis.comentario}>{';\n\n'}</T>
        <T c={sintaxis.palabraClave}>{'export const'}</T>{' '}
        <T c={sintaxis.identificador}>{'markdown'}</T>
        <T c={sintaxis.comentario}>{' = {\n  '}</T>
        <T c={sintaxis.identificador}>{'syntaxHighlight'}</T>
        <T c={sintaxis.comentario}>{': '}</T>
        <T c={sintaxis.literal}>{"'shiki'"}</T>
        <T c={sintaxis.comentario}>{',\n  '}</T>
        <T c={sintaxis.identificador}>{'shikiConfig'}</T>
        <T c={sintaxis.comentario}>{': { '}</T>
        <T c={sintaxis.identificador}>{'theme'}</T>
        <T c={sintaxis.comentario}>{': '}</T>
        <T c={sintaxis.identificador}>{'arrecife'}</T>
        <T c={sintaxis.comentario}>{' },\n  '}</T>
        <T c={sintaxis.identificador}>{'inline'}</T>
        <T c={sintaxis.comentario}>{': '}</T>
        <T c={sintaxis.literal}>{'false'}</T>
        <T c={sintaxis.comentario}>{',\n};'}</T>
      </CodeBlock>
      <Nota>
        Cuatro colores y nada más: arena las palabras clave, bioluz los literales
        —cadenas, números y booleanos, que los tres son literales—, plancton los
        comentarios y la puntuación, y espuma todo lo que se nombra. Funciones,
        variables y tipos caen los tres en espuma a propósito: el sistema se
        comunica con color y borde, no con ruido cromático.
      </Nota>
      <Nota>
        Medidos sobre casco, los cinco AA: espuma 16.42, bioluz 10.05, arena
        9.05, plancton 5.43 e invalidez 4.97. `brand.body` no entra en la paleta
        — el sistema lo restringe a relleno y aquí mide 4.2.
      </Nota>
      <Nota>
        La librería NO trae Shiki. El tema es un objeto de datos en
        `@eduardoalvarez/arrecife/shiki`, y el resaltado lo hace cada proyecto en
        build con su herramienta. Aquí el fragmento va marcado a mano.
      </Nota>
    </Pila>
  ),
};
