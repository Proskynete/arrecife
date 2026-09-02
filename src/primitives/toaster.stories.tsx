import type { Meta, StoryObj } from '@storybook/react-vite';

import { Row, Note } from '../../stories/utils.tsx';
import { Button } from './button.tsx';
import { ToastAction } from './toast.tsx';
import { Toaster, toast } from './toaster.tsx';

const meta = {
  title: 'Primitives/Toaster',
  component: Toaster,
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: 'Basic',
  render: (args) => (
    <div>
      <Row>
        <Button variant="secondary" onClick={() => toast('Borrador stored')}>
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
      </Row>

      <Note>
        It is called from wherever it is needed: `toast('Guardado')`. The state
        lives in the module and not in a context, which is what lets it be fired
        from a `fetch`'s `catch` without lifting a `useState` up to the provider.
      </Note>
      <Note>
        There is no `toast.promise` and there are no configurable positions. What
        is here are the three shapes the projects use — neutral, success, error —
        plus `dismiss`, and nothing else: every addition is public surface to
        maintain.
      </Note>
      <Note>
        The notice appears where it will stay. `sonner` slides them and stacks them
        with perspective; not here, for the same reason modals and menus are not
        animated.
      </Note>

      <Toaster {...args} />
    </div>
  ),
};

export const WithAction: Story = {
  name: 'With action',
  render: (args) => (
    <div>
      <Row>
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
      </Row>
      <Note>
        `altText` is mandatory on `ToastAction` and it is not decorative: it is
        what gets announced when the notice expires before there is time to press
        it.
      </Note>
      <Toaster {...args} />
    </div>
  ),
};

export const Variants: Story = {
  name: 'The three shapes, open',
  render: (args) => (
    <div>
      <Note>
        The three that exist: neutral, success and error. There are no more, and
        there is no `toast.promise` and no configurable positions — every addition
        is public surface to maintain.
      </Note>
      <Note>
        Since 0.5.0 this is the ONLY way to show a notice. `Toast`,
        `ToastProvider` and `ToastViewport` stopped being public: they had no use
        case of their own, and two ways of showing the same thing force a choice at
        every site with no criterion to settle it.
      </Note>
      <Toaster {...args} />
    </div>
  ),
  play: async () => {
    toast('Borrador stored');
    toast.success('Artículo publicado', { description: 'Ya está en el feed.' });
    toast.error('No se pudo guardar', { title: 'Error del servidor' });
  },
};
