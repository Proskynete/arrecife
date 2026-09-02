import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '../../lib/cn.ts';
import { Badge } from '../../primitives/badge.tsx';
import { Text } from '../../primitives/typography.tsx';
import { CARD_SURFACE } from '../../variants/card.ts';
import { CardShell, type CardShellProps } from '../card-base.tsx';

type TalkContent = {
  title: ReactNode;
  /** Where it was given: the conference, the meetup, the team. */
  event: ReactNode;
  date?: ReactNode;
  dateTime?: string | undefined;
  location?: ReactNode;
  /** Short status label: «con vídeo», «próxima», «solo audio». */
  status?: ReactNode;
  /**
   * What the talk was about. Clamped to two lines, same as `ArticleCard`'s
   * `excerpt`, so the grid does not fall out of line.
   */
  description?: ReactNode;
};

/**
 * A talk has more than one destination, and that is what shapes this type.
 *
 * Slides, repo, the recording, the event's own page: the listing used to show
 * them as loose links under each talk, and migrating to this component made them
 * DISAPPEAR — there was nowhere to put them, so the blog pointed the whole card
 * at the first one that existed and the rest were lost.
 *
 * So `resources` is a slot, and it forces a choice in the type: a card with
 * resources is NOT a link. An `<a>` inside an `<a>` is invalid HTML and the
 * browser un-nests it, so «the card links to the slides AND the slides link to
 * the slides» is not a thing that can render. With resources the card is an
 * `<article>` on the card surface and the links are the resources; without them
 * it stays the single-destination card it was.
 *
 * That is why this is a union and not one more optional prop: the combination
 * that cannot work does not compile.
 */
export type TalkCardProps =
  | (Omit<CardShellProps, 'children' | 'title'> &
      TalkContent & {
        /** The card is the link. Do not pass resources with this. */
        resources?: never;
      })
  | (Omit<ComponentPropsWithoutRef<'article'>, 'title'> &
      TalkContent & {
        /**
         * Slides, repo, recording. They are the links, so the card stops being
         * one.
         */
        resources: ReactNode;
      });

export function TalkCard({
  title,
  event,
  date,
  dateTime,
  location,
  status,
  description,
  resources,
  className,
  ...props
}: TalkCardProps) {
  const footer = [
    date ? (
      <time key="date" dateTime={dateTime}>
        {date}
      </time>
    ) : null,
    location ? <span key="location">{location}</span> : null,
  ].filter(Boolean);

  const body = (
    <>
      <div className="gap-step-sm flex items-start justify-between">
        <Text variant="eyebrow" tone="accent" as="p">
          {event}
        </Text>
        {status ? <Badge variant="neutral">{status}</Badge> : null}
      </div>

      <Text
        as="h3"
        variant="h3"
        className={cn(!resources && 'group-hover:text-accent transition-standard')}
      >
        {title}
      </Text>

      {description ? (
        <Text variant="ui" tone="secondary" className="line-clamp-2">
          {description}
        </Text>
      ) : null}

      {footer.length > 0 ? (
        <Text
          variant="label"
          tone="muted"
          as="p"
          className={cn('gap-step-xs flex items-center pt-step-sm', !resources && 'mt-auto')}
        >
          {footer.map((m, i) => (
            <span key={i} className="gap-step-xs flex items-center">
              {i > 0 ? <span aria-hidden="true">·</span> : null}
              {m}
            </span>
          ))}
        </Text>
      ) : null}

      {/*
        The resources go last and carry `mt-auto`, so in a grid every card lines
        its links up at the same height however long the description is.
      */}
      {resources ? (
        <div className="gap-step-md mt-auto flex flex-wrap items-center pt-step-sm">
          {resources}
        </div>
      ) : null}
    </>
  );

  if (resources) {
    return (
      <article
        className={cn(CARD_SURFACE, 'p-step-lg gap-step-sm flex h-full flex-col', className)}
        {...(props as ComponentPropsWithoutRef<'article'>)}
      >
        {body}
      </article>
    );
  }

  return (
    <CardShell className={cn('p-step-lg', className)} {...(props as CardShellProps)}>
      <article className="gap-step-sm flex h-full flex-col">{body}</article>
    </CardShell>
  );
}

