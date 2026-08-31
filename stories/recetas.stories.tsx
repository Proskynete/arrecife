import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Bloque, Nota } from './utils.tsx';
import { Button } from '../src/primitives/button.tsx';
import { Calendar } from '../src/primitives/calendar.tsx';
import { DateField } from '../src/primitives/date-field.tsx';
import { Label } from '../src/primitives/label.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '../src/primitives/popover.tsx';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../src/primitives/sheet.tsx';
import { SidebarItem, SidebarNav } from '../src/components/sidebar-nav/index.tsx';

/**
 * Composiciones que NO son componentes de la librería, y por qué no lo son.
 *
 * Las dos se pidieron como piezas nuevas —`DateTimePicker` y `Sidebar`— y al
 * mirarlas de cerca resultó que ya estaban, repartidas entre primitivos que se
 * montan en cuatro líneas. Un componente que solo junta otros dos no codifica
 * ninguna regla de identidad: es un alias con mantenimiento.
 *
 * Están aquí porque el criterio de entrada dice que hay que decidirlo antes, y
 * una decisión que no deja rastro se vuelve a tomar en seis meses.
 */
const meta = { title: 'Recetas/Composiciones' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function ProgramarPublicacion() {
  const [fecha, setFecha] = useState<Date | undefined>(new Date('2026-09-15T10:00'));

  return (
    <div className="gap-step-sm flex max-w-sm flex-col">
      <Label htmlFor="publicar">Publicar el</Label>

      <div className="gap-step-sm flex items-center">
        <DateField
          id="publicar"
          withTime
          defaultValue="2026-09-15T10:00"
          className="flex-1"
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="icon" aria-label="Elegir en el calendario">
              <span aria-hidden="true">▤</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent aria-label="Calendario de publicación">
            <Calendar mode="single" selected={fecha} onSelect={setFecha} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export const DateTimePicker: Story = {
  name: 'Programar una publicación',
  render: () => (
    <div>
      <Bloque titulo="lo que se pidió como DateTimePicker">
        <ProgramarPublicacion />
      </Bloque>

      <Nota>
        `DateField` con `withTime` ES el selector de fecha y hora: es el
        `datetime-local` nativo, y trae gratis el teclado del sistema, el formato
        según el idioma y el soporte de lector de pantalla.
      </Nota>
      <Nota>
        El `Calendar` del popover es opcional y sirve para elegir a ojo dentro de
        un mes. No sustituye al campo: lo acompaña, porque escribir una fecha con
        el teclado sigue siendo más rápido que buscarla en una rejilla.
      </Nota>
      <Nota>
        Por eso no entra un componente nuevo: no codifica ninguna regla de
        identidad que los dos primitivos no codifiquen ya.
      </Nota>
    </div>
  ),
};

export const Sidebar: Story = {
  name: 'Barra lateral, con su versión de móvil',
  render: () => (
    <div>
      <Bloque titulo="escritorio · SidebarNav a secas">
        <div className="border-hairline h-72 w-60 overflow-hidden rounded-card border">
          <SidebarNav title="Administración" version="v5.0.1" branch="main">
            <SidebarItem href="#" active>
              Artículos
            </SidebarItem>
            <SidebarItem href="#" badge="3">
              Borradores
            </SidebarItem>
            <SidebarItem href="#">Medios</SidebarItem>
            <SidebarItem href="#">Ajustes</SidebarItem>
          </SidebarNav>
        </div>
      </Bloque>

      <Bloque titulo="móvil · la misma nav dentro de un Sheet">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary">Abrir el menú</Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Administración</SheetTitle>
            </SheetHeader>
            <SidebarNav title="Administración" version="v5.0.1" branch="main">
              <SidebarItem href="#" active>
                Artículos
              </SidebarItem>
              <SidebarItem href="#" badge="3">
                Borradores
              </SidebarItem>
              <SidebarItem href="#">Medios</SidebarItem>
            </SidebarNav>
          </SheetContent>
        </Sheet>
      </Bloque>

      <Nota>
        El chasis que faltaba era el cajón de móvil, y ya existe: `Sheet` con
        `side="left"`. Un componente `Sidebar` que envolviera los dos sería un
        alias con mantenimiento.
      </Nota>
      <Nota>
        Lo que NO se puede componer es el rail plegado a solo iconos, y no por
        falta de contenedor: **el sistema no tiene iconos de navegación**. Los
        glifos de `lib/glyphs.tsx` son los que los primitivos necesitan y no
        crecen, y meter una librería de iconos se la comen los cinco proyectos.
        Un rail plegado con la inicial de cada sección es peor que no plegarlo.
      </Nota>
    </div>
  ),
};
