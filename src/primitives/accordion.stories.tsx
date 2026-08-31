import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota } from '../../stories/utils.tsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion.tsx';

const meta = {
  title: 'Primitivos/Accordion',
  component: Accordion,
  args: { type: 'single', collapsible: true, defaultValue: 'consultoria' },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const PREGUNTAS = [
  {
    valor: 'consultoria',
    pregunta: '¿Trabajas con equipos pequeños?',
    respuesta:
      'Sí. La mayoría de lo que hago es con equipos de entre cinco y treinta personas, que es donde los problemas de escala aparecen antes de que nadie los llame así.',
  },
  {
    valor: 'remoto',
    pregunta: '¿En remoto o presencial?',
    respuesta:
      'Las dos. El trabajo de fondo se hace en remoto y las sesiones de arranque salen mejor en persona, si la distancia lo permite.',
  },
  {
    valor: 'plazos',
    pregunta: '¿Cuánto dura un acompañamiento?',
    respuesta:
      'Entre tres y seis meses. Menos de tres no da tiempo a que un cambio de proceso se note; más de seis y el equipo debería poder seguir sin mí.',
  },
] as const;

const items = (deshabilitado = false) =>
  PREGUNTAS.map((p, i) => (
    <AccordionItem key={p.valor} value={p.valor} disabled={deshabilitado && i === 2}>
      <AccordionTrigger headingLevel={3}>{p.pregunta}</AccordionTrigger>
      <AccordionContent>{p.respuesta}</AccordionContent>
    </AccordionItem>
  ));

const bloque = (args: Parameters<NonNullable<Story['render']>>[0], deshabilitado = false) => (
  <Accordion {...args}>{items(deshabilitado)}</Accordion>
);

export const Default: Story = {
  render: (args) => (
    <div>
      {bloque(args)}
      <Nota>
        El panel aparece donde va a quedarse: no hay animación de altura. Radix
        publica `--radix-accordion-content-height` para animarla y el sistema no
        la usa, por lo mismo que no se animan menús ni modales.
      </Nota>
      <Nota>
        El disparador va dentro de un `h3`, no suelto. Un FAQ que pierde la
        estructura de encabezados es una lista de botones para quien navega por
        landmarks.
      </Nota>
    </div>
  ),
};

export const Multiple: Story = {
  name: 'Varios abiertos',
  /*
   * Se monta a mano en vez de esparcir los `args` del meta, y no es manía:
   * `collapsible` solo existe en `type="single"`. Con `type="multiple"`, Radix
   * lo reenvía al `<div>` y React avisa por consola de un atributo inválido —un
   * aviso que la suite no convierte en fallo, así que vive ahí hasta que alguien
   * lee los logs. Pasó justo eso entre la 0.4.0 y la 0.5.0.
   */
  render: () => (
    <div>
      <Accordion type="multiple" defaultValue={['consultoria', 'remoto']}>
        {items()}
      </Accordion>
      <Nota>
        `type="multiple"` para un temario, donde comparar dos secciones es el
        caso normal. Para un FAQ, `single` con `collapsible`.
      </Nota>
    </div>
  ),
};

export const Cerrado: Story = {
  name: 'Todo cerrado',
  args: { defaultValue: '' },
  render: (args) => bloque(args),
};

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: (args) => bloque(args),
};

export const Focus: Story = {
  parameters: { pseudo: { focusVisible: true } },
  render: (args) => bloque(args),
};

export const Deshabilitado: Story = {
  render: (args) => (
    <div>
      {bloque(args, true)}
      <Nota>El tercero está deshabilitado: se atenúa y no responde al puntero.</Nota>
    </div>
  ),
};

export const Movimiento: Story = {
  name: 'La cuarta excepción de movimiento',
  render: (args) => (
    <div>
      {bloque(args)}
      <Nota>
        La altura SÍ se anima, y el componente nació sin animarla citando la regla
        contraria. La diferencia: aquí no APARECE nada, se abre un hueco, y todo
        lo que hay debajo se desplaza. Sin transición ese desplazamiento es un
        salto y quien acaba de pulsar pierde el sitio en la página.
      </Nota>
      <Nota>
        Es la misma categoría que el panel lateral —la segunda excepción— y no la
        de una animación de entrada. Va detrás de `motion-safe`, con
        `--duration-standard` y `--ease-standard`: no estrena tiempo ni curva.
      </Nota>
      <Nota>Ver `docs/decisiones.md` § 20.</Nota>
    </div>
  ),
};
