import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note, Stack } from '../../stories/utils.tsx';
import { Code } from './code.tsx';
import { Text } from './typography.tsx';

const meta = { title: 'Primitives/Code', component: Code } satisfies Meta<typeof Code>;
export default meta;
type Story = StoryObj<typeof meta>;

export const InProse: Story = {
  name: 'In prose',
  render: () => (
    <>
      <Stack>
        <Text variant="body" tone="secondary">
          Los PNG se publican bajo <Code>./assets/brand/</Code> y se sirven en{' '}
          <Code>/brand</Code>, que es la misma ruta que ya usan los cinco proyectos
          desde su <Code>public/</Code>.
        </Text>
      </Stack>
      <Note>
        It exists because it did not: every consumer wrote
        `&lt;code className=&quot;font-mono&quot;&gt;` by hand. A bare `code`
        inherits the paragraph's size, so inside `body` you saw an 18px mono the
        document has nowhere.
      </Note>
      <Note>
        It is not `CodeBlock`. The block is an island of dark theme over hull, with
        a bar and a copy button; this is one word inside a sentence, which is why
        it stays on the page surface instead of inverting the theme.
      </Note>
    </>
  ),
};
