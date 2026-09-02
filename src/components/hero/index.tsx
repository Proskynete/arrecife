import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { Mascot } from '../../brand/mascot.tsx';
import type { Pose } from '../../brand/catalog.ts';
import { cn } from '../../lib/cn.ts';
import { Text } from '../../primitives/typography.tsx';

/**
 * ONE per site. It is the only piece in the system that is spent like the
 * conversion button, and for the same reason: if there are two, there are none.
 *
 * Gradient, panel radius, text at 62 % of the width and the pose bleeding off
 * the bottom-right corner. That is the `header` variant, which is the default.
 *
 * On mobile there is no edge to bleed off, so the pose drops into the flow,
 * below the buttons. It is not a `hidden` on small screens: the pose is 40 % of
 * the hero's personality.
 *
 * The other variant is `centered`, and it exists because the rule above has a
 * case where it does not apply. «Never centred» was written against the hero of
 * a page with more content below it: there, a centred mascot under the headline
 * is a cover illustration, not a header. But a links page is centred end to end
 * and the mascot is the protagonist, not the flourish. That project skipped
 * `Hero` entirely over this, which is worse: a declared rule with a name can be
 * argued with; a copy of the gradient in another repo just drifts. The pose goes
 * ABOVE the headline, not below it, so it still does not read as the
 * illustration closing a block of text.
 *
 * The gradient comes from `--gradient-hero`, so it follows the mode. There is no
 * hand-written angle in any project.
 */
export type HeroProps = Omit<ComponentPropsWithoutRef<'section'>, 'title'> & {
  title: ReactNode;
  /** Mono, small caps, in accent. */
  eyebrow?: ReactNode;
  description?: ReactNode;
  /** The buttons. The screen's only `conversion` goes here. */
  action?: ReactNode;
  /** Tiburoncín's pose. Without it the hero is a panel with text. */
  pose?: Pose | undefined;
  basePath?: string | undefined;
  /**
   * `header` bleeds the pose off the corner; `centered` puts it on top and
   * centres the text, for a page that is only this.
   */
  variant?: 'header' | 'centered';
};

export function Hero({
  title,
  eyebrow,
  description,
  action,
  pose,
  basePath,
  variant = 'header',
  className,
  ...props
}: HeroProps) {
  const centered = variant === 'centered';

  return (
    <section
      className={cn(
        'gradient-hero rounded-panel border-hairline relative overflow-hidden border',
        // 44 top, 40 on the sides and bottom. From the document.
        'px-step-xl pt-[44px] pb-step-xl',
        className,
      )}
      {...props}
    >
      {centered && pose ? (
        <Mascot
          pose={pose}
          basePath={basePath}
          className="mb-step-md mx-auto w-48 md:w-56"
        />
      ) : null}

      <div
        className={cn(
          'gap-step-md flex flex-col',
          centered ? 'items-center text-center' : 'md:max-w-[62%]',
        )}
      >
        {eyebrow ? (
          <Text variant="eyebrow" tone="accent" as="p">
            {eyebrow}
          </Text>
        ) : null}

        <Text as="h1" variant="display">
          {title}
        </Text>

        {description ? (
          <Text variant="body" tone="secondary">
            {description}
          </Text>
        ) : null}

        {action ? (
          <div
            className={cn(
              'gap-step-sm mt-step-xs flex flex-wrap items-center',
              centered && 'justify-center',
            )}
          >
            {action}
          </div>
        ) : null}
      </div>

      {!centered && pose ? (
        <Mascot
          pose={pose}
          basePath={basePath}
          className={cn(
            // On mobile, in the flow and below the buttons. From md up, bleeding
            // off the bottom-right corner.
            'mt-step-lg mx-auto w-40',
            'md:mt-0 md:absolute md:right-0 md:-bottom-4 md:mx-0 md:w-64',
          )}
        />
      ) : null}
    </section>
  );
}
