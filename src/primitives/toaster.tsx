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
 * The ONLY thing re-exported from `toast.tsx`. The rest of the Radix primitive —
 * `Toast`, `ToastProvider`, `ToastViewport`, `ToastTitle`, `ToastDescription` —
 * stopped being public API in 0.5.0.
 *
 * The reason is that it had no use case of its own. `Toaster` is built on top
 * and covers everything the projects do; the lower layer only served to bind a
 * toast to a component's lifecycle, which nobody does. Two ways of showing the
 * same thing force a choice at every call site, and that choice had no criterion
 * to settle it.
 *
 * `ToastAction` does stay: it is what you pass in `action` when the toast offers
 * an undo, and without it that prop cannot be built from outside.
 */
export { ToastAction } from './toast.tsx';

/**
 * The imperative face of Radix's `Toast`: `toast('Guardado')` from anywhere,
 * without threading the notice through props down to the component that fires
 * it.
 *
 * It exists because two projects were pulling in `sonner` for this. `Toast`
 * covers the same role and has a different shape: Radix is declarative with a
 * provider, and to show a notice from a `fetch`'s `catch` you have to lift state
 * up to where the provider lives. That is exactly what `sonner` avoids, and it
 * is a real need, not an API preference.
 *
 * The alternative was for the two projects to adapt. It was ruled out: the
 * notice is fired by the data layer, which has no component nearby to hang a
 * `useState` on — nor should it.
 *
 * What was NOT copied from `sonner` is the whole catalogue. There is no
 * `toast.promise`, no `toast.custom`, no configurable positions, no stacking
 * with perspective: they are four variations on the same thing and each one is
 * public surface that has to be maintained. What is here are the three shapes
 * the projects actually use — neutral, success, error — plus `dismiss`, and
 * nothing else.
 *
 * State lives in a module, not in a context, because the whole point is being
 * callable from outside the tree. `Toaster` subscribes with
 * `useSyncExternalStore`, which is React 19's way of reading external state
 * without effects or cascading renders.
 */
export type ToastVariant = NonNullable<ToastProps['variant']>;

export type ToastOptions = {
  /** The first line, in bold. Without it the notice is a single sentence. */
  title?: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  /** Milliseconds on screen. `Infinity` leaves it until it is closed by hand. */
  duration?: number;
  /** A `ToastAction`, if the notice offers an undo. */
  action?: ReactNode;
};

type Notice = ToastOptions & { id: string; open: boolean };

let warnings: readonly Notice[] = [];
const subscribers = new Set<() => void>();
let counter = 0;

function emit(next: readonly Notice[]) {
  warnings = next;
  for (const warn of subscribers) warn();
}

const subscribe = (warn: () => void) => {
  subscribers.add(warn);
  return () => {
    subscribers.delete(warn);
  };
};

const read = () => warnings;

/**
 * On the server the list is always empty, and it has to be ALWAYS THE SAME
 * array: returning a freshly created `[]` on every call makes React see a new
 * value on every render and loop.
 */
const EMPTY: readonly Notice[] = [];
const onServer = () => EMPTY;

function create(message: ReactNode, options: ToastOptions = {}): string {
  counter += 1;
  const id = `arrecife-toast-${counter}`;
  const { description, ...rest } = options;

  emit([
    ...warnings,
    {
      ...rest,
      // The first argument is the main line. If a `title` also arrives, the
      // message becomes the description: that way `toast('Guardado')` and
      // `toast('No se pudo guardar', { title: 'Error' })` both read well.
      ...(options.title
        ? { description: description ?? message }
        : { title: message, ...(description === undefined ? {} : { description }) }),
      id,
      open: true,
    },
  ]);

  return id;
}

/** Closes one notice, or all of them if it is not told which. */
function discard(id?: string) {
  emit(warnings.map((a) => (id === undefined || a.id === id ? { ...a, open: false } : a)));
}

/** The one that leaves the DOM when Radix has finished closing it. */
function remove(id: string) {
  emit(warnings.filter((a) => a.id !== id));
}

type Trigger = {
  (message: ReactNode, options?: ToastOptions): string;
  success: (message: ReactNode, options?: ToastOptions) => string;
  error: (message: ReactNode, options?: ToastOptions) => string;
  dismiss: (id?: string) => void;
};

/**
 * Fires a notice. It returns its id, which is what you keep in order to close it
 * by hand — the «guardando…» case that gets replaced when the request finishes.
 */
export const toast: Trigger = Object.assign(create, {
  success: (message: ReactNode, options: ToastOptions = {}) =>
    create(message, { ...options, variant: 'success' }),
  error: (message: ReactNode, options: ToastOptions = {}) =>
    create(message, { ...options, variant: 'error' }),
  dismiss: discard,
});

export type ToasterProps = {
  /** How long a notice lasts when it does not say otherwise. */
  duration?: number;
  /**
   * The name of the landmark Radix creates for the notices region. It is
   * translated because a screen reader reads it, and Radix's default is in
   * English.
   */
  label?: string;
};

/**
 * Mount it ONCE, as high in the tree as possible. Two mounted `Toaster`s paint
 * every notice twice: the list belongs to the module, not to the instance.
 */
export function Toaster({ duration = 5000, label = 'Avisos' }: ToasterProps) {
  const list = useSyncExternalStore(subscribe, read, onServer);

  return (
    <ToastProvider duration={duration} label={label}>
      {list.map(({ id, title, description, variant, duration: own, action, open }) => (
        <Toast
          key={id}
          open={open}
          variant={variant ?? 'neutral'}
          {...(own === undefined ? {} : { duration: own })}
          onOpenChange={(stillOpen) => {
            if (!stillOpen) remove(id);
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
