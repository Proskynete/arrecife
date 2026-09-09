import { Check, Copy } from '@phosphor-icons/react';
import { useCallback, useRef, useState } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { Icon } from '../../icons/index.tsx';

/**
 * `brand.hull` is «hull · outline and the background of code blocks», so a code
 * block is dark in light mode too. That is why the root declares
 * `data-theme="dark"`: everything inside — ink, hairline, accent — switches to
 * the dark palette regardless of the page's theme. It is the system's only
 * island of inverted theme, and it is deliberate.
 */
export type CodeBlockProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** The already-highlighted code, or flat text. */
  children: ReactNode;
  /** The language label. Shown in the top bar. */
  language?: string | undefined;
  /** The text copied to the clipboard. Without it, the button is not shown. */
  copyText?: string | undefined;
};

export function CodeBlock({ children, language, copyText, className, ...props }: CodeBlockProps) {
  const [copiado, setCopiado] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);

  const copy = useCallback(async () => {
    if (!copyText) return;
    try {
      await navigator.clipboard.writeText(copyText);
      setCopiado(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopiado(false), 2000);
    } catch {
      // With no clipboard permission there is nothing to be done: the text is
      // still selectable by hand.
    }
  }, [copyText]);

  return (
    <div
      data-theme="dark"
      className={cn(
        'rounded-card border-hairline bg-brand-hull overflow-hidden border',
        className,
      )}
      {...props}
    >
      <div className="border-hairline px-step-sm flex items-center justify-between border-b py-1.5">
        <span className="text-eyebrow font-mono text-text-muted uppercase">
          <span className="text-accent">❯</span> {language ?? 'código'}
        </span>

        {copyText ? (
          <button
            type="button"
            onClick={copy}
            aria-label={copiado ? 'Código copiado' : 'Copiar código'}
            aria-live="polite"
            className={cn(
              'gap-step-xs rounded-chip flex items-center px-2 py-1',
              'text-label font-mono text-text-muted cursor-pointer',
              'transition-standard hover:bg-surface hover:text-text-primary',
              'focus-ring',
            )}
          >
            {copiado ? <Icon as={Check} className="text-accent" /> : <Icon as={Copy} />}
            {copiado ? 'Copiado' : 'Copiar'}
          </button>
        ) : null}
      </div>

      {/*
        `tabIndex={0}` because the block SCROLLS. A region that scrolls and holds
        nothing focusable is unreachable by keyboard — WCAG 2.1.1 — and a code
        block is the one place in this system where the content is routinely
        wider than the box. `Table` has done this since it grew its own surface;
        this one had `overflow-x-auto` without it, and the axe that shipped with
        the older Chromium did not check the rule.
      */}
      <pre
        tabIndex={0}
        className={cn(
          'p-step-md font-mono text-meta text-text-primary overflow-x-auto leading-relaxed',
          // `focus-ring-inset` and not the plain ring: the root carries
          // `overflow-hidden` so its corners hold, and it clips an outward ring
          // on three sides. See the note beside the utility in build-tokens.mjs.
          'focus-ring focus-ring-inset',
        )}
      >
        {children}
      </pre>
    </div>
  );
}
