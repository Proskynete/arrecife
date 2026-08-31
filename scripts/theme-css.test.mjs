/**
 * El test de regresión del choque de nombres.
 *
 * No inspecciona `theme.css` a ojo: compila Tailwind de verdad con nuestros
 * tokens importados encima, exactamente como hace un proyecto que consume la
 * librería, y mira a qué resuelve cada utilidad en el CSS que sale.
 *
 * Es el test que no existía. `--spacing-md` se comía `max-w-md` en todos los
 * proyectos y aquí no se notaba: la suite de stories monta los componentes de
 * Arrecife, y Arrecife no usa `max-w-*` por dentro. El fallo vivía justo en el
 * hueco entre lo que la librería publica y lo que la librería usa.
 *
 * `check-tokens-namespace.mjs` cubre lo mismo por el lado de los nombres. Los
 * dos, porque son razonamientos independientes: el check sabe qué nombres
 * reserva Tailwind, este sabe qué hace Tailwind de verdad al compilarlos.
 */
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';
import { compile } from 'tailwindcss';

import { themeCss } from './build-tokens.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

/** Resuelve los `@import` como lo haría un bundler: `tailwindcss` y relativos. */
async function cargarHoja(id, base) {
  const ruta = id.startsWith('.') ? resolve(base, id) : require.resolve(`${id}/index.css`);
  return { path: ruta, base: dirname(ruta), content: await readFile(ruta, 'utf8') };
}

/**
 * Compila las clases pedidas igual que un proyecto consumidor: Tailwind primero,
 * nuestros tokens después. `theme.css` entra en línea desde el generador, así
 * que el test no depende de que `dist/` esté construido.
 */
async function compilar(clases) {
  const compilador = await compile(`@import "tailwindcss";\n${themeCss}`, {
    base: root,
    loadStylesheet: cargarHoja,
  });
  return compilador.build(clases);
}

/** El cuerpo de la regla de una clase, o `undefined` si no se generó. */
function regla(css, clase) {
  const escapada = clase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return css.match(new RegExp(`\\.${escapada}\\s*\\{([^}]*)\\}`))?.[1].trim();
}

/** El valor declarado para una custom property dentro del CSS compilado. */
function propiedad(css, nombre) {
  return css.match(new RegExp(`${nombre}:\\s*([^;]+);`))?.[1].trim();
}

/**
 * Las cinco que se rompieron, con el ancho que Tailwind les da. Si alguna
 * vuelve a resolver a un `--spacing-*`, el párrafo del hero vuelve a salir a
 * una palabra por línea y esta vez el build se entera.
 */
const ANCHOS_DE_TAILWIND = [
  ['max-w-xs', '20rem'],
  ['max-w-sm', '24rem'],
  ['max-w-md', '28rem'],
  ['max-w-lg', '32rem'],
  ['max-w-xl', '36rem'],
];

describe('theme.css sobre Tailwind v4', () => {
  it('deja intactas las utilidades de ancho de Tailwind', async () => {
    const css = await compilar(ANCHOS_DE_TAILWIND.map(([clase]) => clase));

    for (const [clase, ancho] of ANCHOS_DE_TAILWIND) {
      const escalon = clase.replace('max-w-', '');
      expect(regla(css, clase), clase).toBe(`max-width: var(--container-${escalon});`);
      expect(propiedad(css, `--container-${escalon}`), `--container-${escalon}`).toBe(ancho);
    }
  });

  it('no declara ningún --spacing-* con nombre de la escala --container-*', () => {
    for (const escalon of ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']) {
      expect(themeCss, `--spacing-${escalon}`).not.toMatch(
        new RegExp(`--spacing-${escalon}\\s*:`),
      );
    }
  });

  it('deja intacta la escala numérica de espaciado', async () => {
    const css = await compilar(['p-4', 'gap-2']);

    expect(regla(css, 'p-4')).toBe('padding: calc(var(--spacing) * 4);');
    expect(regla(css, 'gap-2')).toBe('gap: calc(var(--spacing) * 2);');
  });

  it('deja intactos los tamaños y radios de Tailwind', async () => {
    const css = await compilar(['text-2xl', 'rounded-md']);

    expect(regla(css, 'text-2xl')).toContain('var(--text-2xl)');
    expect(regla(css, 'rounded-md')).toBe('border-radius: var(--radius-md);');
    expect(propiedad(css, '--radius-md')).toBe('0.375rem');
  });

  it('sirve los escalones de ritmo de Arrecife por su nombre nuevo', async () => {
    const css = await compilar(['p-step-lg', 'gap-step-sm', 'px-step-md', 'py-step-xl']);

    expect(regla(css, 'p-step-lg')).toBe('padding: var(--spacing-step-lg);');
    expect(regla(css, 'gap-step-sm')).toBe('gap: var(--spacing-step-sm);');
    expect(propiedad(css, '--spacing-step-lg')).toBe('26px');
    expect(propiedad(css, '--spacing-step-md')).toBe('16px');
  });

  it('sirve el resto de tokens de forma y ritmo', async () => {
    const css = await compilar([
      'p-step-lg',
      'py-section',
      'px-control-md',
      'size-control-icon',
      'h-nav',
      'max-w-content',
      'max-w-measure',
      'rounded-card',
      'text-h1',
    ]);

    expect(regla(css, 'py-section')).toContain('var(--spacing-section)');
    expect(regla(css, 'px-control-md')).toContain('var(--spacing-control-md)');
    expect(regla(css, 'h-nav')).toBe('height: var(--spacing-nav);');
    expect(regla(css, 'max-w-content')).toBe('max-width: var(--container-content);');
    expect(regla(css, 'max-w-measure')).toBe('max-width: var(--container-measure);');
    expect(regla(css, 'rounded-card')).toBe('border-radius: var(--radius-card);');
    expect(regla(css, 'text-h1')).toContain('var(--text-h1)');
  });

  it('sirve las cuatro series de gráfica y las cambia con el modo', async () => {
    const css = await compilar(['bg-serie-1', 'bg-serie-4']);

    expect(regla(css, 'bg-serie-1')).toBe('background-color: var(--color-serie-1);');
    // El bloque del modo claro tiene que redeclarar las cuatro: si solo salieran
    // en `@theme`, la gráfica se quedaría con la paleta oscura sobre papel.
    const claro = css.slice(css.indexOf("[data-theme='light']"));
    for (const n of [1, 2, 3, 4]) {
      expect(claro, `--color-serie-${n} en modo claro`).toMatch(
        new RegExp(`--color-serie-${n}\\s*:`),
      );
    }
  });

  /**
   * El gancho de `TableOfContents`. La variante tiene que compilar a un selector
   * de PRESENCIA del atributo —`[aria-current]`, sin valor— porque el scroll-spy
   * del sitio pone `aria-current="true"` y el componente controlado pone
   * `"location"`: si el selector se atara a un valor, una de las dos formas
   * dejaría de pintarse y nada avisaría.
   */
  it('el activo del índice reacciona a aria-current con cualquier valor', async () => {
    const css = await compilar([
      'aria-[current]:text-accent',
      'aria-[current]:hover:text-accent',
      'hover:text-text-primary',
    ]);

    expect(css).toContain('[aria-current]');
    expect(css).not.toContain('[aria-current="location"]');
    // Y el hover del activo lleva las dos variantes, para ganar por
    // especificidad al `hover:` genérico en vez de por orden de emisión.
    expect(css).toContain('[aria-current]:hover');
  });

  it('pisa font-sans y font-mono a propósito, con las familias del sistema', async () => {
    const css = await compilar(['font-sans', 'font-mono', 'font-display']);

    expect(regla(css, 'font-sans')).toBe('font-family: var(--font-sans);');
    expect(propiedad(css, '--font-sans')).toContain('Geist');
    expect(propiedad(css, '--font-mono')).toContain('JetBrains Mono');
    expect(propiedad(css, '--font-display')).toContain('Bricolage Grotesque');
  });
});
