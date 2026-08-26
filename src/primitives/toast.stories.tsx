import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota } from '../../stories/utils.tsx';
import { Button } from './button.tsx';
import {
  Toast,
  ToastAction,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast.tsx';

const meta = { title: 'Primitivos/Toast', component: Toast } satisfies Meta<typeof Toast>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Variantes: Story = {
  render: () => (
    <ToastProvider duration={Infinity}>
      <div className="gap-md flex max-w-content flex-col">
        <Toast open variant="neutral">
          <div>
            <ToastTitle>Borrador guardado</ToastTitle>
            <ToastDescription>Hace unos segundos.</ToastDescription>
          </div>
        </Toast>
        <Toast open variant="success">
          <div>
            <ToastTitle>Artículo publicado</ToastTitle>
            <ToastDescription>Ya está en el feed y en el RSS.</ToastDescription>
          </div>
        </Toast>
        <Toast open variant="error">
          <div>
            <ToastTitle>No se pudo publicar</ToastTitle>
            <ToastDescription>El slug ya existe en otro artículo.</ToastDescription>
          </div>
          <ToastAction altText="Reintentar" asChild>
            <Button size="sm" variant="secondary">
              Reintentar
            </Button>
          </ToastAction>
        </Toast>
      </div>
      <Nota>
        Sin deslizamiento de entrada: el aviso aparece donde va a quedarse. Aquí se
        muestran montados en el flujo para poder revisarlos; en producción viven en
        el `ToastViewport`, abajo a la derecha.
      </Nota>
      <ToastViewport />
    </ToastProvider>
  ),
};
