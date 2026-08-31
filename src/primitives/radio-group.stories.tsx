import type { Meta, StoryObj } from '@storybook/react-vite';

import { Etiqueta } from '../../stories/utils.tsx';
import { RadioGroup, RadioGroupItem } from './radio-group.tsx';

const meta = {
  title: 'Primitivos/RadioGroup',
  component: RadioGroup,
  args: { defaultValue: 'mensual' },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const OPCIONES = [
  { valor: 'mensual', texto: 'Mensual' },
  { valor: 'anual', texto: 'Anual' },
  { valor: 'nunca', texto: 'No enviar' },
];

const grupo = (args: Parameters<NonNullable<Story['render']>>[0]) => (
  <RadioGroup {...args}>
    {OPCIONES.map(({ valor, texto }) => (
      <div key={valor} className="gap-step-sm flex items-center">
        <RadioGroupItem value={valor} id={valor} />
        <Etiqueta htmlFor={valor}>{texto}</Etiqueta>
      </div>
    ))}
  </RadioGroup>
);

export const Default: Story = { render: grupo };
export const Hover: Story = { parameters: { pseudo: { hover: true } }, render: grupo };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } }, render: grupo };
export const Deshabilitado: Story = { args: { disabled: true }, render: grupo };
