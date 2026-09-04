import { Slot } from '@radix-ui/react-slot';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { Text } from '../../primitives/typography.tsx';

/**
 * «En esta página». The long article's table of contents.
 *
 * It is a `<nav>` with an accessible name of its own, not a loose list: on a
 * page that already has the site bar and the breadcrumb, a third group of links
 * with no name is indistinguishable from the other two for anyone navigating by
 * landmarks.
 *
 * The active entry is marked with `aria-current`, not with color alone — the
 * section you are in cannot be communicated purely in biolume.
 *
 * And that attribute is also THE HOOK: the active classes are applied with the
 * `aria-[current]:` variant, not with a ternary in the render. The difference is
 * the one between serving controlled only and also serving uncontrolled.
 *
 * An Astro site solves scroll-spy with fifteen lines of script that set
 * `aria-current` on the visible link and remove it from the previous one. With
 * the state computed in the render, that script could do nothing: the table of
 * contents had to be hydrated as a React island on every article for something
 * that costs zero framework JavaScript. Now the CSS reacts to the attribute and
 * both ways of using it give the same result.
 *
 * The hook is the PRESENCE of the attribute, so it is removed to unmark; you do
 * not set `aria-current="false"`.
 */
export type TocEntry = {
  /** The anchor, with its `#`. */
  href: string;
  label: ReactNode;
  /** Indents the entry. Only two levels: h2 and h3. */
  nested?: boolean | undefined;
};

export type TableOfContentsProps = Omit<ComponentPropsWithoutRef<'nav'>, 'children'> & {
  items: readonly TocEntry[];
  /** The block's title. */
  title?: ReactNode;
  /** The anchor of the visible section. */
  activeHref?: string | undefined;
  linkAsChild?: ((props: { href: string; children: ReactNode }) => ReactNode) | undefined;
};

export function TableOfContents({
  items,
  title = 'En esta página',
  activeHref,
  linkAsChild,
  className,
  ...props
}: TableOfContentsProps) {
  return (
    <nav aria-label={typeof title === 'string' ? title : 'En esta página'} className={cn('gap-step-sm flex flex-col', className)} {...props}>
      <Text variant="eyebrow" tone="muted" as="p">
        {title}
      </Text>

      <ul className="border-hairline gap-step-xs flex flex-col border-l">
        {items.map((item) => {
          const active = item.href === activeHref;
          const classes = cn(
            'px-step-sm -ml-px block border-l',
            'font-sans text-label transition-standard',
            'focus-ring',
            'cursor-pointer',
            item.nested && 'pl-step-lg',
            'border-transparent text-text-secondary hover:text-text-primary',
            // The active hover is declared with both variants together so it
            // beats the `hover:` above by specificity and not by the order
            // Tailwind happens to emit the rules in.
            'aria-[current]:border-accent aria-[current]:text-accent aria-[current]:hover:text-accent',
          );

          return (
            <li key={item.href}>
              {linkAsChild ? (
                <Slot className={classes} aria-current={active ? 'location' : undefined}>
                  {linkAsChild({ href: item.href, children: item.label })}
                </Slot>
              ) : (
                <a href={item.href} className={classes} aria-current={active ? 'location' : undefined}>
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
