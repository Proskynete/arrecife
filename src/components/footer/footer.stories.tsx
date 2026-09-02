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
  X,
  YouTube,
} from '../../lib/social.tsx';
import { Footer, FooterLink } from './index.tsx';

const meta = {
  title: 'Components/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The system's nine. `aria-label` is mandatory in the `SocialLink` type: they are
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
          The six brands are SOLID and the three functional ones — RSS, email and
          the newsletter bell — use a 1.6 stroke. It is a drawing rule, not a
          styling one: the GitHub logo does not exist in outline, and a functional
          symbol in this system is drawn with a line.
        </Note>
        <Note>
          They live in `lib/social.tsx` and not in `glyphs.tsx`. That one is the
          minimum set the primitives need and it does not grow; this is a
          third-party inventory that will change when the social links change.
        </Note>
        <Note>
          The signature comes from `naming.domain`. The `$` is biolume and
          `aria-hidden`, because it is the prompt and not part of the text.
        </Note>
      </div>
    </div>
  ),
};

export const Icons: Story = {
  name: 'The nine icons',
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
      <Footer brand={<Logo />} social={SOCIAL}>
        <FooterLink href="/rss.xml">./rss</FooterLink>
        <FooterLink href="/aviso-legal">./aviso-legal</FooterLink>
      </Footer>

      <div className="p-step-lg">
        <Note>
          The brand has a slot of its own. It used to end up inside `children` with
          a `w-full` so it would take a line of its own: it worked and it was a
          patch, because the brand is not one more text link.
        </Note>
        <Note>
          And the signature shares a line WITH THE BRAND, which is the first row.
          Pinned to the social row — as it was in 0.5.0 — it fell to the third line
          the moment the footer had a brand and links above it.
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
 * Van en DOS stories y no en una con los two pies: `<footer>` es el landmark
 * `contentinfo`, y two en el mismo documento es una violación —axe la señaló al
 * primer intento—. Un footer de página no se compara poniendo two.
 */
export const FirstRowIsTheBrand: Story = {
  name: 'First row · the brand',
  render: () => (
    <div className="-m-step-lg">
      <Footer brand={<Logo />} social={SOCIAL}>
        <FooterLink href="/rss.xml">./rss</FooterLink>
        <FooterLink href="/aviso-legal">./aviso-legal</FooterLink>
      </Footer>

      <div className="p-step-lg">
        <Note>
          With a brand, the signature shares its line. It is the difference between
          «the signature goes right» and «the signature goes at the TOP right».
        </Note>
      </div>
    </div>
  ),
};

export const FirstRowIsTheLinks: Story = {
  name: 'First row · the links',
  render: () => (
    <div className="-m-step-lg">
      <Footer social={SOCIAL}>
        <FooterLink href="/rss.xml">./rss</FooterLink>
        <FooterLink href="/aviso-legal">./aviso-legal</FooterLink>
      </Footer>

      <div className="p-step-lg">
        <Note>
          With no brand, the first row is the links and the signature lines up with
          them. It is not pinned to any particular row: it is pinned to whichever
          one comes first.
        </Note>
      </div>
    </div>
  ),
};
