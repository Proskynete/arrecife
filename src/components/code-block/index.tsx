import { useCallback, useRef, useState } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { Check, Copy } from '../../lib/glyphs.tsx';

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
            {copiado ? <Check className="text-accent" /> : <Copy />}
            {copiado ? 'Copiado' : 'Copiar'}
          </button>
        ) : null}
      </div>

      <pre className="p-step-md font-mono text-meta text-text-primary overflow-x-auto leading-relaxed">
        {children}
      </pre>
    </div>
  );
}
