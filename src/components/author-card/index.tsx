import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { Avatar, AvatarFallback, AvatarImage } from '../../primitives/avatar.tsx';
import { CARD_SURFACE } from '../../primitives/card.tsx';
import { Text } from '../../primitives/typography.tsx';

/**
 * The byline at the foot of the article: 52px avatar, 15/500 name and the role
 * in muted mono. Three data points, not one more.
 *
 * It does NOT take a mascot face, and that is not an oversight: it is the same
 * rule as `PageHeader`. A face here would be humour in the exact place where the
 * reader is deciding whether the author knows what they are talking about —
 * precisely what the manual's contract excludes.
 *
 * The manual's avatar is the head inside a solid shark-blue circle, never the
 * expressive face on its own.
 */
export type AuthorCardProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  name: string;
  /** The role. It goes in mono: it is a datum, not a sentence. */
  role?: ReactNode;
  /** The avatar's URL. Without it the initials are shown. */
  src?: string | undefined;
  /** One or two sentences. It clamps itself to 68ch. */
  bio?: ReactNode;
  /** Links or a contact button. */
  action?: ReactNode;
};

/** 52px, from the document. It is portrait size, not page rhythm. */
const AVATAR = 'size-[52px]';

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0] ?? '')
    .join('')
    .toUpperCase();
}

export function AuthorCard({ name, role, src, bio, action, className, ...props }: AuthorCardProps) {
  return (
    <div className={cn(CARD_SURFACE, 'p-step-lg gap-step-md flex items-start', className)} {...props}>
      <Avatar className={cn(AVATAR, 'shrink-0')}>
        {src ? <AvatarImage src={src} alt="" /> : null}
        <AvatarFallback>{initials(name)}</AvatarFallback>
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
