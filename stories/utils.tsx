import type { ReactNode } from 'react';

import { Text } from '../src/primitives/typography.tsx';

/** Shared scaffolding for the stories. It is not part of the public API. */

export function Row({ children }: { children: ReactNode }) {
  return <div className="gap-step-md flex flex-wrap items-center">{children}</div>;
}

export function Stack({ children }: { children: ReactNode }) {
  return <div className="gap-step-md flex max-w-content flex-col">{children}</div>;
}

export function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-step-lg">
      <Text variant="eyebrow" tone="muted" className="mb-step-sm">
        {title}
      </Text>
      {children}
    </section>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <Text variant="ui" tone="secondary" measure className="mt-step-sm">
      {children}
    </Text>
  );
}

export function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="text-label font-sans text-text-secondary">
      {children}
    </label>
  );
}
