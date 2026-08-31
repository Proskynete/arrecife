import { useSyncExternalStore, type ReactNode } from 'react';

import {
  Toast,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProps,
} from './toast.tsx';

/**
 * Lo ÚNICO que se reexporta de `toast.tsx`. El resto de la primitiva de Radix
 * —`Toast`, `ToastProvider`, `ToastViewport`, `ToastTitle`,
 * `ToastDescription`— dejó de ser API pública en la 0.5.0.
 *
 * El motivo es que no tenía un caso de uso propio. `Toaster` está construido
 * encima y cubre todo lo que los proyectos hacen; la capa de abajo solo servía
 * para atar un aviso al ciclo de vida de un componente, que no lo hace nadie.
 * Dos formas de mostrar lo mismo obligan a elegir en cada sitio de uso, y esa
 * elección no tenía criterio que la resolviera.
 *
 * `ToastAction` sí se queda: es lo que se pasa en `action` cuando el aviso
 * ofrece deshacer, y sin él esa prop no se puede construir desde fuera.
 */
export { ToastAction } from './toast.tsx';

/**
 * La cara imperativa del `Toast` de Radix: `toast('Guardado')` desde cualquier
 * sitio, sin pasar el aviso por props hasta el componente que lo dispara.
 *
 * Existe porque dos proyectos traían `sonner` para esto. `Toast` cubre el mismo
 * rol y tiene otra forma: Radix es declarativo con proveedor, y para mostrar un
 * aviso desde el `catch` de un `fetch` hay que subir estado hasta donde vive el
 * proveedor. Eso es exactamente lo que `sonner` evita, y es una necesidad real,
 * no una preferencia de API.
 *
 * La alternativa era que los dos proyectos se adaptaran. Se descartó: el aviso
 * lo dispara la capa de datos, que no tiene —ni debería tener— un componente
 * cerca al que subirle un `useState`.
 *
 * Lo que NO se copió de `sonner` es el catálogo entero. No hay `toast.promise`,
 * ni `toast.custom`, ni posiciones configurables, ni apilado con perspectiva:
 * son cuatro variantes de lo mismo y cada una es superficie pública que hay que
 * mantener. Están las tres formas que los proyectos usan de verdad —neutral,
 * éxito, error—, `dismiss` y nada más.
 *
 * El estado vive en un módulo, no en un contexto, porque el punto es que se
 * pueda llamar desde fuera del árbol. `Toaster` se suscribe con
 * `useSyncExternalStore`, que es la forma que React 19 tiene de leer un estado
 * externo sin efectos ni renders en cascada.
 */
export type ToastVariant = NonNullable<ToastProps['variant']>;

export type ToastOptions = {
  /** La primera línea, en negrita. Sin ella el aviso es una sola frase. */
  title?: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  /** Milisegundos en pantalla. `Infinity` lo deja hasta que se cierre a mano. */
  duration?: number;
  /** Un `ToastAction`, si el aviso ofrece deshacer. */
  action?: ReactNode;
};

type Aviso = ToastOptions & { id: string; abierto: boolean };

let avisos: readonly Aviso[] = [];
const suscriptores = new Set<() => void>();
let contador = 0;

function emitir(siguientes: readonly Aviso[]) {
  avisos = siguientes;
  for (const avisar of suscriptores) avisar();
}

const suscribirse = (avisar: () => void) => {
  suscriptores.add(avisar);
  return () => {
    suscriptores.delete(avisar);
  };
};

const leer = () => avisos;

/**
 * En el servidor la lista siempre está vacía, y tiene que ser SIEMPRE EL MISMO
 * array: devolver `[]` recién creado en cada llamada hace que React lo vea como
 * un valor nuevo en cada render y entre en bucle.
 */
const VACIO: readonly Aviso[] = [];
const enServidor = () => VACIO;

function crear(mensaje: ReactNode, opciones: ToastOptions = {}): string {
  contador += 1;
  const id = `arrecife-toast-${contador}`;
  const { description, ...resto } = opciones;

  emitir([
    ...avisos,
    {
      ...resto,
      // El primer argumento es la línea principal. Si además llega `title`, el
      // mensaje pasa a ser la descripción: así `toast('Guardado')` y
      // `toast('No se pudo guardar', { title: 'Error' })` se leen igual de bien.
      ...(opciones.title
        ? { description: description ?? mensaje }
        : { title: mensaje, ...(description === undefined ? {} : { description }) }),
      id,
      abierto: true,
    },
  ]);

  return id;
}

/** Cierra un aviso, o todos si no se le dice cuál. */
function descartar(id?: string) {
  emitir(avisos.map((a) => (id === undefined || a.id === id ? { ...a, abierto: false } : a)));
}

/** El que sale del DOM cuando Radix termina de cerrarlo. */
function retirar(id: string) {
  emitir(avisos.filter((a) => a.id !== id));
}

type Lanzador = {
  (mensaje: ReactNode, opciones?: ToastOptions): string;
  success: (mensaje: ReactNode, opciones?: ToastOptions) => string;
  error: (mensaje: ReactNode, opciones?: ToastOptions) => string;
  dismiss: (id?: string) => void;
};

/**
 * Lanza un aviso. Devuelve su id, que es lo que hay que guardar para cerrarlo a
 * mano —el caso de «guardando…» que se reemplaza cuando termina la petición.
 */
export const toast: Lanzador = Object.assign(crear, {
  success: (mensaje: ReactNode, opciones: ToastOptions = {}) =>
    crear(mensaje, { ...opciones, variant: 'success' }),
  error: (mensaje: ReactNode, opciones: ToastOptions = {}) =>
    crear(mensaje, { ...opciones, variant: 'error' }),
  dismiss: descartar,
});

export type ToasterProps = {
  /** Cuánto dura un aviso que no dice lo contrario. */
  duration?: number;
  /**
   * Nombre del landmark que Radix crea para la región de avisos. Se traduce
   * porque lo lee un lector de pantalla, y el default de Radix está en inglés.
   */
  label?: string;
};

/**
 * Va UNA vez, lo más arriba posible del árbol. Dos `Toaster` montados pintan
 * cada aviso dos veces: la lista es del módulo, no de la instancia.
 */
export function Toaster({ duration = 5000, label = 'Avisos' }: ToasterProps) {
  const lista = useSyncExternalStore(suscribirse, leer, enServidor);

  return (
    <ToastProvider duration={duration} label={label}>
      {lista.map(({ id, title, description, variant, duration: propio, action, abierto }) => (
        <Toast
          key={id}
          open={abierto}
          variant={variant ?? 'neutral'}
          {...(propio === undefined ? {} : { duration: propio })}
          onOpenChange={(sigue) => {
            if (!sigue) retirar(id);
          }}
        >
          <div className="min-w-0 flex-1">
            {title ? <ToastTitle>{title}</ToastTitle> : null}
            {description ? <ToastDescription>{description}</ToastDescription> : null}
          </div>
          {action}
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
