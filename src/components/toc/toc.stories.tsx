import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note } from '../../../stories/utils.tsx';
import { TableOfContents, type TocEntry } from './index.tsx';

const meta = {
  title: 'Components/TableOfContents',
  component: TableOfContents,
  args: {
    activeHref: '#la-arquitectura',
    items: [
      { href: '#el-problema', label: 'El problema' },
      { href: '#la-arquitectura', label: 'La arquitectura' },
      { href: '#el-contrato', label: 'El contrato de paths', nested: true },
      { href: '#cuando-no', label: 'Cuándo NO usarlos' },
      { href: '#el-marco', label: 'El marco de decisión' },
    ],
  },
} satisfies Meta<typeof TableOfContents>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: 'Basic',
  render: (args) => (
    <div className="max-w-60">
      <TableOfContents {...args} />
      <Note>
        It is a `nav` with an accessible name of its own. On a page that already
        has the site bar and the breadcrumb, a third group of links with no name is
        indistinguishable from the other two for anyone navigating by landmarks.
      </Note>
      <Note>
        The active section carries `aria-current="location"` as well as the color:
        it cannot be communicated in biolume alone.
      </Note>
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: (args) => (
    <div className="max-w-60">
      <TableOfContents {...args} />
      <Note>
        With the mouse over all of them: the active one stays in biolume. The
        active classes carry both variants together — `aria-[current]:hover:` — so
        they win by specificity and not by the order Tailwind emits the rules in.
      </Note>
    </div>
  ),
};

export const Focus: Story = {
  parameters: { pseudo: { focusVisible: true } },
  render: (args) => (
    <div className="max-w-60">
      <TableOfContents {...args} />
    </div>
  ),
};

/**
 * El caso que obligaba a hidratar el índice como isla de React en cada artículo.
 */
function MarkedFromOutside({ items }: { items: readonly TocEntry[] }) {
  // What the site's scroll-spy script does: put the attribute on the visible
  // link. React never finds out and does not need to.
  const mark = (node: HTMLDivElement | null) => {
    node?.querySelector('a[href="#el-contrato"]')?.setAttribute('aria-current', 'true');
  };

  return (
    <div className="max-w-60" ref={mark}>
      <TableOfContents items={items} />
      <Note>
        `activeHref` is not passed here: the attribute is set by a script, the way
        the blog does it in fifteen lines and zero framework JavaScript. The style
        is applied by the `aria-[current]:` variant, so the result is the same as
        controlled.
      </Note>
      <Note>
        The hook is the PRESENCE of the attribute. To unmark it you remove it; you
        do not set `aria-current="false"`.
      </Note>
    </div>
  );
}

export const Uncontrolled: Story = {
  name: 'Uncontrolled, attribute set by hand',
  render: (args) => <MarkedFromOutside items={args.items} />,
};
