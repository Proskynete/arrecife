import type { Meta, StoryObj } from '@storybook/react-vite';

import { Block, Note, Stack } from '../../stories/utils.tsx';
import { Alert } from './alert.tsx';

const meta = { title: 'Primitives/Alert', component: Alert } satisfies Meta<typeof Alert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <>
      <Stack>
        <Alert variant="accent" title="Borrador stored">
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
      </Stack>
      <Note>
        The semantic color at 8 % as background and at 22 % as border. The tone
        cannot live entirely in a 1px border: four alerts told apart by a line are
        four alerts that get confused. The first is ACCENT (✦), the system's
        informational one — there is no neutral variant, because an alert without
        color is a paragraph.
      </Note>
      <Note>
        The glyphs are mono characters, never emoji: `✦ ✓ ! ✕`. It is the same CLI
        aesthetic as the `❯` in the code block's bar.
      </Note>
      <Note>
        The title uses `textPrimary` and not the tone's color. In light mode the
        semantics are calibrated to pass JUST over paper, so over their own tint at
        8 % they fall to 4.11–4.40 and fail AA. The tint is a surface: what goes on
        top of it is a text token, and the semantic color stays on the border and
        the glyph, which is all the document ever asked of it.
      </Note>
    </>
  ),
};

export const LightMode: Story = {
  name: 'The light-mode check',
  render: () => (
    <>
      <Stack>
        <Alert variant="accent" title="El 8 % está calculado sobre abismo" />
        <Alert variant="success" title="Sobre papel aguanta igual" />
        <Alert variant="warning" title="Cambia el modo en la barra de herramientas" />
        <Alert variant="error" title="Este es el tinte más flojo de los ocho" />
      </Stack>
      <Note>
        Measured, not estimated. Contrast of the tint against the page background:
        accent 1.149 dark / 1.106 light, success 1.116 / 1.121, warning 1.126 /
        1.109, error 1.067 / 1.120.
      </Note>
      <Note>
        Light mode needs NO second table — it holds up as well as or better than
        dark. The system's weak point is `error` over abyss, 1.067, which leans
        entirely on the 22 % border.
      </Note>
    </>
  ),
};

export const Emphasis: Story = {
  name: 'The two recipes',
  render: () => (
    <>
      <Block title="subtle · 8 % background, 22 % border">
        <Stack>
          <Alert variant="success" title="Ya estás dentro">
            Te llega un correo cada dos semanas. Nada más.
          </Alert>
        </Stack>
      </Block>

      <Block title="strong · 10 % background, solid border">
        <Stack>
          <Alert variant="error" emphasis="strong" title="Ese correo no es válido">
            Revisa que tenga arroba y dominio.
          </Alert>
        </Stack>
      </Block>

      <Note>
        The second recipe is deliberate and documented: the newsletter form's
        notice goes under the field, so it needs to separate itself from the border
        of the input right above it. They are not merged.
      </Note>
    </>
  ),
};

export const TitleOnly: Story = {
  name: 'Title only',
  render: () => (
    <Stack>
      <Alert variant="success" title="Guardado" />
    </Stack>
  ),
};
