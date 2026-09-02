import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { Text } from '../../primitives/typography.tsx';

/**
 * One header at two scales, not two components.
 *
 * The portfolio's hero and the courses one turned out to be the same skeleton —
 * eyebrow in accent, headline, clamped paragraph — at different sizes. Splitting
 * them into `Hero` and `PageHeader` would have duplicated the same rule in two
 * places and left the door open for them to drift apart over time.
 *
 * `display` for covers, `page` for section headers.
 *
 * It takes no mascot face, at either scale: faces go in empty states,
 * confirmations, errors, course progress and celebration.
 *
 * It renders a `<header>`, and it goes INSIDE `<main>`. A `<header>` hanging
 * directly off `<body>` becomes a `banner` landmark, and then it competes with
 * the site header: two banners on one page is an accessibility failure. Inside
 * `<main>` it is not a landmark and it is the content's header, which is what
 * this component is.
 */
const header = cva('gap-step-sm flex flex-col', {
  variants: {
    size: {
      display: 'py-section',
      page: 'py-step-xl',
    },
  },
  defaultVariants: { size: 'page' },
});

export type PageHeaderProps = Omit<ComponentPropsWithoutRef<'header'>, 'title'> &
  VariantProps<typeof header> & {
    title: ReactNode;
    /** Mono, small caps, in accent. It is the section the page belongs to. */
    eyebrow?: ReactNode | undefined;
    description?: ReactNode | undefined;
    /**
     * Slot for the calls to action. If a conversion button goes here, it is the
     * only one on the screen.
     */
    action?: ReactNode | undefined;
    /** The headline's level. `h1` unless the page already has one. */
    as?: 'h1' | 'h2' | undefined;
  };

export function PageHeader({
  title,
  eyebrow,
  description,
  action,
  size,
  as = 'h1',
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header className={cn(header({ size }), className)} {...props}>
      {eyebrow ? (
        <Text variant="eyebrow" tone="accent" as="p">
          {eyebrow}
        </Text>
      ) : null}

      <Text as={as} variant={size === 'display' ? 'display' : 'h1'} className="max-w-measure">
        {title}
      </Text>

      {description ? (
        <Text variant="body" tone="secondary">
          {description}
        </Text>
      ) : null}

      {action ? <div className="gap-step-sm mt-step-sm flex flex-wrap items-center">{action}</div> : null}
    </header>
  );
}
