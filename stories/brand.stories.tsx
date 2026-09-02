import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

/**
 * Everything through the public barrel. A story is the best place to check that
 * the published surface exports what it says it exports: if something disappears
 * from `src/index.ts`, the catalogue stops compiling before the consumer does.
 */
import {
  fins,
  faces,
  MascotFace,
  Button,
  Card,
  Code,
  Isotype,
  faceList,
  poseList,
  Logo,
  Mascot,
  MetricBadge,
  naming,
  poses,
  ASSETS_PATH,
  Text,
  type Face,
} from '../src/index.ts';

const meta = {
  title: 'Brand/Assets',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;

/* --------------------------------------------------------------- andamiaje */

function Section({ title, note, children }: { title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <section className="mb-section">
      <Text as="h2" variant="h2" className="mb-step-xs">
        {title}
      </Text>
      {note ? (
        <Text variant="ui" tone="secondary" measure className="mb-step-lg">
          {note}
        </Text>
      ) : null}
      {children}
    </section>
  );
}

/**
 * Copies the usage snippet to the clipboard, which is what people come here for.
 *
 * The preview area declares its own theme. Without that, the «light background»
 * card would be shown over abyss when the page is in dark mode, and it would
 * demonstrate nothing: exactly what rule 1 exists to prevent.
 */
function AssetCard({
  name,
  file,
  code,
  children,
  theme = 'dark',
  background = 'bg-background',
}: {
  name: string;
  file: string;
  code: string;
  children: ReactNode;
  theme?: 'dark' | 'light';
  background?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <Card className="overflow-hidden">
      <div data-theme={theme} className={`${background} p-step-md flex min-h-36 items-center justify-center`}>
        {children}
      </div>
      <div className="border-hairline p-step-sm gap-step-xs flex flex-col border-t">
        <Text variant="label" as="p">
          {name}
        </Text>
        <Text variant="meta" tone="secondary" as="p">
          {file}
        </Text>
        <Button
          size="sm"
          variant="tertiary"
          className="mt-step-xs justify-start"
          onClick={() => {
            void navigator.clipboard.writeText(code).then(
              () => setCopied(true),
              () => undefined,
            );
          }}
        >
          {copied ? './copied ✓' : './copiar_uso →'}
        </Button>
      </div>
    </Card>
  );
}

const grid = 'gap-step-md grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))]';

function Page({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-text-primary font-sans px-step-xl py-step-xl min-h-screen">
      <div className="max-w-wide mx-auto">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ stories */

export const Everything: StoryObj = {
  name: 'Catalogue',
  render: () => (
    <Page>
      <Text variant="eyebrow" tone="accent" as="p" className="mb-step-sm">
        arrecife · marca
      </Text>
      <Text as="h1" variant="h1" className="mb-step-md">
        Tiburoncín
      </Text>
      <Text variant="body" tone="secondary" className="mb-section">
        Thirteen pieces, consolidated from the five projects. They are published in
        the package under <Code>./assets/brand/</Code> and served
        at <Code>{ASSETS_PATH}</Code>, which is the same path they all already use
        from their <Code>public/</Code>. The names are typed: write a pose that does
        not exist and it will not compile.
      </Text>

      <Section
        title="The fin"
        note={
          <>
            The fin's body is nearly black, so over a dark background the two-blue
            variant disappears. Which is why <Code>background</Code> is a prop and
            not a note in a guide: the single-ink silhouette picks itself.
          </>
        }
      >
        <div className={grid}>
          <AssetCard
            name="dark background"
            file={fins.foam}
            theme="dark"
            code={'<Isotype background="dark" />'}
          >
            <Isotype background="dark" className="h-16" />
          </AssetCard>
          <AssetCard
            name="light background"
            file={fins.color}
            theme="light"
            code={'<Isotype background="light" />'}
          >
            <Isotype background="light" className="h-16" />
          </AssetCard>
        </div>
      </Section>

      <Section
        title="The logo"
        note={
          <>
            The wordmark always reads «{naming.wordmark}» and comes from the token,
            not from a prop. {naming.mascot} never appears written inside the logo.
          </>
        }
      >
        <div className={grid}>
          <AssetCard name="full, dark background" file="fin-foam.png + wordmark" theme="dark" code={'<Logo background="dark" />'}>
            <Logo background="dark" />
          </AssetCard>
          <AssetCard name="full, light background" file="fin.png + wordmark" theme="light" code={'<Logo background="light" />'}>
            <Logo background="light" />
          </AssetCard>
          <AssetCard name="with tagline, for the bar" file="fin-foam.png + wordmark + tagline.short" theme="dark" code={'<Logo background="dark" withTagline />'}>
            <Logo background="dark" withTagline />
          </AssetCard>
          <AssetCard name="isotype only" file="fin-foam.png" theme="dark" code={'<Logo background="dark" isotypeOnly />'}>
            <Logo background="dark" isotypeOnly />
          </AssetCard>
        </div>
      </Section>

      <Section
        title={`Faces · ${faceList.length}`}
        note={
          <>
            Only in empty states, confirmations, errors, course progress and
            celebration. Never in a hero, pricing, services, contact or the CV. Which
            is why <Code>EmptyState</Code> takes a face and <Code>PageHeader</Code>
            does not.
          </>
        }
      >
        <div className={grid}>
          {faceList.map((expression) => (
            <AssetCard
              key={expression}
              name={expression}
              file={faces[expression]}
              code={`<MascotFace expression="${expression}" />`}
            >
              <MascotFace expression={expression} className="max-w-20" />
            </AssetCard>
          ))}
        </div>
      </Section>

      <Section title={`Poses · ${poseList.length}`}>
        <div className={grid}>
          {poseList.map((pose) => (
            <AssetCard key={pose} name={pose} file={poses[pose]} code={`<Mascot pose="${pose}" />`}>
              <Mascot pose={pose} className="max-w-40" />
            </AssetCard>
          ))}
        </div>
      </Section>

      <Section
        title="How it is consumed"
        note="The names are a type, so autocomplete offers them and an invented name does not compile."
      >
        <Card className="p-step-md gap-step-sm flex flex-col">
          <Text variant="meta" tone="secondary" as="p">
            import {'{'} Logo, Mascot, MascotFace, faceList {'}'} from
            &apos;@eduardoalvarez/arrecife/brand&apos;;
          </Text>
          <div className="gap-step-xs flex flex-wrap">
            {faceList.map((c: Face) => (
              <MetricBadge key={c} boxed>
                {c}
              </MetricBadge>
            ))}
            {poseList.map((p) => (
              <MetricBadge key={p} boxed>
                {p}
              </MetricBadge>
            ))}
          </div>
        </Card>
      </Section>
    </Page>
  ),
};

export const Faces: StoryObj = {
  name: 'Faces only',
  render: () => (
    <Page>
      <div className={grid}>
        {faceList.map((expression) => (
          <AssetCard
            key={expression}
            name={expression}
            file={faces[expression]}
            code={`<MascotFace expression="${expression}" />`}
          >
            <MascotFace expression={expression} className="max-w-20" />
          </AssetCard>
        ))}
      </div>
    </Page>
  ),
};

export const Poses: StoryObj = {
  name: 'Poses only',
  render: () => (
    <Page>
      <div className={grid}>
        {poseList.map((pose) => (
          <AssetCard key={pose} name={pose} file={poses[pose]} code={`<Mascot pose="${pose}" />`}>
            <Mascot pose={pose} className="max-w-40" />
          </AssetCard>
        ))}
      </div>
    </Page>
  ),
};
