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
import { Camera } from '../lib/glyphs.tsx';

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
 * One for everything: the author's photo and anyone else's in the system. There
 * is no separate `brand/Avatar` — a profile photo wearing the brand's skin is
 * exactly this with a different `src`.
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

/** Initials while the image loads, or when there is no image. */
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
    /** The current image, already uploaded. The local preview beats it while it lasts. */
    src?: string | undefined;
    /** Initials while there is no image. */
    fallback?: ReactNode;
    /** Fires with the chosen file. The upload is the project's job. */
    onSelectFile?: ((file: File) => void) | undefined;
    /** What the system dialog accepts. */
    accept?: string;
    /** The control's accessible name. It is the only thing naming it: there is no visible text. */
    label?: string;
    disabled?: boolean | undefined;
  };

/**
 * The avatar you can change. `Avatar` displays; this one also lets you pick.
 *
 * It is presentational, like `NewsletterForm`: it emits `onSelectFile` with the
 * `File` and its job ends there. The upload does not belong here — every project
 * has its own storage and its own endpoint — and a component doing the `POST`
 * would be infrastructure, which is the third entry criterion and the one most
 * often skipped.
 *
 * The preview is LOCAL and does not wait for the upload to finish. It is the
 * difference between a control that responds and one that looks broken: seconds
 * can pass between picking the file and the server returning the URL, and with
 * no preview the avatar keeps the old photo as though nothing had happened. The
 * `objectURL` is revoked on change and on unmount; not revoking it is a memory
 * leak that does not show its face until the tenth photo.
 *
 * The control is a `<label>` with a hidden `<input type="file">` inside, not a
 * `<button>` firing a synthetic click. The real input brings the system dialog,
 * the browser's drag-and-drop and keyboard focus; the fake button has to be
 * rebuilt from scratch and something is always missing.
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
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  function pick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    onSelectFile?.(file);

    // The value is cleared so that picking THE SAME file again fires another
    // `change`. Without this, someone re-picking the same badly cropped photo
    // after fixing it gets no reaction at all.
    event.target.value = '';
  }

  const image = preview ?? src;

  return (
    <div className={cn('relative inline-flex', className)} {...props}>
      <Avatar size={size}>
        {image ? <AvatarImage src={image} alt="" /> : null}
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>

      {/*
        The badge is ALWAYS visible, in the corner, rather than a scrim that
        appears on hover. The scrim is the pretty solution and it is a desktop
        one: there is no hover on touch, so the control does not exist until
        somebody guesses the photo is tappable. A permanent badge takes 24px and
        is visible in both places.
      */}
      <label
        htmlFor={id}
        className={cn(
          'rounded-pill absolute -right-1 -bottom-1 flex size-6 cursor-pointer items-center justify-center',
          'border-hairline bg-surface-raised text-text-secondary border',
          'transition-standard hover:text-accent hover:border-accent',
          // Focus lives on the input, which is hidden: without this, tabbing to
          // the control shows up nowhere.
          'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        <Camera aria-hidden="true" />
        <span className="sr-only">{label}</span>
        <input
          id={id}
          type="file"
          accept={accept}
          disabled={disabled}
          onChange={pick}
          className="sr-only"
        />
      </label>
    </div>
  );
}

export { avatar as avatarVariants };
