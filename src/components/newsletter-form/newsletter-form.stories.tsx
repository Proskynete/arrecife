import type { Meta, StoryObj } from '@storybook/react-vite';

import { Bloque, Nota } from '../../../stories/utils.tsx';
import { NewsletterForm } from './index.tsx';

const meta = {
  title: 'Componentes/NewsletterForm',
  component: NewsletterForm,
  args: {
    title: 'Un correo cada dos semanas',
    description:
      'Lo que aprendí escalando equipos, escrito en corto. Sin resúmenes de noticias y sin lanzamientos.',
    disclaimer: 'Sin spam. Te das de baja en un clic.',
    expresion: 'wink',
  },
} satisfies Meta<typeof NewsletterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Estados: Story = {
  name: 'Los cuatro estados',
  render: (args) => (
    <>
      <Bloque titulo="reposo">
        <NewsletterForm {...args} state="reposo" />
      </Bloque>

      <Bloque titulo="enviando · campos deshabilitados, botón al 60 %">
        <NewsletterForm {...args} state="enviando" />
      </Bloque>

      <Bloque titulo="éxito · el aviso va DEBAJO, el campo se queda">
        <NewsletterForm {...args} state="exito" />
      </Bloque>

      <Bloque titulo="error">
        <NewsletterForm {...args} state="error" />
      </Bloque>

      <Nota>
        El aviso no reemplaza al formulario. Reemplazarlo es lo que hace casi todo
        el mundo y es lo que rompe el caso real: alguien se suscribe con el correo
        equivocado y ya no tiene dónde volver a escribirlo.
      </Nota>
      <Nota>
        Los dos avisos usan la SEGUNDA receta —`enfasis="fuerte"`, fondo al 10 % y
        borde sólido— porque van pegados bajo un campo que ya tiene borde. Con la
        receta sutil, las dos líneas se leen como una sola caja.
      </Nota>
      <Nota>
        El «sin spam» es uno de los siete sitios del contrato donde puede aparecer
        una cara.
      </Nota>
    </>
  ),
};

export const Reposo: Story = { args: { state: 'reposo' } };
export const Enviando: Story = { args: { state: 'enviando' } };
export const Exito: Story = { name: 'Éxito', args: { state: 'exito' } };
export const Error: Story = { args: { state: 'error' } };
