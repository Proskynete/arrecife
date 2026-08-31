import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota } from '../../../stories/utils.tsx';
import { TableOfContents, type Entrada } from './index.tsx';

const meta = {
  title: 'Componentes/TableOfContents',
  component: TableOfContents,
  args: {
    activeHref: '#la-arquitectura',
    items: [
      { href: '#el-problema', label: 'El problema' },
      { href: '#la-arquitectura', label: 'La arquitectura' },
      { href: '#el-contrato', label: 'El contrato de rutas', nested: true },
      { href: '#cuando-no', label: 'Cuándo NO usarlos' },
      { href: '#el-marco', label: 'El marco de decisión' },
    ],
  },
} satisfies Meta<typeof TableOfContents>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  name: 'Básico',
  render: (args) => (
    <div className="max-w-60">
      <TableOfContents {...args} />
      <Nota>
        Es un `nav` con nombre accesible propio. En una página que ya tiene la
        barra del sitio y las migas, un tercer grupo de enlaces sin nombre es
        indistinguible de los otros dos para quien navega por landmarks.
      </Nota>
      <Nota>
        La sección activa lleva `aria-current="location"` además del color: no se
        puede comunicar solo con bioluz.
      </Nota>
    </div>
  ),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: (args) => (
    <div className="max-w-60">
      <TableOfContents {...args} />
      <Nota>
        Con el ratón encima de todas: la activa se queda en bioluz. Las clases del
        activo llevan las dos variantes juntas —`aria-[current]:hover:`— para que
        ganen por especificidad y no por el orden en que Tailwind emita las
        reglas.
      </Nota>
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
function MarcadoDesdeFuera({ items }: { items: readonly Entrada[] }) {
  // Lo que hace el script de scroll-spy del sitio: poner el atributo en el
  // enlace visible. React no se entera y no tiene por qué.
  const marcar = (nodo: HTMLDivElement | null) => {
    nodo?.querySelector('a[href="#el-contrato"]')?.setAttribute('aria-current', 'true');
  };

  return (
    <div className="max-w-60" ref={marcar}>
      <TableOfContents items={items} />
      <Nota>
        Aquí `activeHref` no se pasa: el atributo lo pone un script, como hace el
        blog con quince líneas y cero JavaScript de framework. El estilo lo aplica
        la variante `aria-[current]:`, así que el resultado es el mismo que
        controlado.
      </Nota>
      <Nota>
        El gancho es la PRESENCIA del atributo. Para desmarcar se quita; no se
        pone `aria-current="false"`.
      </Nota>
    </div>
  );
}

export const SinControlar: Story = {
  name: 'Sin controlar, con el atributo puesto a mano',
  render: (args) => <MarcadoDesdeFuera items={args.items} />,
};
