import { Slot } from '@radix-ui/react-slot';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { Text } from '../../primitives/typography.tsx';
import { naming } from '../../tokens/tokens.ts';

/**
 * The footer, and the site's CLI signature: `$ cd ~/eduardoalvarez.dev/2026`.
 *
 * The domain comes from `naming.domain` and not from a hand-written string, for
 * the same reason as the wordmark: if it changes, it changes in all five
 * projects at once.
 *
 * The social links are icons with NO visible text, so `aria-label` is not an
 * improvement: it is the only thing that makes them legible. Which is why it is
 * mandatory in the type and not an optional prop that gets forgotten.
 *
 * The signature sits top right, level with the FIRST row that exists, not at the
 * end of the block. That is a composition decision and not a styling one: the
 * footer can carry brand, links and social icons, and hanging the signature off
 * one specific row sinks it the moment that row stops being the first.
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

export type FooterProps = ComponentPropsWithoutRef<'footer'> & {
  social?: readonly SocialLink[];
  /** The signature's year. */
  year?: number;
  /** Text links: legal notice, RSS, sitemap. */
  children?: ReactNode;
  /**
   * The brand row: the fin and the wordmark, at the very top.
   *
   * It exists because without it that row ended up inside `children` with a
   * `w-full` so it would take a line of its own. It worked and it was a patch:
   * the brand is not one more text link, and a slot of its own says so in the
   * type.
   */
  brand?: ReactNode;
};

export function Footer({
  social,
  year = new Date().getFullYear(),
  children,
  brand,
  className,
  ...props
}: FooterProps) {
  const signature = (
    <Text variant="meta" tone="muted" as="p" className="ml-auto shrink-0">
      <span aria-hidden="true" className="text-accent">
        ${' '}
      </span>
      cd ~/{naming.domain}/{year}
      {/*
        The caret. It is what says the signature is a prompt and not a decorative
        string: a terminal whose caret does not blink is a terminal that has
        hung, and a still block reads as a typo.

        It is the fifth declared motion exception and the only one that is not
        feedback about progress — see `docs/decisions.md` § 23. `motion-safe`
        leaves it solid for whoever asked for less motion, which is a caret at
        rest and not a missing one.

        `aria-hidden` for the same reason as the `$`: it is the prompt, not the
        text. A screen reader announces the path and stops there.
      */}
      <span
        aria-hidden="true"
        className="bg-accent motion-safe:caret ml-[0.2em] inline-block h-[1em] w-[0.5em] translate-y-[0.15em]"
      />
    </Text>
  );

  /*
    The footer's rows, in order and without the empty ones. They are assembled
    before painting because the signature ALWAYS goes in the first one that
    exists, and which one is first depends on what gets passed: with a brand it
    is the brand, without one it is the links, and with only social icons it is
    the icons.

    It is the difference between «the signature goes on the right» and «the
    signature goes at the top right». Pinning it to the social row — as it was —
    left it on the third line the moment the footer had a brand and links above,
    which is exactly where it does not go.
  */
  const rows = [
    brand ? (
      <div key="marca" className="flex items-center">
        {brand}
      </div>
    ) : null,

    children ? (
      <div key="enlaces" className="gap-step-md flex flex-wrap items-center">
        {children}
      </div>
    ) : null,

    social && social.length > 0 ? (
      // 18px of separation, from the document. It is not a `spacing` step: it is
      // the rhythm of a row of icons, not that of a page.
      <ul key="socialLinks" className="flex items-center gap-[18px]">
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
    ) : null,
  ].filter(Boolean);

  const [first, ...rest] = rows;

  return (
    <footer className={cn('border-hairline w-full border-t', className)} {...props}>
      <div className="max-w-wide px-step-md py-step-xl gap-step-lg mx-auto flex flex-col">
        {/*
          `items-center` and not `items-start`: the signature is a 13px line and
          the brand measures 28, so aligning to the top leaves it floating high.
          On a narrow screen `flex-wrap` drops it onto its own line — there is no
          width for both there, and squeezing them would break the path, which is
          mono and cannot be truncated without becoming unreadable.
        */}
        <div className="gap-step-md flex flex-wrap items-center">
          {first ?? null}
          {signature}
        </div>

        {rest}
      </div>
    </footer>
  );
}

export type FooterLinkProps = ComponentPropsWithoutRef<'a'> & {
  asChild?: boolean | undefined;
};

export function FooterLink({ asChild = false, className, ...props }: FooterLinkProps) {
  const Root = asChild ? Slot : 'a';
  return (
    <Root
      className={cn(
        'font-mono text-meta text-text-secondary hover:text-accent transition-standard cursor-pointer',
        'rounded-chip focus-ring',
        className,
      )}
      {...props}
    />
  );
}
