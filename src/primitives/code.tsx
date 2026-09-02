import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

/**
 * Inline code, inside prose.
 *
 * It exists because it did not: every consumer wrote `<code className="font-mono">`
 * by hand, and the brand story did it four times in a single paragraph. A bare
 * `<code>` inherits the paragraph's size, so inside `body` (18px) you saw an
 * 18px mono that the document has nowhere.
 *
 * It is not `CodeBlock`. The block is an island of dark theme over hull with a
 * bar and a copy button; this is one word inside a sentence, which is why it
 * stays on the page surface instead of inverting the theme.
 */
export type CodeProps = ComponentPropsWithoutRef<'code'>;

export function Code({ className, ...props }: CodeProps) {
  return (
    <code
      className={cn(
        'rounded-chip border-hairline bg-surface-raised border',
        'font-mono text-meta text-text-primary',
        'px-1 py-0.5',
        className,
      )}
      {...props}
    />
  );
}
