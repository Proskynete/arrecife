import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note } from '../../stories/utils.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs.tsx';

const meta = {
  title: 'Primitives/Tabs',
  component: Tabs,
  args: { defaultValue: 'charlas' },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const block = (args: Parameters<NonNullable<Story['render']>>[0], disabled = false) => (
  <Tabs {...args}>
    <TabsList>
      <TabsTrigger value="charlas">Charlas</TabsTrigger>
      <TabsTrigger value="cursos">Cursos</TabsTrigger>
      <TabsTrigger value="file" disabled={disabled}>
        Archivo
      </TabsTrigger>
    </TabsList>
    <TabsContent value="charlas">
      <Note>The active tab is marked with `surfaceRaised` and primary text. Nothing else.</Note>
    </TabsContent>
    <TabsContent value="cursos">
      <Note>No sliding underline: the state is color, not movement.</Note>
    </TabsContent>
    <TabsContent value="file">
      <Note>Contenido archivado.</Note>
    </TabsContent>
  </Tabs>
);

export const Default: Story = { render: (args) => block(args) };
export const Hover: Story = { parameters: { pseudo: { hover: true } }, render: (args) => block(args) };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } }, render: (args) => block(args) };
export const Disabled: Story = { render: (args) => block(args, true) };
