import type { Meta, StoryObj } from '@storybook/react-vite';

import { Block, Note } from '../../../stories/utils.tsx';
import { NewsletterForm } from './index.tsx';

const meta = {
  title: 'Components/NewsletterForm',
  component: NewsletterForm,
  args: {
    title: 'Un email cada dos semanas',
    description:
      'Lo que aprendí escalando equipos, escrito en short. Sin resúmenes de noticias y sin lanzamientos.',
    disclaimer: 'Sin spam. Te das de baja en un clic.',
    expression: 'wink',
  },
} satisfies Meta<typeof NewsletterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  name: 'The four states',
  render: (args) => (
    <>
      <Block title="idle">
        <NewsletterForm {...args} state="idle" />
      </Block>

      <Block title="sending · fields disabled, button at 60 %">
        <NewsletterForm {...args} state="sending" />
      </Block>

      <Block title="success · the notice goes BELOW, the field stays">
        <NewsletterForm {...args} state="success" />
      </Block>

      <Block title="error">
        <NewsletterForm {...args} state="error" />
      </Block>

      <Note>
        The notice does not replace the form. Replacing it is what almost everyone
        does and it is what breaks the real case: somebody subscribes with the wrong
        email and then has nowhere to type it again.
      </Note>
      <Note>
        Both notices use the SECOND recipe — `emphasis="strong"`, background at
        10 % and a solid border — because they sit directly under a field that
        already has a border. With the subtle recipe, the two lines read as a single
        box.
      </Note>
      <Note>
        The «sin spam» is one of the contract's seven places where a face may
        appear.
      </Note>
    </>
  ),
};

export const Rest: Story = { args: { state: 'idle' } };
export const Sending: Story = { args: { state: 'sending' } };
export const Success: Story = { name: 'Éxito', args: { state: 'success' } };
export const Error: Story = { args: { state: 'error' } };

export const WithName: Story = {
  name: 'With name field',
  args: { nameField: true, nameInputProps: { minLength: 2, maxLength: 50 } },
  render: (args) => (
    <>
      <NewsletterForm {...args} />
      <Note>
        With two fields, they split the line and the button drops: three controls
        in a row leave the email at a width an email does not fit in.
      </Note>
      <Note>
        It is not a styling prop. The portfolio's endpoint validates name and email
        and answers 400 if the first is missing, so a one-field form there was not
        poorer: it sent something the server rejects.
      </Note>
      <Note>
        The library does NOT validate the name. This story's `minLength` and
        `maxLength` arrive through `nameInputProps`: the rule belongs to the project
        and to the server that actually checks it, and copying it here would be two
        sources drifting apart in silence.
      </Note>
    </>
  ),
};
