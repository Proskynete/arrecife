# Migrar a arrecife 0.3.0

La 0.3.0 renombra los cinco escalones de espaciado. Es un cambio incompatible y
es la corrección de un bug que llevaba desde la 0.1.0 rompiendo los proyectos
consumidores en silencio.

Léelo entero antes de tocar nada: **la mitad del trabajo no es renombrar clases,
es descubrir qué anchos llevabas rotos sin saberlo.**

---

## Qué pasaba

En Tailwind v4, `--spacing-*` no alimenta solo `p-*`, `m-*` y `gap-*`. También
resuelve `w-*`, `h-*`, `max-w-*`, `min-w-*`, `max-h-*`, `min-h-*`, `basis-*` y
`size-*` — y ahí **gana** a la escala `--container-*`.

Los tokens declaraban los escalones como `xs, sm, md, lg, xl`, que son
exactamente los nombres de esa escala. Al importar `tokens/theme.css`, los
nuestros eclipsaban a los de Tailwind:

```css
/* Del CSS compilado de un proyecto con arrecife 0.2.0 */
.max-w-xl { max-width: var(--spacing-xl) }   /* 40px */
.max-w-sm { max-width: var(--spacing-sm) }   /* 12px */
```

| Clase | Tailwind | Con arrecife 0.2.0 |
| --- | --- | --- |
| `max-w-sm` | 384px | **12px** |
| `max-w-md` | 448px | **16px** |
| `max-w-lg` | 512px | **26px** |
| `max-w-xl` | 576px | **40px** |

Nada avisaba. No es un error de compilación ni un warning: la clase existe, el
CSS es válido y el navegador aplica 12px tan contento. Se descubrió en
`cursos.eduardoalvarez.dev`, con el párrafo del hero saliendo a una palabra por
línea.

Redeclarar `--container-sm` y compañía en el proyecto **no** lo arregla: se
probó, y `--spacing-*` gana igual la resolución. La única salida era que la
librería dejara de usar esos nombres.

---

## Qué cambia

Los cinco escalones llevan ahora `step` en el nombre. **Los valores no se mueven
ni un píxel.**

| Antes | Ahora | Valor |
| --- | --- | --- |
| `--spacing-xs` | `--spacing-step-xs` | 8px |
| `--spacing-sm` | `--spacing-step-sm` | 12px |
| `--spacing-md` | `--spacing-step-md` | 16px |
| `--spacing-lg` | `--spacing-step-lg` | 26px |
| `--spacing-xl` | `--spacing-step-xl` | 40px |

En las utilidades: `p-md` → `p-step-md`, `gap-sm` → `gap-step-sm`, `py-xl` →
`py-step-xl`, `mb-lg` → `mb-step-lg`.

En el objeto de TypeScript, para plantillas de Satori y generadores:
`spacing.md` → `spacing.stepMd`.

**Lo que NO cambia:** `--spacing-section`, `--spacing-nav`,
`--spacing-control-sm|md|lg|icon`, todos los `--container-*`, `--radius-*`,
`--text-*` y `--color-*`. Ninguno chocaba con nada.

---

## Cómo migrar

### 1 · Renombra las clases de espaciado

Los prefijos afectados son todos los de padding, margen y hueco: `p px py pt pr
pb pl`, `m mx my mt mr mb ml`, `gap gap-x gap-y`, `space-x space-y`.

```bash
# Revisa el resultado antes de confiar en él: el patrón también toca comentarios.
rg -l --glob '!node_modules' -e '\b(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|space-x|space-y)-(xs|sm|md|lg|xl)\b' \
  | xargs sed -i '' -E 's/\b(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|space-x|space-y)-(xs|sm|md|lg|xl)\b/\1-step-\2/g'
```

Cuidado con dos cosas:

- **`sm:` y `md:` son variantes de breakpoint**, no escalones. El patrón de
  arriba no las toca porque exige un `-` delante, pero si escribes el tuyo,
  tenlo en cuenta.
- **Un `size="md"` o un `variant="lg"` en JSX no es una clase.** Tampoco los
  toca el patrón, por el mismo motivo.

Un nombre viejo que se quede sin migrar **no da error**: `p-md` cae en la escala
numérica de Tailwind, no genera nada y el elemento se queda sin padding. Búscalos
después de migrar:

```bash
rg --glob '!node_modules' -e '\b(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap)-(xs|sm|md|lg|xl)\b'
```

### 2 · Revisa tus `max-w-*`, y esta es la parte que importa

Si tu proyecto usa `max-w-xs|sm|md|lg|xl`, `min-w-*`, `w-*`, `h-*`, `basis-*` o
`size-*` con esos nombres, **te estaban valiendo el escalón de espaciado, no el
de Tailwind**. Al actualizar vuelven solos a su valor correcto, así que esos
bloques van a cambiar de ancho — a lo que siempre debieron medir.

No es una regresión: es lo que el diseño pedía. Pero míralos, porque puede que
alguien compensara el ancho roto con un `mx-auto`, un `w-full` o un valor
arbitrario que ahora sobra.

```bash
rg --glob '!node_modules' -e '\b(max-w|min-w|max-h|min-h|w|h|basis|size)-(3xs|2xs|xs|sm|md|lg|xl)\b'
```

Ojo: `w-md`, `h-lg`, `basis-sm` y `size-md` **no existen en Tailwind**. Solo
funcionaban porque nuestro `--spacing-*` se los inventaba. Al actualizar dejan de
generar CSS: reemplázalos por la escala numérica (`w-64`), por un
`max-w-*`/`min-w-*` real o por un token de la librería (`max-w-content`,
`max-w-measure`, `h-nav`).

### 3 · Recompila y compara

Recompila el CSS y mira la salida, no el navegador: es donde se ve la diferencia
sin ambigüedad.

```bash
rg -n '^\s*\.max-w-(sm|md|lg|xl)' -A1 dist/salida.css
# Tiene que decir var(--container-sm), no var(--spacing-sm)
```

---

## De paso: los nombres de las fuentes

Sin relación con lo anterior, pero muerde igual de callado.

Los tokens declaran las familias **por nombre exacto**:

| Utilidad | Nombre que pide el token |
| --- | --- |
| `font-display` | `"Bricolage Grotesque"` |
| `font-sans` | `"Geist"` |
| `font-mono` | `"JetBrains Mono"` |

Dos proyectos las tenían registradas en su `@font-face` como
`"Bricolage Grotesque Variable"` y `"Geist Variable"` —el nombre con el que las
publican varios paquetes de fuentes—. Con ese alias, la display y la mono caen a
la fuente del sistema sin un solo aviso en consola.

El `font-family` de un `@font-face` es un alias que elige el proyecto: cámbialo
al nombre de la tabla y ya está.

```css
@font-face {
  font-family: "Bricolage Grotesque"; /* NO "Bricolage Grotesque Variable" */
  src: url("/fuentes/bricolage-grotesque.woff2") format("woff2-variations");
  font-weight: 200 800;
  font-display: swap;
}
```

---

## Que no vuelva a pasar

El bug no lo detectó nada: ni el build, ni los tipos, ni Storybook, ni la suite
de axe en los dos modos. Vivía en el hueco entre lo que la librería **publica** y
lo que la librería **usa** — Arrecife no escribe `max-w-sm` por dentro, así que
ninguna story podía enseñarlo.

La 0.3.0 añade dos defensas, y son dos porque son razonamientos independientes:

- `pnpm check:namespace` (`scripts/check-tokens-namespace.mjs`) falla el build si
  un token pisa un nombre que Tailwind reserva. La lista no está escrita a mano:
  se lee del `theme.css` de la versión instalada.
- `pnpm test:unidad` (`scripts/theme-css.test.mjs`) compila Tailwind de verdad
  con los tokens encima y comprueba a qué resuelve cada utilidad.

El detalle de la decisión está en [`decisiones.md`](decisiones.md) § 16.
