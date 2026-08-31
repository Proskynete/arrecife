import { createElement, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  OG,
  plantillaArticulo,
  plantillaCharla,
  plantillaCurso,
  plantillaDefecto,
  type NodoSatori,
} from '../src/og/index.ts';
import { Text } from '../src/index.ts';

const meta = {
  title: 'Marca/Plantillas OG',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;

/**
 * Andamiaje de la story, no de la librería.
 *
 * Las plantillas devuelven el árbol que espera Satori — `{ type, props }` —, que
 * es estructuralmente lo mismo que un elemento de React sin su `$$typeof`. Este
 * conversor existe solo para poder verlas en el navegador; en producción el
 * árbol va directo a `satori()` y no pasa por React en ningún momento.
 */
function aReact(nodo: NodoSatori | string | null | undefined | false, clave?: number): ReactNode {
  if (!nodo) return null;
  if (typeof nodo === 'string') return nodo;

  const { children, ...resto } = nodo.props;
  const hijos = Array.isArray(children)
    ? children.map((h, i) => aReact(h as NodoSatori, i))
    : aReact(children as NodoSatori);

  return createElement(nodo.type, { ...resto, key: clave }, hijos);
}

function Lienzo({ titulo, nodo }: { titulo: string; nodo: NodoSatori }) {
  return (
    <figure className="mb-section">
      <Text variant="eyebrow" tone="muted" as="figcaption" className="mb-step-sm">
        {titulo} · {OG.width}×{OG.height}
      </Text>
      {/* Se escala a la mitad para que quepan las cuatro sin desplazarse. El
          `transform` no cambia el layout, así que el nodo sigue midiendo 1200 y
          hay que decírselo: sin `width` y `flexShrink: 0` se encoge a la caja. */}
      <div
        className="border-hairline overflow-hidden border"
        style={{ width: OG.width / 2, height: OG.height / 2 }}
      >
        <div
          style={{
            transform: 'scale(0.5)',
            transformOrigin: 'top left',
            width: OG.width,
            height: OG.height,
            flexShrink: 0,
            display: 'flex',
          }}
        >
          {aReact(nodo)}
        </div>
      </div>
    </figure>
  );
}

export const Todas: StoryObj = {
  name: 'Las cuatro',
  render: () => (
    <div className="bg-background text-text-primary font-sans px-step-xl py-step-xl min-h-screen">
      <Text as="h1" variant="h2" className="mb-step-sm">
        Plantillas OG
      </Text>
      <Text variant="body" tone="secondary" className="mb-section">
        Se generan con Satori, así que consumen `tokens` y el catálogo de la
        marca —dato puro— y no componentes de React. Es exactamente el caso que
        justifica la pureza de `src/tokens/`: si un token dependiera de un
        componente, este módulo no podría existir.
      </Text>
      <Text variant="ui" tone="secondary" measure className="mb-section">
        La retícula es UNA: eyebrow arriba, titular a la izquierda, firma abajo y
        la mascota anclada a la derecha. Lo único que cambia entre las tres
        primeras es el fondo y qué pose entra. La de por defecto es la excepción
        declarada del documento y trae retícula propia.
      </Text>
      <Text variant="ui" tone="secondary" measure className="mb-section">
        La aleta NO es un parámetro: espuma en las tres oscuras, dos azules en la
        de curso, y la elige el modo de la plantilla. El documento avisa de que es
        el error más fácil de cometer en un generador «porque el fondo es un
        parámetro» — aquí no hay forma de pedir la combinación mala.
      </Text>

      <Lienzo
        titulo="artículo · degradado 145°, categoría y lectura en arena, cara a la derecha"
        nodo={plantillaArticulo({
          title: 'El camino hacia mi primera charla internacional',
          category: 'engineering-culture',
          readingMinutes: 8,
        })}
      />
      <Lienzo
        titulo="curso · la única en claro, pose completa a la izquierda"
        nodo={plantillaCurso({
          title: 'Microfrontends sin dolor',
          modules: 6,
          duration: '4h 20m',
          pose: 'laptop-coffee',
        })}
      />
      <Lienzo
        titulo="charla · eyebrow bioluz con evento y año, pose sangrando"
        nodo={plantillaCharla({
          title: 'Microfrontends sin dolor',
          event: 'CaribeConf',
          year: 2026,
          summary: 'Cómo escalar React —y tu equipo— sin romperlo todo.',
          location: 'Barranquilla, Colombia · agosto 2026',
        })}
      />
      <Lienzo
        titulo="por defecto · retícula propia, aleta con halo y divisor en x=290"
        nodo={plantillaDefecto()}
      />
    </div>
  ),
};
