import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note } from '../../../stories/utils.tsx';
import { SidebarItem, SidebarNav } from './index.tsx';

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
