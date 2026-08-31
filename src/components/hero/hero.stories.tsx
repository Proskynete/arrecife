import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota } from '../../../stories/utils.tsx';
import { Button } from '../../primitives/button.tsx';
import { tagline } from '../../tokens/tokens.ts';
import { Hero } from './index.tsx';

const meta = {
  title: 'Componentes/Hero',
  component: Hero,
  parameters: { layout: 'fullscreen' },
  args: {
    eyebrow: 'consultoría',
    title: tagline.largo,
    description:
      'Trabajo con equipos que crecieron más rápido que su arquitectura. Empiezo por leer el código y termino hablando con quien lo escribió.',
    pose: 'surf',
  },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  name: 'Básico',
  render: (args) => (
    <div className="p-step-lg">
      <Hero
        {...args}
        action={
          <>
            <Button variant="conversion">Agenda una llamada</Button>
            <Button variant="tertiary">./ver_el_trabajo →</Button>
          </>
        }
      />
      <Nota>
        UNO por sitio. Es la única pieza que se gasta como el botón de conversión,
        y por la misma razón: si hay dos, no hay ninguno.
      </Nota>
      <Nota>
        El degradado sale de `--gradient-hero`, así que sigue el modo y no hay un
        ángulo escrito a mano en ningún proyecto. Cambia el tema en la toolbar: el
        documento solo daba los valores oscuros, y los claros se componen de la
        paleta clara con el mismo ángulo y las mismas paradas.
      </Nota>
      <Nota>
        Texto al 62 % del ancho y la pose sangrando por la esquina inferior
        derecha, nunca centrada. Estrecha la ventana: en móvil no hay borde por el
        que sangrar, así que la pose baja al flujo bajo los botones en vez de
        desaparecer.
      </Nota>
    </div>
  ),
};

export const SinPose: Story = {
  name: 'Sin pose',
  args: { pose: undefined },
  render: (args) => (
    <div className="p-step-lg">
      <Hero {...args} action={<Button variant="conversion">Agenda una llamada</Button>} />
      <Nota>
        Válido, pero es un panel con texto. La pose es la mitad de lo que hace que
        un hero se reconozca como este sitio y no como cualquier otro.
      </Nota>
    </div>
  ),
};
