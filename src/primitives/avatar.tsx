import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';

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

export { avatar as avatarVariants };
