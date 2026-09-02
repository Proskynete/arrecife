import type { Meta, StoryObj } from '@storybook/react-vite';

import { ArrowUpRight, Close } from '../lib/glyphs.tsx';
import { Block, Row, Note } from '../../stories/utils.tsx';
import { Button } from './button.tsx';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  args: { children: 'Ver el trabajo' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The system's FOUR. There is no fifth. */
const VARIANTS = ['primary', 'conversion', 'secondary', 'tertiary'] as const;

/** The tertiary carries its format inside: it is part of the variant, not of the text. */
const LABEL = {
  primary: 'Primario',
  conversion: 'Agenda una llamada',
  secondary: 'Secundario',
  tertiary: './ver_todos →',
} as const;

function VariantRow(args: Partial<Story['args']>) {
  return (
    <Row>
      {VARIANTS.map((v) => (
        <Button key={v} {...args} variant={v}>
          {LABEL[v]}
        </Button>
      ))}
    </Row>
  );
}

const all: NonNullable<Story['render']> = (args) => VariantRow(args);

export const Variants: Story = {
  render: (args) => (
    <>
      {VariantRow(args)}
      <Note>
        Four, and only four. The tertiary is the system's CLI aesthetic — mono,
        `./action →` format, no box and no background — and it shows up on every
        card, so the text format is part of the variant and not a convention to
        be remembered.
      </Note>
      <Note>
        Six with the two danger ones, which arrived in 0.6.0 the way the rule that
        kept them out said they would: into the document first and in here
        second. They are listed apart because they are not interchangeable with
        these four — see the «two danger variants» story.
      </Note>
    </>
  ),
};

export const Hover: Story = { parameters: { pseudo: { hover: true } }, render: all };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } }, render: all };

export const Disabled: Story = {
  render: (args) => (
    <Row>
      {VARIANTS.map((v) => (
        <Button key={v} {...args} variant={v} disabled>
          {LABEL[v]}
        </Button>
      ))}
    </Row>
  ),
};

export const Loading: Story = {
  render: (args) => (
    <>
      <Row>
        {VARIANTS.map((v) => (
          <Button key={v} {...args} variant={v} loading>
            {LABEL[v]}
          </Button>
        ))}
      </Row>
      <Note>
        It is the only exception to «no movement» in the whole system: a loading
        button that does not spin is indistinguishable from a disabled one. It is
        feedback about progress, not about state, and it is wrapped in
        `motion-safe`, so it switches itself off for anyone who asked for less
        motion.
      </Note>
    </>
  ),
};

export const Sizes: Story = {
  name: 'Sizes',
  render: (args) => (
    <>
      <Row>
        <Button {...args} size="sm">
          sm · 13px, padding 14
        </Button>
        <Button {...args} size="md">
          md · 15px, padding 22
        </Button>
        <Button {...args} size="lg">
          lg · 17px, padding 30
        </Button>
        <Button {...args} size="icon" aria-label="Cerrar">
          <Close />
        </Button>
      </Row>
      <Note>
        A single control radius for all three sizes. The document stepped the
        radius 8/10/12; three radius tokens for a two-pixel difference is harder
        to defend than one control radius, so the step comes out of the document
        rather than going into the code. It is recorded in `docs/decisions.md`.
      </Note>
      <Note>
        `icon` is the document's 42×42 square. It carries no text, so it carries
        a mandatory `aria-label`.
      </Note>
    </>
  ),
};

export const Tertiary: Story = {
  name: 'Tertiary mono',
  render: () => (
    <>
      <Row>
        <Button variant="tertiary">./ver_todos →</Button>
        <Button variant="tertiary" size="sm">
          ./copiar_uso →
        </Button>
        <Button variant="tertiary" icon={<ArrowUpRight />}>
          ./abrir_en_github
        </Button>
      </Row>
      <Note>
        Haze at rest, underlined biolume with a 4px offset on hover. No horizontal
        padding and no control height: the tertiary has no box, so it lines up
        with the card's text and not with its buttons.
      </Note>
    </>
  ),
};

export const BrandRules: Story = {
  name: 'Brand rules',
  render: (args) => (
    <>
      <Block title="Rule 2 · the inverted primary">
        <Row>
          <Button {...args} variant="primary">
            Primario
          </Button>
        </Row>
        <Note>
          Switch the mode in the toolbar. In dark it is biolume with ink on top; in
          light it can be neither biolume nor sand, so it moves to solid hull.
          There is no literal hex behind it: the rule is `light:bg-brand-hull`,
          and the hover reuses `textSecondary` instead of inventing a
          `hullHover`.
        </Note>
      </Block>

      <Block title="Rule 3 · conversion, once per screen">
        <Row>
          <Button {...args} variant="conversion">
            Agenda una llamada
          </Button>
          <Button {...args} variant="secondary">
            Ver el trabajo
          </Button>
          <Button {...args} variant="tertiary">
            ./leer_después →
          </Button>
        </Row>
        <Note>
          Sand is the only variant that gets spent. Two conversion buttons on the
          same screen are not a runtime error, they are a design problem: which is
          why it is documented here and not enforced in the component.
        </Note>
      </Block>

      <Block title="The secondary is never filled">
        <Row>
          <Button {...args} variant="secondary">
            En reposo
          </Button>
        </Row>
        <Note>
          `hairlineHover` border and foam text over a transparent background; on
          hover both the border and the text move to biolume. A filled secondary
          is a badly tinted primary.
        </Note>
      </Block>
    </>
  ),
};

export const Destructive: Story = {
  name: 'The two danger variants',
  render: () => (
    <>
      <Block title="destructive · irreversible only">
        <Row>
          <Button variant="destructive">Eliminar cuenta</Button>
          <Button variant="destructiveOutline">Revocar acceso</Button>
          <Button variant="destructive" disabled>
            Eliminar cuenta
          </Button>
          <Button variant="destructiveOutline" disabled>
            Revocar acceso
          </Button>
        </Row>
        <Note>
          Only for what cannot be undone. Never for «cancel» on a form — that is
          `secondary`, and putting a destructive next to it is how the word stops
          being what carries the weight.
        </Note>
      </Block>

      <Block title="the rule it does not break">
        <Row>
          <Button variant="destructive">Eliminar curso</Button>
          <Button variant="secondary">Cancelar</Button>
        </Row>
        <Note>
          Inside an `AlertDialog` the confirm button is still NOT red: there a
          title explains what is about to happen, focus starts on cancel and
          clicking outside does not close it. The context does the work.
        </Note>
        <Note>
          It stops working in a table row. `cursos` has eight of these in row
          actions and toolbars, next to «Editar» and «Duplicar»: rendered as
          `secondary`, «Eliminar curso» looked exactly like «Cancelar» and only
          the word separated them. See `docs/decisions.md` § 21.
        </Note>
      </Block>

      <Block title="the outline one fills on hover">
        <Row>
          <Button variant="destructiveOutline">Revocar acceso</Button>
        </Row>
        <Note>
          That IS an exception to «secondary is never filled», declared rather
          than discovered. A destructive that looks identical to a secondary until
          you read it is the problem the variant exists to fix; at rest it is
          still only border and text.
        </Note>
        <Note>
          Measured, in both modes: the ink gives 6.53:1 over the fill and 7.92:1
          over the hover in dark, 5.11 and 6.61 in light. The border and text of
          the outline give 6.71 over abyss, 5.94 over surface and 4.91 over
          surfaceRaised, so it reads as text on all three.
        </Note>
      </Block>
    </>
  ),
};

export const DestructiveHover: Story = {
  name: 'The two danger variants · hover',
  parameters: { pseudo: { hover: true } },
  render: () => (
    <Row>
      <Button variant="destructive">Eliminar cuenta</Button>
      <Button variant="destructiveOutline">Revocar acceso</Button>
    </Row>
  ),
};

export const DenseIcons: Story = {
  name: 'icon-sm · a table row',
  render: () => (
    <>
      <Row>
        <Button size="icon" variant="secondary" aria-label="Cerrar">
          <Close />
        </Button>
        <Button size="icon-sm" variant="secondary" aria-label="Cerrar">
          <Close />
        </Button>
        <Button size="sm" variant="secondary">
          Editar
        </Button>
        <Button size="icon-sm" variant="destructiveOutline" aria-label="Eliminar el curso">
          <Close />
        </Button>
      </Row>
      <Note>
        42 is the right measure for a control you hit with a thumb, and the four
        reading sites are where that fits. `cursos` is the odd one out: three
        actions per table row, and at 42 the row grows with them.
      </Note>
      <Note>
        It is 32 and not 28 because 32 is `sm`'s height — a dense icon button
        lines up with a small text button, so a toolbar mixing the two stays on
        one baseline. 28 would have been a fifth height that matches nothing.
      </Note>
      <Note>
        It does not replace `icon`. A page's primary action stays at 42; this is
        for a row. And it still needs `aria-label`: it carries no text.
      </Note>
    </>
  ),
};
