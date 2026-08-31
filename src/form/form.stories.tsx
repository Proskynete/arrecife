import { useForm } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Nota } from '../../stories/utils.tsx';
import { Button } from '../primitives/button.tsx';
import { Input } from '../primitives/input.tsx';
import { Textarea } from '../primitives/textarea.tsx';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './index.tsx';

const meta = {
  title: 'Formularios/Form',
  component: FormItem,
} satisfies Meta<typeof FormItem>;

export default meta;
type Story = StoryObj<typeof meta>;

type Campos = { nombre: string; correo: string; mensaje: string };

function Formulario({ conErrores = false }: { conErrores?: boolean }) {
  const form = useForm<Campos>({
    defaultValues: { nombre: '', correo: '', mensaje: '' },
    ...(conErrores
      ? {
          errors: {
            nombre: { type: 'minLength', message: 'El nombre necesita al menos dos letras.' },
            correo: { type: 'pattern', message: 'Eso no parece un correo.' },
          },
        }
      : {}),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {})}
        className="gap-step-md max-w-content flex flex-col"
        noValidate
      >
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Cómo te llamas" {...field} />
              </FormControl>
              <FormDescription>Es lo que aparece en la respuesta.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="correo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo</FormLabel>
              <FormControl>
                <Input type="email" placeholder="tu@correo.dev" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mensaje"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mensaje</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="En qué andas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="self-start">
          Enviar
        </Button>
      </form>
    </Form>
  );
}

export const Basico: Story = {
  name: 'Básico',
  render: () => (
    <div>
      <Formulario />
      <Nota>
        El `htmlFor`, el `aria-describedby` y el `aria-invalid` los cablea
        `FormControl` a partir del contexto. Es lo que se olvidaba al escribir
        cada campo a mano, y cuando se olvida el fallo es que nadie oye por qué el
        campo está en rojo.
      </Nota>
      <Nota>
        Vive en `@eduardoalvarez/arrecife/form` y no en la raíz: React Hook Form
        es dependencia de pares opcional, y los cuatro proyectos que no la usan no
        deberían tener que instalarla.
      </Nota>
    </div>
  ),
};

export const ConErrores: Story = {
  name: 'Con errores',
  render: () => (
    <div>
      <Formulario conErrores />
      <Nota>
        La etiqueta NO se tiñe. El borde del control y el mensaje ya están en
        `error`: teñir además la etiqueta son tres rojos para un solo fallo, y el
        sistema deja el color semántico en el borde y en el glifo.
      </Nota>
      <Nota>
        Sin error, `FormMessage` no renderiza nada. Un hueco reservado desplaza el
        resto del formulario cada vez que el mensaje aparece.
      </Nota>
    </div>
  ),
};
