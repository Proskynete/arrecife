import type { Meta, StoryObj } from '@storybook/react-vite';

import { Fila, Nota } from '../../stories/utils.tsx';
import { Button } from './button.tsx';
import { ToastAction } from './toast.tsx';
import { Toaster, toast } from './toaster.tsx';

const meta = {
  title: 'Primitivos/Toaster',
  component: Toaster,
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  name: 'Básico',
  render: (args) => (
    <div>
      <Fila>
        <Button variant="secondary" onClick={() => toast('Borrador guardado')}>
          Neutral
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast.success('Artículo publicado', { description: 'Ya está en el feed.' })}
        >
          Éxito
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.error('No se pudo guardar', {
              title: 'Error del servidor',
              duration: Infinity,
            })
          }
        >
          Error, sin caducar
        </Button>
        <Button variant="tertiary" onClick={() => toast.dismiss()}>
          ./cerrar todos →
        </Button>
      </Fila>

      <Nota>
        Se llama desde donde haga falta: `toast('Guardado')`. El estado vive en el
        módulo y no en un contexto, que es lo que permite dispararlo desde el
        `catch` de un `fetch` sin subir un `useState` hasta el proveedor.
      </Nota>
      <Nota>
        No hay `toast.promise` ni posiciones configurables. Están las tres formas
        que los proyectos usan —neutral, éxito, error—, `dismiss`, y nada más:
        cada añadido es superficie pública que hay que mantener.
      </Nota>
      <Nota>
        El aviso aparece donde va a quedarse. `sonner` los desliza y los apila con
        perspectiva; aquí no, por lo mismo que no se animan modales ni menús.
      </Nota>

      <Toaster {...args} />
    </div>
  ),
};

export const ConAccion: Story = {
  name: 'Con acción',
  render: (args) => (
    <div>
      <Fila>
        <Button
          variant="secondary"
          onClick={() =>
            toast('Artículo movido a la papelera', {
              action: (
                <ToastAction altText="Deshacer el borrado" asChild>
                  <Button variant="tertiary">./deshacer →</Button>
                </ToastAction>
              ),
            })
          }
        >
          Borrar con deshacer
        </Button>
      </Fila>
      <Nota>
        `altText` es obligatorio en `ToastAction` y no es decorativo: es lo que se
        anuncia cuando el aviso caduca antes de que dé tiempo a pulsarlo.
      </Nota>
      <Toaster {...args} />
    </div>
  ),
};

export const Variantes: Story = {
  name: 'Las tres formas, abiertas',
  render: (args) => (
    <div>
      <Nota>
        Las tres que existen: neutral, éxito y error. No hay más, y no hay
        `toast.promise` ni posiciones configurables — cada añadido es superficie
        pública que hay que mantener.
      </Nota>
      <Nota>
        Desde la 0.5.0 esta es la ÚNICA forma de mostrar un aviso. `Toast`,
        `ToastProvider` y `ToastViewport` dejaron de ser públicos: no tenían un
        caso de uso propio, y dos formas de mostrar lo mismo obligan a elegir en
        cada sitio sin criterio que lo resuelva.
      </Nota>
      <Toaster {...args} />
    </div>
  ),
  play: async () => {
    toast('Borrador guardado');
    toast.success('Artículo publicado', { description: 'Ya está en el feed.' });
    toast.error('No se pudo guardar', { title: 'Error del servidor' });
  },
};
