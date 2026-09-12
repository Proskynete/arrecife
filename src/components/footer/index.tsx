import { Heart } from '@phosphor-icons/react';
import { Slot } from '@radix-ui/react-slot';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { Icon } from '../../icons/index.tsx';
import { cn } from '../../lib/cn.ts';
import { Text } from '../../primitives/typography.tsx';
import { naming } from '../../tokens/tokens.ts';

/**
 * The footer, and the site's CLI signature: `$ cd ~/eduardoalvarez.dev/2026`.
 *
 * The domain defaults to `naming.domain` and not to a hand-written string, for
 * the same reason as the wordmark: if it changes, it changes in all five
 * projects at once. A project that lives on its OWN domain passes `domain` —
 * see `docs/decisions/` § 49.
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
 * where it was. See `docs/decisions/` § 44.
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
   * The glyph, at 19px. It is the PROJECT's — the library ships no catalogue of
   * social marks since 0.10.0 — and the drawing rule it should follow is the
   * system's: a brand is SOLID, so `<Icon as={GithubLogo} tone="current" />`,
   * and a functional mark keeps the default `action`. Never an emoji.
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
 * themselves, which the columns put there. See docs/decisions/ § 47.
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
   * are the identity's and stay the component's. See `docs/decisions/`
   * § 49.
   */
  domain?: string | undefined;
  /**
   * Adds «Creado con Arrecife ♥», linking to the library's Storybook.
   *
   * OFF BY DEFAULT, and that is the decision rather than the default. No
   * consuming project credits the library today — the four were read before
   * this was written — so turning it on for everybody would be the library
   * putting a line into five production footers that none of them asked for.
   * That is the move § 45 is about, and it does not get made twice.
   *
   * A site that wants it passes `builtWith`. It is a boolean and not a slot: the
   * string and the destination are the library's, and a slot would be an
   * invitation to write «Hecho con Arrecife» on one site and «Creado con» on the
   * next, which is the drift this package exists to remove.
   */
  builtWith?: boolean | undefined;
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

/**
 * The row of icons. 18px of separation, from the document — the rhythm of a row
 * of icons, not of a page.
 *
 * CENTRED BELOW `sm` and flush left from there up. On a phone the footer is a
 * single stacked column with nothing to align against, and a row of ten glyphs
 * pinned to the left edge of a centred page reads as an accident. It is the same
 * cut the signature takes two functions down, and it is not invented here:
 * `links` has drawn its footer this way in production since before the library
 * had one — `justify-center sm:justify-start`, copied. See
 * `docs/decisions/` § 53.
 */
function SocialRow({ social }: { social: readonly SocialLink[] }) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-[18px] sm:justify-start">
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
 * bar exists to avoid. See `docs/decisions/` § 45, and § 23 for the argument
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
}: {
  year: number;
  href?: string | undefined;
  domain?: string | undefined;
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
    <Text variant="meta" tone="muted" as="p">
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
 * «Creado con Arrecife ♥», and the link is the only one in this component that
 * points at the library rather than at the site.
 *
 * IT SITS UNDER THE SIGNATURE, which is `SignatureBlock`'s doing and not this
 * component's — the alignment comes from the block so the two lines cannot come
 * apart. It went at the very bottom of the footer first, which is where a «built
 * with» line usually goes, and there it sat alone under a full-width block as
 * far from the signature as the layout allows.
 *
 * The heart is Phosphor's `Heart` through `Icon` and not the ❤️ emoji. Two
 * reasons and the second is the one that decides it: the library has drawn in
 * one hand since 0.10.0 — see `docs/decisions/` § 51 — and an emoji is a
 * different glyph on every operating system, so the one mark that says which
 * library built the page would be a different drawing per visitor. `tone`
 * makes it solid and `Icon` fixes it at 1em, so it tracks the 13px line it sits
 * on. It carries no `label`: it is decorative, the sentence reads without it,
 * and `Icon` hides it from the accessibility tree on its own.
 *
 * THE WORD IS UNDERLINED, and that is the suite's doing rather than a taste.
 * A link sitting inside a line of text has to be told apart from that text by
 * something other than colour — WCAG 1.4.1, `link-in-text-block` — or carry 3:1
 * against it. Both of the obvious colours fail that: `textSecondary` on
 * `textMuted` is 1.7:1 and the accent on `textMuted` is 1.85:1, and axe named
 * both numbers before this line ever shipped. So the distinguishing mark is the
 * underline, at `decoration-1 underline-offset-4`, which is not invented here
 * either: it is what `NavItem` draws on the section you are on and what
 * `Button variant="link"` draws on hover.
 *
 * The colour still moves — accent, going to `textPrimary` on hover, which is
 * the signature's domain link exactly. Colour is the second signal here and not
 * the only one, which is the whole of what the rule asks.
 *
 * The heart takes the accent for the same reason the signature's `$` does: one
 * coloured mark per muted line is what keeps a 13px line from reading as body
 * text that happens to be small.
 *
 * And it carries `inline`, which is the only place in this library that has to.
 * Tailwind's preflight sets `svg { display: block }`, and every other icon here
 * sits in a flex row where that is exactly right — this is the first one INSIDE
 * a sentence, and as a block it took a line of its own under the text. It is
 * visible the moment you look, which is why it is fixed here rather than in
 * `Icon`: changing the base class would change how every icon in five projects
 * is laid out, to solve a case that announces itself.
 */
function BuiltWith() {
  return (
    <Text variant="meta" tone="muted" as="p">
      Creado con{' '}
      <a
        href={naming.libraryUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'text-accent hover:text-text-primary transition-standard cursor-pointer',
          'underline decoration-1 underline-offset-4',
          'rounded-chip focus-ring',
        )}
      >
        {naming.library}
      </a>{' '}
      <Icon as={Heart} tone="current" className="text-accent inline align-middle" />
    </Text>
  );
}

/**
 * The signature and, under it, the credit: the two lines that say what this page
 * is rather than what it contains.
 *
 * THEY STACK, and that is one placement for both shapes. The credit went at the
 * very bottom of the footer first, which is where a «built with» line usually
 * goes and which left it sitting alone under a full-width block, as far from the
 * signature as the layout allows. Under it they read as what they are: the
 * signature names the site, the credit names what built it, and both are the
 * page talking about itself.
 *
 * The alignment is the block's and not each line's, so the two cannot drift
 * apart: centred while the footer is a stacked column, and pinned to whichever
 * edge the shape puts the signature on from `sm` up.
 */
function SignatureBlock({
  year,
  href,
  domain,
  builtWith,
  className,
}: {
  year: number;
  href?: string | undefined;
  domain?: string | undefined;
  builtWith?: boolean | undefined;
  className?: string;
}) {
  return (
    <div
      className={cn('gap-step-xs flex shrink-0 flex-col items-center sm:items-end', className)}
    >
      <Signature year={year} href={href} domain={domain} />
      {builtWith ? <BuiltWith /> : null}
    </div>
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
  builtWith,
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
          {/*
            Centred below `md` for the same reason the default form is centred
            below `sm`: stacked, there is nothing to the left of this block to
            align it against. `md` and not `sm` because this is where the column
            of links sits down beside it, which is the moment left alignment
            starts meaning something again.
          */}
          <div className="gap-step-md flex max-w-xs flex-col items-center text-center md:items-start md:text-left">
            {brand}

            {description ? (
              <Text variant="ui" tone="secondary" as="p">
                {description}
              </Text>
            ) : null}

            {social && social.length > 0 ? <SocialRow social={social} /> : null}

            {action}
          </div>

          {/*
            One column below `xs`, two from there and three from `sm`. It used to
            start at two, and two columns of `./aviso-legal` at 360px is a label
            per line with the second column hard against the first: mono text
            does not reflow, so the grid has to.
          */}
          <div className="gap-step-lg grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3">
            {columns.map((column) => (
              <div
                key={column.title}
                className="gap-step-sm flex flex-col items-center text-center md:items-start md:text-left"
              >
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
          <SignatureBlock
            year={year}
            href={signatureHref}
            domain={domain}
            builtWith={builtWith}
          />
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

        BELOW `sm` IT IS A COLUMN, and that is 0.10.0's correction. It used to be
        `flex-wrap` at every width, which does drop the signature onto its own
        line on a phone — and leaves it there flush RIGHT, because `ml-auto`
        keeps pushing, hanging off the edge of a page whose every other element
        is centred. `flex-wrap` was finishing half the job. Stacking and centring
        finishes the other half, and `sm:ml-auto` is what keeps the wide layout
        exactly as it was.

        Squeezing the two onto one narrow line was never an option: the path is
        mono and cannot be truncated without becoming unreadable.
      */}
      <div className="gap-step-md flex flex-col items-center sm:flex-row sm:flex-wrap">
        {first ?? null}
        <SignatureBlock
          year={year}
          href={signatureHref}
          domain={domain}
          builtWith={builtWith}
          className="sm:ml-auto"
        />
      </div>

      {others}
    </Shell>
  );
}
