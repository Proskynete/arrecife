import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note } from '../../stories/utils.tsx';
import { Badge } from './badge.tsx';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table.tsx';

const meta = { title: 'Primitives/Table', component: Table } satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

const ROWS = [
  { talk: 'Escalar sin romper el equipo', event: 'JSConf', year: '2025', state: 'publicada' },
  { talk: 'Deuda técnica con nombre y apellido', event: 'NerdearLA', year: '2024', state: 'publicada' },
  { talk: 'Arquitecturas que sobreviven', event: 'Interno', year: '2024', state: 'borrador' },
];

const table = (selected?: string) => (
  <Table>
    <TableCaption>Charlas de los últimos dos años</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Charla</TableHead>
        <TableHead>Evento</TableHead>
        <TableHead>Año</TableHead>
        <TableHead>Estado</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {ROWS.map((row) => (
        <TableRow key={row.talk} data-state={row.talk === selected ? 'selected' : undefined}>
          <TableCell className="text-text-primary">{row.talk}</TableCell>
          <TableCell>{row.event}</TableCell>
          <TableCell className="font-mono">{row.year}</TableCell>
          <TableCell>
            <Badge variant={row.state === 'publicada' ? 'success' : 'neutral'}>{row.state}</Badge>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export const Default: Story = {
  render: () => (
    <>
      {table()}
      <Note>
        The card radius and the hairline belong to the table: nothing has to wrap it. The four
        corners are clipped by the same container that scrolls, which is what stops a row tint from
        escaping through them.
      </Note>
    </>
  ),
};

/**
 * The story the surface exists for. Every row is hovered at once, header and last
 * row included, which is exactly where the tint used to spill out of a wrapper
 * that carried a radius and no clip.
 */
export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
  render: () => (
    <>
      {table()}
      <Note>
        Every row hovered at once. Look at the top and bottom corners: the tint stops at the curve
        instead of squaring it off.
      </Note>
    </>
  ),
};

export const Selected: Story = { render: () => table('Deuda técnica con nombre y apellido') };

/**
 * A footer row is `surface`, and it is the one row that is tinted at rest — so it
 * is the one that shows whether the bottom corners are really clipped.
 */
export const WithFooter: Story = {
  render: () => (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Charla</TableHead>
            <TableHead>Evento</TableHead>
            <TableHead className="text-right">Asistentes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROWS.map((row) => (
            <TableRow key={row.talk}>
              <TableCell className="text-text-primary">{row.talk}</TableCell>
              <TableCell>{row.event}</TableCell>
              <TableCell className="text-right font-mono tabular-nums">120</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="text-text-primary">Total</TableCell>
            <TableCell />
            <TableCell className="text-right font-mono tabular-nums">360</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <Note>
        The footer is tinted at rest, so its two bottom corners are the clearest proof that the
        surface clips: they curve with the border instead of filling it.
      </Note>
    </>
  ),
};

/**
 * More columns than there is width. The container scrolls and the page does not,
 * which is what it was drawn for before it had a shape.
 */
export const Scrolls: Story = {
  render: () => (
    <div className="max-w-content">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Charla</TableHead>
            <TableHead>Evento</TableHead>
            <TableHead>Ciudad</TableHead>
            <TableHead>Año</TableHead>
            <TableHead>Duración</TableHead>
            <TableHead>Asistentes</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ROWS.map((row) => (
            <TableRow key={row.talk}>
              <TableCell className="whitespace-nowrap text-text-primary">{row.talk}</TableCell>
              <TableCell className="whitespace-nowrap">{row.event}</TableCell>
              <TableCell className="whitespace-nowrap">Santiago</TableCell>
              <TableCell className="font-mono">{row.year}</TableCell>
              <TableCell className="whitespace-nowrap font-mono">45 min</TableCell>
              <TableCell className="text-right font-mono tabular-nums">120</TableCell>
              <TableCell>
                <Badge variant={row.state === 'publicada' ? 'success' : 'neutral'}>{row.state}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Note>
        Seven columns in a reading measure. The surface scrolls sideways with its border, so the
        page stays put and the shape survives the overflow.
      </Note>
      <Note>
        Tab into it. The scroll container is focusable and shows the focus ring, because a region
        you can pan with a mouse has to be reachable with a keyboard — and a table of text has
        nothing focusable inside it to land on. This story is what found that: it is the first one
        with more columns than width, and axe failed on it immediately.
      </Note>
    </div>
  ),
};
