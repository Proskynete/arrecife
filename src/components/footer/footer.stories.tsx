import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  BellSimple,
  DiscordLogo,
  Envelope,
  GithubLogo,
  Globe,
  InstagramLogo,
  LinkedinLogo,
  Rss,
  XLogo,
  YoutubeLogo,
} from '@phosphor-icons/react';

import { Note } from '../../../stories/utils.tsx';
import { Logo } from '../../brand/logo.tsx';
import { Icon } from '../../icons/index.tsx';
import { Button } from '../../primitives/button.tsx';
import { Footer } from './index.tsx';

const meta = {
  title: 'Components/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The ten, and since 0.10.0 they are Phosphor's rather than the library's own.
 *
 * `Footer` never owned them: `SocialLink.icon` is a `ReactNode` the project
 * supplies, and what the library used to supply alongside it was a catalogue of
 * ten hand-drawn marks at `./social`. That catalogue is gone — this story is
 * what a consumer now writes, verbatim.
 *
 * The six brands are `tone="current"`, which is Phosphor's `fill`: a mark
 * belonging to somebody else has no outline form. The four functional ones —
 * RSS, the envelope, the bell and the globe — stay at the default `action`,
 * which is the system's line. That is the same drawing rule `./social` encoded
 * by hand, now expressed on the axis `Icon` already has.
 *
 * `aria-label` is mandatory in the `SocialLink` type: they are icons with no
 * visible text, so one cannot be built without an accessible name. Which is why
 * the icons themselves carry none — `Icon` marks them `aria-hidden` when it is
 * given no `label`, and the name on the link is the one that gets announced.
 */
const SOCIAL = [
  { label: 'GitHub', href: 'https://github.com/Proskynete', icon: <Icon as={GithubLogo} tone="current" /> },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: <Icon as={LinkedinLogo} tone="current" /> },
  { label: 'X', href: 'https://x.com/Proskynete', icon: <Icon as={XLogo} tone="current" /> },
  { label: 'Instagram', href: 'https://instagram.com', icon: <Icon as={InstagramLogo} tone="current" /> },
  { label: 'Discord', href: 'https://discord.com', icon: <Icon as={DiscordLogo} tone="current" /> },
  { label: 'YouTube', href: 'https://youtube.com', icon: <Icon as={YoutubeLogo} tone="current" /> },
  { label: 'RSS', href: '/rss.xml', icon: <Icon as={Rss} /> },
  { label: 'Escríbeme', href: 'mailto:soy@eduardoalvarez.dev', icon: <Icon as={Envelope} /> },
  { label: 'Newsletter', href: '/newsletter', icon: <Icon as={BellSimple} /> },
  { label: 'Mi otro sitio', href: 'https://eduardoalvarez.dev', icon: <Icon as={Globe} /> },
] as const;

export const Basic: Story = {
  name: 'Basic',
  render: () => (
    <div className="-m-step-lg">
      <Footer social={SOCIAL} />

      <div className="p-step-lg">
        <Note>
          Icons only, with no link text beside them. Icons at 19px in plankton,
          18px apart and a biolume hover. The `aria-label` is what replaces the
          visible text, which is why it is mandatory in the type — a social link
          with no name cannot be built.
        </Note>
        <Note>
          The six brands are SOLID — `tone="current"`, Phosphor's `fill` — and the
          four functional ones use the system's line at the default `action`. It is
          a drawing rule, not a styling one: the GitHub logo does not exist in
          outline, and a functional symbol in this system is drawn with a line.
        </Note>
        <Note>
          They come from `@phosphor-icons/react`, drawn through `Icon`. Until 0.10.0
          the library shipped its own ten at `./social`, and that catalogue is gone:
          `SocialLink.icon` was always a `ReactNode` the project supplies, so what
          disappeared is a second hand drawing the same marks. See
          `docs/decisions/` § 51.
        </Note>
        <Note>
          The signature comes from `naming.domain`. The `$` is biolume and
          `aria-hidden`, because it is the prompt and not part of the text.
        </Note>
        <Note>
          The mark at the end is `pulse-accent`: a 2px bar that stays solid and radiates a halo,
          which is what `cursos` and `eduardoalvarez.dev` both drew before this library had a
          `Footer`. It used to be a blinking block the library had invented on top of them. See
          `docs/decisions/` § 45.
        </Note>
      </div>
    </div>
  ),
};

export const Icons: Story = {
  name: 'The ten icons',
  render: () => (
    <div className="p-step-lg gap-step-lg flex flex-wrap items-center text-[28px]">
      {SOCIAL.map((r) => (
        <span key={r.label} className="text-text-muted gap-step-sm flex items-center">
          {r.icon}
          <span className="text-meta font-mono">{r.label}</span>
        </span>
      ))}
    </div>
  ),
};

export const WithBrand: Story = {
  name: 'With the brand row',
  render: () => (
    <div className="-m-step-lg">
      <Footer brand={<Logo />} social={SOCIAL} />

      <div className="p-step-lg">
        <Note>
          The brand has a slot of its own. It used to end up inside `children` with
          a `w-full` so it would take a line of its own: it worked and it was a
          patch, because the brand is not one more text link.
        </Note>
        <Note>
          And the signature shares a line WITH THE BRAND, which is the first row.
          Pinned to the social row — as it was in 0.5.0 — it fell to the second line
          the moment the footer had a brand above it.
        </Note>
        <Note>
          There is no third row of loose text links any more, and there is no
          `children` to put one in. That row is what `variant="full"`'s columns
          replace — see «Full · the shape of cursos».
        </Note>
      </div>
    </div>
  ),
};

export const SignatureOnTheRight: Story = {
  name: 'The signature goes right',
  render: () => (
    <div className="-m-step-lg">
      <Footer social={SOCIAL} />

      <div className="p-step-lg">
        <Note>
          Icons on the left, signature on the right, on the SAME line. The
          signature carries `ml-auto` and `justify-between` is not enough: with no
          social links, a `justify-between` would leave it pinned to the left edge.
        </Note>
        <Note>
          Here the first row is the icons, so the signature lines up with them. It
          is not pinned to the social links: it is pinned to whichever first row
          exists.
        </Note>
        <Note>
          On a narrow screen the two parts break with `flex-wrap` instead of
          squeezing. The signature is mono and cannot be truncated without ceasing
          to read as a path.
        </Note>
      </div>
    </div>
  ),
};

export const SignatureOnly: Story = {
  name: 'No social links, the signature stays right',
  render: () => (
    <div className="-m-step-lg">
      <Footer />
    </div>
  ),
};

/*
 * They go in TWO stories and not in one holding both footers: `<footer>` is the
 * `contentinfo` landmark, and two of them in one document is a violation — axe
 * flagged it on the first attempt. A page footer is not compared by putting two
 * of them on screen.
 *
 * The comment used to say all of that in Spanish, with `dos` swept to `two` in
 * the middle of it. `check:copy` reads string literals and cannot see a comment,
 * so it caught neither half.
 */
export const FirstRowIsTheBrand: Story = {
  name: 'First row · the brand',
  render: () => (
    <div className="-m-step-lg">
      <Footer brand={<Logo />} social={SOCIAL} />

      <div className="p-step-lg">
        <Note>
          With a brand, the signature shares its line. It is the difference between
          «the signature goes right» and «the signature goes at the TOP right».
        </Note>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------ the full one */

/**
 * The columns of `cursos`, with the two that change according to who is looking
 * resolved for an admin. They are data and not `children` precisely because of
 * that: a flat row of nine links cannot say «this block is a different block
 * depending on the session».
 */
const COLUMNS = [
  {
    title: 'Aprendizaje',
    links: [
      { label: 'Inicio', href: '/' },
      { label: 'Cursos', href: '/cursos' },
      { label: 'Comunidad', href: 'https://discord.com', external: true },
    ],
  },
  {
    title: 'Cuenta',
    links: [
      { label: 'Mis cursos', href: '/mis-cursos' },
      { label: 'Mis diplomas', href: '/mis-diplomas' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Términos', href: '/terminos' },
      { label: 'Privacidad', href: '/privacidad' },
      { label: 'Cookies', href: '/cookies' },
    ],
  },
] as const;

export const Full: Story = {
  name: 'Full · the shape of cursos',
  render: () => (
    <div className="-m-step-lg">
      <Footer
        variant="full"
        brand={<Logo />}
        description="Cursos para construir con IA, directos y al grano."
        columns={COLUMNS}
        social={SOCIAL.slice(0, 7)}
        action={
          <Button variant="tertiary" size="sm">
            Reportar un problema
          </Button>
        }
        signatureHref="/"
        domain="cursos.eduardoalvarez.dev"
      />

      <div className="p-step-lg">
        <Note>
          The signature prints `domain`, which is this site's and not the identity's. Without it the
          line would say `eduardoalvarez.dev` — a site signing with its parent's domain, which
          nothing fails on and nothing warns about. See `docs/decisions/` § 49.
        </Note>
        <Note>
          The 197 hand-written lines of `cursos`, as data. Brand, description, icons and the action
          go in one block on the left; the columns go on the right; the signature closes the footer
          behind a hairline.
        </Note>
        <Note>
          `columns` and `description` exist ONLY on this variant. The props are a union, so the
          default form cannot be handed one and there is no third shape composed by accident.
        </Note>
        <Note>
          The `./` in front of each column link is put there by the component, like `NavItem`&rsquo;s.
          It is `aria-hidden`: a screen reader announces «términos», not «punto barra términos».
        </Note>
        <Note>
          The column headings are `&lt;h3&gt;`. A footer with nine links and three groups is navigable by
          heading or it is nine links.
        </Note>
      </div>
    </div>
  ),
};

/**
 * The half of the ask that has nothing to do with `cursos`: the two projects that
 * already use `Footer` must not move. This is the same call as `Basic`, and it has
 * to render exactly what it rendered before the variant existed.
 */
export const FullNotAsked: Story = {
  name: 'Full · not asking for it changes nothing',
  render: () => (
    <div className="-m-step-lg">
      <Footer brand={<Logo />} social={SOCIAL} />

      <div className="p-step-lg">
        <Note>
          No `variant`, so this is the shape the library has always had: stacked rows and the
          signature level with the first one. Two of the three projects that draw a footer want
          this, which is why it is what comes out of passing nothing.
        </Note>
        <Note>
          It is also exactly what `eduardoalvarez.dev` passes today — `brand` and
          `social`, nothing else — which is how the loose-link row turned out to
          be drawn by nobody.
        </Note>
      </div>
    </div>
  ),
};

/** With no columns to displace it, the signature is still the last row of the full form. */
export const FullMinimal: Story = {
  name: 'Full · brand, one column and the signature',
  render: () => (
    <div className="-m-step-lg">
      <Footer
        variant="full"
        brand={<Logo />}
        columns={[COLUMNS[2]]}
        social={SOCIAL.slice(0, 4)}
      />

      <div className="p-step-lg">
        <Note>
          The signature does not climb. In the default form it hangs off the first row that exists,
          and with columns above it that rule would put a 13px prompt level with a heading. Here it
          is the last row, always.
        </Note>
      </div>
    </div>
  ),
};

/**
 * The slot. It is § 24&rsquo;s rule where it now bites: without it the column links
 * are reachable only by structure or by a style class, and a project with a
 * router cannot plug its `Link` in at all.
 */
export const FullWithLinkSlot: Story = {
  name: 'Full · linkAsChild',
  render: () => (
    <div className="-m-step-lg">
      <Footer
        variant="full"
        brand={<Logo />}
        description="Cursos para construir con IA, directos y al grano."
        columns={COLUMNS}
        social={SOCIAL.slice(0, 7)}
        linkAsChild={({ href, children }) => (
          <a href={href} data-testid={`footer-${href}`}>
            {children}
          </a>
        )}
      />

      <div className="p-step-lg">
        <Note>
          The library keeps the classes and the `./`; the project supplies the element. It is the
          same signature as `Breadcrumb`&rsquo;s `linkAsChild` and `ArticleCard`&rsquo;s `tagAsChild`,
          on purpose.
        </Note>
      </div>
    </div>
  ),
};

export const BuiltWith: Story = {
  name: 'Creado con Arrecife',
  render: () => (
    <div className="-m-step-lg">
      <Footer brand={<Logo />} social={SOCIAL} builtWith />

      <div className="p-step-lg">
        <Note>
          It sits UNDER the signature, in both shapes, and it is OFF unless a site asks for it.
          No consuming project credits the library today, so turning it on for everybody would
          put a line into five production footers that none of them wrote.
        </Note>
        <Note>
          The signature names the site and the credit names what built it: two lines of the page
          talking about itself, so they stack. The alignment belongs to the block that holds both
          — centred while the footer is a stacked column, pinned to the signature&rsquo;s edge from
          `sm` up — which is what stops them drifting apart at one width and not the other.
        </Note>
        <Note>
          The heart is Phosphor&rsquo;s `Heart` through `Icon` and not the ❤️ emoji: the library
          draws in one hand, and an emoji is a different glyph on every operating system. It is
          decorative, so it is hidden from a screen reader — «Creado con Arrecife» reads whole
          without it.
        </Note>
        <Note>
          The word is UNDERLINED because the suite said so, not because it looks better: a link
          inside a line of text needs a signal other than colour, and both candidates failed the
          3:1 against the muted text around them — `textSecondary` at 1.7:1, the accent at
          1.85:1. The rule is `decoration-1 underline-offset-4`, which is what `NavItem` draws on
          the section you are on.
        </Note>
        <Note>
          The destination is `naming.libraryUrl`, which `check:exports` compares against
          `homepage` in `package.json` on every build. It is the one link here that points at the
          library instead of at the site, and a stale one would sit in five footers.
        </Note>
      </div>
    </div>
  ),
};

export const FullBuiltWith: Story = {
  name: 'Full · Creado con Arrecife',
  render: () => (
    <div className="-m-step-lg">
      <Footer
        variant="full"
        brand={<Logo />}
        description="Cursos para construir con IA, directos y al grano."
        columns={COLUMNS}
        social={SOCIAL.slice(0, 7)}
        builtWith
      />

      <div className="p-step-lg">
        <Note>
          The same two lines in the same order, here behind the hairline that closes the full
          footer. One placement for both shapes: whatever edge the signature is on, the credit is
          under it.
        </Note>
      </div>
    </div>
  ),
};
