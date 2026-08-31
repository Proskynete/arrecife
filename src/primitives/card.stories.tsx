import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota, Pila } from '../../stories/utils.tsx';
import { Button } from './button.tsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card.tsx';
import { Text } from './typography.tsx';

const meta = { title: 'Primitivos/Card', component: Card } satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Pila>
      <Card>
        <CardHeader>
          <CardTitle>Cupón de lanzamiento</CardTitle>
          <CardDescription>Válido hasta el 30 de junio, un uso por persona.</CardDescription>
        </CardHeader>
        <CardContent>
          <Text variant="ui" tone="secondary">
            Aplica sobre el precio final y no se acumula con otras promociones.
          </Text>
        </CardContent>
        <CardFooter>
          <Button size="sm">Guardar</Button>
          <Button size="sm" variant="tertiary">./descartar →</Button>
        </CardFooter>
      </Card>
      <Nota>
        Es la única definición de qué es una superficie de tarjeta en el sistema:
        `surface`, borde `hairline`, radio de tarjeta. `ArticleCard`, `TalkCard`,
        `CourseCard` y `LinkRow` reutilizan estas mismas clases, así que un cambio
        de radio las mueve a todas a la vez.
      </Nota>
    </Pila>
  ),
};

export const SoloSuperficie: Story = {
  name: 'Solo superficie',
  render: () => (
    <Pila>
      <Card className="p-step-md">
        <Text variant="ui" tone="secondary">
          Sin cabecera ni pie: a veces una tarjeta solo es una caja con borde.
        </Text>
      </Card>
    </Pila>
  ),
};
