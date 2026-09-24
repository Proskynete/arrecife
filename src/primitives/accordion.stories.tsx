import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note } from '../../stories/utils.tsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion.tsx';

const meta = {
  title: 'Primitives/Accordion',
  component: Accordion,
  args: { type: 'single', collapsible: true, defaultValue: 'consultoria' },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const QUESTIONS = [
  {
    value: 'frecuencia',
    pregunta: '¿Cada cuánto llega la newsletter?',
    response:
      'Una vez al mes. Te cuento lo que voy aprendiendo sobre Spec-Driven Development y desarrollo con IA, sin resúmenes de noticias.',
  },
  {
    value: 'nivel',
    pregunta: '¿Necesito experiencia para los cursos?',
    response:
      'No. Los cursos parten desde cero y avanzan paso a paso, así que sirven si estás empezando o si vienes de otra carrera.',
  },
  {
    value: 'charlas',
    pregunta: '¿Das charlas en remoto?',
    response:
      'Sí, presenciales o remotas. Antes de cada charla pregunto quién va a estar en la sala para adaptar lo que voy a mostrar.',
  },
] as const;

const items = (deshabilitado = false) =>
  QUESTIONS.map((p, i) => (
    <AccordionItem key={p.value} value={p.value} disabled={deshabilitado && i === 2}>
      <AccordionTrigger headingLevel={3}>{p.pregunta}</AccordionTrigger>
      <AccordionContent>{p.response}</AccordionContent>
    </AccordionItem>
  ));

const block = (args: Parameters<NonNullable<Story['render']>>[0], deshabilitado = false) => (
  <Accordion {...args}>{items(deshabilitado)}</Accordion>
);

export const Default: Story = {
  render: (args) => (
    <div>
      {block(args)}
      <Note>
        The panel appears where it will stay: there is no height animation. Radix
        publishes `--radix-accordion-content-height` to animate it and the system
        does not use it, for the same reason menus and modals are not animated.
      </Note>
      <Note>
        The trigger goes inside an `h3`, not loose. A FAQ that loses its heading
        structure is a list of buttons for anyone navigating by landmarks.
      </Note>
    </div>
  ),
};

export const Multiple: Story = {
  name: 'Several open',
  /*
   * Se monta a mano en vez de esparcir los `args` del meta, y no es manía:
   * `collapsible` solo exists en `type="single"`. Con `type="multiple"`, Radix
   * lo reenvía al `<div>` y React avisa por consola de un atributo inválido —un
   * aviso que la suite no convierte en failure, así que vive ahí hasta que alguien
   * lee los logs. Pasó justo eso entre la 0.4.0 y la 0.5.0.
   */
  render: () => (
    <div>
      <Accordion type="multiple" defaultValue={['consultoria', 'remoto']}>
        {items()}
      </Accordion>
      <Note>
        `type="multiple"` for a syllabus, where comparing two sections is the
        normal case. For a FAQ, `single` with `collapsible`.
      </Note>
    </div>
  ),
};

export const Closed: Story = {
  name: 'All closed',
  args: { defaultValue: '' },
  render: (args) => block(args),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: (args) => block(args),
};

export const Focus: Story = {
  parameters: { pseudo: { focusVisible: true } },
  render: (args) => block(args),
};

export const Disabled: Story = {
  render: (args) => (
    <div>
      {block(args, true)}
      <Note>The third one is disabled: it dims and does not respond to the pointer.</Note>
    </div>
  ),
};

export const Motion: Story = {
  name: 'The fourth motion exception',
  render: (args) => (
    <div>
      {block(args)}
      <Note>
        The height IS animated, and the component was born unanimated citing the
        opposite rule. The difference: nothing APPEARS here, a gap opens, and
        everything below it shifts. Without a transition that shift is a jump and
        whoever just clicked loses their place on the page.
      </Note>
      <Note>
        It is the same category as the side panel — the second exception — and not
        that of an entrance animation. It sits behind `motion-safe`, with
        `--duration-standard` and `--ease-standard`: no new timing, no new curve.
      </Note>
      <Note>See `docs/decisions/` § 20.</Note>
    </div>
  ),
};
