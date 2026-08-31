/**
 * El tema, sin React.
 *
 * La librería define TODO el sistema de temas —`@custom-variant light`, los
 * bloques `[data-theme]`, la paleta de los dos modos— y hasta ahora no exponía
 * lo que lo cambia. `eduardoalvarez.dev` y `links` lo reimplementaban por
 * separado, cada uno con su `localStorage` y su `astro:after-swap`.
 *
 * Este subpaquete no importa React a propósito, igual que `./tokens`, `./og` y
 * `./shiki`: los dos proyectos que más lo necesitan son Astro y uno de ellos no
 * envía JavaScript de framework. Lo que se publica aquí es lo difícil del
 * componente —evitar el parpadeo de la primera pintura y que la elección
 * sobreviva a la navegación—, no el botón. El botón es `ThemeToggle`, vive en la
 * raíz y usa esto por dentro.
 *
 * `check-package-exports.mjs` verifica que `./tema` no arrastra React en el
 * `dist/` publicado, igual que las otras tres subrutas portables.
 */

/** Los dos modos. El oscuro es el primario y es el default del sistema. */
export type Tema = 'dark' | 'light';

/**
 * La clave de `localStorage`.
 *
 * Va con el nombre de la librería porque el `localStorage` es del origen, no
 * del proyecto: un `theme` a secas colisiona con el de cualquier otra cosa que
 * viva en el mismo dominio.
 */
export const TEMA_CLAVE = 'arrecife-tema';

/** El atributo que leen los bloques `[data-theme]` de `theme.css`. */
export const TEMA_ATRIBUTO = 'data-theme';

/**
 * El evento que se emite cuando el tema cambia.
 *
 * Existe porque `storage` solo avisa a las OTRAS pestañas: en la que hizo el
 * cambio, nada notifica, y un sitio con dos controles de tema —la cabecera y el
 * pie— se quedaría con uno de los dos mostrando el icono equivocado.
 */
export const TEMA_EVENTO = 'arrecife:tema';

const esTema = (valor: unknown): valor is Tema => valor === 'dark' || valor === 'light';

/**
 * El tema que hay puesto ahora mismo, leído del DOM.
 *
 * Del DOM y no de `localStorage` a propósito: el script de la cabecera ya
 * resolvió la preferencia guardada contra la del sistema, y volver a resolverla
 * aquí es la forma de que las dos respuestas se separen.
 */
export function temaActual(): Tema {
  if (typeof document === 'undefined') return 'dark';
  const puesto = document.documentElement.getAttribute(TEMA_ATRIBUTO);
  return esTema(puesto) ? puesto : 'dark';
}

/**
 * La preferencia guardada, si la hay. `null` significa «nadie ha elegido», que
 * no es lo mismo que «eligió oscuro»: sin elección manda el sistema.
 */
export function temaGuardado(): Tema | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const valor = localStorage.getItem(TEMA_CLAVE);
    return esTema(valor) ? valor : null;
  } catch {
    // Safari en privado tira al leer. Un tema no es motivo para romper la página.
    return null;
  }
}

/**
 * El tema que corresponde: lo elegido, y si no hay elección, lo que pida el
 * sistema. Sin `prefers-color-scheme` declarado, oscuro, que es el primario.
 */
export function temaPreferido(): Tema {
  const guardado = temaGuardado();
  if (guardado) return guardado;
  if (typeof matchMedia === 'undefined') return 'dark';
  return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

/**
 * Pone el tema en el `<html>` y lo persiste.
 *
 * Escribe el atributo SIEMPRE, también cuando es `dark`. El default del sistema
 * no necesita el atributo, pero dejarlo explícito es lo que permite que un
 * subárbol declare el modo contrario —el bloque de código va sobre casco en los
 * dos temas— sin que herede de un `<html>` sin marcar.
 */
export function aplicarTema(tema: Tema, persistir = true): void {
  if (typeof document === 'undefined') return;

  document.documentElement.setAttribute(TEMA_ATRIBUTO, tema);
  document.documentElement.style.colorScheme = tema;

  if (persistir) {
    try {
      localStorage.setItem(TEMA_CLAVE, tema);
    } catch {
      // Ver `temaGuardado`: el modo privado no es un error de la aplicación.
    }
  }

  dispatchEvent(new CustomEvent<Tema>(TEMA_EVENTO, { detail: tema }));
}

/** Cambia al contrario y devuelve el que quedó. */
export function alternarTema(): Tema {
  const siguiente: Tema = temaActual() === 'dark' ? 'light' : 'dark';
  aplicarTema(siguiente);
  return siguiente;
}

/**
 * Se suscribe a los cambios de tema y devuelve la función que cancela.
 *
 * Escucha las dos fuentes: el evento propio —el control de esta pestaña— y
 * `storage`, que es el cambio hecho en otra. Sin la segunda, dos pestañas
 * abiertas se quedan con temas distintos hasta que se recarga una.
 */
export function escucharTema(alCambiar: (tema: Tema) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const propio = (evento: Event) => {
    const detalle = (evento as CustomEvent<Tema>).detail;
    if (esTema(detalle)) alCambiar(detalle);
  };

  const otraPestana = (evento: StorageEvent) => {
    if (evento.key !== TEMA_CLAVE) return;
    const tema = esTema(evento.newValue) ? evento.newValue : temaPreferido();
    aplicarTema(tema, false);
    alCambiar(tema);
  };

  addEventListener(TEMA_EVENTO, propio);
  addEventListener('storage', otraPestana);

  return () => {
    removeEventListener(TEMA_EVENTO, propio);
    removeEventListener('storage', otraPestana);
  };
}

/**
 * El script que va INLINE en el `<head>`, antes de cualquier hoja de estilo.
 *
 * Es la parte difícil y es la que se reescribía en cada proyecto. Sin él, la
 * primera pintura sale con el tema por defecto y el correcto entra un frame
 * después: en un sitio oscuro que el usuario dejó en claro, eso es un
 * fogonazo blanco en cada carga.
 *
 * Tiene que ser una cadena y tiene que ir en línea. Un `<script src>`, aunque
 * sea síncrono, se descarga: el parpadeo vuelve. Por eso esto no es un módulo
 * que se importa, es texto que se inyecta:
 *
 * ```astro
 * ---
 * import { scriptTema } from '@eduardoalvarez/arrecife/tema';
 * ---
 * <head>
 *   <script is:inline set:html={scriptTema} />
 * </head>
 * ```
 *
 * ```tsx
 * // Next, en el layout raíz.
 * <head>
 *   <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
 * </head>
 * ```
 *
 * Reengancha en `astro:after-swap` porque las transiciones de vista de Astro
 * reemplazan el `<html>` entero: sin esa línea, el tema se pierde al navegar y
 * vuelve el fogonazo, esta vez a mitad de sesión.
 */
export const scriptTema: string = [
  '(function () {',
  '  var CLAVE = ' + JSON.stringify(TEMA_CLAVE) + ';',
  '  function resolver() {',
  '    try {',
  '      var guardado = localStorage.getItem(CLAVE);',
  '      if (guardado === "dark" || guardado === "light") return guardado;',
  '    } catch (e) {}',
  '    return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";',
  '  }',
  '  function aplicar() {',
  '    var tema = resolver();',
  '    document.documentElement.setAttribute(' + JSON.stringify(TEMA_ATRIBUTO) + ', tema);',
  '    document.documentElement.style.colorScheme = tema;',
  '  }',
  '  aplicar();',
  '  document.addEventListener("astro:after-swap", aplicar);',
  '})();',
].join('\n');
