/**
 * Las cuatro plantillas de Open Graph, 1200×630.
 *
 * NO son componentes de React. Devuelven el árbol de elementos que Satori
 * espera —`{ type, props }`— construido solo con tokens y con el catálogo de la
 * marca, que es dato puro. Este módulo se puede importar desde un worker, un
 * script de build o una función de borde sin montar nada.
 *
 * Es el caso que justifica la restricción de `src/tokens/`: si un token hubiera
 * terminado dependiendo de un componente, este archivo no existiría.
 *
 * LA RETÍCULA ES UNA, del documento: eyebrow arriba, titular a la izquierda,
 * firma abajo y la mascota anclada a la derecha. Lo único que cambia entre
 * plantillas es el fondo y qué pose entra. Por eso no hay cuatro maquetaciones
 * aquí: hay una, y tres parámetros.
 *
 *   lienzo 1200×630 · margen 64
 *   eyebrow  mono 20 · tracking 0.12em
 *   titular  display 800 · 58 · máx 3 líneas al 70 % del ancho
 *   firma    mono 21 · con la aleta a 34
 *   mascota  anclada a la derecha · alto máx 430
 *
 * La de por defecto es la excepción declarada: retícula propia de dos columnas
 * con la aleta a 200 y divisor en x=290, y Geist 72/700 y 28/400 en vez de la
 * display. Está en el documento como excepción, así que está aquí como función
 * aparte y no como un `if` dentro de la común.
 *
 * LA ALETA NO ES UN PARÁMETRO. El documento avisa de que «es el error más fácil
 * de cometer en un generador, porque el fondo es un parámetro»: espuma en las
 * tres plantillas oscuras, dos azules en la de curso. Aquí la elige el modo de
 * la plantilla, igual que `Isotipo` la elige con `sobre`. No hay forma de pedir
 * la combinación mala.
 *
 * El titular se trunca a 3 líneas con elipsis y NUNCA baja de tamaño: un titular
 * a 44 y otro a 58 en el mismo feed se ven como dos marcas distintas.
 *
 * Las imágenes llevan `alt=''`. Satori no lo necesita —pinta a SVG—, pero la
 * mascota y la aleta SON decorativas aquí: lo que la tarjeta dice es el titular,
 * y el `alt` de una OG lo pone el `<meta property="og:image:alt">` de la página.
 * Además, la story las monta como `<img>` de verdad y sin `alt` no pasan axe.
 *
 * Uso:
 *
 *   import satori from 'satori';
 *   import { plantillaArticulo, OG } from '@eduardoalvarez/arrecife/og';
 *
 *   const svg = await satori(plantillaArticulo({ title, category, readingMinutes }), {
 *     width: OG.width,
 *     height: OG.height,
 *     fonts: [...],
 *   });
 */
import { aletas, caras, poses, RUTA_ASSETS, type Cara, type Pose } from '../brand/catalogo.ts';
import { dark, fonts, gradient, light, naming, tagline, typeScale } from '../tokens/tokens.ts';

/* -------------------------------------------------------------------- tipos */

export type NodoSatori = {
  type: string;
  props: Record<string, unknown> & {
    style?: Record<string, string | number>;
    children?: Hijo | readonly Hijo[];
  };
};

type Hijo = NodoSatori | string | null | undefined | false;

/** El lienzo y la retícula. Son las medidas de producción. */
export const OG = {
  width: 1200,
  height: 630,
  margen: 64,
  /** Alto máximo de la mascota. */
  mascota: 430,
  /** La aleta de la firma. */
  aletaFirma: 34,
  /**
   * Hueco que deja la columna cuando la pose va a la izquierda (curso).
   *
   * Son 560 y no 420 porque una pose completa a 430 de alto mide ~534 de ancho:
   * con el hueco justo, el tiburón se comía el titular. La reserva se mide por
   * el ancho real de la pose, no por el margen.
   */
  reservaMascota: 560,
} as const;

export type DatosBase = {
  title: string;
  /**
   * Dónde se sirven los PNG. Satori no lee del disco: en un worker esto tiene
   * que ser una URL absoluta o un `data:` URI.
   */
  basePath?: string | undefined;
};

/* ----------------------------------------------------------------- helpers */

function el(
  type: string,
  props: Record<string, unknown>,
  children?: Hijo | readonly Hijo[],
): NodoSatori {
  return { type, props: children === undefined ? props : { ...props, children } };
}

/**
 * Satori exige `display: flex` explícito en cualquier caja con más de un hijo:
 * no hay flujo de bloques. Esto lo pone una vez.
 */
function caja(style: Record<string, string | number>, children?: Hijo | readonly Hijo[]) {
  return el('div', { style: { display: 'flex', ...style } }, children);
}

function texto(style: Record<string, string | number>, contenido: string) {
  return el('div', { style: { display: 'flex', ...style } }, contenido);
}

/** El antetítulo: mono 20, versalitas, tracking 0.12em. */
function eyebrow(contenido: string, color: string) {
  return texto(
    {
      fontFamily: fonts.mono,
      fontSize: 20,
      letterSpacing: typeScale.eyebrow.tracking,
      textTransform: 'uppercase',
      color,
    },
    contenido,
  );
}

/**
 * El titular. Display 800 a 58, tres líneas y elipsis.
 *
 * `WebkitLineClamp` es lo que Satori entiende para truncar; sin él un título
 * largo empuja la firma fuera del lienzo.
 */
function titular(contenido: string, color: string) {
  return texto(
    {
      fontFamily: fonts.display,
      fontSize: 58,
      fontWeight: 800,
      lineHeight: 1.06,
      letterSpacing: typeScale.h1.tracking,
      color,
      // 70 % del LIENZO, no de la columna. Con la mascota en su propia columna
      // el 70 % relativo daba ~400px y el titular se truncaba a media palabra.
      maxWidth: OG.width * 0.7,
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 3,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    contenido,
  );
}

/** La firma: la aleta a 34 y el texto en mono 21. */
function firma(contenido: string, color: string, modo: 'oscuro' | 'claro', base: string) {
  return caja({ alignItems: 'center', gap: 14 }, [
    el('img', { alt: '',
      src: `${base}/${modo === 'oscuro' ? aletas.espuma : aletas.color}`,
      height: OG.aletaFirma,
      style: { height: OG.aletaFirma },
    }),
    texto({ fontFamily: fonts.mono, fontSize: 21, color }, contenido),
  ]);
}

/**
 * La retícula compartida. Tres de las cuatro plantillas son esto con otro fondo
 * y otra pieza de mascota.
 */
function tarjeta(opciones: {
  modo: 'oscuro' | 'claro';
  fondo: string;
  eyebrow: { texto: string; color: string };
  title: string;
  /** Línea bajo el titular, opcional. */
  bajada?: string | undefined;
  firma: string;
  firmaColor: string;
  base: string;
  /** La pieza de la derecha, ya montada. */
  mascota?: NodoSatori | null | undefined;
  /** `curso` la pone a la izquierda: es la única que invierte la retícula. */
  mascotaIzquierda?: boolean | undefined;
  tinta: string;
  tintaSecundaria: string;
}): NodoSatori {
  /**
   * La mascota se ANCLA al borde, no ocupa una columna.
   *
   * Es lo que dice el documento —«anclada a la derecha», «sangra por la
   * esquina»— y además es lo único que deja al titular medir el 70 % del
   * lienzo: con la mascota compitiendo por el ancho, el titular se quedaba en
   * un tercio y se truncaba a media palabra. El titular ocupa la franja de
   * arriba y la mascota la esquina de abajo, así que no chocan.
   */
  const columna = caja(
    {
      position: 'relative',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
      height: '100%',
      padding: OG.margen,
      // Cuando la pose va a la izquierda hay que dejarle el hueco: es lo único
      // que cambia de la retícula, y solo lo hace la plantilla de curso.
      paddingLeft: opciones.mascotaIzquierda ? OG.reservaMascota : OG.margen,
    },
    [
      eyebrow(opciones.eyebrow.texto, opciones.eyebrow.color),
      caja({ flexDirection: 'column', gap: 18 }, [
        titular(opciones.title, opciones.tinta),
        opciones.bajada
          ? texto(
              {
                fontFamily: fonts.sans,
                fontSize: 26,
                color: opciones.tintaSecundaria,
                maxWidth: OG.width * 0.7,
              },
              opciones.bajada,
            )
          : null,
      ]),
      firma(opciones.firma, opciones.firmaColor, opciones.modo, opciones.base),
    ],
  );

  return caja(
    {
      position: 'relative',
      width: OG.width,
      height: OG.height,
      backgroundImage: opciones.fondo,
      backgroundColor: opciones.modo === 'oscuro' ? dark.background : light.background,
      fontFamily: fonts.sans,
      overflow: 'hidden',
    },
    [
      opciones.mascota
        ? caja(
            {
              position: 'absolute',
              bottom: 0,
              ...(opciones.mascotaIzquierda ? { left: 0 } : { right: 0 }),
              alignItems: 'flex-end',
            },
            opciones.mascota,
          )
        : null,
      columna,
    ],
  );
}

function mascotaPose(pose: Pose, base: string, alto = OG.mascota) {
  return el('img', { alt: '', src: `${base}/${poses[pose]}`, height: alto, style: { height: alto } });
}

/* ------------------------------------------------------------- plantillas */

export type DatosArticulo = DatosBase & {
  /** El slug de la categoría. Va en arena, en versalitas. */
  category?: string | undefined;
  readingMinutes?: number | undefined;
  /**
   * La cara, «según el tono del texto». No hay defecto pensado como neutro:
   * `hearts` es la que el manual asigna al OG de artículo.
   */
  expresion?: Cara | undefined;
};

/** Artículo · degradado 145° sobre abismo, categoría y lectura en arena. */
export function plantillaArticulo(datos: DatosArticulo): NodoSatori {
  const base = datos.basePath ?? RUTA_ASSETS;
  const cara = datos.expresion ?? 'hearts';
  const meta = [datos.category, datos.readingMinutes ? `${datos.readingMinutes} min` : undefined]
    .filter(Boolean)
    .join(' · ');

  return tarjeta({
    modo: 'oscuro',
    fondo: gradient.dark.og,
    eyebrow: { texto: meta || 'artículo', color: dark.warm },
    title: datos.title,
    firma: naming.domain,
    firmaColor: dark.textSecondary,
    base,
    tinta: dark.textPrimary,
    tintaSecundaria: dark.textSecondary,
    mascota: el('img', { alt: '',
      src: `${base}/${caras[cara]}`,
      height: 300,
      style: { height: 300, marginBottom: OG.margen, marginRight: OG.margen },
    }),
  });
}

export type DatosCurso = DatosBase & {
  modules?: number | undefined;
  duration?: string | undefined;
  /** El dominio del pie. Por defecto, el subdominio de cursos. */
  url?: string | undefined;
  pose?: Pose | undefined;
};

/**
 * Curso · LA ÚNICA PLANTILLA EN CLARO.
 *
 * Pose completa a la izquierda —invierte la retícula—, eyebrow y URL en arena
 * oscura, y por tanto la aleta a dos azules. Esa última parte no se decide aquí:
 * sale de que el modo es claro.
 */
export function plantillaCurso(datos: DatosCurso): NodoSatori {
  const base = datos.basePath ?? RUTA_ASSETS;
  const meta = [datos.modules ? `${datos.modules} módulos` : undefined, datos.duration]
    .filter(Boolean)
    .join(' · ');

  return tarjeta({
    modo: 'claro',
    fondo: gradient.light.og,
    eyebrow: { texto: 'nuevo curso', color: light.warm },
    title: datos.title,
    bajada: meta || undefined,
    firma: datos.url ?? `cursos.${naming.domain}`,
    firmaColor: light.warm,
    base,
    tinta: light.textPrimary,
    tintaSecundaria: light.textSecondary,
    mascotaIzquierda: true,
    mascota: mascotaPose(datos.pose ?? 'desk', base),
  });
}

export type DatosCharla = DatosBase & {
  event?: string | undefined;
  year?: string | number | undefined;
  location?: string | undefined;
  summary?: string | undefined;
  pose?: Pose | undefined;
};

/** Charla · eyebrow en bioluz con evento y año, pose sangrando por la esquina. */
export function plantillaCharla(datos: DatosCharla): NodoSatori {
  const base = datos.basePath ?? RUTA_ASSETS;
  const cabeza = ['charla', datos.event, datos.year].filter(Boolean).join(' · ');
  const pie = [datos.location, datos.event ? undefined : naming.domain].filter(Boolean).join(' · ');

  return tarjeta({
    modo: 'oscuro',
    fondo: 'none',
    eyebrow: { texto: cabeza, color: dark.accent },
    title: datos.title,
    bajada: datos.summary,
    firma: pie || naming.domain,
    firmaColor: dark.textSecondary,
    base,
    tinta: dark.textPrimary,
    tintaSecundaria: dark.textSecondary,
    // Sangra: se sale por abajo y por la derecha, como la portada de slide.
    mascota: el('img', { alt: '',
      src: `${base}/${poses[datos.pose ?? 'surf']}`,
      height: 470,
      style: { height: 470, marginBottom: -46, marginRight: -36 },
    }),
  });
}

export type DatosDefecto = Omit<DatosBase, 'title'> & {
  /** El nombre. Por defecto, el wordmark. */
  title?: string | undefined;
  description?: string | undefined;
};

/**
 * Por defecto · la excepción declarada del documento.
 *
 * Retícula propia de dos columnas: la aleta en bioluz a 200 con halo, divisor en
 * x=290 y Geist 72/700 y 28/400 — NO la display. No comparte casco con las otras
 * tres porque el documento dice que la define el generador, no la tabla.
 */
export function plantillaDefecto(datos: DatosDefecto = {}): NodoSatori {
  const base = datos.basePath ?? RUTA_ASSETS;

  return caja(
    {
      width: OG.width,
      height: OG.height,
      alignItems: 'center',
      backgroundColor: dark.background,
      fontFamily: fonts.sans,
    },
    [
      // Columna de la aleta: 290 de ancho, que es donde cae el divisor.
      caja(
        { width: 290, height: '100%', alignItems: 'center', justifyContent: 'center' },
        // El halo. Un círculo de bioluz al 12 % detrás de la aleta.
        caja(
          {
            width: 260,
            height: 260,
            borderRadius: 999,
            backgroundColor: `${dark.accent}1F`,
            alignItems: 'center',
            justifyContent: 'center',
          },
          el('img', { alt: '', src: `${base}/${aletas.espuma}`, height: 200, style: { height: 200 } }),
        ),
      ),

      // El divisor, exactamente en x=290.
      caja({ width: 1, height: 340, backgroundColor: dark.border }),

      caja(
        { flexDirection: 'column', gap: 20, paddingLeft: OG.margen, paddingRight: OG.margen, flex: 1 },
        [
          texto(
            { fontFamily: fonts.sans, fontSize: 72, fontWeight: 700, color: dark.textPrimary, lineHeight: 1.05 },
            datos.title ?? naming.wordmark,
          ),
          texto(
            { fontFamily: fonts.sans, fontSize: 28, fontWeight: 400, color: dark.textSecondary, lineHeight: 1.4 },
            datos.description ?? tagline.corto,
          ),
        ],
      ),
    ],
  );
}

/** El casco compartido, por si un proyecto necesita una quinta plantilla. */
export { tarjeta as plantillaBase };
