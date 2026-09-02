import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note, Stack } from '../../../stories/utils.tsx';
import { syntax } from '../../tokens/tokens.ts';
import { CodeBlock } from './index.tsx';

const EXAMPLE = `import { tokens } from '@eduardoalvarez/arrecife/tokens';

export const og = {
  background: tokens.colors.dark.background,
  tinta: tokens.colors.dark.textPrimary,
};`;

const meta = {
  title: 'Components/CodeBlock',
  component: CodeBlock,
  args: { language: 'ts', children: EXAMPLE, copyText: EXAMPLE },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Stack>
      <CodeBlock {...args} />
      <Note>
        Switch the mode in the toolbar: the block does not change. `brand.hull` is
        the background of code blocks in both themes, so the root declares
        `data-theme="dark"` and all the ink inside switches to the dark palette. It
        is the system's only island of inverted theme.
      </Note>
    </Stack>
  ),
};

export const NoCopy: Story = {
  name: 'No copy button',
  args: { copyText: undefined },
  render: (args) => (
    <Stack>
      <CodeBlock {...args} />
      <Note>
        With no `copyText` there is no button. A copy button that does not copy is
        worse than no button.
      </Note>
    </Stack>
  ),
};

export const NoLanguage: Story = {
  name: 'No language',
  args: { language: undefined },
  render: (args) => <Stack><CodeBlock {...args} /></Stack>,
};


/**
 * Andamiaje de la story, no de la librería. En producción el resaltado lo hace
 * Shiki en build con `@eduardoalvarez/arrecife/shiki`; aquí el fragmento va
 * marcado a mano para poder ver la palette sin traerse el resaltador.
 */
const T = ({ c, children }: { c: string; children: string }) => (
  <span style={{ color: c }}>{children}</span>
);

export const Highlight: Story = {
  name: 'The syntax palette',
  args: { language: 'ts', copyText: undefined },
  render: (args) => (
    <Stack>
      <CodeBlock {...args}>
        <T c={syntax.comment}>{'// El tema sale de tokens.syntax\n'}</T>
        <T c={syntax.keyword}>{'import'}</T>
        {' { '}
        <T c={syntax.identifier}>{'arrecife'}</T>
        {' } '}
        <T c={syntax.keyword}>{'from'}</T>{' '}
        <T c={syntax.literal}>{"'@eduardoalvarez/arrecife/shiki'"}</T>
        <T c={syntax.comment}>{';\n\n'}</T>
        <T c={syntax.keyword}>{'export const'}</T>{' '}
        <T c={syntax.identifier}>{'markdown'}</T>
        <T c={syntax.comment}>{' = {\n  '}</T>
        <T c={syntax.identifier}>{'syntaxHighlight'}</T>
        <T c={syntax.comment}>{': '}</T>
        <T c={syntax.literal}>{"'shiki'"}</T>
        <T c={syntax.comment}>{',\n  '}</T>
        <T c={syntax.identifier}>{'shikiConfig'}</T>
        <T c={syntax.comment}>{': { '}</T>
        <T c={syntax.identifier}>{'theme'}</T>
        <T c={syntax.comment}>{': '}</T>
        <T c={syntax.identifier}>{'arrecife'}</T>
        <T c={syntax.comment}>{' },\n  '}</T>
        <T c={syntax.identifier}>{'inline'}</T>
        <T c={syntax.comment}>{': '}</T>
        <T c={syntax.literal}>{'false'}</T>
        <T c={syntax.comment}>{',\n};'}</T>
      </CodeBlock>
      <Note>
        Four colors and nothing else: sand for keywords, biolume for literals —
        strings, numbers and booleans, all three being literals — plankton for
        comments and punctuation, and foam for everything that gets named.
        Functions, variables and types all land on foam on purpose: the system
        communicates with color and border, not with chromatic noise.
      </Note>
      <Note>
        Measured over hull, all five AA: foam 16.42, biolume 10.05, sand 9.05,
        plankton 5.43 and invalid 4.97. `brand.body` is not in the palette — the
        system restricts it to fill and here it measures 4.2.
      </Note>
      <Note>
        The library does NOT ship Shiki. The theme is a data object in
        `@eduardoalvarez/arrecife/shiki`, and the highlighting is done by each
        project at build time with its own tool. Here the snippet is marked up by
        hand.
      </Note>
    </Stack>
  ),
};
