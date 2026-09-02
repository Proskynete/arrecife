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
 * The layer that ties the controls to a form with validation and messages.
 *
 * The library already had `Input`, `Label`, `Checkbox`, `RadioGroup`, `Select`
 * and `Textarea`, and none of them knew anything about the others: the
 * `htmlFor`, the error message's `aria-describedby` and the `aria-invalid` had
 * to be wired by hand on every field of every project. That gets forgotten, and
 * when it does the failure is that a screen reader never announces why the field
 * is red.
 *
 * It is published at `@eduardoalvarez/arrecife/form`, NOT at the root, and that
 * is deliberate. React Hook Form is an optional peer dependency: only one of the
 * five projects uses it, and if this hung off the main index the other four
 * would have to install it just so their bundler could resolve an import they
 * never execute. It is the same reason `./og` and `./shiki` live apart, seen
 * from the other side: there React is kept out of the way, here RHF is.
 *
 * The shape is shadcn's — `FormField` on `Controller`, field context and item
 * context — because the project consuming it is already written against it and
 * reinventing it would only cost them a migration. What changes is the visual
 * vocabulary: the ids, the scale and the tone come from the system.
 */
export const Form = FormProvider;

type FieldContext = { name: string };
const Field = createContext<FieldContext | null>(null);

type ItemContext = { id: string };
const Item = createContext<ItemContext | null>(null);

/**
 * A controlled field. It wraps RHF's `Controller` and also publishes the name
 * into context, which is where the label and the message read it from without
 * having to repeat it three times.
 */
export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <Field.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </Field.Provider>
  );
}

/**
 * What any piece of the field needs: the name, the three ids and the validation
 * state.
 *
 * It throws if used outside a `FormField` or a `FormItem`, with a message saying
 * which of the two is missing. Returning something half-formed would be worse:
 * the field would render with no `aria-describedby` and nothing would warn.
 */
export function useFormField() {
  const field = useContext(Field);
  const item = useContext(Item);
  const { getFieldState } = useFormContext();
  const state = useFormState({ name: field?.name ?? '' });

  if (!field) throw new Error('useFormField must be used inside a <FormField>.');
  if (!item) throw new Error('useFormField must be used inside a <FormItem>.');

  return {
    name: field.name,
    id: item.id,
    descriptionId: `${item.id}-descripcion`,
    messageId: `${item.id}-mensaje`,
    ...getFieldState(field.name, state),
  };
}

/** The field's box: label, control, help and message, in a column. */
export function FormItem({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  const id = useId();

  return (
    <Item.Provider value={{ id }}>
      <div className={cn('gap-step-xs flex flex-col', className)} {...props} />
    </Item.Provider>
  );
}

/**
 * The label is NOT tinted red when the field fails.
 *
 * The system keeps the semantic color on the border and on the glyph, and the
 * text on a text token: the control's border is already in `error` and so is the
 * message below it, so tinting the label as well is three reds for one failure.
 */
export function FormLabel({ className, ...props }: ComponentPropsWithoutRef<typeof Label>) {
  const { id } = useFormField();
  return <Label htmlFor={id} className={className} {...props} />;
}

/**
 * Wraps the control and wires its attributes: the `id` the label points at, the
 * `aria-describedby` with the help and the message, and the `aria-invalid`.
 *
 * It is a `Slot`, so the child can be any of the system's controls — `Input`,
 * `Textarea`, `SelectTrigger` — without this knowing which.
 */
export function FormControl({ ...props }: ComponentPropsWithoutRef<typeof Slot>) {
  const { error, id, descriptionId, messageId } = useFormField();

  return (
    <Slot
      id={id}
      aria-describedby={error ? `${descriptionId} ${messageId}` : descriptionId}
      aria-invalid={error ? true : undefined}
      {...props}
    />
  );
}

/** The field's help text. It is always announced, error or not. */
export function FormDescription({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  const { descriptionId } = useFormField();

  return (
    <Text
      as="p"
      variant="label"
      tone="muted"
      id={descriptionId}
      className={cn('font-normal', className)}
      {...props}
    />
  );
}

/**
 * The validation message. With no error it renders nothing: a gap reserved for
 * the failure shifts the rest of the form every time it appears.
 *
 * It takes its text from RHF's error; `children` is for a message that does not
 * come from the schema — the 409 the server returns and that no client-side
 * validator can anticipate.
 */
export function FormMessage({ className, children, ...props }: ComponentPropsWithoutRef<'p'>) {
  const { error, messageId } = useFormField();
  const body = error?.message ? String(error.message) : children;

  if (!body) return null;

  return (
    <Text
      as="p"
      variant="label"
      tone="error"
      id={messageId}
      className={className}
      {...props}
    >
      {body}
    </Text>
  );
}
