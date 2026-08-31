import { useCallback, useRef, useState } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { Check, Copy } from '../../lib/glyphs.tsx';

/**
 * `brand.hull` es «casco · contorno y fondo de bloques de código», así que un
 * bloque de código es oscuro también en modo claro. Por eso la raíz declara
 * `data-theme="dark"`: todo lo de dentro — tinta, hairline, acento — pasa a la
 * paleta oscura sin importar el tema de la página. Es la única isla de tema
 * invertido del sistema, y es deliberada.
 */
export type CodeBlockProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** El código ya resaltado, o texto plano. */
  children: ReactNode;
  /** Etiqueta del lenguaje. Se muestra en la barra superior. */
  language?: string | undefined;
  /** Texto que se copia al portapapeles. Sin esto, no se muestra el botón. */
  copyText?: string | undefined;
};

export function CodeBlock({ children, language, copyText, className, ...props }: CodeBlockProps) {
  const [copiado, setCopiado] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout>>(null);

  const copiar = useCallback(async () => {
    if (!copyText) return;
    try {
      await navigator.clipboard.writeText(copyText);
      setCopiado(true);
      if (temporizador.current) clearTimeout(temporizador.current);
      temporizador.current = setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Sin permiso de portapapeles no hay nada que hacer: el texto sigue
      // seleccionable a mano.
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
            onClick={copiar}
            aria-label={copiado ? 'Código copiado' : 'Copiar código'}
            aria-live="polite"
            className={cn(
              'gap-step-xs rounded-chip flex items-center px-2 py-1',
              'text-label font-mono text-text-muted cursor-pointer',
              'transition-standard hover:bg-surface hover:text-text-primary',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
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
