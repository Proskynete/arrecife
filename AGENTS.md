# AGENTS.md · Arrecife

Instrucciones para un agente que trabaja **dentro** de este repositorio.

Si lo que estás haciendo es escribir código en un proyecto que **consume** la
librería, el documento es `llms.txt`, no este.

`CLAUDE.md` es un symlink a este archivo: hay un solo documento y lo leen todos.

---

## Qué es este repo

`@eduardoalvarez/arrecife`: la librería de componentes de la identidad visual de
Eduardo Álvarez. React 19, TypeScript, Tailwind v4, shadcn/ui sobre Radix, tsup,
Storybook. La consumen cinco proyectos, un generador de Open Graph con Satori y
un sitio Astro que no monta React.

Existe por un motivo concreto: esas piezas se escribían por separado en cada
proyecto y se desincronizaban. La paleta de resaltado vivió meses con un color
incorrecto porque el documento de identidad no era `grep`-able desde el código.
Casi todo lo que sigue es una defensa contra esa clase de fallo.

## La restricción que manda sobre todo lo demás

**`src/tokens/` no importa nada.** Ni React, ni componentes, ni CSS de terceros.

Es el único subpaquete que pueden consumir los cinco proyectos, Satori y un Astro
sin React. Si un token termina dependiendo de un componente, la librería deja de
ser portable y `./og` y `./shiki` dejan de existir.

No es una recomendación: `pnpm check:tokens` lo verifica en cada build, ESLint lo
dice en el editor y `check:exports` comprueba que las subrutas portables no
traen React en el `dist/` publicado.

## Entorno

```bash
pnpm install          # pnpm 11.20.0, Node >= 22.18.0
pnpm storybook        # genera los tokens y levanta Storybook en el 6006
```

**Usa `pnpm`.** El repo tiene `pnpm-workspace.yaml` y `packageManager` fijado;
`npm install` o `yarn` rompen el lockfile.

| Comando                                | Qué hace                                            |
| -------------------------------------- | --------------------------------------------------- |
| `pnpm build`                           | pureza de tokens → tsup → `theme.css` → `llms.txt`  |
| `pnpm typecheck`                       | `tsc --noEmit`                                      |
| `pnpm lint`                            | ESLint, incluido el veto a hex literales            |
| `pnpm test`                            | regresión de tokens + axe en los **dos** modos      |
| `pnpm test:unidad`                     | compila Tailwind y comprueba a qué resuelve cada utilidad |
| `pnpm test:oscuro` / `pnpm test:claro` | axe sobre las stories, un modo cada uno             |
| `pnpm test:watch`                      | la suite en watch, modo oscuro                      |
| `pnpm check:tokens`                    | falla si `src/tokens/` importa algo de fuera        |
| `pnpm check:namespace`                 | falla si un token pisa un nombre de Tailwind        |
| `pnpm check:exports`                   | verifica que `dist/` tiene lo que `exports` promete |
| `pnpm check:llms`                      | falla si `llms.txt` no cuadra con los tipos         |
| `pnpm check:release`                   | valida la configuración de release-please           |
| `pnpm build:tokens`                    | regenera `dist/tokens/theme.css`                    |
| `pnpm build:llms`                      | regenera `llms.txt`                                 |

Antes de dar por terminado un cambio: `pnpm lint`, `pnpm typecheck` y
`pnpm test`. La suite corre en un Chromium real y tarda; no la saltes cuando el
cambio toca color, contraste o marcado.

## Mapa del repo

```
src/
  tokens/       tokens.ts es LA fuente. No importa nada. Se publica en ./tokens
  primitives/   los 28 primitivos sobre shadcn/Radix, con su .stories.tsx al lado
  components/   las piezas de identidad, una carpeta por componente
  brand/        logo, isotipo, mascota y el catálogo de PNG
  og/           plantillas de Satori. Sin React. Se publica en ./og
  shiki/        el tema de resaltado. Sin React. Se publica en ./shiki
  lib/          cn, los glifos inline y los iconos sociales
stories/        stories que no son de un componente (tokens, marca, og) y utils
scripts/        los generadores y los checks
docs/           los documentos de identidad y la plantilla de llms.txt
```

## Archivos generados: no se editan a mano

| Archivo                     | Lo genera                                                           | Se verifica con                |
| --------------------------- | ------------------------------------------------------------------- | ------------------------------ |
| `dist/tokens/theme.css`     | `scripts/build-tokens.mjs` desde `tokens.ts`                        | se regenera en cada build      |
| `llms.txt`                  | `scripts/build-llms.mjs` desde los tipos y `docs/llms.plantilla.md` | `pnpm check:llms`              |
| `CHANGELOG.md`              | release-please desde los commits                                    | —                              |
| `version` de `package.json` | release-please                                                      | el workflow compara con el tag |

Si hace falta cambiar la prosa de `llms.txt`, se edita `docs/llms.plantilla.md` y
se corre `pnpm build:llms`. El inventario de componentes **no** se toca: sale del
compilador de TypeScript, y esa es toda la gracia.

---

## Cómo se crea un componente

Un componente es **dos archivos**, siempre:

```
src/components/<nombre-en-kebab>/index.tsx
src/components/<nombre-en-kebab>/<nombre-en-kebab>.stories.tsx
```

Los primitivos van planos, sin carpeta: `src/primitives/badge.tsx` y
`src/primitives/badge.stories.tsx`.

### 1 · Decide si de verdad entra

El criterio, y no ha cambiado desde la Fase 3: **codifica una regla de identidad,
tiene dos o más consumidores, y no arrastra infraestructura del proyecto.**

Los tres a la vez. Un componente que hace un `POST` a un endpoint es
infraestructura: `NewsletterForm` está aquí porque el `POST` se quedó fuera y el
componente solo recibe `state` y emite `onSubmitEmail`.

### 2 · El patrón

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../lib/cn.ts';

/**
 * El porqué del componente. Qué regla del sistema codifica y qué alternativa se
 * descartó. Este bloque lo lee un humano en el repo y un agente en `llms.txt`:
 * el generador lo extrae, así que la primera frase tiene que valerse sola.
 */
const pieza = cva('clases base', {
  variants: {
    variant: { … },
  },
  defaultVariants: { variant: 'primary' },
});

export type PiezaProps = ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof pieza> & {
    /** Un prop propio, con su JSDoc de una línea. Sale en la tabla generada. */
    icon?: ReactNode;
  };

export function Pieza({ className, variant, icon, ...props }: PiezaProps) {
  return <div className={cn(pieza({ variant }), className)} {...props} />;
}
```

Reglas del patrón, todas con motivo:

- **`export function`**, no `const` con arrow ni `forwardRef`. React 19 pasa `ref`
  como un prop más.
- **El tipo de props se llama `<Componente>Props` y se exporta.** El generador de
  `llms.txt` lo busca por ese nombre para la línea `Extiende`, y los proyectos
  consumidores lo importan.
- **`className` se acepta y se compone con `cn`**, siempre en último lugar para
  que el sitio de uso pueda ganar.
- **`...props` se propaga.** Un componente que se come los atributos del elemento
  obliga a envolverlo en un `div` en el sitio de uso.
- **`asChild`** cuando el componente renderiza un enlace o un control: es como se
  enchufa el `Link` del framework sin que la librería dependa de un enrutador.
- **JSDoc con el porqué, no con el qué.** `/** Botón primario */` sobre `Button`
  no informa a nadie. El repo entero está escrito así; mantenlo.
- **Reutiliza los primitivos.** Un componente de `components/` que escribe sus
  propias clases de tipografía en vez de usar `Text` está duplicando la escala.

### 3 · Colores, tamaños y espaciados

Todo sale de un token, por su utilidad de Tailwind: `bg-surface-raised`,
`text-h1`, `rounded-card`, `p-step-lg`, `gap-step-xs`, `h-nav`, `max-w-content`.

- **El ritmo de página lleva `step`**: `p-step-md`, `gap-step-sm`, `py-step-xl`.
  No es verbosidad gratuita. `xs, sm, md, lg, xl` son los nombres de la escala
  `--container-*` de Tailwind, y un `--spacing-md` nuestro se comía `max-w-md` en
  todos los proyectos consumidores sin dejar rastro. Un `p-md` escrito hoy no
  falla: cae en la escala numérica y no hace nada. Ver `docs/decisiones.md` § 16.
- **Cero hex literales.** ESLint lo bloquea en todo `src/**` salvo en
  `src/tokens/tokens.ts`, que es donde viven.
- **Nada de valores arbitrarios** tipo `p-[13px]` o `text-[15px]`: si el valor no
  tiene token, la pregunta es si debería tenerlo, y eso se decide antes.
- Un token nuevo entra en `tokens.ts`, sale solo en `theme.css` y se usa por su
  utilidad. No hay paso intermedio. Si su nombre choca con uno de Tailwind,
  `pnpm check:namespace` lo para: dale un grupo propio, como `step` o `control`.

### 4 · Movimiento

**Sin animaciones de entrada.** Modales, menús, tooltips y toasts aparecen donde
van a quedarse. La perilla del `Switch` cambia de posición sin deslizarse.

La única transición del sistema es `transition-standard`, y por cómo está escrita
la utilidad **solo puede animar color y borde**. La única excepción documentada es
el spinner de `Button loading`, que va envuelto en `motion-safe`: un botón
cargando sin movimiento es indistinguible de uno deshabilitado.

### 5 · Accesibilidad

- `cursor-pointer` explícito en todo lo que se pulsa. Tailwind v4 lo quitó del
  preflight, así que un `<button>` sin la clase se queda con la flecha del
  sistema. Dos excepciones deliberadas: `Label`, que apunta a un control pero no
  es el control, y los ítems de menú de `Select` y `DropdownMenu`, que se quedan
  en `cursor-default` porque un menú nativo no muestra la manito.
- Foco visible con `focus-visible:outline-2 outline-offset-2 outline-accent`.
- Todo control sin texto lleva `aria-label`. `Progress` exige `label` como prop.
- Sin iconos de librería: los glifos están inline en `src/lib/glyphs.tsx`,
  heredan `currentColor` y miden 1em.

### 6 · Las stories no son opcionales

`pnpm test` monta **cada story** en Chromium y le pasa axe con
`a11y: { test: 'error' }`, dos veces, una por modo. Una story es a la vez la
documentación publicada y el test.

- Una story por estado, no solo el de reposo. El hover y el focus se fuerzan con
  `parameters: { pseudo: { hover: true } }`, sin pedirle a nadie que pase el
  ratón por encima.
- `title: 'Componentes/<Nombre>'` o `'Primitivos/<Nombre>'`.
- Usa los ayudantes de `stories/utils.tsx`: `Fila`, `Pila`, `Bloque`, `Nota`,
  `Etiqueta`. `Nota` es donde se escribe qué hay que mirar en esa story.
- Desactivar una regla de axe necesita motivo escrito al lado, en la story
  concreta y nunca global. El único precedente es `aria-hidden-focus` en
  `Select`/`DropdownMenu` abiertos, que es un desacuerdo conocido entre axe y
  Radix.

### 7 · Si tocas un color

El contraste se **mide**, no se estima, y se anota en el PR. La suite en los dos
modos es el juez: devolver `light.textMuted` a su valor anterior tira ocho
stories con «insufficient color contrast of 4.24».

Dos trampas ya documentadas, con su tabla en el README:

- **`surfaceRaised` es el peor caso en los dos modos**, no `background`. Es donde
  viven menús y tabs activos. `textMuted` sobre `surfaceRaised` da 4.07 en
  oscuro: ahí va `textSecondary`.
- **Un color semántico no es color de texto sobre su propio tinte.** El tinte al
  8 % es una superficie, así que el texto encima es un token de texto. El color
  semántico se queda en el borde y en el glifo.

### 8 · Si contradices el documento de identidad

`docs/design-system.md` y `docs/manual-de-marca.md` son la copia consultable de
los canvas de Claude Design. Cuando el código y el documento no dicen lo mismo,
la discrepancia se anota en **`docs/decisiones.md`** con qué había, qué quedó y
por qué. No se resuelve en silencio ni se deja para después.

---

## Convenciones de código

- **El código se escribe en español**: nombres, comentarios, mensajes de error,
  logs. La API pública en inglés cuando es un nombre de componente o un prop que
  el ecosistema ya nombra así (`Button`, `variant`, `asChild`, `onSubmitEmail`);
  lo interno, en español (`Tarjeta`, `Etiqueta`, `plantillaArticulo`, `caras`).
  Mira un archivo vecino antes de decidir.
- Comillas simples, punto y coma, 2 espacios, ancho ~90. No hay Prettier: sigue
  el estilo del archivo que tienes al lado.
- **Imports con extensión**: `'../lib/cn.ts'`, `'./index.tsx'`. El repo tiene
  `allowImportingTsExtensions` y lo hace en todas partes.
- **`import type`** para los tipos. ESLint lo exige
  (`consistent-type-imports`), y `verbatimModuleSyntax` está activo.
- **`any` está prohibido** (`no-explicit-any` en `error`).
- `tsconfig` va en estricto largo: `exactOptionalPropertyTypes`,
  `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`. Por eso un
  prop opcional se declara `tags?: readonly string[] | undefined` y no solo con
  el `?`: con `exactOptionalPropertyTypes`, pasar `undefined` explícito no
  compila si el tipo no lo admite.
- Los scripts van en `scripts/*.mjs`, con el porqué en la cabecera y un
  `console.log` final que empieza por `arrecife · `.

## Commits, PR y publicación

Conventional Commits, en minúscula y sin punto final. El título del PR lo valida
un workflow.

```
feat(components): Hero con el degradado y la pose de la esquina
fix(badge): separar categoría, estado y métrica
docs(readme): la tercera corrección de contraste
```

Ámbitos válidos, y la lista es corta a propósito: `tokens`, `primitives`,
`components`, `brand`, `og`, `shiki`, `storybook`, `a11y`, `deps`,
`deps-dev`, `ci`. **Un cambio de proceso del repo va sin ámbito** —`docs:`,
`ci:`—: no hay ámbito para «cómo trabajamos», y uno inventado se rechaza.

Cuidado con una trampa: el workflow valida el **título del PR**, no los ámbitos
de los commits que van dentro. Un `docs(agents):` enterrado en un PR titulado
`feat(tokens)!:` pasa el lint y llega al CHANGELOG con un ámbito que no existe.
Ya pasó una vez, en la 0.3.0.

Las ramas siguen el mismo vocabulario que el commit:
`tipo/descripcion-en-espanol-con-guiones` — `feat/espaciado-con-prefijo-step`,
`fix/ambito-deps-dev`, `docs/documentos-para-agentes`.

### Cómo se sube la versión

**No edites nunca `version` en `package.json` ni `CHANGELOG.md`.** Tampoco
`.release-please-manifest.json`. Los tres los escribe release-please, y editarlos
a mano descuadra el manifiesto contra el tag: el workflow de release compara los
dos y se corta.

La versión **se pide desde el mensaje del commit**, y es lo único que la decide:

| Lo que escribes en el commit | Lo que sale |
| ---------------------------- | ----------- |
| `fix(...)`, `perf(...)`      | patch · `0.2.0` → `0.2.1` |
| `feat(...)`                  | minor · `0.2.0` → `0.3.0` |
| `feat(...)!` + footer `BREAKING CHANGE:` | minor · `0.2.0` → `0.3.0` |
| `docs`, `ci`, `chore`, `test`, `style`, `refactor` | nada, no corta versión |

`release-please-config.json` tiene `bump-minor-pre-major: true`, así que mientras
estemos en `0.x` **un cambio incompatible sube la minor, no la major**. El `!` y
el footer siguen siendo obligatorios: no cambian el número, pero son lo que hace
que el CHANGELOG lo anuncie como ruptura en vez de esconderlo entre novedades.

Un cambio incompatible se escribe así:

```
feat(tokens)!: el ritmo de página lleva step, para no comerse max-w-*

<el porqué, como en cualquier commit del repo>

BREAKING CHANGE: `p-md` pasa a ser `p-step-md` y `spacing.md` a `spacing.stepMd`.
Los valores no cambian. Migración en docs/migracion-0.3.md.

<todo lo que quieras: aquí abajo ya no lo lee nadie más que quien abra el commit>
```

**Del footer solo llega al CHANGELOG el PRIMER PÁRRAFO.** Lo que va después de la
primera línea en blanco se pierde, y se pierde en silencio. Comprobado en la
0.3.0: el footer llevaba dos tablas y tres avisos, y en el CHANGELOG salió una
sola frase.

De ahí las dos reglas que importan:

1. **Ese párrafo tiene que valerse solo**, y se escribe para quien va a migrar, no
   para quien hizo el cambio. Cabe justo lo esencial: qué se renombra, si los
   valores cambian, y a dónde ir para el resto. Ni una tabla, ni un ejemplo de
   código: no van a llegar.
2. **La migración de verdad va a un documento en `docs/`**, y el párrafo lo
   enlaza. No es un premio de consolación: el documento existe antes de que se
   corte la release, se puede enlazar desde el README mientras tanto, y no está
   limitado a un párrafo. `docs/migracion-0.3.md` es el precedente.

Los `Co-Authored-By:` y demás pies de página van al final del todo, nunca en
medio del footer.

### `main` está protegida

No se empuja a `main`. Ni con `--force`, ni siendo el dueño del repo: el ruleset
rechaza el push antes de que llegue. Todo entra por PR.

- **Los seis checks tienen que estar en verde**: ESLint, `Build · Node 22.x`,
  `Build · Node 24.x`, `Accesibilidad y contraste`, `Formato de commit
  convencional` y `Escaneo de seguridad`. Ninguno tiene filtro de `paths`, así
  que los seis corren en todos los PRs y ninguno se queda sin reportar.
- **Un PR de fuera necesita la aprobación de @Proskynete**, y solo la suya:
  `CODEOWNERS` es `* @Proskynete` y la regla exige revisión de code owner, así
  que la aprobación de cualquier otro no cuenta.
- **El dueño puede mergear sus propios PRs sin aprobación**, porque GitHub no
  deja aprobarse a uno mismo y si no se quedaría atascado. El bypass está
  limitado a `pull_request`: sirve para mergear, **no** para empujar a `main`.
  No es automático, hay que pedirlo: `gh pr merge <n> --rebase --admin`, o el
  botón de la interfaz que avisa de que te saltas la regla. Un `gh pr merge` a
  secas responde «the base branch policy prohibits the merge», y eso **no** es
  que esté roto: es la regla haciendo su trabajo.
- **Solo squash y rebase.** El merge commit está desactivado en el repo y el
  historial es lineal por regla. `main` nunca ha tenido un merge commit.
- La rama se borra sola al mergear.

Si un check se cuelga o no reporta, el dueño puede forzar el merge del PR desde
la interfaz. Es la única salida, y deja rastro.

**No publiques a npm a mano.** El workflow publica con OIDC y genera procedencia.

## Errores que se cometen en este repo

Por orden de frecuencia real:

1. Escribir un hex o un valor arbitrario «solo para este caso». ESLint lo para;
   la solución es un token, no un `eslint-disable`.
2. Importar algo en `src/tokens/`. Rompe `./og`, `./shiki` y el sitio Astro.
3. Añadir una animación de entrada porque «queda mejor». No entra.
4. Añadir `lucide-react` u otra librería de iconos. Se la comen los cinco
   proyectos; el glifo va inline en `src/lib/glyphs.tsx`.
5. Cambiar props sin regenerar `llms.txt`. `pnpm check:llms` lo para en CI.
6. Correr la suite en un solo modo. Un color falla en uno y pasa en el otro.
7. Añadir una story sin estados: hover y focus se fuerzan, no se confían.
8. Escribir un componente nuevo que ya existe como primitivo con otro nombre.
9. Escribir `p-md` o `gap-sm` por costumbre. El escalón es `p-step-md`, y el
   nombre viejo no da error: no hace nada.
