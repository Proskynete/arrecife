import type { ReactNode } from 'react';

import { Text } from '../src/primitives/typography.tsx';

/** Andamiaje compartido de las stories. No forma parte de la API pública. */

export function Fila({ children }: { children: ReactNode }) {
  return <div className="gap-step-md flex flex-wrap items-center">{children}</div>;
}

export function Pila({ children }: { children: ReactNode }) {
  return <div className="gap-step-md flex max-w-content flex-col">{children}</div>;
}

export function Bloque({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="mb-step-lg">
      <Text variant="eyebrow" tone="muted" className="mb-step-sm">
        {titulo}
      </Text>
      {children}
    </section>
  );
}

export function Nota({ children }: { children: ReactNode }) {
  return (
    <Text variant="ui" tone="secondary" measure className="mt-step-sm">
      {children}
    </Text>
  );
}

export function Etiqueta({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="text-label font-sans text-text-secondary">
      {children}
    </label>
  );
}
