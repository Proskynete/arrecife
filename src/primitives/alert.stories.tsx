import type { Meta, StoryObj } from '@storybook/react-vite';

import { Pila } from '../../stories/utils.tsx';
import { Alert } from './alert.tsx';

const meta = { title: 'Primitivos/Alert', component: Alert } satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Variantes: Story = {
  render: () => (
    <Pila>
      <Alert variant="neutral" title="Borrador guardado">
        Se guarda solo cada treinta segundos mientras escribes.
      </Alert>
      <Alert variant="success" title="Curso publicado">
        Ya es visible en cursos.eduardoalvarez.dev.
      </Alert>
      <Alert variant="warning" title="Falta la imagen de portada">
        Sin portada, la tarjeta del artículo se ve incompleta al compartirla.
      </Alert>
      <Alert variant="error" title="No se pudo publicar">
        El slug ya existe en otro artículo. Cámbialo y vuelve a intentar.
      </Alert>
    </Pila>
  ),
};

export const SoloTitulo: Story = {
  name: 'Solo título',
  render: () => (
    <Pila>
      <Alert variant="success" title="Guardado" />
    </Pila>
  ),
};
