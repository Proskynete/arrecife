import { useId, type ComponentPropsWithoutRef, type FormEvent, type ReactNode } from 'react';

import { CaraDeMascota } from '../../brand/mascota.tsx';
import type { Cara } from '../../brand/catalogo.ts';
import { cn } from '../../lib/cn.ts';
import { Alert } from '../../primitives/alert.tsx';
import { Button } from '../../primitives/button.tsx';
import { Input } from '../../primitives/input.tsx';
import { Label } from '../../primitives/label.tsx';
import { Text } from '../../primitives/typography.tsx';

/**
 * Cuatro estados, y el aviso va DEBAJO del formulario.
 *
 * Reemplazar el formulario por el mensaje de éxito es lo que hace casi todo el
 * mundo y es lo que rompe el caso real: alguien se suscribe con el correo
 * equivocado y ya no tiene dónde volver a escribirlo. El campo se queda.
 *
 * El componente es presentacional: recibe `state` y emite `onSubmitEmail`. La
 * llamada de red la hace el proyecto, porque cada uno tiene su proveedor y la
 * librería no va a elegirlo por ellos.
 *
 * El aviso usa la SEGUNDA receta del sistema —`enfasis="fuerte"`, fondo al 10 %
 * y borde sólido— porque va pegado bajo un campo que ya tiene borde: con la
 * receta sutil, las dos líneas se leen como una sola caja.
 *
 * Es uno de los sitios donde la mascota puede aparecer: el «sin spam».
 */
export type NewsletterState = 'reposo' | 'enviando' | 'exito' | 'error';

export type NewsletterFormProps = Omit<ComponentPropsWithoutRef<'section'>, 'title' | 'onSubmit'> & {
  title: ReactNode;
  description?: ReactNode;
  state?: NewsletterState;
  /** Se dispara con el correo ya leído del campo. */
  onSubmitEmail?: ((email: string) => void) | undefined;
  successMessage?: ReactNode;
  errorMessage?: ReactNode;
  /** La letra pequeña. Es el «sin spam», y por eso admite cara. */
  disclaimer?: ReactNode;
  expresion?: Cara | undefined;
  basePath?: string | undefined;
  submitLabel?: string;
  placeholder?: string;
  fieldLabel?: string;
};

export function NewsletterForm({
  title,
  description,
  state = 'reposo',
  onSubmitEmail,
  successMessage = 'Ya estás dentro. Te llega un correo cada dos semanas, y nada más.',
  errorMessage = 'No se pudo suscribir ese correo. Revísalo y vuelve a intentar.',
  disclaimer,
  expresion,
  basePath,
  submitLabel = 'Suscribirme',
  placeholder = 'tu@correo.dev',
  fieldLabel = 'Correo electrónico',
  className,
  ...props
}: NewsletterFormProps) {
  const id = useId();
  const enviando = state === 'enviando';
  const error = state === 'error';

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    const correo = String(datos.get('email') ?? '');
    onSubmitEmail?.(correo);
  }

  return (
    <section
      className={cn(
        'degradado-seccion rounded-panel border-hairline p-lg gap-md flex flex-col border',
        className,
      )}
      {...props}
    >
      <div className="gap-xs flex flex-col">
        <Text as="h2" variant="h3">
          {title}
        </Text>
        {description ? (
          <Text variant="ui" tone="secondary">
            {description}
          </Text>
        ) : null}
      </div>

      <form onSubmit={enviar} className="gap-sm flex flex-col sm:flex-row sm:items-end" noValidate>
        <div className="gap-xs flex flex-1 flex-col">
          <Label htmlFor={id}>{fieldLabel}</Label>
          <Input
            id={id}
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={placeholder}
            disabled={enviando}
            invalid={error}
            aria-describedby={state === 'exito' || error ? `${id}-aviso` : undefined}
          />
        </div>

        <Button
          type="submit"
          variant="conversion"
          loading={enviando}
          // El documento pide el 60 % mientras envía, no el 50 % del
          // deshabilitado genérico.
          className="disabled:opacity-60"
        >
          {submitLabel}
        </Button>
      </form>

      {state === 'exito' ? (
        <Alert id={`${id}-aviso`} variant="success" enfasis="fuerte">
          {successMessage}
        </Alert>
      ) : null}

      {error ? (
        <Alert id={`${id}-aviso`} variant="error" enfasis="fuerte">
          {errorMessage}
        </Alert>
      ) : null}

      {disclaimer ? (
        <div className="gap-sm flex items-center">
          {expresion ? (
            <CaraDeMascota expresion={expresion} basePath={basePath} className="w-10 max-w-none" />
          ) : null}
          <Text variant="label" tone="muted" as="p" className="font-normal">
            {disclaimer}
          </Text>
        </div>
      ) : null}
    </section>
  );
}
