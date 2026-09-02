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
        There is no danger variant. The system's error lives in alerts and in
        field validation, not in a red button: a destructive one goes into the
        document first and in here second.
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
