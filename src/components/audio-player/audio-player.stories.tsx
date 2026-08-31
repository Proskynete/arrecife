import type { Meta, StoryObj } from '@storybook/react-vite';

import { Bloque, Nota, Pila } from '../../../stories/utils.tsx';
import { AudioPlayer } from './index.tsx';

/**
 * Un WAV de silencio generado en memoria: la librería no publica archivos de
 * audio, pero sin una fuente con duración real la barra de progreso, el ciclo de
 * velocidad y los saltos de ±15s no se pueden probar.
 */
function pistaDeSilencio(segundos: number): string {
  const rate = 8000;
  const muestras = rate * segundos;
  const buffer = new ArrayBuffer(44 + muestras);
  const vista = new DataView(buffer);
  const texto = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i += 1) vista.setUint8(offset + i, s.charCodeAt(i));
  };

  texto(0, 'RIFF');
  vista.setUint32(4, 36 + muestras, true);
  texto(8, 'WAVEfmt ');
  vista.setUint32(16, 16, true);
  vista.setUint16(20, 1, true); // PCM
  vista.setUint16(22, 1, true); // mono
  vista.setUint32(24, rate, true);
  vista.setUint32(28, rate, true);
  vista.setUint16(32, 1, true);
  vista.setUint16(34, 8, true); // 8 bits
  texto(36, 'data');
  vista.setUint32(40, muestras, true);
  for (let i = 0; i < muestras; i += 1) vista.setUint8(44 + i, 128); // silencio centrado

  return URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }));
}

const PISTA = pistaDeSilencio(225);

const meta = {
  title: 'Componentes/AudioPlayer',
  component: AudioPlayer,
  args: {
    src: PISTA,
    title: 'Arquitectura que sobrevive al equipo que la escribió',
  },
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['full', 'compact', 'banner'],
      description: 'full para páginas dedicadas, compact para barras laterales, banner para artículos con narración.',
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
    <Pila>
      <AudioPlayer {...args} />
      <Nota>
        Podcasts y páginas dedicadas. Es el único modo que se dibuja sobre una
        tarjeta propia; los otros dos se montan sobre el fondo del artículo.
      </Nota>
    </Pila>
  ),
};

export const Compact: Story = {
  args: { mode: 'compact' },
  render: (args) => (
    <Pila>
      <AudioPlayer {...args} />
      <Nota>
        Barras laterales y usos en línea. Sin volumen y sin título: en una columna
        estrecha, los controles que sobran son los que estorban.
      </Nota>
    </Pila>
  ),
};

export const Banner: Story = {
  args: { mode: 'banner' },
  render: (args) => (
    <Pila>
      <AudioPlayer {...args} />
      <Nota>
        Artículos con narración. Es el único con el botón de play etiquetado con
        texto, porque ahí compite con el propio artículo por la atención.
      </Nota>
    </Pila>
  ),
};

export const Controles: Story = {
  args: { mode: 'full' },
  render: (args) => (
    <div className="gap-step-lg flex flex-col">
      <Bloque titulo="lo que se conserva del original">
        <AudioPlayer {...args} />
      </Bloque>
      <Nota>
        Los tres modos, el reproductor flotante, los saltos de ±15s, el ciclo de
        velocidad 1 → 1.25 → 1.5 → 1.75 → 2 y el volumen con mute son los mismos
        que en el portafolio. Pulsa la velocidad cinco veces y vuelve a 1x; arrastra
        la barra para buscar; el flotante aparece cuando el estático sale de vista,
        que en una story siempre está visible.
      </Nota>
    </div>
  ),
};

export const Error_: Story = {
  name: 'Error de carga',
  args: { mode: 'full', src: '/no-existe.mp3', title: 'Una pista que no carga' },
  render: (args) => (
    <Pila>
      <AudioPlayer {...args} />
      <Nota>
        El botón pasa a rojo y a «Reintentar», y sigue siendo el mismo botón: se
        vuelve a pulsar para reintentar. El estado se comunica con color, no con
        movimiento.
      </Nota>
    </Pila>
  ),
};
