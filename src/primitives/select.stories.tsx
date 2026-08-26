import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';

import { Pila } from '../../stories/utils.tsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select.tsx';

const meta = { title: 'Primitivos/Select', component: Select } satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

const control = (args: Parameters<NonNullable<Story['render']>>[0], disabled = false) => (
  <Pila>
    <div className="gap-xs flex flex-col">
      <span id="velocidad-etiqueta" className="text-label font-sans text-text-secondary">
        Velocidad
      </span>
      <Select {...args}>
        <SelectTrigger disabled={disabled} aria-labelledby="velocidad-etiqueta">
          <SelectValue placeholder="Elige una velocidad" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Reproducción</SelectLabel>
            <SelectItem value="1">1x</SelectItem>
            <SelectItem value="1.25">1.25x</SelectItem>
            <SelectItem value="1.5">1.5x</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectItem value="2" disabled>
            2x
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </Pila>
);

export const Default: Story = { render: (args) => control(args) };
export const Hover: Story = { parameters: { pseudo: { hover: true } }, render: (args) => control(args) };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } }, render: (args) => control(args) };
/**
 * Se abre pulsando, no montando `open`: así el test de accesibilidad mide el
 * estado real, con el foco ya movido dentro del portal.
 */
/**
 * Radix marca `aria-hidden` todo lo que queda fuera del portal, y el disparador
 * se queda dentro de esa región siendo focusable. axe lo reporta, pero el foco
 * está atrapado en el portal por el `FocusScope` de Radix, así que en la práctica
 * no se puede tabular hasta él. Es un desacuerdo conocido entre axe y Radix, no
 * algo que introduzca Arrecife: se desactiva esta regla y solo esta, aquí y no
 * en el resto de la librería.
 */
export const Abierto: Story = {
  parameters: {
    a11y: { config: { rules: [{ id: 'aria-hidden-focus', enabled: false }] } },
  },
  args: { defaultValue: '1.25' },
  render: (args) => control(args),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('combobox'));
  },
};
export const Deshabilitado: Story = { render: (args) => control(args, true) };
