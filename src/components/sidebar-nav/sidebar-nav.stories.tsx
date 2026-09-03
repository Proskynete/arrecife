import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Books,
  ChatCircleDots,
  ClipboardText,
  CreditCard,
  Heart,
  Robot,
  SquaresFour,
  Star,
  Ticket,
  Users,
} from '@phosphor-icons/react';

import { useState } from 'react';

import { Note } from '../../../stories/utils.tsx';
import { Icon } from '../../icons/index.tsx';
import { Isotype } from '../../brand/isotype.tsx';
import { Avatar, AvatarFallback } from '../../primitives/avatar.tsx';
import { Text } from '../../primitives/typography.tsx';
import { SidebarGroup, SidebarItem, SidebarNav } from './index.tsx';

const BRAND = (
  <span className="gap-step-xs text-ui flex items-center font-mono font-semibold">
    <Isotype background="dark" className="h-6" />
    cursos <span className="text-text-muted">·</span> admin
  </span>
);

/** What the wordmark becomes in the rail: the isotype on its own. */
const MARK = <Isotype background="dark" className="h-6" />;

const USER = (
  <span className="gap-step-xs flex items-center">
    <Avatar className="size-7 shrink-0">
      <AvatarFallback>EA</AvatarFallback>
    </Avatar>
    <span className="text-meta text-text-secondary min-w-0 truncate font-mono">
      eduardo@arrecife
    </span>
  </span>
);

/** The eleven sections, so the rail and the panel show the same list. */
function Sections() {
  return (
    <>
      <SidebarItem href="/admin" icon={<Icon as={SquaresFour} />} active>
        Resumen
      </SidebarItem>

      <SidebarGroup label="Contenido">
        <SidebarItem href="/admin/contenido" icon={<Icon as={Books} />}>
          Contenido
        </SidebarItem>
        <SidebarItem href="/admin/agentes" icon={<Icon as={Robot} />}>
          Agentes
        </SidebarItem>
        <SidebarItem href="/admin/resenas" icon={<Icon as={Star} />}>
          Reseñas
        </SidebarItem>
        <SidebarItem href="/admin/retos" icon={<Icon as={ClipboardText} />}>
          Retos
        </SidebarItem>
      </SidebarGroup>

      <SidebarGroup label="Alumnos">
        <SidebarItem href="/admin/alumnos" icon={<Icon as={Users} />}>
          Alumnos
        </SidebarItem>
        <SidebarItem href="/admin/reportes" icon={<Icon as={ChatCircleDots} />} badge="3">
          Reportes
        </SidebarItem>
      </SidebarGroup>

      <SidebarGroup label="Ventas">
        <SidebarItem href="/admin/ventas" icon={<Icon as={CreditCard} />}>
          Ventas
        </SidebarItem>
        <SidebarItem href="/admin/interesados" icon={<Icon as={Heart} />}>
          Interesados
        </SidebarItem>
        <SidebarItem href="/admin/cupones" icon={<Icon as={Ticket} />}>
          Cupones
        </SidebarItem>
      </SidebarGroup>
    </>
  );
}

const meta = {
  title: 'Components/SidebarNav',
  component: SidebarNav,
} satisfies Meta<typeof SidebarNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Admin: Story = {
  name: 'Blog admin',
  render: () => (
    <>
      <div className="h-80 w-56">
        <SidebarNav title="admin" version="v5.0.1" branch="main">
          <SidebarItem href="/admin/articulos" active>
            Artículos
          </SidebarItem>
          <SidebarItem href="/admin/borradores" badge="3">
            Borradores
          </SidebarItem>
          <SidebarItem href="/admin/newsletter">Newsletter</SidebarItem>
          <SidebarItem href="/admin/media">Media</SidebarItem>
        </SidebarNav>
      </div>
      <Note>
        The `▸` is set by the component, same as `NavItem`'s `./` and the
        breadcrumb's `~`. Same CLI aesthetic, same decision: the format is part of
        the piece and it is `aria-hidden`.
      </Note>
      <Note>
        The version and branch at the bottom are not decoration: in an admin they
        are the first thing anyone asks about when something looks off.
      </Note>
    </>
  ),
};

export const Panel: Story = {
  name: 'The course admin, with its blocks',
  render: () => (
    <>
      <div className="h-[36rem] w-64">
        <SidebarNav
          aria-label="Administración de cursos"
          brand={BRAND}
          user={USER}
          version="v0.6.0"
          branch="main"
        >
          <Sections />
        </SidebarNav>
      </div>

      <Note>
        Eleven items is where a flat sidebar stops being readable, and the fix is
        not a scrollbar. Each block is a nested list named by its label, so a
        screen reader says «lista Ventas, 3 elementos» instead of one list of
        eleven. The label is a paragraph and not a heading: a sidebar is
        navigation, and a heading here would land in the page's own outline.
      </Note>
      <Note>
        The icon REPLACES the `▸` rather than joining it. Two marks before a label
        is one more than the eye needs, and the prompt exists to say «this is a
        place you can go» — which a section glyph already says, and says better.
      </Note>
      <Note>
        `Resumen` sits outside any block on purpose: it is not one of a kind, it
        is the thing the blocks are a breakdown of.
      </Note>
      <Note>
        `user` is a slot for the same reason `Nav`'s user menu goes in `actions`:
        an avatar needs a session and a sign-out route, and the library takes no
        project infrastructure.
      </Note>
    </>
  ),
};

export const WithoutIcons: Story = {
  name: 'Without icons, the prompt stays',
  render: () => (
    <>
      <div className="h-80 w-56">
        <SidebarNav title="admin" version="v0.6.0" branch="main">
          <SidebarGroup label="Publicación">
            <SidebarItem href="/admin/articulos" active>
              Artículos
            </SidebarItem>
            <SidebarItem href="/admin/borradores" badge="3">
              Borradores
            </SidebarItem>
          </SidebarGroup>
          <SidebarGroup label="Difusión">
            <SidebarItem href="/admin/newsletter">Newsletter</SidebarItem>
            <SidebarItem href="/admin/media">Media</SidebarItem>
          </SidebarGroup>
        </SidebarNav>
      </div>
      <Note>
        Blocks and no icons: the `▸` comes back on every item. A reading site's
        admin has four sections and no need for a glyph per section, and it should
        not have to invent one to get the grouping.
      </Note>
      <Note>
        <Text variant="ui" tone="secondary" as="span">
          `title` is still the eyebrow AND the accessible name of the `nav`. A
          `brand` row does not replace it, because a logo is not an accessible
          name — the panel story passes `aria-label` instead.
        </Text>
      </Note>
    </>
  ),
};

/** The toggle is controlled, so the story owns the state — as a project would. */
function Collapsible({ start = false }: { start?: boolean }) {
  const [collapsed, setCollapsed] = useState(start);

  return (
    <div className="h-[36rem]">
      <SidebarNav
        aria-label="Administración de cursos"
        brand={BRAND}
        mark={MARK}
        user={
          collapsed ? (
            <Avatar className="size-7 shrink-0">
              <AvatarFallback>EA</AvatarFallback>
            </Avatar>
          ) : (
            USER
          )
        }
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        version="v0.6.0"
        branch="main"
      >
        <Sections />
      </SidebarNav>
    </div>
  );
}

export const Expanded: Story = {
  name: 'Collapsible · open',
  render: () => (
    <>
      <Collapsible />
      <Note>
        Press the chevron. The width comes from `w-sidebar` and `w-sidebar-rail`,
        which are the component's only when it can collapse: the layout beside it
        has to reserve one of the two and cannot know which.
      </Note>
      <Note>
        It does NOT transition. The system's only transition animates colour and
        border, and a rail that slides is the entrance animation this library does
        not have — the same call as the `Switch` knob, which changes position
        without moving.
      </Note>
    </>
  ),
};

export const Rail: Story = {
  name: 'Collapsible · the rail',
  render: () => (
    <>
      <Collapsible start />
      <Note>
        The names are still there. Collapsed they go to `sr-only` and are not
        removed: a rail of bare glyphs with no accessible name is a list called
        «enlace, enlace, enlace», and the person who most needs the label is the
        one who cannot see the icon that replaced it. The badge on `Reportes` goes
        the same way.
      </Note>
      <Note>
        The block labels become a rule. They have nowhere to go in a rail, but
        they stay in the accessibility tree naming their list, so «lista Ventas,
        3 elementos» survives the collapse.
      </Note>
      <Note>
        `brand` is hidden and `mark` takes its place: a wordmark does not fit in a
        rail, and the component cannot trim somebody else's markup. The version
        and branch go too — they are the one thing here that can wait for the
        panel to be open again.
      </Note>
      <Note>
        This is the rail the backlog ruled out, and the reason it ruled it out was
        that the system had no navigation icons, so a collapsed rail would have
        shown each section's initial. That reason is gone. See
        `docs/decisions.md` § 34.
      </Note>
    </>
  ),
};
