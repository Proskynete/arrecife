import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from './badge.tsx';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table.tsx';

const meta = { title: 'Primitives/Table', component: Table } satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

const ROWS = [
  { charla: 'Escalar sin romper el equipo', event: 'JSConf', anio: '2025', state: 'publicada' },
  { charla: 'Deuda técnica con nombre y apellido', event: 'NerdearLA', anio: '2024', state: 'publicada' },
  { charla: 'Arquitecturas que sobreviven', event: 'Interno', anio: '2024', state: 'borrador' },
];

const table = (seleccionada?: string) => (
  <Table>
    <TableCaption>Charlas de los últimos two años</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Charla</TableHead>
        <TableHead>Evento</TableHead>
        <TableHead>Año</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {ROWS.map((f) => (
        <TableRow key={f.charla} data-state={f.charla === seleccionada ? 'selected' : undefined}>
          <TableCell className="text-text-primary">{f.charla}</TableCell>
          <TableCell>{f.event}</TableCell>
          <TableCell className="font-mono">{f.anio}</TableCell>
          <TableCell>
            <Badge variant={f.state === 'publicada' ? 'success' : 'neutral'}>{f.state}</Badge>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export const Default: Story = { render: () => table() };
export const Hover: Story = { parameters: { pseudo: { hover: true } }, render: () => table() };
export const Selected: Story = { render: () => table('Deuda técnica con nombre y apellido') };
