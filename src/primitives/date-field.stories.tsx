import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota, Pila } from '../../stories/utils.tsx';
import { DateField } from './date-field.tsx';
import { Label } from './label.tsx';

const meta = {
  title: 'Primitivos/DateField',
  component: DateField,
  args: { defaultValue: '2026-03-14' },
} satisfies Meta<typeof DateField>;

export default meta;
type Story = StoryObj<typeof meta>;

const campo = (args: Parameters<NonNullable<Story['render']>>[0], etiqueta = 'Publicar el') => (
  <Pila>
    <div className="gap-xs flex flex-col">
      <Label htmlFor="fecha">{etiqueta}</Label>
      <DateField id="fecha" {...args} />
    </div>
  </Pila>
);

export const Default: Story = { render: (args) => campo(args) };

export const ConHora: Story = {
  name: 'Con hora',
  args: { withTime: true, defaultValue: '2026-03-14T09:30' },
  render: (args) => campo(args, 'Publicar el'),
};

export const Invalido: Story = {
  name: 'Inválido',
  args: { invalid: true },
  render: (args) => campo(args),
};

export const Deshabilitado: Story = { args: { disabled: true }, render: (args) => campo(args) };

export const PorQueNativo: Story = {
  name: 'Por qué el control nativo',
  render: (args) => (
    <>
      {campo(args)}
      <Nota>
        Trae gratis el teclado del sistema, el formato según el idioma del usuario
        y el soporte de lector de pantalla. Para elegir una fecha dentro de un
        formulario es mejor que cualquier calendario a medida, y no arrastra
        dependencias. Cuando hace falta un calendario mensual navegable —el
        planificador de contenido— ahí está `Calendar`.
      </Nota>
    </>
  ),
};
