import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note } from '../../../stories/utils.tsx';
import { Button } from '../../primitives/button.tsx';
import { tagline } from '../../tokens/tokens.ts';
import { Hero } from './index.tsx';

const meta = {
  title: 'Components/Hero',
  component: Hero,
  parameters: { layout: 'fullscreen' },
  args: {
    eyebrow: 'consultoría',
    title: tagline.long,
    description:
      'Trabajo con equipos que crecieron más rápido que su arquitectura. Empiezo por leer el código y termino hablando con quien lo escribió.',
    pose: 'surf',
  },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: 'Basic',
  render: (args) => (
    <div className="p-step-lg">
      <Hero
        {...args}
        action={
          <>
            <Button variant="conversion">Agenda una llamada</Button>
            <Button variant="tertiary">./ver_el_trabajo →</Button>
          </>
        }
      />
      <Note>
        ONE per site. It is the only piece that gets spent like the conversion
        button, and for the same reason: if there are two, there are none.
      </Note>
      <Note>
        The gradient comes from `--gradient-hero`, so it follows the mode and there
        is no hand-written angle in any project. Switch the theme in the toolbar:
        the document only gave the dark values, and the light ones are composed from
        the light palette with the same angle and the same stops.
      </Note>
      <Note>
        Text at 62 % of the width and the pose bleeding off the bottom-right
        corner, never centred. Narrow the window: on mobile there is no edge to
        bleed off, so the pose drops into the flow below the buttons instead of
        disappearing.
      </Note>
    </div>
  ),
};

export const NoPose: Story = {
  name: 'No pose',
  args: { pose: undefined },
  render: (args) => (
    <div className="p-step-lg">
      <Hero {...args} action={<Button variant="conversion">Agenda una llamada</Button>} />
      <Note>
        Valid, but it is a panel with text. The pose is half of what makes a hero
        recognisable as this site and not as any other.
      </Note>
    </div>
  ),
};

export const Centered: Story = {
  name: 'Centred variant',
  args: { variant: 'centered' },
  render: (args) => (
    <div className="p-step-lg">
      <Hero
        {...args}
        eyebrow="enlaces"
        title="Eduardo Álvarez"
        description="Everything lo que publico, en un sitio."
        action={<Button variant="secondary">Ver el blog</Button>}
      />
      <Note>
        The system's rule is that the pose is NEVER centred, and it is still true
        for a header with more page below it: there, a centred mascot under the
        headline is a cover illustration.
      </Note>
      <Note>
        A links page is another case: it is centred end to end and the mascot is
        the protagonist. That project skipped `Hero` entirely over this, which is
        worse — a rule with a name can be argued with, a copy of the gradient in
        another repo just drifts.
      </Note>
      <Note>
        The pose goes ABOVE the headline, not below: that way it still does not
        read as the illustration closing a block of text.
      </Note>
    </div>
  ),
};
