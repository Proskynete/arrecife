import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota } from '../../../stories/utils.tsx';
import { Logo } from '../../brand/logo.tsx';
import { Correo, Discord, GitHub, Instagram, LinkedIn, Rss, X, YouTube } from '../../lib/social.tsx';
import { Footer, FooterLink } from './index.tsx';

const meta = {
  title: 'Componentes/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Los ocho del sistema. `aria-label` es obligatorio en el tipo `Red`: son iconos
 * sin texto visible, así que no se puede construir uno sin nombre accesible.
 */
const REDES = [
  { label: 'GitHub', href: 'https://github.com/Proskynete', icon: <GitHub /> },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: <LinkedIn /> },
  { label: 'X', href: 'https://x.com/Proskynete', icon: <X /> },
  { label: 'Instagram', href: 'https://instagram.com', icon: <Instagram /> },
  { label: 'Discord', href: 'https://discord.com', icon: <Discord /> },
  { label: 'YouTube', href: 'https://youtube.com', icon: <YouTube /> },
  { label: 'RSS', href: '/rss.xml', icon: <Rss /> },
  { label: 'Escríbeme', href: 'mailto:soy@eduardoalvarez.dev', icon: <Correo /> },
] as const;

export const Basico: Story = {
  name: 'Básico',
  render: () => (
    <div className="-m-step-lg">
      <Footer social={REDES} />

      <div className="p-step-lg">
        <Nota>
          Solo iconos, sin texto de red al lado. Iconos a 19px en plancton,
          separación de 18px y hover en bioluz. El `aria-label` es lo que
          reemplaza al texto visible, y por eso es obligatorio en el tipo — no se
          puede construir una red sin nombre.
        </Nota>
        <Nota>
          Las seis marcas van en SÓLIDO y los dos funcionales —RSS y correo— en
          trazo de 1.6. Es una regla de dibujo, no de estilo: el logo de GitHub no
          existe en outline, y un símbolo funcional en este sistema se dibuja con
          línea.
        </Nota>
        <Nota>
          Viven en `lib/social.tsx` y no en `glyphs.tsx`. Aquel es el juego mínimo
          que necesitan los primitivos y no crece; este es un inventario de
          terceros que sí va a cambiar cuando cambien las redes.
        </Nota>
        <Nota>
          La firma sale de `naming.domain`. El `$` va en bioluz y `aria-hidden`,
          porque es el prompt y no parte del texto.
        </Nota>
      </div>
    </div>
  ),
};

export const Iconos: Story = {
  name: 'Los ocho iconos',
  render: () => (
    <div className="p-step-lg gap-step-lg flex flex-wrap items-center text-[28px]">
      {REDES.map((r) => (
        <span key={r.label} className="text-text-muted gap-step-sm flex items-center">
          {r.icon}
          <span className="text-meta font-mono">{r.label}</span>
        </span>
      ))}
    </div>
  ),
};

export const ConMarca: Story = {
  name: 'Con la fila de marca',
  render: () => (
    <div className="-m-step-lg">
      <Footer brand={<Logo />} social={REDES}>
        <FooterLink href="/rss.xml">./rss</FooterLink>
        <FooterLink href="/aviso-legal">./aviso-legal</FooterLink>
      </Footer>

      <div className="p-step-lg">
        <Nota>
          La marca tiene ranura propia. Antes acababa dentro de `children` con un
          `w-full` para que se llevara su propia línea: funcionaba y era un apaño,
          porque la marca no es un enlace de texto más.
        </Nota>
        <Nota>
          Y la firma comparte línea CON LA MARCA, que es la primera fila. Colgada
          de la fila de redes —como estaba en la 0.5.0— caía a la tercera línea en
          cuanto el pie tenía marca y enlaces encima.
        </Nota>
      </div>
    </div>
  ),
};

export const FirmaALaDerecha: Story = {
  name: 'La firma va a la derecha',
  render: () => (
    <div className="-m-step-lg">
      <Footer social={REDES} />

      <div className="p-step-lg">
        <Nota>
          Iconos a la izquierda, firma a la derecha, en la MISMA línea. La firma
          lleva `ml-auto` y no basta con `justify-between`: sin redes, un
          `justify-between` la dejaría pegada al borde izquierdo.
        </Nota>
        <Nota>
          Aquí la primera fila son los iconos, así que la firma se alinea con
          ellos. No está pegada a las redes: está pegada a la primera fila que
          exista, sea la que sea.
        </Nota>
        <Nota>
          En pantalla estrecha las dos partes se parten con `flex-wrap` en vez de
          apretarse. La firma es mono y no se puede truncar sin que deje de
          leerse como una ruta.
        </Nota>
      </div>
    </div>
  ),
};

export const SoloFirma: Story = {
  name: 'Sin redes, la firma sigue a la derecha',
  render: () => (
    <div className="-m-step-lg">
      <Footer />
    </div>
  ),
};

/*
 * Van en DOS stories y no en una con los dos pies: `<footer>` es el landmark
 * `contentinfo`, y dos en el mismo documento es una violación —axe la señaló al
 * primer intento—. Un pie de página no se compara poniendo dos.
 */
export const PrimeraFilaEsLaMarca: Story = {
  name: 'Primera fila · la marca',
  render: () => (
    <div className="-m-step-lg">
      <Footer brand={<Logo />} social={REDES}>
        <FooterLink href="/rss.xml">./rss</FooterLink>
        <FooterLink href="/aviso-legal">./aviso-legal</FooterLink>
      </Footer>

      <div className="p-step-lg">
        <Nota>
          Con marca, la firma comparte línea con la marca. Es la diferencia entre
          «la firma va a la derecha» y «la firma va a la derecha DEL TODO».
        </Nota>
      </div>
    </div>
  ),
};

export const PrimeraFilaSonLosEnlaces: Story = {
  name: 'Primera fila · los enlaces',
  render: () => (
    <div className="-m-step-lg">
      <Footer social={REDES}>
        <FooterLink href="/rss.xml">./rss</FooterLink>
        <FooterLink href="/aviso-legal">./aviso-legal</FooterLink>
      </Footer>

      <div className="p-step-lg">
        <Nota>
          Sin marca, la primera fila son los enlaces y la firma se alinea con
          ellos. No está pegada a ninguna fila concreta: está pegada a la primera
          que exista.
        </Nota>
      </div>
    </div>
  ),
};
