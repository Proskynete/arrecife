import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota } from '../../../stories/utils.tsx';
import { Logo } from '../../brand/logo.tsx';
import { Button } from '../../primitives/button.tsx';
import { Text } from '../../primitives/typography.tsx';
import { ThemeToggle } from '../theme-toggle/index.tsx';
import { Nav, NavItem } from './index.tsx';

const meta = {
  title: 'Componentes/Nav',
  component: Nav,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Nav>;

export default meta;
type Story = StoryObj<typeof meta>;

const SECCIONES = ['artículos', 'cursos', 'charlas', 'sobre-mí'] as const;

export const Basico: Story = {
  name: 'Básico',
  render: () => (
    <div className="-m-step-lg">
      <Nav
        brand={<Logo sobre="oscuro" className="h-7" />}
        actions={<Button variant="conversion">Agenda una llamada</Button>}
      >
        {SECCIONES.map((s) => (
          <NavItem key={s} href={`/${s}`} active={s === 'artículos'}>
            {s}
          </NavItem>
        ))}
      </Nav>

      <div className="px-step-md py-section max-w-wide mx-auto">
        <Text variant="body" tone="secondary" measure>
          Baja la página para ver el desenfoque. La barra es abismo al 86 % con
          14px de desenfoque detrás, y el alfa va sobre el token, así que en modo
          claro es papel al 86 % sin tocar una línea.
        </Text>
        <div className="h-[120vh]" />
      </div>
    </div>
  ),
};

export const Formato: Story = {
  name: 'El ./ lo pone el componente',
  render: () => (
    <div className="-m-step-lg">
      <Nav brand={<Logo sobre="oscuro" className="h-7" />}>
        {SECCIONES.map((s) => (
          <NavItem key={s} href={`/${s}`} active={s === 'cursos'}>
            {s}
          </NavItem>
        ))}
      </Nav>
      <div className="p-step-lg">
        <Nota>
          Quien usa el componente escribe `artículos`, no `./artículos`. Es la
          misma decisión que el botón terciario: el formato es parte de la pieza y
          no una convención que haya que recordar en cinco proyectos. El `./` va
          `aria-hidden`, así que un lector de pantalla anuncia «artículos».
        </Nota>
        <Nota>
          El activo es bioluz con subrayado de 1px y `aria-current="page"`. El
          color no puede ser el único indicador, y el subrayado es lo que lo
          acompaña.
        </Nota>
      </div>
    </div>
  ),
};

export const ComoEnElSitio: Story = {
  name: 'La barra real del sitio',
  render: () => (
    <div className="-m-step-lg">
      <Nav
        brand={<Logo sobre="oscuro" conLema />}
        actions={
          <>
            <Button variant="tertiary" size="icon" aria-label="Buscar">
              <span aria-hidden="true">⌕</span>
            </Button>
            <ThemeToggle />
          </>
        }
      >
        <NavItem href="#" active>
          artículos
        </NavItem>
        <NavItem href="#">charlas</NavItem>
        <NavItem href="#">cursos</NavItem>
        <NavItem href="#">sobre_mí</NavItem>
        <NavItem href="#">hablemos</NavItem>
      </Nav>

      <div className="p-step-lg">
        <Nota>
          Los items van a la DERECHA, pegados a las acciones. Con la marca a la
          izquierda y los items justo detrás, el bloque de navegación queda
          flotando en medio y el ojo cruza el hueco dos veces.
        </Nota>
        <Nota>
          El `~/` es el prompt y va fuera de los `li`: meterlo dentro lo
          convertiría en un elemento más de la lista de navegación, y esa lista
          tiene que tener tantos elementos como secciones.
        </Nota>
        <Nota>
          La sección actual va entre corchetes además de en bioluz y subrayada.
          El color y el subrayado son la misma señal; los corchetes son cómo una
          terminal marca la ruta activa y no dependen de distinguir el color.
        </Nota>
        <Nota>
          La marca lleva `conLema`: el lema sale de `tagline.corto` y no se puede
          pasar por prop, por lo mismo que el wordmark.
        </Nota>
      </div>
    </div>
  ),
};
