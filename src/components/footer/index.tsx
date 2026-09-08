import { Slot } from '@radix-ui/react-slot';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { Text } from '../../primitives/typography.tsx';
import { naming } from '../../tokens/tokens.ts';

/**
 * The footer, and the site's CLI signature: `$ cd ~/eduardoalvarez.dev/2026`.
 *
 * The domain defaults to `naming.domain` and not to a hand-written string, for
 * the same reason as the wordmark: if it changes, it changes in all five
 * projects at once. A project that lives on its OWN domain passes `domain` —
 * see `docs/decisions/0.9.md` § 49.
 *
 * The social links are icons with NO visible text, so `aria-label` is not an
 * improvement: it is the only thing that makes them legible. Which is why it is
 * mandatory in the type and not an optional prop that gets forgotten.
 *
 * IT HAS TWO SHAPES, and the one that already existed is the one you get by
 * passing nothing. That is not a courtesy: of the three projects that draw a
 * footer, two want what was already there — `eduardoalvarez.dev` in 56 lines and
 * `links` in a 64-line Astro replica — and only `cursos` wanted more. Changing
 * the default would have broken the two that work to serve the one that did not.
 *
 * It is the third time the system answers «one component, two shapes» and the
 * answer has not moved: `EmptyState` is a discriminated union where `page` is
 * the default and `inline` cannot be handed a face; `Nav` takes a `size` where
 * `default` is the bar it always was. Both left what was written before exactly
 * where it was. See `docs/decisions/0.8.md` § 44.
 *
 * The union is what holds the rule up. `columns`, `description` and `action`
 * exist only on `full`, and the default form cannot be handed one. As loose
 * optional props they would compose into a third shape that nobody designed and
 * nothing describes — a footer with columns and no description, or with a
 * description and no columns, laid out by whichever branch happened to run.
 */
export type SocialLink = {
  /** What replaces the visible text. Mandatory. */
  label: string;
  href: string;
  /**
   * The glyph, at 19px. Brands are SOLID (`fill`) and functional icons use a 1.6
   * stroke. Never an emoji.
   */
  icon: ReactNode;
};

/** One link in a column of the full footer. */
export type FooterColumnLink = {
  label: ReactNode;
  href: string;
  /** Opens in a new tab, with the `rel` that has to go with it. */
  external?: boolean | undefined;
};

/**
 * A column of the full footer: a mono heading in small caps and its links.
 *
 * The columns are not decoration and they are not a sitemap. Two of the three in
 * `cursos` change with who is looking — «Administración» with panel and metrics
 * for an admin, «Cuenta» with my courses and my diplomas for everybody else —
 * and a flat row of nine links cannot express that. Which is why this is data
 * the project builds and not a `children` the library walks.
 */
export type FooterColumn = {
  title: string;
  links: readonly FooterColumnLink[];
};

/**
 * `children` is OMITTED, and it is the point of the type rather than an
 * oversight.
 *
 * The footer used to take a row of loose text links this way — `./rss`,
 * `./aviso-legal` — and that row is what `variant="full"`'s columns replace. A
 * flat row cannot say which block a link belongs to, cannot carry a heading a
 * screen reader can jump to, and made whoever wrote the label type the `./`
 * themselves, which the columns put there. See docs/decisions/0.8.md § 47.
 */
type FooterBase = Omit<ComponentPropsWithoutRef<'footer'>, 'children'> & {
  social?: readonly SocialLink[];
  /** The signature's year. */
  year?: number;
  /**
   * The brand row: the fin and the wordmark, at the very top.
   *
   * It exists because without it that row ended up inside `children` with a
   * `w-full` so it would take a line of its own. It worked and it was a patch:
   * the brand is not one more text link, and a slot of its own says so in the
   * type.
   */
  brand?: ReactNode;
  /**
   * Makes the domain inside the signature a link, keeping the `$`, the path and
   * the prompt's mark as text.
   *
   * Only the domain: linking the whole line would turn a prompt into a button
   * and put `cd ~/` inside the accessible name of the link. Without it the
   * signature is text, which is what it has always been.
   */
  signatureHref?: string | undefined;
  /**
   * The domain the signature prints, defaulting to the identity's own.
   *
   * It exists because the default is right for the sites that ARE
   * `eduardoalvarez.dev` and wrong for the ones that are not: `cursos` lives on
   * `cursos.eduardoalvarez.dev` and had been printing it since before this
   * component existed. Adopting the footer would have made a site sign with its
   * parent's domain — a fact, not a style, and one nothing in the type could
   * have warned about.
   *
   * It is a domain and not a whole signature: the `$`, the `cd ~/` and the year
   * are the identity's and stay the component's. See `docs/decisions/0.9.md`
   * § 49.
   */
  domain?: string | undefined;
};

export type FooterProps = FooterBase &
  (
    | {
        /** The shape the library has always had: stacked rows and the signature at the top right. */
        variant?: 'default' | undefined;
        columns?: never;
        description?: never;
        action?: never;
        linkAsChild?: never;
      }
    | {
        /** `full`: brand and description on the left, link columns on the right, signature closing it. */
        variant: 'full';
        /** The link columns. Mandatory: without them `full` is the default form with extra steps. */
        columns: readonly FooterColumn[];
        /** One line under the brand, saying what the site is. */
        description?: ReactNode;
        /** An action under the row of icons — «Reportar un problema». Usually a tertiary button. */
        action?: ReactNode;
        /**
         * Renders the column links through the child, to plug in the framework's
         * `Link`. It receives each `href` in the Slot's `props`.
         *
         * It is § 24's rule applied where it now bites: a column turns data into
         * markup, so without a slot the only way to reach one of those links
         * from a project is to select it by structure or by a style class, and
         * neither is a contract. `Breadcrumb` and `ArticleCard` have the same
         * signature on purpose.
         *
         * It is also what a client-side transition needs: `cursos` reached for
         * it the moment its columns stopped being `<a>` tags.
         */
        linkAsChild?: ((props: { href: string; children: ReactNode }) => ReactNode) | undefined;
      }
  );

/** The row of icons. 18px of separation, from the document — the rhythm of a row of icons, not of a page. */
function SocialRow({ social }: { social: readonly SocialLink[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-[18px]">
      {social.map((socialLink) => (
        <li key={socialLink.href}>
          <a
            href={socialLink.href}
            aria-label={socialLink.label}
            className={cn(
              'text-text-muted hover:text-accent transition-standard block cursor-pointer text-[19px]',
              'rounded-chip focus-ring',
            )}
          >
            {socialLink.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * The signature, and the mark that says it is a prompt.
 *
 * THE MARK IS THE HALO, not a blink, and it is the one place the library had
 * quietly overruled the identity. `cursos` and `eduardoalvarez.dev` both shipped
 * `cursor-ping` — a solid bar that radiates a ring out to 5px and fades, 1.5s —
 * and when the blog adopted this `Footer` it got a blinking block instead. Its
 * `@keyframes cursor-ping` is still sitting in `base.css` with nothing rendering
 * it, which is what a replaced effect looks like from the outside.
 *
 * So the mark is `pulse-accent`, and the geometry is the one those two sites
 * drew: a 2px bar, not a half-em block. A halo needs something thin to radiate
 * from — around a block it reads as a glowing rectangle, which is the shape the
 * bar exists to avoid. See `docs/decisions/0.8.md` § 45, and § 23 for the argument
 * this reverses.
 *
 * The height is `1em` and not `cursos`'s fixed 12px, so the mark tracks the text
 * if the signature is ever rendered at another scale. The radius is `rounded-pill`
 * and not Tailwind's `rounded-sm`: on a 2px bar the two look identical, and
 * `--radius-sm` is a name consuming projects redefine — `cursos` and
 * `blog-content-manager` both do — so the token is the one that cannot drift.
 *
 * `motion-safe` stays, and it is the one thing NOT copied from `cursos`, whose
 * span animates regardless. The blog's version was behind
 * `prefers-reduced-motion: no-preference`, every other exception in this system
 * is, and at rest the bar is simply solid — which is a caret at rest, not a
 * missing one.
 *
 * The `$` and the mark are `aria-hidden`: they are the prompt, not the text. A
 * screen reader announces the path and stops there.
 */
function Signature({
  year,
  href,
  domain: domainName = naming.domain,
  className,
}: {
  year: number;
  href?: string | undefined;
  domain?: string | undefined;
  className?: string;
}) {
  const domain = href ? (
    <a
      href={href}
      className="text-accent hover:text-text-primary transition-standard rounded-chip focus-ring cursor-pointer"
    >
      {domainName}
    </a>
  ) : (
    domainName
  );

  return (
    <Text variant="meta" tone="muted" as="p" className={cn('shrink-0', className)}>
      <span aria-hidden="true" className="text-accent">
        ${' '}
      </span>
      cd ~/{domain}/{year}
      <span
        aria-hidden="true"
        className="bg-accent motion-safe:pulse-accent rounded-pill ml-1 inline-block h-[1em] w-[2px] align-middle"
      />
    </Text>
  );
}

/**
 * The shell both shapes share: the top hairline, the page measure and the
 * vertical rhythm.
 *
 * `contentClassName` is a separate prop and not a slice of `className`, and it
 * is the same trap `Nav`'s `size` documents from the other side: `className`
 * reaches the `<footer>`, the layout lives on the container inside it, and a gap
 * passed from outside would land on an element that is not a flex container and
 * do nothing, silently.
 */
function Shell({
  className,
  contentClassName,
  children,
  ...props
}: ComponentPropsWithoutRef<'footer'> & {
  contentClassName?: string | undefined;
  children: ReactNode;
}) {
  return (
    <footer className={cn('border-hairline w-full border-t', className)} {...props}>
      <div
        className={cn('max-w-wide px-step-md py-step-xl mx-auto flex flex-col', contentClassName)}
      >
        {children}
      </div>
    </footer>
  );
}

export function Footer({
  variant,
  columns,
  description,
  action,
  linkAsChild,
  social,
  brand,
  year = new Date().getFullYear(),
  signatureHref,
  domain,
  className,
  ...rest
}: FooterProps) {
  if (variant === 'full') {
    const link = (href: string, external: boolean | undefined, content: ReactNode) => {
      const classes = cn(
        'font-mono text-meta text-text-secondary hover:text-accent transition-standard cursor-pointer',
        'rounded-chip focus-ring',
      );
      const inner = (
        <>
          {/*
            The `./`, put there by the component and not by whoever writes the
            label — the same decision as `NavItem`'s. It is `aria-hidden`, so a
            screen reader announces «términos» and not «punto barra términos».
          */}
          <span aria-hidden="true" className="text-text-muted">
            ./
          </span>
          {content}
        </>
      );

      if (linkAsChild) {
        return <Slot className={classes}>{linkAsChild({ href, children: inner })}</Slot>;
      }

      return (
        <a
          href={href}
          className={classes}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {inner}
        </a>
      );
    };

    return (
      <Shell className={className} {...rest}>
        {/*
          Two blocks side by side from `md` up and stacked below it. That is the
          half of this shape the default form cannot express at all: everything
          there goes in one column, by design.
        */}
        <div className="gap-step-xl flex flex-col md:flex-row md:justify-between">
          <div className="gap-step-md flex max-w-xs flex-col">
            {brand}

            {description ? (
              <Text variant="ui" tone="secondary" as="p">
                {description}
              </Text>
            ) : null}

            {social && social.length > 0 ? <SocialRow social={social} /> : null}

            {action}
          </div>

          <div className="gap-step-lg grid grid-cols-2 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title} className="gap-step-sm flex flex-col">
                {/*
                  An `<h3>` and not a `<p>`: the columns are sections of the
                  footer, and a screen reader jumping by heading should find
                  «Legal» rather than walk nine links looking for it.
                */}
                <Text variant="eyebrow" tone="muted" as="h3">
                  {column.title}
                </Text>
                <ul className="gap-step-xs flex flex-col">
                  {column.links.map((columnLink) => (
                    <li key={columnLink.href}>
                      {link(columnLink.href, columnLink.external, columnLink.label)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/*
          The signature CLOSES the full footer, on its own row and behind a
          hairline.

          In the default form it hangs off the first row that exists, and with
          three columns above it that rule puts a 13px prompt level with a
          heading — the documented failure of hanging it off one specific row,
          arrived at from the other side. `cursos` had already settled it in
          production: last row, separated, right-aligned. Centred below `sm`,
          because a right-aligned line on a narrow screen reads as an accident
          rather than as a decision.
        */}
        <div className="border-hairline mt-step-xl pt-step-lg border-t">
          <Signature year={year} href={signatureHref} domain={domain} className="text-center sm:text-right" />
        </div>
      </Shell>
    );
  }

  /*
    The footer's rows, in order and without the empty ones. They are assembled
    before painting because the signature ALWAYS goes in the first one that
    exists, and which one is first depends on what gets passed: with a brand it
    is the brand, and with only social icons it is the icons.

    It is the difference between «the signature goes on the right» and «the
    signature goes at the top right». Pinning it to the social row — as it was —
    left it on the third line the moment the footer had a brand above it, which
    is exactly where it does not go.

    Two rows now, and the assembly is kept rather than collapsed into a
    conditional: what it encodes is «first row, whichever it is», and that
    survives the list being short.
  */
  const rows = [
    brand ? (
      <div key="brand" className="flex items-center">
        {brand}
      </div>
    ) : null,

    social && social.length > 0 ? <SocialRow key="social" social={social} /> : null,
  ].filter(Boolean);

  const [first, ...others] = rows;

  return (
    <Shell className={className} contentClassName="gap-step-lg" {...rest}>
      {/*
        `items-center` and not `items-start`: the signature is a 13px line and
        the brand measures 28, so aligning to the top leaves it floating high.
        On a narrow screen `flex-wrap` drops it onto its own line — there is no
        width for both there, and squeezing them would break the path, which is
        mono and cannot be truncated without becoming unreadable.
      */}
      <div className="gap-step-md flex flex-wrap items-center">
        {first ?? null}
        <Signature year={year} href={signatureHref} domain={domain} className="ml-auto" />
      </div>

      {others}
    </Shell>
  );
}
