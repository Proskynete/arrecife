import type { Meta, StoryObj } from '@storybook/react-vite';

import { Bloque, Fila, Nota } from '../../stories/utils.tsx';
import { Button } from './button.tsx';

const meta = {
  title: 'Primitivos/Button',
  component: Button,
  args: { children: 'Ver el trabajo' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTES = ['primary', 'conversion', 'secondary', 'ghost', 'danger'] as const;

const todas: NonNullable<Story['render']> = (args) => (
  <Fila>
    {VARIANTES.map((v) => (
      <Button key={v} {...args} variant={v}>
        {v}
      </Button>
    ))}
  </Fila>
);

export const Variantes: Story = { render: todas };
export const Hover: Story = { parameters: { pseudo: { hover: true } }, render: todas };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } }, render: todas };

export const Deshabilitado: Story = {
  render: (args) => (
    <Fila>
      {VARIANTES.map((v) => (
        <Button key={v} {...args} variant={v} disabled>
          {v}
        </Button>
      ))}
    </Fila>
  ),
};

export const Cargando: Story = {
  render: (args) => (
    <>
      <Fila>
        {VARIANTES.map((v) => (
          <Button key={v} {...args} variant={v} loading>
            {v}
          </Button>
        ))}
      </Fila>
      <Nota>
        Es la única excepción a «nada de movimiento» en todo el sistema: un botón
        cargando sin girar es indistinguible de uno deshabilitado. Es
        realimentación de progreso, no de estado, y va envuelta en `motion-safe`,
        así que se apaga sola para quien pidió menos movimiento.
      </Nota>
    </>
  ),
};

export const Tamanos: Story = {
  name: 'Tamaños',
  render: (args) => (
    <Fila>
      <Button {...args} size="sm">
        sm · 13px
      </Button>
      <Button {...args} size="md">
        md · 15px
      </Button>
      <Button {...args} size="lg">
        lg · 15px
      </Button>
    </Fila>
  ),
};

export const ReglasDeMarca: Story = {
  name: 'Reglas de marca',
  render: (args) => (
    <>
      <Bloque titulo="Regla 2 · el primario invertido">
        <Fila>
          <Button {...args} variant="primary">
            Primario
          </Button>
        </Fila>
        <Nota>
          Cambia el modo en la toolbar. En oscuro es bioluz con tinta encima; en
          claro no puede ser bioluz ni arena, así que pasa a casco sólido. No hay
          un hex literal detrás: la regla es `light:bg-brand-hull`, y el hover
          reusa `textSecondary` en vez de inventar un `hullHover`.
        </Nota>
      </Bloque>

      <Bloque titulo="Regla 3 · conversión, una sola vez por pantalla">
        <Fila>
          <Button {...args} variant="conversion">
            Agenda una llamada
          </Button>
          <Button {...args} variant="secondary">
            Ver el trabajo
          </Button>
          <Button {...args} variant="ghost">
            Leer después
          </Button>
        </Fila>
        <Nota>
          Arena es la única variante que se gasta. Dos botones de conversión en la
          misma pantalla no son un error de runtime, son un problema de diseño: por
          eso está documentado aquí y no forzado en el componente.
        </Nota>
      </Bloque>
    </>
  ),
};
