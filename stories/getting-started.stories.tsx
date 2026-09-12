import type { Meta, StoryObj } from '@storybook/react-vite';
import { GithubLogo } from '@phosphor-icons/react';

import pkg from '../package.json';
import { Logo } from '../src/brand/logo.tsx';
import { CodeBlock } from '../src/components/code-block/index.tsx';
import { Footer } from '../src/components/footer/index.tsx';
import { Icon } from '../src/icons/index.tsx';
import { Alert } from '../src/primitives/alert.tsx';
import { Badge } from '../src/primitives/badge.tsx';
import { Button } from '../src/primitives/button.tsx';
import { Text } from '../src/primitives/typography.tsx';
import { naming, tagline } from '../src/tokens/tokens.ts';
import { Block, Note, Stack } from './utils.tsx';

/**
 * The published version, READ FROM `package.json` and never typed here.
 *
 * It is the one number on this page that goes stale on its own, and it would go
 * stale silently: release-please writes `package.json` on every release and
 * would have no reason to touch a story. A hand-written «v0.11.0» in the
 * heading is wrong the day after it is written and looks exactly as right as it
 * did the day before — which is the failure this whole repository is built
 * against.
 *
 * The story files are not published — `files` ships `dist`, `assets`,
 * `llms.txt` and the changelog — so importing the manifest here costs the
 * package nothing. `resolveJsonModule` is already on and Vite serves it.
 */
const VERSION = pkg.version;

/**
 * The way in. It is the first thing in the sidebar and it is the only page in
 * this Storybook that is not about a component.
 *
 * WHY IT EXISTS. Storybook published fifty component pages and nothing that said
 * how to get any of them onto a screen, so the answer lived in `README.md` and in
 * `llms.txt` — two files a person reading the published site does not have. The
 * three things that actually stop an adoption are all setup: the second `@import`
 * without which every class silently does nothing, the font names that fall back
 * without an error, and `@source`, without which Tailwind purges the library's
 * classes out of the build. None of them is discoverable from a component page.
 *
 * WHAT IT IS NOT is a second copy of the documentation. Every block here is the
 * install, and the moment a question is about a component the page hands over —
 * to the sidebar for a human and to `llms.txt` for an agent. `llms.txt` is
 * generated from the compiler and this page is written by hand, so anything said
 * in both would eventually be said differently in each.
 */
const meta = {
  title: 'Arrecife/Getting started',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const INSTALL = `pnpm add @eduardoalvarez/arrecife @phosphor-icons/react`;

const STYLES = `/* The project's entry stylesheet, in this order. */
@import "tailwindcss";
@import "@eduardoalvarez/arrecife/tokens/theme.css";

/* Only if the project declares @source at all. */
@source "../node_modules/@eduardoalvarez/arrecife/dist";`;

const USAGE = `import { Button, Card, Text } from '@eduardoalvarez/arrecife';
import { Icon } from '@eduardoalvarez/arrecife/icons';
import { ArrowUpRight } from '@phosphor-icons/react';

export function Panel() {
  return (
    <Card className="p-step-lg gap-step-md flex flex-col">
      <Text variant="h3" as="h2">Escalar con criterio</Text>
      <Text variant="ui" tone="secondary" as="p" measure>
        Cada color, tamaño y espacio sale de un token.
      </Text>
      <Button variant="primary" icon={<Icon as={ArrowUpRight} />}>
        Leer el artículo
      </Button>
    </Card>
  );
}`;

const AGENT_PROMPT = `Read node_modules/@eduardoalvarez/arrecife/llms.txt first.

Then build <what you are building> with this library.

Rules that are not negotiable:
- Look through the inventory before writing a component. If the library has it,
  import it — do not hand-write a card, a button, a header or a footer.
- Take every colour, size and space from a token utility (bg-surface-raised,
  text-h1, rounded-card, p-step-md). No hex values, no arbitrary values.
- Page rhythm carries "step": p-step-md, gap-step-sm. A bare p-md lands on
  Tailwind's container scale and does nothing, silently.
- Icons come from @phosphor-icons/react, drawn through Icon from
  '@eduardoalvarez/arrecife/icons'. Never an emoji.
- No entrance animations. Modals, menus and toasts appear where they will stay.
- In a Next Server Component, import from the subpath: the root carries
  "use client" and ./tokens, ./theme, ./variants and ./icons do not.`;

/**
 * The whole page is one story because it is one document. Splitting it into
 * «Install», «Tailwind» and «An agent» would put three sidebar entries where
 * there is one thing to do, and the reader would have to visit all three anyway.
 */
export const GettingStarted: Story = {
  render: () => (
    <div className="max-w-content px-step-md py-step-xl gap-step-xl mx-auto flex flex-col">
      <header className="gap-step-md flex flex-col">
        <Logo withTagline />
        <div className="gap-step-sm flex flex-wrap items-center">
          <Text variant="display" as="h1">
            {naming.wordmark}
          </Text>
          {/*
            The version sits beside the wordmark and not in the install snippet:
            the snippet is what you copy, and pinning a version into something
            copied is how a project ends up installing a release that was
            current when the page was read.
          */}
          <Badge variant="neutral">v{VERSION}</Badge>
        </div>
        <Text variant="lead" tone="secondary" as="p" measure>
          La librería de componentes de la identidad visual de Eduardo Álvarez. React 19,
          TypeScript, Tailwind v4 y shadcn/ui sobre Radix.
        </Text>
        <Text variant="meta" tone="muted" as="p">
          $ pnpm add @eduardoalvarez/arrecife &nbsp;·&nbsp; {tagline.short}
        </Text>
      </header>

      <Block title="1 · install">
        <Stack>
          <CodeBlock language="bash" copyText={INSTALL}>
            {INSTALL}
          </CodeBlock>
          <Note>
            `@phosphor-icons/react` is a REQUIRED peer dependency since 0.10.0, and it is
            required whether or not the project draws an icon of its own: the `Alert`, the
            `Select` and the `Button` it imports already draw with it. React 19 and
            `react-dom` 19 are peers too. Radix, `clsx`, `tailwind-merge`, `cva`,
            `date-fns` and `react-day-picker` arrive as dependencies — nothing to declare.
          </Note>
          <Note>
            Tailwind has to be v4. There is no v3 preset and there will not be one: the
            output is `@theme`, which v3 does not parse.
          </Note>
          <Note>
            This page describes **v{VERSION}**, read from the package&rsquo;s own
            `package.json` when the Storybook was built. The published site is deployed by
            the release workflow AFTER npm publishes, so the version above is the one on
            npm — that is why the deploy is chained to the publish and not to a push.
          </Note>
        </Stack>
      </Block>

      <Block title="2 · the two lines that make it work">
        <Stack>
          <CodeBlock language="css" copyText={STYLES}>
            {STYLES}
          </CodeBlock>
          <Alert variant="error" title="Without the second @import nothing fails">
            The components mount and every class they use — `bg-surface-raised`, `text-h1`,
            `rounded-card` — does not exist in a bare Tailwind. There is no error anywhere:
            the page renders unstyled and looks like a bug in the library. It is the single
            most common way an install goes wrong.
          </Alert>
          <Note>
            `@source` matters for the same reason from the other side. If the project
            declares one, Tailwind scans only what is listed and purges every class the
            library brings. `pnpm dlx @eduardoalvarez/arrecife arrecife` — the package&rsquo;s
            own `doctor` — checks both this and token collisions in a consuming project.
          </Note>
        </Stack>
      </Block>

      <Block title="3 · the fonts, which fail silently too">
        <Stack>
          <Note>
            The library declares the three families BY NAME and loads none of them. The
            project loads Bricolage Grotesque (`font-display`), Geist (`font-sans`) and
            JetBrains Mono (`font-mono`) however it prefers — `next/font`, `@fontsource`, a
            plain `link` tag.
          </Note>
          <Note>
            The name has to match EXACTLY. Several packages publish them as «Bricolage
            Grotesque Variable» or «Geist Variable», and registering the `@font-face` under
            that name does not load what the tokens ask for: the family falls back to the
            system with no console error. It has already happened in two projects.
          </Note>
          <Note>
            Dark mode is primary and it is the default, so a dark project declares nothing.
            A light one sets `data-theme="light"` on the root element. There is no `dark:` variant —
            the tokens switch on their own — and `themeScript` from `./theme` goes inline in
            the document head so the first paint does not flash.
          </Note>
        </Stack>
      </Block>

      <Block title="4 · what it looks like in the project">
        <Stack>
          <CodeBlock language="tsx" copyText={USAGE}>
            {USAGE}
          </CodeBlock>
          <Note>
            Three imports and three rules, and they are the whole of the daily contract:
            the component comes from the library, the icon comes from Phosphor through
            `Icon`, and every value is a token utility. `className` is for where a piece
            sits on the page, not for restyling it — if a variant is missing, that is a
            decision, not a `className`.
          </Note>
        </Stack>
      </Block>

      <Block title="5 · handing it to an agent">
        <Stack>
          <Note>
            The package ships `llms.txt` inside the tarball, generated from the TypeScript
            compiler on every build. An agent working in a consuming project already has it
            on disk, and it cannot describe a prop that does not exist — which a prompt with
            the API pasted into it eventually will. So the prompt is one instruction and a
            list of the mistakes an agent makes on its own.
          </Note>
          <CodeBlock language="text" copyText={AGENT_PROMPT}>
            {AGENT_PROMPT}
          </CodeBlock>
          <Note>
            Every component page in this Storybook carries the same block, narrowed to that
            component, under «Using it with an agent». It is generated from the story&rsquo;s
            own metadata rather than written fifty times — see `.storybook/agent-usage.tsx`.
          </Note>
          <Note>
            If you are working INSIDE this repository, the document is `AGENTS.md` and not
            `llms.txt`. They answer different questions and neither is a summary of the
            other.
          </Note>
        </Stack>
      </Block>

      <Block title="6 · where to go next">
        <Stack>
          <Note>
            The sidebar, in the order it is in: **Tokens** is the system itself — colour,
            type, spacing, radii — and it is the page to read before deciding anything is
            missing. **Primitives** are the 31 controls on Radix. **Components** are the
            identity pieces. **Recipes** shows them composed into real screens.
          </Note>
          <Note>
            Every story mounts in both modes and axe runs over it on every build, so a
            colour that fails contrast breaks CI rather than waiting to be noticed. The
            theme switch in the toolbar is the same suite, by hand.
          </Note>
          <div>
            {/*
              The icon goes INSIDE the anchor and not in `icon`: `asChild` renders
              the child and drops the button's own nodes, so an `icon` passed
              alongside it would silently not be drawn.
            */}
            <Button variant="tertiary" asChild>
              <a
                href="https://github.com/Proskynete/arrecife"
                className="gap-step-xs inline-flex items-center"
              >
                <Icon as={GithubLogo} tone="current" />
                Proskynete/arrecife
              </a>
            </Button>
          </div>
        </Stack>
      </Block>

      <div className="-mx-step-md">
        <Footer
          brand={<Logo />}
          social={[
            {
              label: 'GitHub',
              href: 'https://github.com/Proskynete',
              icon: <Icon as={GithubLogo} tone="current" />,
            },
          ]}
        />
      </div>
    </div>
  ),
};
