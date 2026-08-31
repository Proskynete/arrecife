import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { Avatar, AvatarFallback, AvatarImage } from '../../primitives/avatar.tsx';
import { SUPERFICIE_TARJETA } from '../../primitives/card.tsx';
import { Text } from '../../primitives/typography.tsx';

/**
 * La firma al pie del artículo: avatar 52px, nombre 15/500 y el rol en mono
 * muted. Tres datos, ni uno más.
 *
 * NO recibe cara de mascota, y no es un descuido: es la misma regla que
 * `PageHeader`. Una cara aquí sería humor en el sitio donde el lector está
 * decidiendo si el autor sabe de lo que habla — justo lo que el contrato del
 * manual excluye.
 *
 * El avatar del manual es la cabeza dentro de un círculo azul tiburón sólido,
 * nunca la cara expresiva suelta.
 */
export type AuthorCardProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  name: string;
  /** El rol. Va en mono: es un dato, no una frase. */
  role?: ReactNode;
  /** URL del avatar. Sin ella se muestran las iniciales. */
  src?: string | undefined;
  /** Una o dos frases. Se corta a 68ch sola. */
  bio?: ReactNode;
  /** Enlaces o botón de contacto. */
  action?: ReactNode;
};

/** 52px, del documento. Es tamaño de retrato, no ritmo de página. */
const AVATAR = 'size-[52px]';

function iniciales(nombre: string) {
  return nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0] ?? '')
    .join('')
    .toUpperCase();
}

export function AuthorCard({ name, role, src, bio, action, className, ...props }: AuthorCardProps) {
  return (
    <div className={cn(SUPERFICIE_TARJETA, 'p-step-lg gap-step-md flex items-start', className)} {...props}>
      <Avatar className={cn(AVATAR, 'shrink-0')}>
        {src ? <AvatarImage src={src} alt="" /> : null}
        <AvatarFallback>{iniciales(name)}</AvatarFallback>
      </Avatar>

      <div className="gap-step-xs flex min-w-0 flex-1 flex-col">
        <Text variant="ui" as="p" className="font-medium">
          {name}
        </Text>

        {role ? (
          <Text variant="chip" tone="muted" as="p">
            {role}
          </Text>
        ) : null}

        {bio ? (
          <Text variant="ui" tone="secondary" className="mt-step-xs">
            {bio}
          </Text>
        ) : null}

        {action ? <div className="mt-step-xs gap-step-sm flex flex-wrap items-center">{action}</div> : null}
      </div>
    </div>
  );
}
