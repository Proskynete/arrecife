import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota } from '../../../stories/utils.tsx';
import { SidebarItem, SidebarNav } from './index.tsx';

const meta = {
  title: 'Componentes/SidebarNav',
  component: SidebarNav,
} satisfies Meta<typeof SidebarNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Admin: Story = {
  name: 'Admin del blog',
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
      <Nota>
        El `▸` lo pone el componente, igual que el `./` de `NavItem` y el `~` del
        breadcrumb. Misma estética CLI, misma decisión: el formato es parte de la
        pieza y va `aria-hidden`.
      </Nota>
      <Nota>
        La versión y la rama al pie no son decoración: en un admin es lo primero
        que se pregunta cuando algo se ve raro.
      </Nota>
    </>
  ),
};
