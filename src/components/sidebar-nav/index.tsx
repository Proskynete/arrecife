import { Slot } from '@radix-ui/react-slot';
import { useId } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { Text } from '../../primitives/typography.tsx';

/**
 * The blog admin's sidebar.
 *
 * The `▸` is put there by the component, same as `NavItem`'s `./` and the
 * breadcrumb's `~`: it is the same CLI aesthetic and the same decision — the
 * format is part of the piece, not a convention to be remembered. It is
 * `aria-hidden`.
 *
 * An `icon` REPLACES it rather than joining it. Two marks before a label is one
 * more than the eye needs, and the `▸` exists to say «this is a place you can
 * go» — which is exactly what a section icon already says, and says better. A
 * sidebar with no icons keeps the prompt, which is the reading sites' case.
 *
 * The footer carries the version and the branch (`v5.0.1 · main`) in the `meta`
 * scale. It is not decoration: in an admin it is the first thing anyone asks
 * when something looks off.
 */
export type SidebarItemProps = ComponentPropsWithoutRef<'a'> & {
  active?: boolean | undefined;
  asChild?: boolean | undefined;
  /** Counter on the right: pending drafts, unused media. */
  badge?: ReactNode;
  /**
   * The section's glyph, on the left. It REPLACES the `▸` rather than joining
   * it, and it inherits `currentColor`, so it follows the item's state without
   * being tinted separately.
   */
  icon?: ReactNode;
};

export function SidebarItem({
  active = false,
  asChild = false,
  badge,
  icon,
  className,
  children,
  ...props
}: SidebarItemProps) {
  const Root = asChild ? Slot : 'a';

  return (
    <li>
      <Root
        aria-current={active ? 'page' : undefined}
        className={cn(
          'rounded-chip px-step-sm gap-step-xs flex cursor-pointer items-center py-1.5',
          'font-mono text-meta transition-standard',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          // The active item is `surfaceRaised` with primary ink, same as
          // `TabsTrigger`. NOT biolume: `tokens.ts` says so explicitly — light
          // accent passes over background and over surface, but over
          // surfaceRaised it measures 4.2 and is not a text color there. The
          // accent stays on the `▸`, which is decorative and gets the 3:1
          // threshold.
          active
            ? 'bg-surface-raised text-text-primary'
            : 'text-text-secondary hover:text-text-primary hover:bg-surface-raised',
          className,
        )}
        {...props}
      >
        {icon ? (
          // A shade bigger than the 13px mono label, which is what keeps it
          // reading as a glyph rather than as a character in the word.
          <span aria-hidden="true" className="text-body shrink-0">
            {icon}
          </span>
        ) : (
          <span aria-hidden="true" className={active ? 'text-accent' : 'text-text-muted'}>
            ▸
          </span>
        )}
        <span className="min-w-0 flex-1 truncate">{children}</span>
        {badge ? <span className="text-text-muted shrink-0">{badge}</span> : null}
      </Root>
    </li>
  );
}

/**
 * A labelled block of items — «Contenido», «Alumnos», «Ventas».
 *
 * A panel's sidebar stops being readable somewhere around eight items, and the
 * fix is not a scrollbar: it is saying what the blocks are. The label is a `<p>`
 * and not a heading, because a heading here would land in the document outline
 * between the page's own — a sidebar is navigation, not content.
 *
 * The items go in a nested `<ul>` named by that label, which is what gives a
 * screen reader «lista Ventas, 3 elementos» instead of one list of eleven.
 */
export type SidebarGroupProps = Omit<ComponentPropsWithoutRef<'li'>, 'title'> & {
  /** The block's name. Sentence case, not a section title. */
  label: ReactNode;
};

export function SidebarGroup({ label, children, className, ...props }: SidebarGroupProps) {
  const id = useId();

  return (
    <li className={cn('mt-step-md first:mt-0', className)} {...props}>
      <Text variant="meta" tone="muted" as="p" id={id} className="px-step-sm pb-step-xs">
        {label}
      </Text>
      <ul aria-labelledby={id} className="gap-0.5 flex flex-col">
        {children}
      </ul>
    </li>
  );
}

export type SidebarNavProps = ComponentPropsWithoutRef<'nav'> & {
  /**
   * The panel's heading, as an eyebrow. It also names the `<nav>` when it is a
   * string, which is why a `brand` row does not replace it: a logo is not an
   * accessible name. Pass `aria-label` when neither fits.
   */
  title?: ReactNode;
  /**
   * The row at the top: isotype and wordmark, `cursos · admin`. It is a slot and
   * not a `logo`/`name` pair because every panel spells its own name
   * differently, and the part that IS the system — the rhythm, the hairline
   * under it — is here.
   */
  brand?: ReactNode;
  /** Version and branch, at the bottom. */
  version?: ReactNode;
  branch?: ReactNode;
};

export function SidebarNav({
  title,
  brand,
  version,
  branch,
  children,
  className,
  ...props
}: SidebarNavProps) {
  const footer = [version, branch].filter(Boolean);

  return (
    <nav
      aria-label={typeof title === 'string' ? title : 'Administración'}
      className={cn(
        'border-hairline bg-surface p-step-sm gap-step-sm flex h-full flex-col border-r',
        className,
      )}
      {...props}
    >
      {brand ? (
        <div className="border-hairline px-step-sm pb-step-sm mb-step-xs border-b">{brand}</div>
      ) : null}

      {title ? (
        <Text variant="eyebrow" tone="muted" as="p" className="px-step-sm">
          {title}
        </Text>
      ) : null}

      <ul className="gap-0.5 flex flex-1 flex-col">{children}</ul>

      {footer.length > 0 ? (
        <Text variant="meta" tone="muted" as="p" className="border-hairline px-step-sm pt-step-sm border-t">
          {footer.map((p, i) => (
            <span key={i}>
              {i > 0 ? <span aria-hidden="true"> · </span> : null}
              {p}
            </span>
          ))}
        </Text>
      ) : null}
    </nav>
  );
}
