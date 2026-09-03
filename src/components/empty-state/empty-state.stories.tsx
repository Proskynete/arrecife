import type { Meta, StoryObj } from '@storybook/react-vite';

import { Block, Note, Stack } from '../../../stories/utils.tsx';
import { Button } from '../../primitives/button.tsx';
import { EmptyState } from './index.tsx';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  args: {
    expression: 'waiting',
    title: 'Todavía no hay artículos con esta etiqueta',
    description: 'Prueba con otra categoría, o vuelve dentro de un par de semanas.',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: 'Basic',
  render: (args) => (
    <>
      <Stack>
        <EmptyState {...args} />
      </Stack>
      <Note>
        `expression` is mandatory. It is not an API oversight: an empty state
        without a face is half the component, and making it optional would put the
        mascot rule back in the hands of whoever writes the view.
      </Note>
    </>
  ),
};

export const WithAction: Story = {
  name: 'With action',
  args: { expression: 'confused' },
  render: (args) => (
    <Stack>
      <EmptyState {...args} action={<Button variant="tertiary">./ver_todos →</Button>} />
    </Stack>
  ),
};

/** The document's four, with their copy verbatim. */
export const FromTheDocument: Story = {
  name: 'The document\'s four',
  render: () => (
    <>
      <div className="gap-step-md grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
        <EmptyState
          expression="confused"
          title="404 · aguas desconocidas"
          description="Nadaste fuera del mapa. Volvamos a la superficie."
        />
        <EmptyState
          expression="annoyed"
          title="Error del servidor"
          description="Algo se rompió de mi lado. Ya lo estoy mirando."
        />
        <EmptyState
          expression="waiting"
          title="Sin resultados"
          description="No encontré nada con ese término. Prueba con menos palabras."
        />
        <EmptyState
          expression="shades"
          title="Módulo completado"
          description="Sigues tú: microfrontends sin dolor."
        />
      </div>
      <Note>
        The four faces come from the manual's inventory, which assigns a situation
        to each: confused → 404, annoyed → server error, waiting → no results,
        shades → module completed. It is data in `faceUsage`, so the choice is not
        made by eye at every call site.
      </Note>
    </>
  ),
};

export const WhereFacesGo: Story = {
  name: 'Where the faces go',
  render: () => (
    <>
      <Block title="404">
        <Stack>
          <EmptyState
            expression="confused"
            title="Esta página no existe"
            description="El enlace que seguiste apunta a algo que se movió o que nunca estuvo."
            action={<Button variant="tertiary">./volver_al_inicio →</Button>}
          />
        </Stack>
      </Block>

      <Block title="server error">
        <Stack>
          <EmptyState
            expression="annoyed"
            title="Algo se rompió de este lado"
            description="No es cosa tuya. Vuelve a intentar en un minuto."
          />
        </Stack>
      </Block>

      <Block title="course completed">
        <Stack>
          <EmptyState
            expression="shades"
            title="Terminaste el curso"
            description="El certificado te llega por correo en unos minutos."
          />
        </Stack>
      </Block>

      <Note>
        The full contract: empty states, 404, server error, course progress,
        celebration, toast and the newsletter's «sin spam». Nowhere else — not the
        hero, not pricing, not services, not contact, not the CV.
      </Note>
      <Note>
        The three faces are the ones `faceUsage` assigns — `confused` → 404,
        `annoyed` → server error, `shades` → module or course completed. This
        story used to show the first two swapped and `hearts` for the third, which
        is the choice-by-eye the story above says the data exists to prevent.
      </Note>
    </>
  ),
};
