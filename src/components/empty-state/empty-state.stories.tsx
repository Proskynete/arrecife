import type { Meta, StoryObj } from '@storybook/react-vite';

import { Bloque, Nota, Pila } from '../../../stories/utils.tsx';
import { Button } from '../../primitives/button.tsx';
import { EmptyState } from './index.tsx';

const meta = {
  title: 'Componentes/EmptyState',
  component: EmptyState,
  args: {
    expresion: 'waiting',
    title: 'Todavía no hay artículos con esta etiqueta',
    description: 'Prueba con otra categoría, o vuelve dentro de un par de semanas.',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  name: 'Básico',
  render: (args) => (
    <>
      <Pila>
        <EmptyState {...args} />
      </Pila>
      <Nota>
        `expresion` es obligatoria. No es un descuido de la API: un estado vacío
        sin cara es la mitad del componente, y hacerla opcional era dejar la regla
        de la mascota otra vez en manos de quien escribe la vista.
      </Nota>
    </>
  ),
};

export const ConAccion: Story = {
  name: 'Con acción',
  args: { expresion: 'confused' },
  render: (args) => (
    <Pila>
      <EmptyState {...args} action={<Button variant="tertiary">./ver_todos →</Button>} />
    </Pila>
  ),
};

/** Los cuatro del documento, con su copy tal cual. */
export const DelDocumento: Story = {
  name: 'Los cuatro del documento',
  render: () => (
    <>
      <div className="gap-md grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
        <EmptyState
          expresion="confused"
          title="404 · aguas desconocidas"
          description="Nadaste fuera del mapa. Volvamos a la superficie."
        />
        <EmptyState
          expresion="annoyed"
          title="Error del servidor"
          description="Algo se rompió de mi lado. Ya lo estoy mirando."
        />
        <EmptyState
          expresion="waiting"
          title="Sin resultados"
          description="No encontré nada con ese término. Prueba con menos palabras."
        />
        <EmptyState
          expresion="shades"
          title="Módulo completado"
          description="Sigues tú: microfrontends sin dolor."
        />
      </div>
      <Nota>
        Las cuatro caras salen del inventario del manual, que asigna una situación
        a cada una: confusión → 404, molesto → error de servidor, ojos cerrados →
        sin resultados, lentes de sol → módulo completado. Está como dato en
        `usoDeCara`, así que la elección no se hace a ojo en cada sitio de uso.
      </Nota>
    </>
  ),
};

export const DondeVanLasCaras: Story = {
  name: 'Dónde van las caras',
  render: () => (
    <>
      <Bloque titulo="404">
        <Pila>
          <EmptyState
            expresion="annoyed"
            title="Esta página no existe"
            description="El enlace que seguiste apunta a algo que se movió o que nunca estuvo."
            action={<Button variant="tertiary">./volver_al_inicio →</Button>}
          />
        </Pila>
      </Bloque>

      <Bloque titulo="error de servidor">
        <Pila>
          <EmptyState
            expresion="confused"
            title="Algo se rompió de este lado"
            description="No es cosa tuya. Vuelve a intentar en un minuto."
          />
        </Pila>
      </Bloque>

      <Bloque titulo="celebración">
        <Pila>
          <EmptyState
            expresion="hearts"
            title="Terminaste el curso"
            description="El certificado te llega por correo en unos minutos."
          />
        </Pila>
      </Bloque>

      <Nota>
        El contrato completo: estados vacíos, 404, error de servidor, progreso de
        curso, celebración, toast y el «sin spam» del newsletter. En ningún otro
        lugar — ni hero, ni precios, ni servicios, ni contacto, ni CV.
      </Nota>
    </>
  ),
};
