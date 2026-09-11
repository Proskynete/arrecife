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
 * The size picks the title's scale by default, and `titleVariant` lets the
 * screen pick another one. The default is the document's — «h1 44/700» on the
 * six interior pages of the reading site — and it is right there. It is not
 * right in the two admin apps: `blog-content-manager` titles its twelve screens
 * at 24px, and `cursos` titles 29 of its 32 at `h3` — every one in the panel —
 * and the other three, the public catalog pages, at `h2`. Both are rungs the
 * scale already has, and a third `size` could only have named one of them. See
 * `docs/decisions/0.11.md` § 57.
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
    /**
     * The headline's scale, when the screen needs a different one from what
     * `size` gives — `display` for `display`, `h1` for `page`.
     *
     * It is the same split `Text` makes: `as` is the level, this is how big it
     * looks. A panel's `<h1>` at `h3` is still the page's only `h1`. The padding
     * stays with `size`, so a header inside a layout that already spaces its
     * content passes `className="py-0"`.
     *
     * Only the four headline scales, all in the display family. `stat` is for
     * numbers and `body` is not a headline.
     */
    titleVariant?: 'display' | 'h1' | 'h2' | 'h3' | undefined;
  };

export function PageHeader({
  title,
  eyebrow,
  description,
  action,
  size,
  as = 'h1',
  titleVariant,
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

      <Text
        as={as}
        variant={titleVariant ?? (size === 'display' ? 'display' : 'h1')}
        className="max-w-measure"
      >
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
