import type { Meta, StoryObj } from '@storybook/react-vite';

import { FieldLabel, Row, Note } from '../../stories/utils.tsx';
import { Switch } from './switch.tsx';

const meta = { title: 'Primitives/Switch', component: Switch } satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

const withLabel = (args: Parameters<NonNullable<Story['render']>>[0]) => (
  <Row>
    <Switch id="theme" {...args} />
    <FieldLabel htmlFor="theme">Modo claro</FieldLabel>
  </Row>
);

export const Default: Story = { render: withLabel };
export const Active: Story = { args: { checked: true }, render: withLabel };
export const Hover: Story = { parameters: { pseudo: { hover: true } }, render: withLabel };
export const Focus: Story = { parameters: { pseudo: { focusVisible: true } }, render: withLabel };
export const Disabled: Story = { args: { disabled: true }, render: withLabel };

export const NoAnimation: Story = {
  name: 'No animation',
  render: (args) => (
    <>
      {withLabel(args)}
      <Note>
        The knob changes position when switched on, but it does not slide: the
        position IS the state, not a transition. The only thing that transitions is
        the track's color, in 150ms ease-out.
      </Note>
    </>
  ),
};
