import {
  useEffect,
  useId,
  useRef,
  type ComponentPropsWithoutRef,
  type FormEvent,
  type ReactNode,
} from 'react';

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
 *
 * Four of the props are here because the blog had already built each one by
 * hand, and each workaround leaned on something nobody had promised: `aside`
 * replaces an absolutely positioned pose and a `md:pr-[330px]` measured off the
 * image; `resetOnSuccess` replaces finding the `<form>` with a `ref` on the
 * container; `onFieldChange` replaces an `onInput` on the `<section>` that
 * worked because the event bubbles; and `fieldErrors` replaces losing the second
 * message whenever two fields failed at once. A workaround that works by an
 * implementation detail is a bug with a delay.
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
  /**
   * The illustration, as a second column inside the panel.
   *
   * It exists because the component builds its own children, so neither
   * `children` nor an extra `ReactNode` had anywhere to go: the blog ended up
   * positioning the desk pose absolutely over the panel and reserving room for
   * it with a hand-written `md:pr-[330px]`. That number depends on the image's
   * width and nothing keeps the two in step.
   *
   * It only becomes a column from `md` up. Below that it goes back into the
   * flow under the form, for the same reason `Hero`'s pose does: on a narrow
   * screen there is no second column to put it in.
   */
  aside?: ReactNode;
  /**
   * Empties the fields after a successful subscription. On by default.
   *
   * With the fields still full, the same email invites a second submission. The
   * blog worked around it by finding the `<form>` with a `ref` on the container
   * and calling `reset()`, because the component exposed no form — a trick that
   * works by an implementation detail and not by contract.
   */
  resetOnSuccess?: boolean;
  /**
   * Fires when either field changes. It is where the project clears its error.
   *
   * The blog was doing it by hanging an `onInput` off the `<section>` and
   * relying on the event bubbling up. That works, and it works by accident: it
   * depends on the spare props landing on the section, which is an
   * implementation detail and not something anybody promised.
   */
  onFieldChange?: ((field: 'name' | 'email', value: string) => void) | undefined;
  /**
   * A message under one specific field, instead of the single alert.
   *
   * With one bad field the general alert already names it, because the API
   * sends Zod's first message. With two bad at once only one of them is ever
   * seen. `fieldErrors` marks each field and puts its message underneath;
   * `errorMessage` still covers what belongs to the form as a whole — the 409,
   * the network failure — and both can show at the same time.
   */
  fieldErrors?: { name?: ReactNode; email?: ReactNode } | undefined;
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
  aside,
  resetOnSuccess = true,
  onFieldChange,
  fieldErrors,
  className,
  ...props
}: NewsletterFormProps) {
  const id = useId();
  const form = useRef<HTMLFormElement>(null);
  const sending = state === 'sending';
  const error = state === 'error';

  const nameError = fieldErrors?.name;
  const emailError = fieldErrors?.email;

  /*
    The reset hangs off `state`, not off the submit: the component does not know
    whether the request succeeded until the project says so. Emptying on submit
    would clear the field on the way to a 400, which is the case the notice going
    BELOW the form exists to protect.
  */
  useEffect(() => {
    if (state === 'success' && resetOnSuccess) form.current?.reset();
  }, [state, resetOnSuccess]);

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
        'gradient-section rounded-panel border-hairline p-step-lg border',
        // Two columns from `md` up when there is an illustration, one otherwise.
        // `items-center` centres the pose against the block of text and form
        // rather than against the panel, which is what the blog was doing by
        // hand with an absolute position and a reserved `pr`.
        aside
          ? 'gap-step-lg flex flex-col md:flex-row md:items-center'
          : 'gap-step-md flex flex-col',
        className,
      )}
      {...props}
    >
      <div className={cn('gap-step-md flex min-w-0 flex-1 flex-col')}>
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
      <form ref={form} onSubmit={submit} className="gap-step-sm flex flex-col" noValidate>
        <div className="gap-step-sm flex flex-col sm:flex-row sm:items-start">
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
                invalid={Boolean(nameError)}
                aria-describedby={nameError ? `${id}-name-error` : undefined}
                onChange={(e) => onFieldChange?.('name', e.currentTarget.value)}
                {...nameInputProps}
              />
              {nameError ? (
                <Text id={`${id}-name-error`} variant="label" tone="error" as="p" role="alert">
                  {nameError}
                </Text>
              ) : null}
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
              invalid={error || Boolean(emailError)}
              onChange={(e) => onFieldChange?.('email', e.currentTarget.value)}
              aria-describedby={
                emailError
                  ? `${id}-email-error`
                  : state === 'success' || error
                    ? `${id}-notice`
                    : undefined
              }
            />
            {emailError ? (
              <Text id={`${id}-email-error`} variant="label" tone="error" as="p" role="alert">
                {emailError}
              </Text>
            ) : null}
          </div>

          {/*
            `items-start` and not `items-end`: with a per-field message under one
            of them, aligning to the bottom pushed the button down by the height
            of the message. `mt-[26px]` lines it up with the inputs, which sit
            under a 13px label plus its gap.
          */}
          {nameField ? null : <div className="sm:mt-[26px]">{button}</div>}
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
      </div>

      {/*
        The second column. It goes AFTER the form in the DOM so the reading and
        tab order reach the field first: an illustration that comes before the
        thing it decorates is one more stop between the reader and the input.
        `md:order-*` is not used for the same reason — the visual order matches.
      */}
      {aside ? <div className="shrink-0 md:max-w-[42%]">{aside}</div> : null}
    </section>
  );
}
