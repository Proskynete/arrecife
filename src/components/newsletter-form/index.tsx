import { useId, type ComponentPropsWithoutRef, type FormEvent, type ReactNode } from 'react';

import { MascotFace } from '../../brand/mascot.tsx';
import type { Face } from '../../brand/catalog.ts';
import { cn } from '../../lib/cn.ts';
import { Alert } from '../../primitives/alert.tsx';
import { Button } from '../../primitives/button.tsx';
import { Input, type InputProps } from '../../primitives/input.tsx';
import { Label } from '../../primitives/label.tsx';
import { Text } from '../../primitives/typography.tsx';

/**
 * Four states, and the notice goes UNDER the form.
 *
 * Replacing the form with the success message is what almost everyone does and
 * it is what breaks the real case: somebody subscribes with the wrong email and
 * then has nowhere to type it again. The field stays.
 *
 * The component is presentational: it takes `state` and emits `onSubmitEmail`.
 * The network call is the project's job, because each has its own provider and
 * the library is not going to choose one for them.
 *
 * The notice uses the system's SECOND recipe — `emphasis="strong"`, background
 * at 10 % and a solid border — because it sits directly under a field that
 * already has a border: with the subtle recipe, the two lines read as a single
 * box.
 *
 * It is one of the places the mascot may appear: the «sin spam».
 *
 * The name field is OPTIONAL and off by default. It is not a styling prop: one
 * project's endpoint validates name and email and answers 400 if the first is
 * missing, so a one-field form there is not a poorer form — it is one that sends
 * something the server rejects. The name travels as the SECOND argument of
 * `onSubmitEmail`, so the calls that already exist — the ones only declaring
 * `(email)` — keep compiling.
 *
 * What the library does NOT do is validate the name. The project asking for it
 * bounds it between 2 and 50 characters and to letters and accents only; that
 * rule is theirs and the server's that actually checks it, and copying it here
 * would mean two sources drifting apart in silence. `nameInputProps` is there
 * for the project to put its own in.
 */
export type NewsletterState = 'idle' | 'sending' | 'success' | 'error';

export type NewsletterFormProps = Omit<ComponentPropsWithoutRef<'section'>, 'title' | 'onSubmit'> & {
  title: ReactNode;
  description?: ReactNode;
  state?: NewsletterState;
  /**
   * Fires with the email already read from the field, and with the name if that
   * field is enabled.
   */
  onSubmitEmail?: ((email: string, name?: string) => void) | undefined;
  successMessage?: ReactNode;
  errorMessage?: ReactNode;
  /** The small print. It is the «sin spam», which is why it accepts a face. */
  disclaimer?: ReactNode;
  expression?: Face | undefined;
  basePath?: string | undefined;
  submitLabel?: string;
  placeholder?: string;
  fieldLabel?: string;
  /** Adds the name field ahead of the email one. */
  nameField?: boolean;
  nameLabel?: string;
  namePlaceholder?: string;
  /**
   * Whatever the project needs to hang off the name field: `minLength`,
   * `maxLength`, `pattern`. The library imposes none of the three.
   */
  nameInputProps?: Omit<InputProps, 'id' | 'name' | 'disabled'> | undefined;
};

export function NewsletterForm({
  title,
  description,
  state = 'idle',
  onSubmitEmail,
  successMessage = 'Ya estás dentro. Te llega un email cada dos semanas, y nada más.',
  errorMessage = 'No se pudo suscribir ese email. Revísalo y vuelve a intentar.',
  disclaimer,
  expression,
  basePath,
  submitLabel = 'Suscribirme',
  placeholder = 'tu@email.dev',
  fieldLabel = 'Email electrónico',
  nameField = false,
  nameLabel = 'Nombre',
  namePlaceholder = 'Cómo te llamas',
  nameInputProps,
  className,
  ...props
}: NewsletterFormProps) {
  const id = useId();
  const sending = state === 'sending';
  const error = state === 'error';

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') ?? '');
    const name = nameField ? String(data.get('name') ?? '') : undefined;
    onSubmitEmail?.(email, name);
  }

  const button = (
    <Button
      type="submit"
      variant="conversion"
      loading={sending}
      // The document asks for 60 % while sending, not the generic disabled 50 %.
      // With the name field it drops to its own line and aligns left: stretched
      // to full width it would look like a modal's submit.
      className={cn('disabled:opacity-60', nameField && 'sm:self-start')}
    >
      {submitLabel}
    </Button>
  );

  return (
    <section
      className={cn(
        'gradient-section rounded-panel border-hairline p-step-lg gap-step-md flex flex-col border',
        className,
      )}
      {...props}
    >
      <div className="gap-step-xs flex flex-col">
        <Text as="h2" variant="h3">
          {title}
        </Text>
        {description ? (
          <Text variant="ui" tone="secondary">
            {description}
          </Text>
        ) : null}
      </div>

      {/*
        With a single field, field and button share a line from `sm` up. With two,
        the fields split that line and the button drops: three controls in one row
        leave the email at a width an email does not fit in.
      */}
      <form onSubmit={submit} className="gap-step-sm flex flex-col" noValidate>
        <div className="gap-step-sm flex flex-col sm:flex-row sm:items-end">
          {nameField ? (
            <div className="gap-step-xs flex flex-1 flex-col">
              <Label htmlFor={`${id}-name`}>{nameLabel}</Label>
              <Input
                id={`${id}-name`}
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder={namePlaceholder}
                disabled={sending}
                {...nameInputProps}
              />
            </div>
          ) : null}

          <div className="gap-step-xs flex flex-1 flex-col">
            <Label htmlFor={id}>{fieldLabel}</Label>
            <Input
              id={id}
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder={placeholder}
              disabled={sending}
              invalid={error}
              aria-describedby={state === 'success' || error ? `${id}-notice` : undefined}
            />
          </div>

          {nameField ? null : button}
        </div>

        {nameField ? button : null}
      </form>

      {state === 'success' ? (
        <Alert id={`${id}-notice`} variant="success" emphasis="strong">
          {successMessage}
        </Alert>
      ) : null}

      {error ? (
        <Alert id={`${id}-notice`} variant="error" emphasis="strong">
          {errorMessage}
        </Alert>
      ) : null}

      {disclaimer ? (
        <div className="gap-step-sm flex items-center">
          {expression ? (
            <MascotFace expression={expression} basePath={basePath} className="w-10 max-w-none" />
          ) : null}
          <Text variant="label" tone="muted" as="p" className="font-normal">
            {disclaimer}
          </Text>
        </div>
      ) : null}
    </section>
  );
}
