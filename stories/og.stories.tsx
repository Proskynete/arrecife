import { createElement, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  OG,
  articleTemplate,
  talkTemplate,
  courseTemplate,
  defaultTemplate,
  type SatoriNode,
} from '../src/og/index.ts';
import { Text } from '../src/index.ts';

const meta = {
  title: 'Brand/OG templates',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;

/**
 * Story scaffolding, not library code.
 *
 * The templates return the tree Satori expects — `{ type, props }` — which is
 * structurally the same as a React element without its `$$typeof`. This converter
 * exists only so they can be seen in the browser; in production the tree goes
 * straight to `satori()` and never passes through React.
 */
function toReact(node: SatoriNode | string | null | undefined | false, key?: number): ReactNode {
  if (!node) return null;
  if (typeof node === 'string') return node;

  const { children, ...rest } = node.props;
  const kids = Array.isArray(children)
    ? children.map((child, i) => toReact(child as SatoriNode, i))
    : toReact(children as SatoriNode);

  return createElement(node.type, { ...rest, key: key }, kids);
}

function Canvas({ title, node }: { title: string; node: SatoriNode }) {
  return (
    <figure className="mb-section">
      <Text variant="eyebrow" tone="muted" as="figcaption" className="mb-step-sm">
        {title} · {OG.width}×{OG.height}
      </Text>
      {/* Scaled to half so all four fit without scrolling. The `transform` does
          not change layout, so the node still measures 1200 and it has to be told:
          without `width` and `flexShrink: 0` it shrinks to the box. */}
      <div
        className="border-hairline overflow-hidden border"
        style={{ width: OG.width / 2, height: OG.height / 2 }}
      >
        <div
          style={{
            transform: 'scale(0.5)',
            transformOrigin: 'top left',
            width: OG.width,
            height: OG.height,
            flexShrink: 0,
            display: 'flex',
          }}
        >
          {toReact(node)}
        </div>
      </div>
    </figure>
  );
}

export const All: StoryObj = {
  name: 'All four',
  render: () => (
    <div className="bg-background text-text-primary font-sans px-step-xl py-step-xl min-h-screen">
      <Text as="h1" variant="h2" className="mb-step-sm">
        Plantillas OG
      </Text>
      <Text variant="body" tone="secondary" className="mb-section">
        They are generated with Satori, so they consume `tokens` and the brand
        catalog — pure data — and not React components. It is exactly the case that
        justifies the purity of `src/tokens/`: if a token depended on a
        component, este módulo no podría existir.
      </Text>
      <Text variant="ui" tone="secondary" measure className="mb-section">
        There is ONE grid: eyebrow on top, headline on the left, signature at the
        bottom and the mascot anchored right. The only things that change between the
        first three are the background and which pose comes in. The default one is
        the document's declared exception and brings a grid of its own.
      </Text>
      <Text variant="ui" tone="secondary" measure className="mb-section">
        The fin is NOT a parameter: foam in the three dark ones, two blues in the
        course one, and it is chosen by the template's mode. The document warns that
        it is the easiest mistake to make in a generator «because the background is a
        parameter» — here there is no way to ask for the bad combination.
      </Text>

      <Canvas
        title="article · 145° gradient, category and reading time in sand, face on the right"
        node={articleTemplate({
          title: 'El camino hacia mi primera charla internacional',
          category: 'engineering-culture',
          readingMinutes: 8,
        })}
      />
      <Canvas
        title="course · the only light one, full pose on the left"
        node={courseTemplate({
          title: 'Microfrontends sin dolor',
          modules: 6,
          duration: '4h 20m',
          pose: 'laptop-coffee',
        })}
      />
      <Canvas
        title="talk · biolume eyebrow with event and year, pose bleeding off"
        node={talkTemplate({
          title: 'Microfrontends sin dolor',
          event: 'CaribeConf',
          year: 2026,
          summary: 'Cómo escalar React —y tu equipo— sin romperlo todo.',
          location: 'Barranquilla, Colombia · agosto 2026',
        })}
      />
      <Canvas
        title="default · its own grid, haloed fin and a divider at x=290"
        node={defaultTemplate()}
      />
    </div>
  ),
};
