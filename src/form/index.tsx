import {
  createContext,
  useContext,
  useId,
  type ComponentPropsWithoutRef,
} from 'react';
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '../lib/cn.ts';
import { Label } from '../primitives/label.tsx';
import { Text } from '../primitives/typography.tsx';

/**
 * La capa que ata los controles a un formulario con validación y mensajes.
 *
 * La librería ya traía `Input`, `Label`, `Checkbox`, `RadioGroup`, `Select` y
 * `Textarea`, y ninguno sabía nada del otro: el `htmlFor`, el `aria-describedby`
 * del mensaje de error y el `aria-invalid` había que cablearlos a mano en cada
 * campo de cada proyecto. Eso se olvida, y cuando se olvida el fallo es que un
 * lector de pantalla no anuncia por qué el campo está en rojo.
 *
 * Se publica en `@eduardoalvarez/arrecife/form`, NO en la raíz, y eso es
 * deliberado. React Hook Form es una dependencia de pares opcional: solo uno de
 * los cinco proyectos la usa, y si esto colgara del índice principal, los otros
 * cuatro tendrían que instalarla para que su bundler resolviera un import que
 * nunca ejecutan. Es la misma razón por la que `./og` y `./shiki` viven aparte,
 * mirada desde el otro lado: allí se saca React del camino, aquí se saca RHF.
 *
 * La forma es la de shadcn —`FormField` sobre `Controller`, contexto de campo y
 * contexto de item— porque el proyecto que la consume ya está escrito contra
 * ella y reinventarla solo le costaría una migración. Lo que cambia es el
 * vocabulario visual: los ids, la escala y el tono salen del sistema.
 */
export const Form = FormProvider;

type CampoContexto = { name: string };
const Campo = createContext<CampoContexto | null>(null);

type ItemContexto = { id: string };
const Item = createContext<ItemContexto | null>(null);

/**
 * Un campo controlado. Envuelve el `Controller` de RHF y además publica el
 * nombre en contexto, que es de donde lo leen la etiqueta y el mensaje sin que
 * haya que repetirlo tres veces.
 */
export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <Campo.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </Campo.Provider>
  );
}

/**
 * Lo que necesita cualquier pieza del campo: el nombre, los tres ids y el estado
 * de validación.
 *
 * Tira si se usa fuera de un `FormField` o de un `FormItem`, con el mensaje que
 * dice cuál de los dos falta. Devolver algo a medias sería peor: el campo se
 * renderizaría sin `aria-describedby` y nada avisaría.
 */
export function useFormField() {
  const campo = useContext(Campo);
  const item = useContext(Item);
  const { getFieldState } = useFormContext();
  const estado = useFormState({ name: campo?.name ?? '' });

  if (!campo) throw new Error('useFormField se usa dentro de un <FormField>.');
  if (!item) throw new Error('useFormField se usa dentro de un <FormItem>.');

  return {
    name: campo.name,
    id: item.id,
    idDescripcion: `${item.id}-descripcion`,
    idMensaje: `${item.id}-mensaje`,
    ...getFieldState(campo.name, estado),
  };
}

/** La caja del campo: etiqueta, control, ayuda y mensaje, en columna. */
export function FormItem({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  const id = useId();

  return (
    <Item.Provider value={{ id }}>
      <div className={cn('gap-step-xs flex flex-col', className)} {...props} />
    </Item.Provider>
  );
}

/**
 * La etiqueta NO se tiñe de rojo cuando el campo falla.
 *
 * El sistema deja el color semántico en el borde y en el glifo, y el texto en un
 * token de texto: el borde del control ya está en `error` y el mensaje de abajo
 * también, así que teñir además la etiqueta son tres rojos para un solo fallo.
 */
export function FormLabel({ className, ...props }: ComponentPropsWithoutRef<typeof Label>) {
  const { id } = useFormField();
  return <Label htmlFor={id} className={className} {...props} />;
}

/**
 * Envuelve al control y le cablea los atributos: el `id` que la etiqueta apunta,
 * el `aria-describedby` con la ayuda y el mensaje, y el `aria-invalid`.
 *
 * Es un `Slot`, así que el hijo puede ser cualquiera de los controles del
 * sistema —`Input`, `Textarea`, `SelectTrigger`— sin que esto sepa cuál.
 */
export function FormControl({ ...props }: ComponentPropsWithoutRef<typeof Slot>) {
  const { error, id, idDescripcion, idMensaje } = useFormField();

  return (
    <Slot
      id={id}
      aria-describedby={error ? `${idDescripcion} ${idMensaje}` : idDescripcion}
      aria-invalid={error ? true : undefined}
      {...props}
    />
  );
}

/** La ayuda del campo. Se anuncia siempre, haya error o no. */
export function FormDescription({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  const { idDescripcion } = useFormField();

  return (
    <Text
      as="p"
      variant="label"
      tone="muted"
      id={idDescripcion}
      className={cn('font-normal', className)}
      {...props}
    />
  );
}

/**
 * El mensaje de validación. Sin error no renderiza nada: un hueco reservado
 * para el fallo desplaza el resto del formulario cada vez que aparece.
 *
 * Toma el texto del error de RHF; `children` sirve para un mensaje que no venga
 * del esquema —el 409 que devuelve el servidor y que ningún validador de
 * cliente puede anticipar—.
 */
export function FormMessage({ className, children, ...props }: ComponentPropsWithoutRef<'p'>) {
  const { error, idMensaje } = useFormField();
  const cuerpo = error?.message ? String(error.message) : children;

  if (!cuerpo) return null;

  return (
    <Text
      as="p"
      variant="label"
      tone="error"
      id={idMensaje}
      className={className}
      {...props}
    >
      {cuerpo}
    </Text>
  );
}
