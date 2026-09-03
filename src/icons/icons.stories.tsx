import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  GraduationCap,
  Trophy,
  Ticket,
  MagnifyingGlass,
  Trash,
  Minus as PhosphorMinus,
} from '@phosphor-icons/react';

import { Block, Note, Row, Stack } from '../../stories/utils.tsx';
import { Minus } from '../lib/glyphs.tsx';
import { Rss } from '../social/index.tsx';
import { Button } from '../primitives/button.tsx';
import { Text } from '../primitives/typography.tsx';
import { Stat } from '../components/stat/index.tsx';
import { EmptyState } from '../components/empty-state/index.tsx';
import { Icon } from './index.tsx';

const meta = {
  title: 'Icons/Icon',
  component: Icon,
  args: { as: GraduationCap },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizing: Story = {
  name: 'It measures 1em, so nobody picks a number',
  render: () => (
    <>
      <Stack>
        {(['h3', 'body', 'ui', 'label'] as const).map((variant) => (
          <Text key={variant} variant={variant} as="p" className="gap-step-xs flex items-center">
            <Icon as={GraduationCap} />
            {variant}
          </Text>
        ))}
      </Stack>
      <Note>
        The same icon four times, with nothing set on it. It takes the size of the
        text it sits in — 25px beside `h3`, 13px beside `label` — which is the
        contract every icon in this library already follows, including the ones a
        component receives through a prop.
      </Note>
      <Note>
        The admin panel was sizing them by hand in five ways: `size-4` twenty-six
        times, then `size-3.5`, `size-3`, `size-6` and `size-7`, with no rule
        behind any of them. That is what this replaces.
      </Note>
    </>
  ),
};

export const Weight: Story = {
  name: 'regular IS the document\'s stroke',
  render: () => (
    <>
      <Block title="the three weights, beside the two families the library already draws">
        <Stack>
          {(['light', 'regular', 'bold'] as const).map((weight) => (
            <Text key={weight} variant="h3" as="p" className="gap-step-sm flex items-center">
              <span className="text-meta w-16 shrink-0 font-mono">{weight}</span>
              <PhosphorMinus weight={weight} size="1em" aria-hidden="true" />
              <Minus />
              <PhosphorMinus weight={weight} size="1em" aria-hidden="true" />
              <Rss />
              <PhosphorMinus weight={weight} size="1em" aria-hidden="true" />
            </Text>
          ))}
        </Stack>
      </Block>

      <Note>
        The bars alternate a Phosphor `Minus` with, first, the library's own
        `Minus` from `lib/glyphs.tsx` and then the `Rss` from `./social`. The
        middle row is the one to read: at `regular` the Phosphor bar and the
        social one are the same line, and the glyph between them is visibly
        heavier than both.
      </Note>
      <Note>
        The numbers, measured on the `Minus` path itself. Phosphor bakes the
        weight into the path instead of exposing a `strokeWidth`, so its regular
        bar has radius 8 on a 256 grid: **16/256 = 0.0625em**. The document says
        «funcionales en trazo 1.6» on a 24 grid: **1.6/24 = 0.0667em**. Six per
        cent apart, which is no pixel on any screen — nothing had to be derived
        and no number had to be invented.
      </Note>
      <Note>
        `lib/glyphs.tsx` is the outlier at **1.75/16 = 0.109em**, three quarters
        heavier than both. It is deliberately not reconciled here: aligning it
        restyles every primitive in the library and is its own change. See
        `docs/decisions.md` § 29.
      </Note>
    </>
  ),
};

export const Sample: Story = {
  name: 'The set at the system\'s weight',
  render: () => (
    <>
      <Row>
        <Text variant="h3" as="p" className="gap-step-md flex items-center">
          <Icon as={GraduationCap} />
          <Icon as={Trophy} />
          <Icon as={Ticket} />
          <Icon as={MagnifyingGlass} />
          <Icon as={Trash} />
        </Text>
      </Row>
      <Note>
        Domain icons for an admin panel, which is what seventy-seven of the
        eighty-nine are. The library ships none of them and is not going to: what
        it ships is the line they are drawn with.
      </Note>
    </>
  ),
};

export const Naming: Story = {
  name: 'Decorative by default, named when it is alone',
  render: () => (
    <>
      <Block title="decorative · the label is right there">
        <Row>
          <Text variant="ui" as="p" className="gap-step-xs flex items-center">
            <Icon as={Trophy} />
            248 diplomas emitidos
          </Text>
        </Row>
      </Block>

      <Block title="named · it is the only thing there">
        <Row>
          <Text variant="ui" as="p" className="gap-step-xs flex items-center">
            <Icon as={Ticket} label="Cupón aplicado" />
          </Text>
        </Row>
      </Block>

      <Block title="inside a control · the name goes on the BUTTON">
        <Row>
          <Button size="icon-sm" variant="secondary" aria-label="Borrar la fila">
            <Icon as={Trash} />
          </Button>
        </Row>
      </Block>

      <Note>
        Without `label` the icon gets `aria-hidden`, which is the right default:
        most icons sit beside their own text and announcing them twice is noise.
        With it the icon becomes an `img` with a name.
      </Note>
      <Note>
        Inside a button with no text the name belongs on the button and not on the
        icon — that is what `Button size="icon"` already asks for. Two names on one
        control is one more than a screen reader can use.
      </Note>
    </>
  ),
};

export const InComponents: Story = {
  name: 'Where they actually go',
  render: () => (
    <>
      <div className="gap-step-md grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] items-start">
        <Stat
          icon={<Icon as={Trophy} />}
          label="diplomas emitidos"
          value="248"
          tone="achievement"
          delta={{ value: '+18 este mes', direction: 'up' }}
        />
        <EmptyState
          variant="inline"
          icon={<Icon as={MagnifyingGlass} className="text-h3" />}
          title="No hay reportes que coincidan"
          description="Los filtros activos no dejan pasar ninguno."
        />
      </div>
      <Note>
        `Stat`'s `icon` and `EmptyState`'s `icon` were always `ReactNode` slots so
        the project could pass its own. Nothing about them changed: what changed is
        that there is now one right way to draw what goes in them.
      </Note>
    </>
  ),
};
