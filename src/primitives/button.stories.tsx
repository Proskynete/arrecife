import type { Meta, StoryObj } from '@storybook/react-vite';

import { ArrowUpRight, Close } from '../lib/glyphs.tsx';
import { Bloque, Fila, Nota } from '../../stories/utils.tsx';
import { Button } from './button.tsx';

const meta = {
  title: 'Primitivos/Button',
  component: Button,
  args: { children: 'Ver el trabajo' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Las CUATRO del sistema. No hay una quinta. */
const VARIANTES = ['primary', 'conversion', 'secondary', 'tertiary'] as const;

/** El terciario lleva su formato dentro: es parte de la variante, no del texto. */
const ETIQUETA = {
  primary: 'Primario',
  conversion: 'Agenda una llamada',
  secondary: 'Secundario',
  tertiary: './ver_todos →',
} as const;

function FilaDeVariantes(args: Partial<Story['args']>) {
  return (
    <Fila>
      {VARIANTES.map((v) => (
        <Button key={v} {...args} variant={v}>
          {ETIQUETA[v]}
        </Button>
      ))}
    </Fila>
  );
}

const todas: NonNullable<Story['render']> = (args) => FilaDeVariantes(args);

export const Variantes: Story = {
  render: (args) => (
    <>
      {FilaDeVariantes(args)}
      <Nota>
        Cuatro, y solo cuatro. El terciario es la estética CLI del sistema — mono,
        formato `./acción →`, sin caja ni fondo — y aparece en cada tarjeta, así
        que el formato del texto es parte de la variante y no una convención que
        haya que recordar.
      </Nota>
      <Nota>
        No hay variante de peligro. El error del sistema vive en los avisos y en
        la validación de campo, no en un botón rojo: un destructivo entra primero
        en el documento y luego aquí.
      </Nota>
    </>
  ),
};

export const Hover: Story = { parameters: { pseudo: { hover: true } }, render: todas };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } }, render: todas };

export const Deshabilitado: Story = {
  render: (args) => (
    <Fila>
      {VARIANTES.map((v) => (
        <Button key={v} {...args} variant={v} disabled>
          {ETIQUETA[v]}
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
            {ETIQUETA[v]}
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
    <>
      <Fila>
        <Button {...args} size="sm">
          sm · 13px, padding 14
        </Button>
        <Button {...args} size="md">
          md · 15px, padding 22
        </Button>
        <Button {...args} size="lg">
          lg · 17px, padding 30
        </Button>
        <Button {...args} size="icon" aria-label="Cerrar">
          <Close />
        </Button>
      </Fila>
      <Nota>
        Un solo radio de control para los tres tamaños. El documento escalonaba el
        radio 8/10/12; tres tokens de radio para una diferencia de dos píxeles es
        más difícil de defender que un radio de control único, así que el escalón
        se quita del documento y no se añade al código. Está anotado en
        `docs/decisiones.md`.
      </Nota>
      <Nota>
        `icon` es el cuadrado de 42×42 del documento. No lleva texto, así que
        lleva `aria-label` obligatorio.
      </Nota>
    </>
  ),
};

export const Terciario: Story = {
  name: 'Terciario mono',
  render: () => (
    <>
      <Fila>
        <Button variant="tertiary">./ver_todos →</Button>
        <Button variant="tertiary" size="sm">
          ./copiar_uso →
        </Button>
        <Button variant="tertiary" icon={<ArrowUpRight />}>
          ./abrir_en_github
        </Button>
      </Fila>
      <Nota>
        Bruma en reposo, bioluz subrayado con offset 4 en hover. Sin padding
        horizontal y sin alto de control: el terciario no tiene caja, así que se
        alinea con el texto de la tarjeta y no con sus botones.
      </Nota>
    </>
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
          <Button {...args} variant="tertiary">
            ./leer_después →
          </Button>
        </Fila>
        <Nota>
          Arena es la única variante que se gasta. Dos botones de conversión en la
          misma pantalla no son un error de runtime, son un problema de diseño: por
          eso está documentado aquí y no forzado en el componente.
        </Nota>
      </Bloque>

      <Bloque titulo="El secundario nunca se rellena">
        <Fila>
          <Button {...args} variant="secondary">
            En reposo
          </Button>
        </Fila>
        <Nota>
          Borde `hairlineHover` y texto espuma sobre fondo transparente; en hover
          el borde y el texto pasan los dos a bioluz. Un secundario con fondo es
          un primario mal teñido.
        </Nota>
      </Bloque>
    </>
  ),
};
