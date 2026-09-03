import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note } from '../../../stories/utils.tsx';
import { Logo } from '../../brand/logo.tsx';
import { Button } from '../../primitives/button.tsx';
import { Text } from '../../primitives/typography.tsx';
import { ThemeToggle } from '../theme-toggle/index.tsx';
import { Nav, NavItem } from './index.tsx';

/** A `~/cursos` wordmark, which is what `brand` is a slot for. */
function SectionBrand({ section }: { section: string }) {
  return (
    <a href="/" className="gap-step-xs text-meta flex items-center font-mono font-semibold">
      <Logo background="dark" className="h-6" />
      <span>
        <span className="text-accent">~/</span>
        {section}
      </span>
    </a>
  );
}

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

export const AppShell: Story = {
  name: 'Compact · a bar that shares the screen with a sidebar',
  render: () => (
    <div className="-m-step-lg">
      <Nav
        size="compact"
        brand={<SectionBrand section="cursos" />}
        actions={
          <>
            <ThemeToggle />
            <Button size="sm">Entrar</Button>
          </>
        }
      >
        <NavItem href="/cursos" active>
          cursos
        </NavItem>
      </Nav>

      <div className="px-step-md py-step-xl max-w-wide mx-auto">
        <Note>
          56px instead of 64. It is not «a smaller bar because it looks better»:
          at 64 the header of an app shell competes with the rail beside it for
          the same corner, and the two together eat the top of the content area.
          Same reasoning as `Button size="icon-sm"` — the one admin app of the
          five is denser than the four reading sites.
        </Note>
        <Note>
          It is a prop and not a `className` because the height lives on the inner
          container, which never sees one. Passing `h-14` from outside did
          nothing, silently.
        </Note>
        <Note>
          The 64px default is in `Basic`, and the two are deliberately NOT shown
          in one story: `Nav` renders the site's `banner` landmark, and two
          banners on one page is an accessibility failure. The suite said so
          before this note existed.
        </Note>
        <Note>
          Everything else here is composition, not new API. The `~/cursos`
          wordmark is a `brand` slot, and the «Entrar» button — a user menu, when
          there is a session — is an `actions` slot. Session state does not get a
          prop of its own: it is project infrastructure, which is what the third
          clause of the admission criterion excludes. See `docs/decisions.md`
          § 30.
        </Note>
      </div>
    </div>
  ),
};
