import { Slot } from '@radix-ui/react-slot';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';

/**
 * The site bar: 64px, abyss at 86 % and a 14px blur behind it.
 *
 * It is page composition and not a primitive, but it lives in the library for a
 * concrete reason: the CLI aesthetic of the items — mono, `./section` format —
 * is the first thing that drifts when five projects each rewrite it on their
 * own.
 *
 * It renders a `<header>` hanging directly off the `body`, so it IS the site's
 * `banner` landmark. That is why `PageHeader` goes inside `<main>` and is not a
 * landmark: two banners on one page is an accessibility failure.
 *
 * The items go on the RIGHT, next to the actions, not straight after the brand.
 * With the brand on the left and the items right behind it, the navigation block
 * floats in the middle of the bar and the eye has to cross the gap twice: once
 * to read the brand and once to come back and find the section. Grouped on the
 * right, brand and navigation are two anchors instead of three.
 */
export type NavProps = ComponentPropsWithoutRef<'header'> & {
  /** The logo, on the left. */
  brand?: ReactNode;
  /** The section items. They go on the right, next to `actions`. */
  children?: ReactNode;
  /** Actions on the right: conversion, theme switch, search. */
  actions?: ReactNode;
};

export function Nav({ brand, children, actions, className, ...props }: NavProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full',
        // Abyss at 86 % with 14px of blur behind. The alpha rides on the token,
        // so it follows the mode: in light it is paper at 86 %.
        'bg-background/86 backdrop-blur-[14px]',
        'border-hairline border-b',
        className,
      )}
      {...props}
    >
      <div className="max-w-wide px-step-md h-nav gap-step-lg mx-auto flex items-center">
        {brand ? <div className="shrink-0">{brand}</div> : null}

        {children ? (
          <nav aria-label="Principal" className="ml-auto min-w-0">
            <ul className="gap-step-md flex items-center">
              {/*
                The prompt. It is the same CLI aesthetic as each item's `./` and
                the footer's `$`, and it is `aria-hidden` for the same reason: a
                screen reader announces «artículos», not «tilde slash artículos».

                It sits outside the `<li>`s on purpose. Putting it inside would
                turn the prompt into an element of the navigation list, and that
                list has to have exactly as many elements as there are sections.
              */}
              <span aria-hidden="true" className="text-text-muted font-mono text-meta select-none">
                ~/
              </span>
              {children}
            </ul>
          </nav>
        ) : (
          <div className="flex-1" />
        )}

        {actions ? <div className="gap-step-sm flex shrink-0 items-center">{actions}</div> : null}
      </div>
    </header>
  );
}

export type NavItemProps = ComponentPropsWithoutRef<'a'> & {
  /** Current section: biolume with a 1px underline. */
  active?: boolean | undefined;
  /** Renders the child instead of an `<a>`, for the router's `Link`. */
  asChild?: boolean | undefined;
};

/**
 * The `./` is put there by the component, not by whoever uses it.
 *
 * It is the same decision as the tertiary button: the format is part of the
 * piece, not a convention to be remembered across five projects. It is
 * `aria-hidden`, so a screen reader announces «artículos» and not «dot slash
 * artículos».
 *
 * The current section goes in BRACKETS as well as in biolume and underlined.
 * That is not decoration: the underline and the color are the same signal —
 * «this stands out» — and in a six-item mono bar at 13px that signal reads worse
 * than it looks in a mockup. Brackets are how a terminal marks the active path,
 * so they say «you are here» without relying on the color being told apart. They
 * are `aria-hidden`, because whoever is listening already has `aria-current`.
 */
export function NavItem({ active = false, asChild = false, className, children, ...props }: NavItemProps) {
  const Root = asChild ? Slot : 'a';

  return (
    <li>
      <Root
        aria-current={active ? 'page' : undefined}
        className={cn(
          'font-mono text-meta transition-standard cursor-pointer',
          'rounded-chip focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
          active
            ? 'text-accent underline decoration-1 underline-offset-4'
            : 'text-text-secondary hover:text-accent',
          className,
        )}
        {...props}
      >
        {active ? (
          <span aria-hidden="true" className="text-accent">
            [
          </span>
        ) : null}
        <span aria-hidden="true" className={active ? 'text-accent' : 'text-text-muted'}>
          ./
        </span>
        {children}
        {active ? (
          <span aria-hidden="true" className="text-accent">
            ]
          </span>
        ) : null}
      </Root>
    </li>
  );
}
