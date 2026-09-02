import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Block, Note } from '../../../stories/utils.tsx';
import { Mascot } from '../../brand/mascot.tsx';
import { NewsletterForm } from './index.tsx';

const meta = {
  title: 'Components/NewsletterForm',
  component: NewsletterForm,
  args: {
    title: 'Un email cada dos semanas',
    description:
      'Lo que aprendí escalando equipos, escrito en corto. Sin resúmenes de noticias y sin lanzamientos.',
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

export const WithAside: Story = {
  name: 'With the illustration',
  args: {
    aside: <Mascot pose="desk" className="mx-auto w-56 md:w-64" />,
  },
  render: (args) => (
    <>
      <NewsletterForm {...args} />
      <Note>
        The pose is a second column INSIDE the panel, not something positioned on
        top of it. Before this slot the blog placed it absolutely and reserved
        room with a hand-written `md:pr-[330px]` — a number measured off the
        image's width, with nothing keeping the two in step.
      </Note>
      <Note>
        It only becomes a column from `md` up. Narrow the window: below that it
        goes back into the flow, for the same reason `Hero`'s pose does.
      </Note>
      <Note>
        It comes AFTER the form in the DOM, so reading and tab order reach the
        field first. An illustration ahead of the thing it decorates is one more
        stop between the reader and the input.
      </Note>
    </>
  ),
};

export const FieldErrors: Story = {
  name: 'One message per field',
  args: {
    nameField: true,
    fieldErrors: {
      name: 'El nombre necesita al menos dos letras.',
      email: 'Falta el dominio del correo.',
    },
  },
  render: (args) => (
    <>
      <NewsletterForm {...args} />
      <Note>
        With one bad field the general alert already names it, because the API
        sends Zod's first message. With two bad at once only one of them was ever
        seen — this is the case `fieldErrors` exists for.
      </Note>
      <Note>
        Each message is tied to its field with `aria-describedby` and the input is
        marked `aria-invalid`, so a screen reader hears which field is red and
        why. The label is NOT tinted: the border and the message are already in
        `error`, and a third red is the rule from `Form` all over again.
      </Note>
      <Note>
        `errorMessage` still covers what belongs to the form as a whole — the 409,
        the network failure — and both can show at the same time.
      </Note>
    </>
  ),
};

export const Behaviour: StoryObj = {
  name: 'resetOnSuccess and onFieldChange',
  render: () => {
    function Demo() {
      const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
      return (
        <NewsletterForm
          title="Un email cada dos semanas"
          disclaimer="Suscríbete y mira qué pasa con el campo."
          expression="wink"
          state={state}
          onSubmitEmail={() => setState('success')}
          onFieldChange={() => setState('idle')}
        />
      );
    }
    return (
      <>
        <Demo />
        <Note>
          Subscribe: on success the field empties itself. With it still full, the
          same email invites a second submission. The blog worked around it by
          finding the `form` with a `ref` on the container and calling `reset()`,
          because the component exposed no form.
        </Note>
        <Note>
          The reset hangs off `state` and not off the submit: the component does
          not know whether the request succeeded until the project says so.
          Emptying on submit would clear the field on the way to a 400, which is
          the case the notice going BELOW the form exists to protect.
        </Note>
        <Note>
          Type again and the notice goes away: that is `onFieldChange`. Before, the
          blog hung an `onInput` off the `section` and relied on the event
          bubbling — which works, and works by an implementation detail.
        </Note>
      </>
    );
  },
};
