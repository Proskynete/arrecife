import { useId, type ComponentPropsWithoutRef, type FormEvent, type ReactNode } from 'react';

import { CaraDeMascota } from '../../brand/mascota.tsx';
import type { Cara } from '../../brand/catalogo.ts';
import { cn } from '../../lib/cn.ts';
import { Alert } from '../../primitives/alert.tsx';
import { Button } from '../../primitives/button.tsx';
import { Input, type InputProps } from '../../primitives/input.tsx';
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
 *
 * El campo de nombre es OPCIONAL y está apagado por defecto. No es una prop de
 * estilo: el endpoint de uno de los proyectos valida nombre y correo y responde
 * 400 si falta el primero, así que un formulario de un solo campo ahí no es un
 * formulario más pobre — es uno que envía algo que el servidor rechaza. El
 * nombre viaja como SEGUNDO argumento de `onSubmitEmail`, para que las llamadas
 * que ya existen —las que solo declaran `(email)`— sigan compilando.
 *
 * Lo que la librería NO hace es validar el nombre. El proyecto que lo pide lo
 * acota entre 2 y 50 caracteres y solo letras y acentos; esa regla es suya y del
 * servidor que la comprueba de verdad, y copiarla aquí sería tener dos fuentes
 * que se desincronizan en silencio. `nameInputProps` está para que el proyecto
 * ponga la suya.
 */
export type NewsletterState = 'reposo' | 'enviando' | 'exito' | 'error';

export type NewsletterFormProps = Omit<ComponentPropsWithoutRef<'section'>, 'title' | 'onSubmit'> & {
  title: ReactNode;
  description?: ReactNode;
  state?: NewsletterState;
  /**
   * Se dispara con el correo ya leído del campo, y con el nombre si el campo
   * está puesto.
   */
  onSubmitEmail?: ((email: string, name?: string) => void) | undefined;
  successMessage?: ReactNode;
  errorMessage?: ReactNode;
  /** La letra pequeña. Es el «sin spam», y por eso admite cara. */
  disclaimer?: ReactNode;
  expresion?: Cara | undefined;
  basePath?: string | undefined;
  submitLabel?: string;
  placeholder?: string;
  fieldLabel?: string;
  /** Añade el campo de nombre delante del correo. */
  nameField?: boolean;
  nameLabel?: string;
  namePlaceholder?: string;
  /**
   * Lo que el proyecto necesite colgar del campo de nombre: `minLength`,
   * `maxLength`, `pattern`. La librería no impone ninguna de las tres.
   */
  nameInputProps?: Omit<InputProps, 'id' | 'name' | 'disabled'> | undefined;
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
  nameField = false,
  nameLabel = 'Nombre',
  namePlaceholder = 'Cómo te llamas',
  nameInputProps,
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
    const nombre = nameField ? String(datos.get('name') ?? '') : undefined;
    onSubmitEmail?.(correo, nombre);
  }

  const boton = (
    <Button
      type="submit"
      variant="conversion"
      loading={enviando}
      // El documento pide el 60 % mientras envía, no el 50 % del deshabilitado
      // genérico. Con el campo de nombre baja a su propia línea y se alinea a la
      // izquierda: estirado a todo el ancho parecería el envío de un modal.
      className={cn('disabled:opacity-60', nameField && 'sm:self-start')}
    >
      {submitLabel}
    </Button>
  );

  return (
    <section
      className={cn(
        'degradado-seccion rounded-panel border-hairline p-step-lg gap-step-md flex flex-col border',
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
        Con un solo campo, campo y botón van en la misma línea desde `sm`. Con
        dos, los campos se reparten esa línea y el botón baja: tres controles en
        una fila dejan el correo en un ancho donde no cabe un correo.
      */}
      <form onSubmit={enviar} className="gap-step-sm flex flex-col" noValidate>
        <div className="gap-step-sm flex flex-col sm:flex-row sm:items-end">
          {nameField ? (
            <div className="gap-step-xs flex flex-1 flex-col">
              <Label htmlFor={`${id}-nombre`}>{nameLabel}</Label>
              <Input
                id={`${id}-nombre`}
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder={namePlaceholder}
                disabled={enviando}
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
              disabled={enviando}
              invalid={error}
              aria-describedby={state === 'exito' || error ? `${id}-aviso` : undefined}
            />
          </div>

          {nameField ? null : boton}
        </div>

        {nameField ? boton : null}
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
        <div className="gap-step-sm flex items-center">
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
