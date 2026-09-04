import { Slot } from '@radix-ui/react-slot';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';

/**
 * The path as a path: `~ / artículos / cómo-escalar-un-equipo`.
 *
 * The `~` is neither decoration nor a house icon: it is the filesystem's home,
 * which is why the breadcrumb is mono and not sans. The separators use `border`
 * (#22414F), the faintest token that still reads as a line.
 *
 * The last crumb is the current page, so it is not a link and carries
 * `aria-current="page"`. That is the difference between an accessible breadcrumb
 * and four consecutive links, one of which goes nowhere.
 */
export type Crumb = {
  label: ReactNode;
  /** With no `href`, the crumb is text. The last one should never carry it. */
  href?: string | undefined;
};

export type BreadcrumbProps = Omit<ComponentPropsWithoutRef<'nav'>, 'children'> & {
  items: readonly Crumb[];
  /** Where the `~` goes. The site root by default. */
  homeHref?: string;
  /** Accessible label for the `~`, which otherwise reads as a stray tilde. */
  homeLabel?: string;
  /**
   * Renders the links through the child, to plug in Next's or Astro's `Link`.
   * It receives each `href` in the Slot's `props`.
   */
  linkAsChild?: ((props: { href: string; children: ReactNode }) => ReactNode) | undefined;
};

const LINK =
  'transition-standard hover:text-accent focus-ring rounded-chip cursor-pointer';

export function Breadcrumb({
  items,
  homeHref = '/',
  homeLabel = 'Inicio',
  linkAsChild,
  className,
  ...props
}: BreadcrumbProps) {
  const link = (href: string, content: ReactNode) =>
    linkAsChild ? (
      <Slot className={LINK}>{linkAsChild({ href, children: content })}</Slot>
    ) : (
      <a href={href} className={LINK}>
        {content}
      </a>
    );

  return (
    <nav aria-label="Ruta" className={cn('font-mono text-meta text-text-muted', className)} {...props}>
      <ol className="gap-step-xs flex flex-wrap items-center">
        <li>{link(homeHref, <span aria-label={homeLabel}>~</span>)}</li>

        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="gap-step-xs flex items-center">
              <span aria-hidden="true" className="text-border">
                /
              </span>
              {item.href && !last ? (
                link(item.href, item.label)
              ) : (
                <span aria-current={last ? 'page' : undefined} className="text-text-secondary">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
