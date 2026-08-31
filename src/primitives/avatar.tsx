import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  useEffect,
  useId,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';

import { cn } from '../lib/cn.ts';
import { Camara } from '../lib/glyphs.tsx';

const avatar = cva(
  'relative flex shrink-0 overflow-hidden rounded-pill bg-surface-raised border border-hairline',
  {
    variants: {
      size: {
        sm: 'size-8',
        md: 'size-10',
        lg: 'size-14',
        xl: 'size-24',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export type AvatarProps = ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatar>;

/**
 * Uno solo para todo: la foto del autor y la de cualquier persona del sistema.
 * No hay un `brand/Avatar` aparte — una foto de perfil con la piel de la marca
 * es exactamente esto con un `src` distinto.
 */
export function Avatar({ className, size, ...props }: AvatarProps) {
  return <AvatarPrimitive.Root className={cn(avatar({ size }), className)} {...props} />;
}

export function AvatarImage({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image className={cn('aspect-square size-full object-cover', className)} {...props} />
  );
}

/** Iniciales mientras la imagen carga, o cuando no hay imagen. */
export function AvatarFallback({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        'text-label font-mono text-text-secondary flex size-full items-center justify-center uppercase',
        className,
      )}
      {...props}
    />
  );
}


export type AvatarUploadProps = Omit<ComponentPropsWithoutRef<'div'>, 'onSelect' | 'children'> &
  VariantProps<typeof avatar> & {
    /** La imagen actual, ya subida. La previsualización local la gana mientras dure. */
    src?: string | undefined;
    /** Iniciales mientras no hay imagen. */
    fallback?: ReactNode;
    /** Se dispara con el archivo elegido. La subida la hace el proyecto. */
    onSelectFile?: ((archivo: File) => void) | undefined;
    /** Qué acepta el diálogo del sistema. */
    accept?: string;
    /** Nombre accesible del control. Es lo único que lo nombra: no hay texto visible. */
    label?: string;
    disabled?: boolean | undefined;
  };

/**
 * El avatar que se puede cambiar. `Avatar` muestra; este además deja elegir.
 *
 * Es presentacional, como `NewsletterForm`: emite `onSelectFile` con el `File` y
 * ahí se acaba su trabajo. La subida no entra —cada proyecto tiene su
 * almacenamiento y su endpoint— y un componente que hiciera el `POST` sería
 * infraestructura, que es el tercer criterio de entrada y el que más se salta.
 *
 * La previsualización es LOCAL y no espera a que la subida termine. Es la
 * diferencia entre un control que responde y uno que parece roto: entre elegir
 * el archivo y que el servidor devuelva la URL pueden pasar segundos, y sin
 * previa el avatar se queda con la foto vieja como si no hubiera pasado nada.
 * El `objectURL` se revoca al cambiar y al desmontar; no revocarlo es una fuga
 * de memoria que no da la cara hasta la décima foto.
 *
 * El control es un `<label>` con un `<input type="file">` oculto dentro, no un
 * `<button>` que dispara un click sintético. El input real trae el diálogo del
 * sistema, el arrastrar-y-soltar del navegador y el foco por teclado; el botón
 * falso hay que reconstruirlo entero y siempre falta algo.
 */
export function AvatarUpload({
  src,
  fallback,
  onSelectFile,
  accept = 'image/*',
  label = 'Cambiar la foto',
  size,
  disabled = false,
  className,
  ...props
}: AvatarUploadProps) {
  const id = useId();
  const [previa, setPrevia] = useState<string | null>(null);

  useEffect(() => {
    if (!previa) return;
    return () => URL.revokeObjectURL(previa);
  }, [previa]);

  function elegir(evento: ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0];
    if (!archivo) return;

    setPrevia(URL.createObjectURL(archivo));
    onSelectFile?.(archivo);

    // Se limpia el valor para que volver a elegir EL MISMO archivo dispare otro
    // `change`. Sin esto, quien corrige una foto mal recortada y vuelve a elegir
    // la misma no obtiene ninguna reacción.
    evento.target.value = '';
  }

  const imagen = previa ?? src;

  return (
    <div className={cn('relative inline-flex', className)} {...props}>
      <Avatar size={size}>
        {imagen ? <AvatarImage src={imagen} alt="" /> : null}
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>

      {/*
        Insignia SIEMPRE visible, en la esquina, y no un velo que aparece al
        pasar el ratón. El velo es la solución bonita y es de escritorio: en
        táctil no hay hover, así que el control no existe hasta que alguien
        adivina que la foto se puede tocar. Una insignia permanente ocupa 24px y
        se ve en los dos sitios.
      */}
      <label
        htmlFor={id}
        className={cn(
          'rounded-pill absolute -right-1 -bottom-1 flex size-6 cursor-pointer items-center justify-center',
          'border-hairline bg-surface-raised text-text-secondary border',
          'transition-standard hover:text-accent hover:border-accent',
          // El foco vive en el input, que está oculto: sin esto, tabular hasta
          // el control no se ve por ninguna parte.
          'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        <Camara aria-hidden="true" />
        <span className="sr-only">{label}</span>
        <input
          id={id}
          type="file"
          accept={accept}
          disabled={disabled}
          onChange={elegir}
          className="sr-only"
        />
      </label>
    </div>
  );
}

export { avatar as avatarVariants };
