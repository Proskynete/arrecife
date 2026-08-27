/**
 * Genera `llms.txt` a partir de `docs/llms.plantilla.md` y de los tipos.
 *
 * Es el documento que lee un agente —Claude, Codex, Cursor— desde un proyecto
 * que instaló la librería. Ese agente nunca ve este repo: ve
 * `node_modules/@eduardoalvarez/arrecife/`, y por eso `llms.txt` viaja en el
 * tarball. `AGENTS.md` es la otra mitad, para el agente que trabaja aquí dentro.
 *
 * El inventario NO se escribe a mano. Una tabla de props copiada se desincroniza
 * en dos versiones y nadie lo nota, que es exactamente el fallo que este repo ya
 * arregló una vez con la paleta. La prosa vive en la plantilla; las tablas salen
 * del compilador de TypeScript, así que dicen lo que el código dice.
 *
 * Solo se listan los props DECLARADOS EN `src/`. Los que un componente hereda de
 * `<button>` o de Radix se resumen en la línea `extiende`: enumerarlos serían mil
 * filas de `onCopyCapture` que el agente ya conoce y que tapan las cinco que
 * importan.
 *
 *   node scripts/build-llms.mjs            genera llms.txt
 *   node scripts/build-llms.mjs --check    falla si llms.txt está desactualizado
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const COMPROBAR = process.argv.includes('--check');

const PLANTILLA = resolve(root, 'docs/llms.plantilla.md');
const DESTINO = resolve(root, 'llms.txt');
const MARCA = '<!-- INVENTARIO -->';

/** Los puntos de entrada de `exports`, con la subruta que los publica. */
const ENTRADAS = [
  { subruta: '.', archivo: 'src/index.ts' },
  { subruta: './tokens', archivo: 'src/tokens/index.ts' },
  { subruta: './brand', archivo: 'src/brand/index.ts' },
  { subruta: './og', archivo: 'src/og/index.ts' },
  { subruta: './shiki', archivo: 'src/shiki/index.ts' },
];

/** De qué directorio sale cada sección del inventario, en orden. */
const SECCIONES = [
  {
    titulo: 'Primitivos',
    dir: 'src/primitives/',
    entrada: '`@eduardoalvarez/arrecife`',
  },
  {
    titulo: 'Componentes',
    dir: 'src/components/',
    entrada: '`@eduardoalvarez/arrecife`',
  },
  {
    titulo: 'Marca',
    dir: 'src/brand/',
    entrada: '`@eduardoalvarez/arrecife` o `@eduardoalvarez/arrecife/brand`',
  },
];

const cfg = ts.readConfigFile(resolve(root, 'tsconfig.json'), ts.sys.readFile);
const opciones = ts.parseJsonConfigFileContent(cfg.config, ts.sys, root).options;
const program = ts.createProgram(
  ENTRADAS.map((e) => resolve(root, e.archivo)),
  opciones,
);
const checker = program.getTypeChecker();

const ruta = (nodo) => relative(root, nodo.getSourceFile().fileName);

/** Una línea, sin saltos ni dobles espacios: las tablas markdown no los admiten. */
const plano = (s) => s.replace(/\s+/g, ' ').trim();

/** El primer párrafo del JSDoc. El resto es el porqué, y va en el repo. */
const primerParrafo = (s) => plano(s.split(/\n\s*\n/)[0] ?? '');

const jsdoc = (simbolo) =>
  ts.displayPartsToString(simbolo.getDocumentationComment(checker));

/** Escapa lo que rompería una celda: la barra vertical y el salto de línea. */
const celda = (s) => plano(s).replace(/\|/g, '\\|');

/** A partir de aquí un tipo impreso deja de informar y empieza a estorbar. */
const LARGO_MAXIMO = 160;

/**
 * `Etiqueta` no le dice nada a un agente; `'h1' | 'h2' | …` sí. Se expande el
 * alias solo cuando la unión es de literales: hacerlo con `ReactNode` imprime
 * media biblioteca de tipos de React.
 */
function tipoLegible(tipo) {
  const partes = tipo.isUnion() ? tipo.types : [tipo];
  const utiles = partes.filter(
    (t) => !(t.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)),
  );
  if (utiles.length === 0) return checker.typeToString(tipo);

  const todosLiterales = utiles.every((t) => t.isStringLiteral() || t.isNumberLiteral());
  const texto =
    utiles.length > 1 && !todosLiterales
      ? // Unión de tipos con nombre: se imprime tal cual la escribió el código.
        checker.typeToString(tipo, undefined, ts.TypeFormatFlags.NoTruncation)
      : utiles
          .map((t) => checker.typeToString(t, undefined, ts.TypeFormatFlags.NoTruncation))
          .join(' | ');

  return compactar(texto, utiles.length === 1 ? utiles[0] : tipo);
}

/**
 * `tokens` impreso entero son cuatro kilobytes de hexadecimales en una celda de
 * tabla. Lo que un agente necesita de un objeto de tokens son los NOMBRES: los
 * valores ya están en `theme.css`, y ahí sí puede leerlos sin que le tapen el
 * resto del documento.
 */
function compactar(texto, tipo) {
  if (texto.length <= LARGO_MAXIMO) return texto;

  const propiedades = tipo.getProperties?.() ?? [];
  if (propiedades.length === 0 || tipo.getCallSignatures?.().length > 0) {
    return `${texto.slice(0, LARGO_MAXIMO)}…`;
  }

  const claves = `{ ${propiedades.map((p) => p.getName()).join(', ')} }`;
  return claves.length <= texto.length ? claves : `${texto.slice(0, LARGO_MAXIMO)}…`;
}

/**
 * `defaultVariants` de cada `cva()` del archivo, indexado por el nombre de la
 * variable a la que se asigna. Se ata al componente por la variable que su
 * cuerpo llama —`button({ variant })`— y no por adivinanza: `badge.tsx` declara
 * dos cva y atribuir el defecto equivocado sería peor que no ponerlo.
 */
function defectosDeCva(archivo) {
  const porVariable = new Map();

  const visitar = (nodo) => {
    if (
      ts.isVariableDeclaration(nodo) &&
      nodo.initializer &&
      ts.isCallExpression(nodo.initializer) &&
      nodo.initializer.expression.getText() === 'cva' &&
      ts.isIdentifier(nodo.name)
    ) {
      {
        const config = nodo.initializer.arguments[1];
        const prop =
          config && ts.isObjectLiteralExpression(config)
            ? config.properties.find((p) => p.name?.getText() === 'defaultVariants')
            : undefined;
        const defectos = new Map();
        if (prop && ts.isPropertyAssignment(prop) && ts.isObjectLiteralExpression(prop.initializer)) {
          for (const d of prop.initializer.properties) {
            if (ts.isPropertyAssignment(d)) {
              defectos.set(d.name.getText(), d.initializer.getText().replace(/'/g, ''));
            }
          }
        }
        // El JSDoc del cva es, en la mayoría de los archivos, la explicación
        // del componente: el porqué de las variantes está ahí y no sobre la
        // función. Se guarda para usarlo cuando la función no tiene el suyo.
        const simbolo = checker.getSymbolAtLocation(nodo.name);
        porVariable.set(nodo.name.text, {
          defectos,
          doc: simbolo ? primerParrafo(jsdoc(simbolo)) : '',
        });
      }
    }
    ts.forEachChild(nodo, visitar);
  };

  ts.forEachChild(archivo, visitar);
  return porVariable;
}

/** Los `= false` del destructuring de props, que es donde vive el otro defecto. */
function defectosDeFirma(declaracion) {
  const defectos = new Map();
  const parametro = declaracion.parameters?.[0];
  if (!parametro || !ts.isObjectBindingPattern(parametro.name)) return defectos;

  for (const elemento of parametro.name.elements) {
    if (elemento.initializer) {
      const nombre = (elemento.propertyName ?? elemento.name).getText();
      defectos.set(nombre, elemento.initializer.getText().replace(/'/g, ''));
    }
  }
  return defectos;
}

/** El cva que el cuerpo del componente llama de verdad. */
function cvaDelCuerpo(declaracion, porVariable) {
  let encontrado = null;
  const visitar = (nodo) => {
    if (encontrado) return;
    if (ts.isIdentifier(nodo) && porVariable.has(nodo.text)) {
      encontrado = porVariable.get(nodo.text);
      return;
    }
    ts.forEachChild(nodo, visitar);
  };
  if (declaracion.body) visitar(declaracion.body);
  return encontrado ?? { defectos: new Map(), doc: '' };
}

/** El JSDoc del alias `XProps`, la tercera fuente cuando las otras dos callan. */
function docDeProps(nombre, archivo) {
  let doc = '';
  const visitar = (nodo) => {
    if (ts.isTypeAliasDeclaration(nodo) && nodo.name.text === `${nombre}Props`) {
      const simbolo = checker.getSymbolAtLocation(nodo.name);
      if (simbolo) doc = primerParrafo(jsdoc(simbolo));
    }
    ts.forEachChild(nodo, visitar);
  };
  ts.forEachChild(archivo, visitar);
  return doc;
}

/**
 * De qué se cuelga el tipo de props, literal del código fuente. Es la línea que
 * le dice al agente que `Button` también acepta `onClick` y `type` sin tener que
 * listar los ciento y pico atributos de `<button>`.
 */
function baseDeProps(nombre, archivo) {
  let texto = null;
  const visitar = (nodo) => {
    if (ts.isTypeAliasDeclaration(nodo) && nodo.name.text === `${nombre}Props`) {
      texto = nodo.type.getText();
    }
    ts.forEachChild(nodo, visitar);
  };
  ts.forEachChild(archivo, visitar);
  if (texto === null) return null;

  // Se quita el `& { … }` de los props propios: esos ya salen en la tabla.
  const base = plano(texto.replace(/&\s*\{[\s\S]*\}\s*$/, '').replace(/&\s*$/, ''));
  return base.length > 0 && base !== `${nombre}Props` ? base : null;
}

/** Un componente exportado, con lo que hace falta para documentarlo. */
function leerComponente(simbolo) {
  const declaracion = simbolo.declarations?.find(
    (d) => ts.isFunctionDeclaration(d) || ts.isVariableDeclaration(d),
  );
  if (!declaracion) return null;

  const archivo = declaracion.getSourceFile();
  const tipo = checker.getTypeOfSymbolAtLocation(simbolo, declaracion);
  const firma = tipo.getCallSignatures()[0];
  if (!firma) return null;

  const funcion = ts.isFunctionDeclaration(declaracion) ? declaracion : null;
  const cva = cvaDelCuerpo(funcion ?? {}, defectosDeCva(archivo));
  const defectos = new Map([
    ...cva.defectos,
    ...(funcion ? defectosDeFirma(funcion) : []),
  ]);

  // Tres sitios donde puede vivir la explicación, en orden de cercanía al
  // componente. El código las usa las tres, así que el generador también.
  const doc =
    primerParrafo(jsdoc(simbolo)) ||
    cva.doc ||
    docDeProps(simbolo.getName(), archivo);

  const props = [];
  const parametro = firma.getParameters()[0];
  if (parametro) {
    const tipoProps = checker.getTypeOfSymbolAtLocation(
      parametro,
      parametro.valueDeclaration ?? declaracion,
    );
    for (const prop of tipoProps.getProperties()) {
      const d = prop.declarations?.[0];
      if (!d) continue;
      // El corte: solo lo declarado aquí. Lo heredado va en `extiende`.
      if (!d.getSourceFile().fileName.startsWith(resolve(root, 'src'))) continue;

      props.push({
        nombre: prop.getName(),
        tipo: tipoLegible(checker.getTypeOfSymbolAtLocation(prop, d)),
        opcional: Boolean(prop.flags & ts.SymbolFlags.Optional),
        defecto: defectos.get(prop.getName()) ?? null,
        doc: primerParrafo(jsdoc(prop)),
      });
    }
  }

  return {
    nombre: simbolo.getName(),
    archivo: ruta(declaracion),
    doc,
    base: baseDeProps(simbolo.getName(), archivo),
    props: props.sort((a, b) => a.nombre.localeCompare(b.nombre)),
  };
}

/** Todo lo exportado por una entrada, ya clasificado. */
function leerEntrada(archivoEntrada) {
  const sf = program.getSourceFile(resolve(root, archivoEntrada));
  const modulo = checker.getSymbolAtLocation(sf);
  const componentes = [];
  const valores = [];
  const tipos = [];

  for (const simbolo of checker.getExportsOfModule(modulo)) {
    const nombre = simbolo.getName();
    const declaracion = simbolo.declarations?.[0];
    if (!declaracion) continue;

    if (simbolo.flags & (ts.SymbolFlags.TypeAlias | ts.SymbolFlags.Interface)) {
      tipos.push(nombre);
      continue;
    }

    const tipo = checker.getTypeOfSymbolAtLocation(simbolo, declaracion);
    const esFuncion = tipo.getCallSignatures().length > 0;

    if (esFuncion && /^[A-Z]/.test(nombre)) {
      const componente = leerComponente(simbolo);
      if (componente) componentes.push(componente);
      continue;
    }

    valores.push({
      nombre,
      archivo: ruta(declaracion),
      tipo: esFuncion
        ? plano(checker.signatureToString(tipo.getCallSignatures()[0]))
        : plano(tipoLegible(tipo)),
      doc: primerParrafo(jsdoc(simbolo)),
    });
  }

  return { componentes, valores, tipos };
}

// ---------------------------------------------------------------- emisión ---

const lineas = [];
const escribir = (s = '') => lineas.push(s);

const raiz = leerEntrada('src/index.ts');

for (const seccion of SECCIONES) {
  const dir = resolve(root, seccion.dir);
  const suyos = raiz.componentes.filter((c) =>
    resolve(root, c.archivo).startsWith(dir),
  );
  if (suyos.length === 0) continue;

  escribir(`## ${seccion.titulo}`);
  escribir();
  escribir(`Se importan de ${seccion.entrada}. ${suyos.length} exportaciones.`);
  escribir();

  // Agrupados por archivo: `Dialog`, `DialogContent` y `DialogTitle` son una
  // pieza, y separarlos alfabéticamente los volvería tres cosas sin relación.
  const porArchivo = new Map();
  for (const c of suyos) {
    if (!porArchivo.has(c.archivo)) porArchivo.set(c.archivo, []);
    porArchivo.get(c.archivo).push(c);
  }

  for (const [archivo, grupo] of [...porArchivo].sort()) {
    escribir(`### ${grupo.map((c) => c.nombre).join(', ')}`);
    escribir();
    escribir(`Fuente: \`${archivo}\``);
    escribir();

    for (const c of grupo) {
      if (grupo.length > 1) escribir(`**${c.nombre}**`);
      if (c.doc) {
        escribir(c.doc);
        escribir();
      }
      if (c.base) escribir(`- Extiende: \`${celda(c.base)}\``);

      if (c.props.length === 0) {
        escribir('- Sin props propios: pasa los del elemento o la primitiva que envuelve.');
        escribir();
        continue;
      }

      escribir();
      escribir('| prop | tipo | req. | defecto | qué hace |');
      escribir('| --- | --- | --- | --- | --- |');
      for (const p of c.props) {
        escribir(
          `| \`${p.nombre}\` | \`${celda(p.tipo)}\` | ${p.opcional ? '' : 'sí'} | ${
            p.defecto ? `\`${celda(p.defecto)}\`` : ''
          } | ${celda(p.doc)} |`,
        );
      }
      escribir();
    }
  }
}

escribir('## Exportaciones que no son componentes');
escribir();
escribir(
  'La raíz reexporta todo lo de `./tokens` y `./brand` por conveniencia. Cada uno',
);
escribir(
  'aparece una sola vez, en la subruta más específica que lo publica: si el código',
);
escribir(
  'no monta React, esa subruta es la que hay que importar.',
);
escribir();

// De la más específica a la raíz: así `tokens` sale bajo `./tokens` —que es la
// que puede consumir Satori— y no bajo la raíz, que arrastra React.
const yaListado = new Set();
const ordenadas = [...ENTRADAS].sort((a, b) => b.subruta.length - a.subruta.length);

for (const entrada of ordenadas) {
  const { valores, tipos } = leerEntrada(entrada.archivo);
  const propios = valores
    .filter((v) => !yaListado.has(v.nombre))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
  const tiposPropios = tipos.filter((t) => !yaListado.has(t)).sort();

  for (const v of propios) yaListado.add(v.nombre);
  for (const t of tiposPropios) yaListado.add(t);

  if (propios.length === 0 && tiposPropios.length === 0) continue;

  const subruta = entrada.subruta === '.' ? '' : entrada.subruta.slice(1);
  escribir(`### \`@eduardoalvarez/arrecife${subruta}\``);
  escribir();

  if (propios.length > 0) {
    escribir('| export | tipo | qué es |');
    escribir('| --- | --- | --- |');
    for (const v of propios) {
      escribir(`| \`${v.nombre}\` | \`${celda(v.tipo)}\` | ${celda(v.doc)} |`);
    }
    escribir();
  }

  if (tiposPropios.length > 0) {
    escribir(
      `Tipos (${tiposPropios.length}): ${tiposPropios.map((t) => `\`${t}\``).join(', ')}.`,
    );
    escribir();
  }
}

const plantilla = await readFile(PLANTILLA, 'utf8');
if (!plantilla.includes(MARCA)) {
  console.error(`docs/llms.plantilla.md no tiene la marca ${MARCA}.`);
  process.exit(1);
}

const salida = plantilla.replace(MARCA, lineas.join('\n').trimEnd());

if (COMPROBAR) {
  const actual = await readFile(DESTINO, 'utf8').catch(() => null);
  if (actual !== salida) {
    console.error(
      'llms.txt está desactualizado. Se genera desde los tipos y la plantilla:\n\n' +
        '  pnpm build:llms\n\n' +
        'Pasa cuando cambia un prop y no se regenera. Es el fallo que el archivo existe para evitar.',
    );
    process.exit(1);
  }
  console.log('arrecife · llms.txt al día con los tipos');
} else {
  await writeFile(DESTINO, salida, 'utf8');
  const componentes = raiz.componentes.length;
  console.log(
    `arrecife · llms.txt → ${relative(root, DESTINO)} (${componentes} componentes, ${
      salida.split('\n').length
    } líneas)`,
  );
}
