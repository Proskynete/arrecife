import type { Meta, StoryObj } from '@storybook/react-vite';

import { Block, Row, Note } from '../../../stories/utils.tsx';
import { themeScript } from '../../theme/index.ts';
import { ThemeToggle } from './index.tsx';

const meta = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: 'Basic',
  render: (args) => (
    <div>
      <Row>
        <ThemeToggle {...args} />
      </Row>
      <Note>
        In Storybook the theme is driven by the toolbar, so pressing here changes
        it and the selector above stays where it was. In a real project there are
        not two sources: `data-theme` on the {'<html>'} decides.
      </Note>
      <Note>
        The icon you see is the TARGET one: the sun in dark, the moon in light.
        Both are always in the DOM and the spare one is hidden by the `light:`
        variant, which is what stops the server and the client from disagreeing.
      </Note>
      <Note>
        The accessible name is «Cambiar de tema» and it does not change with the
        mode. Saying «switch to light» would be more informative and would be false
        half the time: the HTML is fixed by the server, which does not know what the
        reader chose.
      </Note>
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: (args) => <ThemeToggle {...args} />,
};

export const Focus: Story = {
  parameters: { pseudo: { focusVisible: true } },
  render: (args) => <ThemeToggle {...args} />,
};

export const Variants: Story = {
  render: () => (
    <div>
      <Block title="secondary · the default">
        <ThemeToggle />
      </Block>
      <Block title="tertiary · for a header with no boxes">
        <ThemeToggle variant="tertiary" />
      </Block>
      <Note>
        It inherits `Button`'s variants because it is a button, not a new piece.
        `conversion` is not meant for this: it gets spent once per screen, and not
        on the theme control.
      </Note>
    </div>
  ),
};

export const TheScript: Story = {
  name: 'The <head> script',
  render: () => (
    <div className="gap-step-md flex flex-col">
      <Note>
        The hard part is not the button: it is that the first paint already comes
        out in the right theme. This goes INLINE in the {'<head>'}, before the
        stylesheets, and it is imported from `@eduardoalvarez/arrecife/theme`, which
        brings no React.
      </Note>
      <pre
        data-theme="dark"
        className="rounded-card bg-brand-hull p-step-md text-chip text-text-primary overflow-x-auto font-mono"
      >
        {themeScript}
      </pre>
      <Note>
        The last line is the one both projects kept forgetting: Astro's view
        transitions replace the whole {'<html>'}, so without `astro:after-swap` the
        theme is lost on navigation.
      </Note>
    </div>
  ),
};
