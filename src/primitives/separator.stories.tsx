import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota, Pila } from '../../stories/utils.tsx';
import { Separator } from './separator.tsx';
import { Text } from './typography.tsx';

const meta = { title: 'Primitivos/Separator', component: Separator } satisfies Meta<typeof Separator>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <Pila>
      <Text variant="ui">Charlas</Text>
      <Separator />
      <Text variant="ui">Cursos</Text>
      <Separator />
      <Text variant="ui">Escritos</Text>
      <Nota>
        Usa `hairline`, no `border`: una división entre contenidos es sutil por
        definición. `border` es para delimitar un control.
      </Nota>
    </Pila>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="gap-step-sm flex h-8 items-center">
      <Text variant="label" tone="secondary">2025</Text>
      <Separator orientation="vertical" />
      <Text variant="label" tone="secondary">8 min</Text>
      <Separator orientation="vertical" />
      <Text variant="label" tone="secondary">arquitectura</Text>
    </div>
  ),
};
