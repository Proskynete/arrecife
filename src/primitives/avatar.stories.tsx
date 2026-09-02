import type { Meta, StoryObj } from '@storybook/react-vite';

import { Row, Note, Stack } from '../../stories/utils.tsx';
import { Avatar, AvatarFallback, AvatarImage, AvatarUpload } from './avatar.tsx';

const meta = { title: 'Primitives/Avatar', component: Avatar } satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {
  render: () => (
    <Row>
      <Avatar size="sm"><AvatarFallback>EA</AvatarFallback></Avatar>
      <Avatar size="md"><AvatarFallback>EA</AvatarFallback></Avatar>
      <Avatar size="lg"><AvatarFallback>EA</AvatarFallback></Avatar>
      <Avatar size="xl"><AvatarFallback>EA</AvatarFallback></Avatar>
    </Row>
  ),
};

export const WithImage: Story = {
  name: 'With image',
  render: () => (
    <Stack>
      <Row>
        <Avatar size="lg">
          <AvatarImage src="/no-existe.jpg" alt="" />
          <AvatarFallback>EA</AvatarFallback>
        </Avatar>
      </Row>
      <Note>
        The image deliberately does not load here: the initials fallback is what
        you see while it arrives, and what remains if it never does. It is a single
        `Avatar` for everything — there is no separate `brand/Avatar`, because your
        photo is this with a different `src`.
      </Note>
    </Stack>
  ),
};

export const Upload: Story = {
  name: 'AvatarUpload',
  render: () => (
    <div>
      <Row>
        <AvatarUpload size="lg" fallback="EA" />
        <AvatarUpload size="xl" fallback="EA" />
        <AvatarUpload size="lg" fallback="EA" disabled />
      </Row>
      <Note>
        The badge is ALWAYS visible, it does not appear on hover. The hover scrim
        is cleaner and it is a desktop solution: there is no hover on touch, so the
        control would not exist until somebody guessed the photo is tappable.
      </Note>
      <Note>
        It is a `label` with a hidden `input type="file"` inside, not a button
        firing a synthetic click. The real input brings the system dialog,
        drag-and-drop and keyboard focus.
      </Note>
      <Note>
        The preview is local and does not wait for the upload: it emits
        `onSelectFile(File)` and the `POST` is the project's job, as in
        `NewsletterForm`. The `objectURL` is revoked on change and on unmount.
      </Note>
    </div>
  ),
};

export const UploadFocus: Story = {
  name: 'AvatarUpload · focus',
  parameters: { pseudo: { focusVisible: true } },
  render: () => <AvatarUpload size="lg" fallback="EA" />,
};
