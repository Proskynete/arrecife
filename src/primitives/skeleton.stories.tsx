import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note, Stack } from '../../stories/utils.tsx';
import { Card } from './card.tsx';
import { Skeleton } from './skeleton.tsx';

const meta = { title: 'Primitives/Skeleton', component: Skeleton } satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const CardShell: Story = {
  name: 'Card loading',
  render: () => (
    <>
      <Stack>
        <Card className="p-step-lg gap-step-sm flex flex-col">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </Card>
      </Stack>
      <Note>
        A 1.4s linear sweep. It is the third and last exception to «the system does
        not animate», alongside the button spinner and the side panel: all three
        are feedback about progress and not about state. A block that is still and
        a block that will never load look exactly the same.
      </Note>
      <Note>
        It sits behind `motion-safe`, so it switches itself off for anyone who
        asked for less motion — and what is left is the block on `surfaceRaised`,
        which still says what shape the thing coming has.
      </Note>
    </>
  ),
};

export const Still: Story = {
  name: 'No sweep',
  render: () => (
    <>
      <Stack>
        <div className="gap-step-xs flex flex-col">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} still className="h-9 w-full" />
          ))}
        </div>
      </Stack>
      <Note>
        `still` turns it off by hand. Twenty table rows sweeping at once are a
        strobe, not a load.
      </Note>
    </>
  ),
};
