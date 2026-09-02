import { useSyncExternalStore, type ComponentPropsWithoutRef } from 'react';

import { cn } from '../../lib/cn.ts';
import { Moon, Sun } from '../../lib/glyphs.tsx';
import { Button, type ButtonProps } from '../../primitives/button.tsx';
import { toggleTheme, watchTheme, currentTheme, type Theme } from '../../theme/index.ts';

/**
 * The control that was missing. The library defined the whole theming system and
 * exposed nothing that changes it, so two projects were reimplementing it.
 *
 * The hard part is not the button: it is that the first paint does not flash and
 * that the choice survives navigation. That lives in
 * `@eduardoalvarez/arrecife/theme`, which does not import React — an Astro that
 * mounts none consumes it — and out of it comes `themeScript`, which goes inline
 * in the `<head>`. Without that script this button works and you still get the
 * flash on every load.
 *
 * BOTH icons are always rendered and CSS hides the spare one with the `light:`
 * variant. It is not an optimisation: it is what stops the server and the client
 * from disagreeing. The server does not know which theme the reader chose, so
 * whichever icon it picks in the HTML has a fifty-fifty chance of being wrong,
 * and correcting it on hydration is the flash all over again.
 *
 * The accessible name does NOT say which mode you are going to. That would be
 * more informative and would be a lie half the time, for the same reason as
 * above: the server's HTML fixes it before the theme is known. «Cambiar de
 * tema» is always true.
 */
export type ThemeToggleProps = Omit<ComponentPropsWithoutRef<'button'>, 'onClick'> & {
  /** Accessible name. The button has no visible text, so it is the only thing naming it. */
  label?: string;
  /** Fires with whichever theme ended up set, in case the project wants to record it. */
  onThemeChange?: ((theme: Theme) => void) | undefined;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
};

export function ThemeToggle({
  label = 'Cambiar de theme',
  onThemeChange,
  variant = 'secondary',
  size = 'icon',
  className,
  ...props
}: ThemeToggleProps) {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      aria-label={label}
      // 19px, the same icon size as the footer links.
      className={cn('[&_svg]:size-[19px]', className)}
      onClick={() => onThemeChange?.(toggleTheme())}
      {...props}
    >
      {/* The target one, not the current state: you press it to go to the other. */}
      <Sun className="light:hidden" />
      <Moon className="hidden light:block" />
    </Button>
  );
}

/**
 * The theme set right now, for a project that needs to branch in React — a
 * different logo per mode, an image with no light version.
 *
 * It is `useSyncExternalStore` and not a `useState` with an effect behind it
 * because the theme is exactly that: state living outside React, in an attribute
 * on `<html>` that can change without React finding out. Writing it as an effect
 * calling `setState` on mount is the pattern that triggers a cascading render
 * and that the `set-state-in-effect` rule rightly flags.
 *
 * `getServerSnapshot` returns `'dark'` because there is no `document` on the
 * server. The client's first render matches the server's and the real value
 * arrives afterwards, which is the same hydration mismatch `ThemeToggle` avoids
 * by rendering both icons.
 *
 * Hence the usage rule: if what branches is ONLY style, this is not needed and
 * the `light:` variant is better — it re-renders nothing. This is for when the
 * content changes.
 */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, currentTheme, server);
}

const subscribe = (warn: () => void) => watchTheme(() => warn());
const server = (): Theme => 'dark';
