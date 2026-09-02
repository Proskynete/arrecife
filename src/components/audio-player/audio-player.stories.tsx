import type { Meta, StoryObj } from '@storybook/react-vite';

import { Block, Note, Stack } from '../../../stories/utils.tsx';
import { AudioPlayer } from './index.tsx';

/**
 * Un WAV de silencio generado en memoria: la librería no publica archivos de
 * audio, pero sin una source con duración real la barra de progress, el ciclo de
 * speed y los saltos de ±15s no se pueden probar.
 */
function silentTrack(segundos: number): string {
  const rate = 8000;
  const samples = rate * segundos;
  const buffer = new ArrayBuffer(44 + samples);
  const view = new DataView(buffer);
  const text = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i += 1) view.setUint8(offset + i, s.charCodeAt(i));
  };

  text(0, 'RIFF');
  view.setUint32(4, 36 + samples, true);
  text(8, 'WAVEfmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, rate, true);
  view.setUint32(28, rate, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true); // 8 bits
  text(36, 'data');
  view.setUint32(40, samples, true);
  for (let i = 0; i < samples; i += 1) view.setUint8(44 + i, 128); // silencio centered

  return URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }));
}

const TRACK = silentTrack(225);

const meta = {
  title: 'Components/AudioPlayer',
  component: AudioPlayer,
  args: {
    src: TRACK,
    title: 'Arquitectura que sobrevive al equipo que la escribió',
  },
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['full', 'compact', 'banner'],
      description: 'full for dedicated pages, compact for sidebars, banner for articles with narration.',
      table: { defaultValue: { summary: 'full' } },
    },
    src: { control: false },
    onFirstPlay: { control: false },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof AudioPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = {
  args: { mode: 'full' },
  render: (args) => (
    <Stack>
      <AudioPlayer {...args} />
      <Note>
        Podcasts and dedicated pages. It is the only mode drawn on a card of its
        own; the other two mount on the article's background.
      </Note>
    </Stack>
  ),
};

export const Compact: Story = {
  args: { mode: 'compact' },
  render: (args) => (
    <Stack>
      <AudioPlayer {...args} />
      <Note>
        Sidebars and inline uses. No volume and no title: in a narrow column, the
        controls that are spare are the ones that get in the way.
      </Note>
    </Stack>
  ),
};

export const Banner: Story = {
  args: { mode: 'banner' },
  render: (args) => (
    <Stack>
      <AudioPlayer {...args} />
      <Note>
        Articles with narration. It is the only one with the play button labelled
        in text, because there it competes with the article itself for attention.
      </Note>
    </Stack>
  ),
};

export const Controls: Story = {
  args: { mode: 'full' },
  render: (args) => (
    <div className="gap-step-lg flex flex-col">
      <Block title="what is kept from the original">
        <AudioPlayer {...args} />
      </Block>
      <Note>
        The three modes, the floating player, the ±15s skips, the 1 → 1.25 → 1.5 →
        1.75 → 2 speed cycle and the volume with mute are the same as in the
        portfolio. Press the speed five times and it comes back to 1x; drag the bar
        to seek; the floating player appears when the static one leaves the
        viewport, which in a story is always visible.
      </Note>
    </div>
  ),
};

export const Error_: Story = {
  name: 'Load error',
  args: { mode: 'full', src: '/no-existe.mp3', title: 'Una pista que no carga' },
  render: (args) => (
    <Stack>
      <AudioPlayer {...args} />
      <Note>
        The button turns red and reads «Reintentar», and it is still the same
        button: you press it again to retry. The state is communicated with color,
        not with movement.
      </Note>
    </Stack>
  ),
};
