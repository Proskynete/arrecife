import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note } from '../../../stories/utils.tsx';
import { Logo } from '../../brand/logo.tsx';
import { Button } from '../../primitives/button.tsx';
import { Text } from '../../primitives/typography.tsx';
import { ThemeToggle } from '../theme-toggle/index.tsx';
import { Nav, NavItem } from './index.tsx';

const meta = {
  title: 'Components/Nav',
  component: Nav,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Nav>;

export default meta;
type Story = StoryObj<typeof meta>;

const SECTIONS = ['artículos', 'cursos', 'charlas', 'sobre-mí'] as const;

export const Basic: Story = {
  name: 'Basic',
  render: () => (
    <div className="-m-step-lg">
      <Nav
        brand={<Logo background="dark" className="h-7" />}
        actions={<Button variant="conversion">Agenda una llamada</Button>}
      >
        {SECTIONS.map((s) => (
          <NavItem key={s} href={`/${s}`} active={s === 'artículos'}>
            {s}
          </NavItem>
        ))}
      </Nav>

      <div className="px-step-md py-section max-w-wide mx-auto">
        <Text variant="body" tone="secondary" measure>
          Baja la página para ver el desenfoque. La barra es abismo al 86 % con
          14px de desenfoque detrás, y el alfa va sobre el token, así que en mode
          claro es papel al 86 % sin tocar una línea.
        </Text>
        <div className="h-[120vh]" />
      </div>
    </div>
  ),
};

export const Format: Story = {
  name: 'The ./ is set by the component',
  render: () => (
    <div className="-m-step-lg">
      <Nav brand={<Logo background="dark" className="h-7" />}>
        {SECTIONS.map((s) => (
          <NavItem key={s} href={`/${s}`} active={s === 'cursos'}>
            {s}
          </NavItem>
        ))}
      </Nav>
      <div className="p-step-lg">
        <Note>
          Whoever uses the component writes `artículos`, not `./artículos`. It is
          the same decision as the tertiary button: the format is part of the piece
          and not a convention to be remembered across five projects. The `./` is
          `aria-hidden`, so a screen reader announces «artículos».
        </Note>
        <Note>
          The active one is biolume with a 1px underline and `aria-current="page"`.
          Color cannot be the only indicator, and the underline is what goes with
          it.
        </Note>
      </div>
    </div>
  ),
};

export const AsOnTheSite: Story = {
  name: 'The real site bar',
  render: () => (
    <div className="-m-step-lg">
      <Nav
        brand={<Logo background="dark" withTagline />}
        actions={
          <>
            <Button variant="tertiary" size="icon" aria-label="Buscar">
              <span aria-hidden="true">⌕</span>
            </Button>
            <ThemeToggle />
          </>
        }
      >
        <NavItem href="#" active>
          artículos
        </NavItem>
        <NavItem href="#">charlas</NavItem>
        <NavItem href="#">cursos</NavItem>
        <NavItem href="#">sobre_mí</NavItem>
        <NavItem href="#">hablemos</NavItem>
      </Nav>

      <div className="p-step-lg">
        <Note>
          The items go on the RIGHT, next to the actions. With the brand on the
          left and the items right behind it, the navigation block floats in the
          middle and the eye crosses the gap twice.
        </Note>
        <Note>
          The `~/` is the prompt and it sits outside the `li`s: putting it inside
          would turn it into one more element of the navigation list, and that list
          has to have exactly as many elements as there are sections.
        </Note>
        <Note>
          The current section goes in brackets as well as in biolume and
          underlined. The color and the underline are the same signal; brackets are
          how a terminal marks the active path and they do not depend on telling
          colors apart.
        </Note>
        <Note>
          The brand carries `withTagline`: the tagline comes from `tagline.short`
          and cannot be passed as a prop, for the same reason as the wordmark.
        </Note>
      </div>
    </div>
  ),
};
