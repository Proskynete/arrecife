import type { Meta, StoryObj } from '@storybook/react-vite';
import type { SVGProps } from 'react';

import { Block, Note, Stack } from '../../../stories/utils.tsx';
import { Button } from '../../primitives/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../primitives/card.tsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../primitives/table.tsx';
import { Text } from '../../primitives/typography.tsx';
import { EmptyState } from './index.tsx';

/**
 * The project's glyph, drawn HERE and not imported, because that is the contract:
 * the system has no icon library, `lib/glyphs.tsx` is the minimum set the
 * primitives need and it is not exported. A consumer passes its own, and this is
 * what «its own» looks like — 1em, `currentColor`, 1.6 stroke, `aria-hidden`.
 */
function Clock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className="text-h3"
      {...props}
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

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

/**
 * The variant that carries no face, and the reason it is a variant and not an
 * optional prop.
 */
export const Inline: Story = {
  name: 'Inline · the hole inside something else',
  render: () => (
    <>
      <Stack>
        <EmptyState variant="inline" title="No hay reseñas que coincidan" />
      </Stack>
      <Note>
        No card, no border and no face: it sits inside something that already
        draws the region. What makes it quiet is the muted tone and the absence of
        a surface, not a smaller size — the type comes from the same scale as the
        `page` variant, one step down.
      </Note>
      <Note>
        `expression` is not optional here, it is **impossible**: the props are a
        union and `variant="inline"` does not accept a face. That is the whole
        point. An admin panel has twenty of these on one screen, and «make the
        face optional» would have put that decision back at every call site.
      </Note>
    </>
  ),
};

export const InlineStates: Story = {
  name: 'Inline · with a glyph, a second line and an action',
  render: () => (
    <>
      <Block title="just the line">
        <Stack>
          <EmptyState variant="inline" title="No hay entregas pendientes" />
        </Stack>
      </Block>

      <Block title="with a glyph">
        <Stack>
          <EmptyState
            variant="inline"
            icon={<Clock />}
            title="Sin actividad en el rango"
          />
        </Stack>
      </Block>

      <Block title="with a second line and a way out">
        <Stack>
          <EmptyState
            variant="inline"
            icon={<Clock />}
            title="No hay reportes que coincidan"
            description="Los filtros activos no dejan pasar ninguno."
            action={
              <Button variant="tertiary" size="sm">
                ./limpiar_filtros
              </Button>
            }
          />
        </Stack>
      </Block>

      <Note>
        `icon` is a `ReactNode` and the project passes its own, sized by the
        project: the system has no icon library and is not getting one. It
        inherits `currentColor`, so it takes the muted tone from the wrapper
        without being tinted separately — the same contract as `Stat`'s `icon`.
      </Note>
    </>
  ),
};

export const InlineInPlace: Story = {
  name: 'Inline · where it actually goes',
  render: () => (
    <>
      <div className="gap-step-md grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        <Card>
          <CardHeader>
            <CardTitle>Últimas reseñas</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState variant="inline" title="Aún no hay reseñas" />
          </CardContent>
        </Card>

        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={2}>
                  <EmptyState
                    variant="inline"
                    title="No hay lecciones en esta página"
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      <Note>
        This is the case the variant exists for, and it is why it draws no box of
        its own: the card and the table already draw one. A second border inside
        either is noise, and a dashed one — which is what every project invented
        on its own — is a stroke that appears nowhere else in the system.
      </Note>
    </>
  ),
};

export const BothVariants: Story = {
  name: 'The two side by side',
  render: () => (
    <>
      <div className="gap-step-md grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start">
        <div>
          <Text variant="eyebrow" tone="muted" as="p" className="mb-step-sm">
            page
          </Text>
          <EmptyState
            expression="waiting"
            title="Sin resultados"
            description="No encontré nada con ese término. Prueba con menos palabras."
          />
        </div>
        <div>
          <Text variant="eyebrow" tone="muted" as="p" className="mb-step-sm">
            inline
          </Text>
          <EmptyState
            variant="inline"
            title="No hay reseñas que coincidan"
            description="Prueba con otro rango de fechas."
          />
        </div>
      </div>
      <Note>
        They are two situations, not two sizes. On the left the empty state IS the
        screen and can afford the mascot; on the right it is one of a dozen
        elements on a dashboard and cannot. `page` is the default, so every call
        site written before the variant existed keeps its face.
      </Note>
    </>
  ),
};
