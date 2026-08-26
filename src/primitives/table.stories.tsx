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

const meta = { title: 'Primitivos/Table', component: Table } satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

const FILAS = [
  { charla: 'Escalar sin romper el equipo', evento: 'JSConf', anio: '2025', estado: 'publicada' },
  { charla: 'Deuda técnica con nombre y apellido', evento: 'NerdearLA', anio: '2024', estado: 'publicada' },
  { charla: 'Arquitecturas que sobreviven', evento: 'Interno', anio: '2024', estado: 'borrador' },
];

const tabla = (seleccionada?: string) => (
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
      {FILAS.map((f) => (
        <TableRow key={f.charla} data-state={f.charla === seleccionada ? 'selected' : undefined}>
          <TableCell className="text-text-primary">{f.charla}</TableCell>
          <TableCell>{f.evento}</TableCell>
          <TableCell className="font-mono">{f.anio}</TableCell>
          <TableCell>
            <Badge variant={f.estado === 'publicada' ? 'success' : 'neutral'}>{f.estado}</Badge>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export const Default: Story = { render: () => tabla() };
export const Hover: Story = { parameters: { pseudo: { hover: true } }, render: () => tabla() };
export const Seleccionada: Story = { render: () => tabla('Deuda técnica con nombre y apellido') };
