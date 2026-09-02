import type { Meta, StoryObj } from '@storybook/react-vite';

import { Block, Row, Note } from '../../stories/utils.tsx';
import { Badge, CategoryBadge, MetricBadge } from './badge.tsx';

const meta = { title: 'Primitives/Badge', component: Badge } satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

const STATES = ['neutral', 'accent', 'warm', 'success', 'warning', 'error'] as const;

/** Los del documento, con su text real. */
const REAL = [
  { text: 'Publicado', variant: 'success' },
  { text: 'Borrador', variant: 'neutral' },
  { text: 'Fallo de build', variant: 'error' },
  { text: 'Archivado', variant: 'neutral' },
  { text: 'Nuevo', variant: 'accent' },
  { text: 'En vivo', variant: 'warm' },
] as const;

const CATEGORIES = ['engineering-culture', 'arquitectura', 'liderazgo', 'carrera'] as const;

export const Families: Story = {
  name: 'The three families',
  render: () => (
    <>
      <Block title="category · mono pill in sand">
        <Row>
          {CATEGORIES.map((c) => (
            <CategoryBadge key={c} active={c === 'arquitectura'}>
              {c}
            </CategoryBadge>
          ))}
        </Row>
        <Note>
          They are slugs, so they read `engineering-culture` in lowercase. The
          filled one is not decorative: it is the only indicator of the active
          filter in the article listing, which is why it is the `active` prop and
          not a `className` at the call site.
        </Note>
      </Block>

      <Block title="status · square r6, sans 12.5/500, background at 8 %">
        <Row>
          {REAL.map((e) => (
            <Badge key={e.text} variant={e.variant}>
              {e.text}
            </Badge>
          ))}
        </Row>
        <Note>
          It is the alert recipe at word size: the semantic color at 8 % as
          background and nothing else. Square at `chip` radius, not a pill — the
          shape is what separates it from a category at a metre's distance.
        </Note>
        <Note>
          No border. It had one for a while and it was heavy: a bordered box next
          to a title reads as a control and not as a datum. The text uses
          `textPrimary` and not the tone's color — switch the mode in the toolbar:
          in light the semantics are calibrated to pass JUST over paper, so over
          their own tint they fall to 4.10–4.40 and fail AA.
        </Note>
        <Note>
          The tone is never the only carrier of meaning: the label spells out
          «Publicado» or «Borrador» in full.
        </Note>
      </Block>

      <Block title="metric · mono, no box, no transform">
        <Row>
          <MetricBadge>8 min de lectura</MetricBadge>
          <MetricBadge>6 módulos</MetricBadge>
          <MetricBadge>pose-laptop-coffee.png</MetricBadge>
          <MetricBadge boxed>v5.0.1</MetricBadge>
        </Row>
        <Note>
          None of the three is small-capped. The `uppercase` all of them carried
          came from `text-eyebrow`, which is the overline's scale and not the
          badges': it turned a slug into `ENGINEERING-CULTURE` and a file name into
          one that does not exist.
        </Note>
      </Block>
    </>
  ),
};

export const Status: Story = {
  render: () => (
    <Row>
      {STATES.map((v) => (
        <Badge key={v} variant={v}>
          {v}
        </Badge>
      ))}
    </Row>
  ),
};

export const Category: Story = {
  name: 'Category',
  render: () => (
    <Row>
      {CATEGORIES.map((c) => (
        <CategoryBadge key={c} active={c === 'arquitectura'}>
          {c}
        </CategoryBadge>
      ))}
    </Row>
  ),
};

export const Metric: Story = {
  name: 'Metric',
  render: () => (
    <Row>
      <MetricBadge>8 min de lectura</MetricBadge>
      <MetricBadge>18 ago 2026</MetricBadge>
      <MetricBadge boxed>v5.0.1</MetricBadge>
    </Row>
  ),
};
