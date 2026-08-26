import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota } from '../../stories/utils.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs.tsx';

const meta = {
  title: 'Primitivos/Tabs',
  component: Tabs,
  args: { defaultValue: 'charlas' },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const bloque = (args: Parameters<NonNullable<Story['render']>>[0], deshabilitada = false) => (
  <Tabs {...args}>
    <TabsList>
      <TabsTrigger value="charlas">Charlas</TabsTrigger>
      <TabsTrigger value="cursos">Cursos</TabsTrigger>
      <TabsTrigger value="archivo" disabled={deshabilitada}>
        Archivo
      </TabsTrigger>
    </TabsList>
    <TabsContent value="charlas">
      <Nota>El tab activo se marca con `surfaceRaised` y texto primario. Nada más.</Nota>
    </TabsContent>
    <TabsContent value="cursos">
      <Nota>Sin subrayado deslizante: el estado es color, no movimiento.</Nota>
    </TabsContent>
    <TabsContent value="archivo">
      <Nota>Contenido archivado.</Nota>
    </TabsContent>
  </Tabs>
);

export const Default: Story = { render: (args) => bloque(args) };
export const Hover: Story = { parameters: { pseudo: { hover: true } }, render: (args) => bloque(args) };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } }, render: (args) => bloque(args) };
export const Deshabilitado: Story = { render: (args) => bloque(args, true) };
