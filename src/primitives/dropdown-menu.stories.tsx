import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';

import { Button } from './button.tsx';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu.tsx';

const meta = {
  title: 'Primitives/DropdownMenu',
  component: DropdownMenu,
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const menu = (args: Parameters<NonNullable<Story['render']>>[0]) => (
  <DropdownMenu {...args}>
    <DropdownMenuTrigger asChild>
      <Button variant="secondary">Opciones</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      <DropdownMenuLabel>Vista</DropdownMenuLabel>
      <DropdownMenuItem>Abrir en una pestaña</DropdownMenuItem>
      <DropdownMenuCheckboxItem checked>Mostrar borradores</DropdownMenuCheckboxItem>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>Orden</DropdownMenuLabel>
      <DropdownMenuRadioGroup value="reciente">
        <DropdownMenuRadioItem value="reciente">Más reciente</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="leido">Más leído</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
      <DropdownMenuSeparator />
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Exportar</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem>Markdown</DropdownMenuItem>
          <DropdownMenuItem>JSON</DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
      <DropdownMenuItem disabled>Archivar</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export const Closed: Story = { render: menu };

/**
 * Se abre pulsando, no montando `open`: así el test de accesibilidad mide el
 * state real, con el foco ya movido dentro del portal.
 */
/**
 * Radix marca `aria-hidden` todo lo que queda fuera del portal, y el disparador
 * se queda dentro de esa región siendo focusable. axe lo reporta, pero el foco
 * está atrapado en el portal por el `FocusScope` de Radix, así que en la práctica
 * no se puede tabular hasta él. Es un desacuerdo conocido entre axe y Radix, no
 * algo que introduzca Arrecife: se desactiva esta rule y solo esta, aquí y no
 * en el rest de la librería.
 */
export const Open: Story = {
  parameters: {
    a11y: { config: { rules: [{ id: 'aria-hidden-focus', enabled: false }] } },
  },
  render: menu,
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Opciones' }));
  },
};
