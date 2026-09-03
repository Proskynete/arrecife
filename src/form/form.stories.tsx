import { useForm } from 'react-hook-form';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Note } from '../../stories/utils.tsx';
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
  title: 'Forms/Form',
  component: FormItem,
} satisfies Meta<typeof FormItem>;

export default meta;
type Story = StoryObj<typeof meta>;

type Fields = { name: string; email: string; message: string };

function DemoForm({ withErrors = false }: { withErrors?: boolean }) {
  const form = useForm<Fields>({
    defaultValues: { name: '', email: '', message: '' },
    ...(withErrors
      ? {
          errors: {
            name: { type: 'minLength', message: 'El nombre necesita al menos dos letras.' },
            email: { type: 'pattern', message: 'Eso no parece un correo.' },
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Cómo te llamas" {...field} />
              </FormControl>
              <FormDescription>Es lo que aparece en la response.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="tu@email.dev" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
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

export const Basic: Story = {
  name: 'Basic',
  render: () => (
    <div>
      <DemoForm />
      <Note>
        The `htmlFor`, the `aria-describedby` and the `aria-invalid` are wired by
        `FormControl` from context. It is what got forgotten when writing each
        field by hand, and when it is forgotten the failure is that nobody hears
        why the field is red.
      </Note>
      <Note>
        It lives at `@eduardoalvarez/arrecife/form` and not at the root: React Hook
        Form is an optional peer dependency, and the four projects that do not use
        it should not have to install it.
      </Note>
    </div>
  ),
};

export const WithErrors: Story = {
  name: 'With errors',
  render: () => (
    <div>
      <DemoForm withErrors />
      <Note>
        The label is NOT tinted. The control's border and the message are already
        in `error`: tinting the label as well is three reds for one failure, and
        the system keeps the semantic color on the border and the glyph.
      </Note>
      <Note>
        With no error, `FormMessage` renders nothing. A reserved gap shifts the
        rest of the form every time the message appears.
      </Note>
    </div>
  ),
};
