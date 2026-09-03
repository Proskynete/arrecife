import { Slot } from '@radix-ui/react-slot';
import { createContext, useContext, useId } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { ChevronLeft, ChevronRight } from '../../lib/glyphs.tsx';
import { cn } from '../../lib/cn.ts';
import { Text } from '../../primitives/typography.tsx';

/**
 * Whether the sidebar is a rail, read by the items and the groups.
 *
 * It is a context and not a prop threaded down because the alternative is
 * `collapsed` on `SidebarNav`, on every `SidebarGroup` and on all eleven
 * `SidebarItem`s, kept in step by hand — which is the same list-maintained-
 * against-another-list that § 15 is about. The default is `false`, so an item
 * used outside a `SidebarNav` behaves exactly as it did.
 */
const Collapsed = createContext(false);

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
  const collapsed = useContext(Collapsed);

  return (
    <li>
      <Root
        aria-current={active ? 'page' : undefined}
        className={cn(
          'rounded-chip px-step-sm gap-step-xs flex cursor-pointer items-center py-1.5',
          collapsed && 'justify-center',
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
        {/*
          Collapsed, the name goes to `sr-only` and is NOT removed. A rail of
          bare glyphs with no accessible name is a list of links called
          «enlace, enlace, enlace», and the person who most needs the label is
          the one who cannot see the icon that replaced it.
        */}
        <span className={collapsed ? 'sr-only' : 'min-w-0 flex-1 truncate'}>{children}</span>

        {badge ? (
          <span className={cn('text-text-muted', collapsed ? 'sr-only' : 'shrink-0')}>{badge}</span>
        ) : null}
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
  const collapsed = useContext(Collapsed);

  return (
    <li
      className={cn(
        'mt-step-md first:mt-0',
        // In a rail the label has nowhere to go, so the block becomes a rule.
        // The label itself stays in the accessibility tree naming the list.
        collapsed && 'border-hairline pt-step-md mt-step-sm border-t first:border-t-0',
        className,
      )}
      {...props}
    >
      <Text
        variant="meta"
        tone="muted"
        as="p"
        id={id}
        className={collapsed ? 'sr-only' : 'px-step-sm pb-step-xs'}
      >
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
   *
   * Collapsed, it is hidden: a wordmark does not fit in a rail and the component
   * cannot trim somebody else's markup. Pass the isotype on its own through
   * `mark` for the rail to keep something at the top.
   */
  brand?: ReactNode;
  /** What `brand` becomes in the rail. Usually the isotype with no wordmark. */
  mark?: ReactNode;
  /**
   * Who is signed in, at the bottom above the version. A slot, because an avatar
   * needs a session and a sign-out route and the library takes no project
   * infrastructure — the same reason `Nav`'s user menu goes in `actions`.
   */
  user?: ReactNode;
  /**
   * Turns the sidebar into a rail: icons only, and the widths become the
   * library's — `w-sidebar` and `w-sidebar-rail`. It is CONTROLLED and there is
   * no uncontrolled mode, because this state is almost always persisted in a
   * cookie or in `localStorage`, and an internal state would fight the one the
   * project already keeps.
   */
  collapsed?: boolean | undefined;
  /**
   * Called with what the state should become. With it, the toggle appears; with
   * `collapsed` alone the sidebar is a rail with no way out of it, which is a
   * legitimate layout and not an accident.
   */
  onCollapsedChange?: ((collapsed: boolean) => void) | undefined;
  /** The toggle's accessible name, in the two directions. */
  collapseLabel?: string;
  expandLabel?: string;
  /** Version and branch, at the bottom. */
  version?: ReactNode;
  branch?: ReactNode;
};

export function SidebarNav({
  title,
  brand,
  mark,
  user,
  collapsed = false,
  onCollapsedChange,
  collapseLabel = 'Plegar el panel',
  expandLabel = 'Desplegar el panel',
  version,
  branch,
  children,
  className,
  ...props
}: SidebarNavProps) {
  const footer = [version, branch].filter(Boolean);
  const top = collapsed ? mark : brand;

  return (
    <Collapsed.Provider value={collapsed}>
      <nav
        aria-label={typeof title === 'string' ? title : 'Administración'}
        className={cn(
          'border-hairline bg-surface p-step-sm gap-step-sm flex h-full flex-col border-r',
          // The width is the component's only when it can collapse: the layout
          // beside it has to reserve one of the two, and it cannot know which.
          // It does NOT transition. The system's only transition animates colour
          // and border, and a rail that slides is the entrance animation this
          // library does not have — same call as the `Switch` knob, which changes
          // position without moving.
          onCollapsedChange && (collapsed ? 'w-sidebar-rail' : 'w-sidebar'),
          className,
        )}
        {...props}
      >
        {top || onCollapsedChange ? (
          <div
            className={cn(
              'border-hairline px-step-sm pb-step-sm mb-step-xs gap-step-xs flex items-center border-b',
              collapsed ? 'justify-center' : 'justify-between',
            )}
          >
            {top ? <span className="min-w-0">{top}</span> : null}

            {onCollapsedChange ? (
              <button
                type="button"
                onClick={() => onCollapsedChange(!collapsed)}
                aria-expanded={!collapsed}
                aria-label={collapsed ? expandLabel : collapseLabel}
                className={cn(
                  'rounded-chip transition-standard shrink-0 cursor-pointer p-1',
                  'text-text-muted hover:text-text-primary hover:bg-surface-raised',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                )}
              >
                {collapsed ? <ChevronRight /> : <ChevronLeft />}
              </button>
            ) : null}
          </div>
        ) : null}

        {title && !collapsed ? (
          <Text variant="eyebrow" tone="muted" as="p" className="px-step-sm">
            {title}
          </Text>
        ) : null}

        <ul className="gap-0.5 flex flex-1 flex-col">{children}</ul>

        {user ? (
          <div
            className={cn(
              'border-hairline px-step-sm pt-step-sm border-t',
              collapsed && 'flex justify-center',
            )}
          >
            {user}
          </div>
        ) : null}

        {footer.length > 0 && !collapsed ? (
          <Text
            variant="meta"
            tone="muted"
            as="p"
            className={cn('px-step-sm', user ? '' : 'border-hairline pt-step-sm border-t')}
          >
            {footer.map((p, i) => (
              <span key={i}>
                {i > 0 ? <span aria-hidden="true"> · </span> : null}
                {p}
              </span>
            ))}
          </Text>
        ) : null}
      </nav>
    </Collapsed.Provider>
  );
}
