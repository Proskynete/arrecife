import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

/**
 * Todo por el barril público. Una story es el mejor sitio para comprobar que la
 * superficie que se publica exporta lo que dice exportar: si algo desaparece de
 * `src/index.ts`, el catálogo deja de compilar antes que el consumidor.
 */
import {
  aletas,
  caras,
  CaraDeMascota,
  Button,
  Card,
  Code,
  Isotipo,
  listaCaras,
  listaPoses,
  Logo,
  Mascota,
  MetricBadge,
  naming,
  poses,
  RUTA_ASSETS,
  Text,
  type Cara,
} from '../src/index.ts';

const meta = {
  title: 'Marca/Assets',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;

/* --------------------------------------------------------------- andamiaje */

function Seccion({ titulo, nota, children }: { titulo: string; nota?: ReactNode; children: ReactNode }) {
  return (
    <section className="mb-section">
      <Text as="h2" variant="h2" className="mb-xs">
        {titulo}
      </Text>
      {nota ? (
        <Text variant="ui" tone="secondary" measure className="mb-lg">
          {nota}
        </Text>
      ) : null}
      {children}
    </section>
  );
}

/**
 * Copia al portapapeles el fragmento de uso, que es para lo que se viene aquí.
 *
 * La zona de previsualización declara su propio tema. Sin eso, la ficha «sobre
 * claro» se vería sobre abismo cuando la página está en oscuro, y no demostraría
 * nada: justo lo que la regla 1 existe para evitar.
 */
function Ficha({
  nombre,
  archivo,
  codigo,
  children,
  tema = 'dark',
  fondo = 'bg-background',
}: {
  nombre: string;
  archivo: string;
  codigo: string;
  children: ReactNode;
  tema?: 'dark' | 'light';
  fondo?: string;
}) {
  const [copiado, setCopiado] = useState(false);

  return (
    <Card className="overflow-hidden">
      <div data-theme={tema} className={`${fondo} p-md flex min-h-36 items-center justify-center`}>
        {children}
      </div>
      <div className="border-hairline p-sm gap-xs flex flex-col border-t">
        <Text variant="label" as="p">
          {nombre}
        </Text>
        <Text variant="meta" tone="secondary" as="p">
          {archivo}
        </Text>
        <Button
          size="sm"
          variant="tertiary"
          className="mt-xs justify-start"
          onClick={() => {
            void navigator.clipboard.writeText(codigo).then(
              () => setCopiado(true),
              () => undefined,
            );
          }}
        >
          {copiado ? './copiado ✓' : './copiar_uso →'}
        </Button>
      </div>
    </Card>
  );
}

const rejilla = 'gap-md grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))]';

function Pagina({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-text-primary font-sans px-xl py-xl min-h-screen">
      <div className="max-w-wide mx-auto">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ stories */

export const Todo: StoryObj = {
  name: 'Catálogo',
  render: () => (
    <Pagina>
      <Text variant="eyebrow" tone="accent" as="p" className="mb-sm">
        arrecife · marca
      </Text>
      <Text as="h1" variant="h1" className="mb-md">
        Tiburoncín
      </Text>
      <Text variant="body" tone="secondary" className="mb-section">
        Trece piezas, consolidadas desde los cinco proyectos. Se publican en el
        paquete bajo <Code>./assets/brand/</Code> y se sirven
        en <Code>{RUTA_ASSETS}</Code>, que es la misma ruta
        que ya usan todos desde su <Code>public/</Code>. Los
        nombres están tipados: escribe una pose que no existe y no compila.
      </Text>

      <Seccion
        titulo="La aleta"
        nota={
          <>
            El cuerpo de la aleta es casi negro, así que sobre fondo oscuro la
            variante de dos azules desaparece. Por eso <Code>sobre</Code> es
            una prop y no una nota en una guía: la silueta a una tinta se elige sola.
          </>
        }
      >
        <div className={rejilla}>
          <Ficha
            nombre="sobre oscuro"
            archivo={aletas.espuma}
            tema="dark"
            codigo={'<Isotipo sobre="oscuro" />'}
          >
            <Isotipo sobre="oscuro" className="h-16" />
          </Ficha>
          <Ficha
            nombre="sobre claro"
            archivo={aletas.color}
            tema="light"
            codigo={'<Isotipo sobre="claro" />'}
          >
            <Isotipo sobre="claro" className="h-16" />
          </Ficha>
        </div>
      </Seccion>

      <Seccion
        titulo="El logo"
        nota={
          <>
            El wordmark siempre dice «{naming.wordmark}» y sale del token, no de una
            prop. {naming.mascot} nunca aparece escrito dentro del logo.
          </>
        }
      >
        <div className={rejilla}>
          <Ficha nombre="completo, sobre oscuro" archivo="fin-foam.png + wordmark" tema="dark" codigo={'<Logo sobre="oscuro" />'}>
            <Logo sobre="oscuro" />
          </Ficha>
          <Ficha nombre="completo, sobre claro" archivo="fin.png + wordmark" tema="light" codigo={'<Logo sobre="claro" />'}>
            <Logo sobre="claro" />
          </Ficha>
          <Ficha nombre="solo isotipo" archivo="fin-foam.png" tema="dark" codigo={'<Logo sobre="oscuro" soloIsotipo />'}>
            <Logo sobre="oscuro" soloIsotipo />
          </Ficha>
        </div>
      </Seccion>

      <Seccion
        titulo={`Caras · ${listaCaras.length}`}
        nota={
          <>
            Solo en estados vacíos, confirmaciones, errores, progreso de curso y
            celebración. Nunca en hero, precios, servicios, contacto ni CV. Por eso
            <Code>EmptyState</Code> recibe una cara y <Code>PageHeader</Code> no.
          </>
        }
      >
        <div className={rejilla}>
          {listaCaras.map((expresion) => (
            <Ficha
              key={expresion}
              nombre={expresion}
              archivo={caras[expresion]}
              codigo={`<CaraDeMascota expresion="${expresion}" />`}
            >
              <CaraDeMascota expresion={expresion} className="max-w-20" />
            </Ficha>
          ))}
        </div>
      </Seccion>

      <Seccion titulo={`Poses · ${listaPoses.length}`}>
        <div className={rejilla}>
          {listaPoses.map((pose) => (
            <Ficha key={pose} nombre={pose} archivo={poses[pose]} codigo={`<Mascota pose="${pose}" />`}>
              <Mascota pose={pose} className="max-w-40" />
            </Ficha>
          ))}
        </div>
      </Seccion>

      <Seccion
        titulo="Cómo se consume"
        nota="Los nombres son un tipo, así que el autocompletado los ofrece y un nombre inventado no compila."
      >
        <Card className="p-md gap-sm flex flex-col">
          <Text variant="meta" tone="secondary" as="p">
            import {'{'} Logo, Mascota, CaraDeMascota, listaCaras {'}'} from
            &apos;@eduardoalvarez/arrecife/brand&apos;;
          </Text>
          <div className="gap-xs flex flex-wrap">
            {listaCaras.map((c: Cara) => (
              <MetricBadge key={c} boxed>
                {c}
              </MetricBadge>
            ))}
            {listaPoses.map((p) => (
              <MetricBadge key={p} boxed>
                {p}
              </MetricBadge>
            ))}
          </div>
        </Card>
      </Seccion>
    </Pagina>
  ),
};

export const Caras: StoryObj = {
  name: 'Solo las caras',
  render: () => (
    <Pagina>
      <div className={rejilla}>
        {listaCaras.map((expresion) => (
          <Ficha
            key={expresion}
            nombre={expresion}
            archivo={caras[expresion]}
            codigo={`<CaraDeMascota expresion="${expresion}" />`}
          >
            <CaraDeMascota expresion={expresion} className="max-w-20" />
          </Ficha>
        ))}
      </div>
    </Pagina>
  ),
};

export const Poses: StoryObj = {
  name: 'Solo las poses',
  render: () => (
    <Pagina>
      <div className={rejilla}>
        {listaPoses.map((pose) => (
          <Ficha key={pose} nombre={pose} archivo={poses[pose]} codigo={`<Mascota pose="${pose}" />`}>
            <Mascota pose={pose} className="max-w-40" />
          </Ficha>
        ))}
      </div>
    </Pagina>
  ),
};
