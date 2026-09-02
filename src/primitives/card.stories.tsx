import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note, Stack } from '../../stories/utils.tsx';
import { Button } from './button.tsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card.tsx';
import { Text } from './typography.tsx';

const meta = { title: 'Primitives/Card', component: Card } satisfies Meta<typeof Card>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Stack>
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
          <Button size="sm" variant="tertiary">./discard →</Button>
        </CardFooter>
      </Card>
      <Note>
        It is the system's only definition of what a card surface is: `surface`,
        `hairline` border, card radius. `ArticleCard`, `TalkCard`, `CourseCard`
        and `LinkRow` reuse these same classes, so a change of radius moves all of
        them at once.
      </Note>
    </Stack>
  ),
};

export const SurfaceOnly: Story = {
  name: 'Surface only',
  render: () => (
    <Stack>
      <Card className="p-step-md">
        <Text variant="ui" tone="secondary">
          Sin cabecera ni pie: a veces una tarjeta solo es una caja con borde.
        </Text>
      </Card>
    </Stack>
  ),
};
