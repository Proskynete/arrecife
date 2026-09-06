import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note } from '../../../stories/utils.tsx';
import { Logo } from '../../brand/logo.tsx';
import {
  Email,
  Discord,
  GitHub,
  Instagram,
  LinkedIn,
  Newsletter,
  Rss,
  Website,
  X,
  YouTube,
} from '../../social/index.tsx';
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
 * The system's ten. `aria-label` is mandatory in the `SocialLink` type: they are
 * icons with no visible text, so one cannot be built without an accessible name.
 */
const SOCIAL = [
  { label: 'GitHub', href: 'https://github.com/Proskynete', icon: <GitHub /> },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: <LinkedIn /> },
  { label: 'X', href: 'https://x.com/Proskynete', icon: <X /> },
  { label: 'Instagram', href: 'https://instagram.com', icon: <Instagram /> },
  { label: 'Discord', href: 'https://discord.com', icon: <Discord /> },
  { label: 'YouTube', href: 'https://youtube.com', icon: <YouTube /> },
  { label: 'RSS', href: '/rss.xml', icon: <Rss /> },
  { label: 'Escríbeme', href: 'mailto:soy@eduardoalvarez.dev', icon: <Email /> },
  { label: 'Newsletter', href: '/newsletter', icon: <Newsletter /> },
  { label: 'Mi otro sitio', href: 'https://eduardoalvarez.dev', icon: <Website /> },
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
          The six brands are SOLID and the four functional ones — RSS, email, the
          newsletter bell and the globe — use a 1.6 stroke. It is a drawing rule, not a
          styling one: the GitHub logo does not exist in outline, and a functional
          symbol in this system is drawn with a line.
        </Note>
        <Note>
          They live in `social/index.tsx` and not in `lib/glyphs.tsx`. That one
          is the minimum set the primitives need and it does not grow; this is a
          third-party inventory that will change when the social links change.
        </Note>
        <Note>
          The signature comes from `naming.domain`. The `$` is biolume and
          `aria-hidden`, because it is the prompt and not part of the text.
        </Note>
        <Note>
          The mark at the end is `pulse-accent`: a 2px bar that stays solid and radiates a halo,
          which is what `cursos` and `eduardoalvarez.dev` both drew before this library had a
          `Footer`. It used to be a blinking block the library had invented on top of them. See
          `docs/decisions.md` § 45.
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
      />

      <div className="p-step-lg">
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
