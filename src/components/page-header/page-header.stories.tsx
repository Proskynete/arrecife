import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota } from '../../../stories/utils.tsx';
import { Button } from '../../primitives/button.tsx';
import { tagline } from '../../tokens/tokens.ts';
import { PageHeader } from './index.tsx';

const meta = {
  title: 'Componentes/PageHeader',
  component: PageHeader,
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['display', 'page'],
      description: 'display para portadas, page para cabeceras de sección.',
      table: { defaultValue: { summary: 'page' } },
    },
    as: { control: 'inline-radio', options: ['h1', 'h2'] },
  },
  parameters: { layout: 'padded' },
  // Va dentro de `<main>`: fuera se convertiría en landmark `banner` y chocaría
  // con la cabecera del sitio.
  decorators: [
    (Story) => (
      <main>
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Portada: Story = {
  args: {
    size: 'display',
    eyebrow: 'inicio',
    title: tagline.largo,
    description:
      'Trabajo con equipos que crecieron más rápido que su arquitectura. Empiezo por leer el código y terminar hablando con quien lo escribió.',
  },
  render: (args) => (
    <>
      <PageHeader
        {...args}
        action={
          <>
            <Button variant="conversion">Agenda una llamada</Button>
            <Button variant="ghost">Ver el trabajo</Button>
          </>
        }
      />
      <Nota>
        El titular sale del token `tagline.largo`, no de una cadena escrita a mano:
        el wordmark y la frase viven en `tokens.ts` para que no se bifurquen entre
        proyectos. La ranura `action` lleva el único botón de conversión de la
        pantalla.
      </Nota>
    </>
  ),
};

export const Seccion: Story = {
  name: 'Cabecera de sección',
  args: {
    size: 'page',
    eyebrow: 'artículos',
    title: 'Escritos sobre arquitectura y equipos',
    description:
      'Notas largas sobre decisiones que costaron caro. Sin listas de diez trucos.',
  },
};

export const SinEyebrow: Story = {
  name: 'Sin eyebrow ni descripción',
  args: { size: 'page', title: 'Contacto' },
};

export const DosEscalas: Story = {
  name: 'Las dos escalas',
  args: { title: 'Escalar con criterio' },
  render: () => (
    <div className="gap-lg flex flex-col">
      <PageHeader size="display" eyebrow="portada" title="Escalar con criterio" as="h1" />
      <PageHeader size="page" eyebrow="sección" title="Escalar con criterio" as="h2" />
      <Nota>
        El mismo esqueleto en 76 y en 44 píxeles. Antes eran dos componentes, `Hero`
        y `PageHeader`, con la misma regla escrita dos veces.
      </Nota>
    </div>
  ),
};
