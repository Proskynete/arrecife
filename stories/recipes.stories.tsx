import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Block, Note } from './utils.tsx';
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
 * Composiciones que NO son components de la librería, y por qué no lo son.
 *
 * Las two se pidieron como piezas nuevas —`DateTimePicker` y `Sidebar`— y al
 * mirarlas de cerca resultó que ya estaban, repartidas entre primitivos que se
 * montan en cuatro líneas. Un component que solo junta otros two no codifica
 * ninguna rule de identidad: es un alias con mantenimiento.
 *
 * Están aquí because el criterio de entry dice que hay que decidirlo antes, y
 * una decisión que no deja rastro se vuelve a tomar en seis meses.
 */
const meta = { title: 'Recipes/Compositions' } satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function SchedulePublication() {
  const [date, setDate] = useState<Date | undefined>(new Date('2026-09-15T10:00'));

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
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export const DateTimePicker: Story = {
  name: 'Scheduling a publication',
  render: () => (
    <div>
      <Block title="what was requested as a DateTimePicker">
        <SchedulePublication />
      </Block>

      <Note>
        `DateField` with `withTime` IS the date-and-time picker: it is the native
        `datetime-local`, and it brings the system keyboard, the language-aware
        format and screen-reader support for free.
      </Note>
      <Note>
        The popover's `Calendar` is optional and serves to pick by eye within a
        month. It does not replace the field: it accompanies it, because typing a
        date on the keyboard is still faster than hunting for it in a grid.
      </Note>
      <Note>
        Which is why no new component gets in: it encodes no identity rule the two
        primitives do not already encode.
      </Note>
    </div>
  ),
};

export const Sidebar: Story = {
  name: 'Sidebar, with its mobile version',
  render: () => (
    <div>
      <Block title="desktop · plain SidebarNav">
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
      </Block>

      <Block title="mobile · the same nav inside a Sheet">
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
      </Block>

      <Note>
        The chassis that was missing was the mobile drawer, and it already exists:
        `Sheet` with `side="left"`. A `Sidebar` component wrapping the two would be
        an alias with maintenance.
      </Note>
      <Note>
        What CANNOT be composed is the rail collapsed to icons only, and not for
        lack of a container: **the system has no navigation icons**. The glyphs in
        `lib/glyphs.tsx` are the ones the primitives need and they do not grow, and
        bringing in an icon library is something all five projects pay for. A
        collapsed rail showing each section's initial is worse than not collapsing
        it.
      </Note>
    </div>
  ),
};
