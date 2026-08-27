import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota, Pila } from '../../stories/utils.tsx';
import { Code } from './code.tsx';
import { Text } from './typography.tsx';

const meta = { title: 'Primitivos/Code', component: Code } satisfies Meta<typeof Code>;
export default meta;
type Story = StoryObj<typeof meta>;

export const EnProsa: Story = {
  name: 'En prosa',
  render: () => (
    <>
      <Pila>
        <Text variant="body" tone="secondary">
          Los PNG se publican bajo <Code>./assets/brand/</Code> y se sirven en{' '}
          <Code>/brand</Code>, que es la misma ruta que ya usan los cinco proyectos
          desde su <Code>public/</Code>.
        </Text>
      </Pila>
      <Nota>
        Existe porque no existía: cada consumidor escribía
        `&lt;code className=&quot;font-mono&quot;&gt;` a mano. Un `code` suelto
        hereda el tamaño del párrafo, así que dentro de `body` se veía un mono de
        18px que el documento no tiene en ninguna parte.
      </Nota>
      <Nota>
        No es `CodeBlock`. El bloque es una isla de tema oscuro sobre casco, con
        barra y botón de copiar; esto es una palabra dentro de una frase, y por eso
        se queda en la superficie de la página en vez de invertir el tema.
      </Nota>
    </>
  ),
};
