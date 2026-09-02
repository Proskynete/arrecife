import { Slot } from '@radix-ui/react-slot';
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
 * The footer carries the version and the branch (`v5.0.1 · main`) in the `meta`
 * scale. It is not decoration: in an admin it is the first thing anyone asks
 * when something looks off.
 */
export type SidebarItemProps = ComponentPropsWithoutRef<'a'> & {
  active?: boolean | undefined;
  asChild?: boolean | undefined;
  /** Counter on the right: pending drafts, unused media. */
  badge?: ReactNode;
};

export function SidebarItem({
  active = false,
  asChild = false,
  badge,
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
        <span aria-hidden="true" className={active ? 'text-accent' : 'text-text-muted'}>
          ▸
        </span>
        <span className="min-w-0 flex-1 truncate">{children}</span>
        {badge ? <span className="text-text-muted shrink-0">{badge}</span> : null}
      </Root>
    </li>
  );
}

export type SidebarNavProps = ComponentPropsWithoutRef<'nav'> & {
  /** The panel's heading. */
  title?: ReactNode;
  /** Version and branch, at the bottom. */
  version?: ReactNode;
  branch?: ReactNode;
};

export function SidebarNav({
  title,
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
