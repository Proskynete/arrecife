import * as AccordionPrimitive from '@radix-ui/react-accordion';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '../lib/cn.ts';
import { ChevronDown } from '../lib/glyphs.tsx';

/**
 * The disclosure. Two projects asked for it: the portfolio FAQ and the course
 * syllabus, which is literally a list of sections that open.
 *
 * The height IS animated, and it is the system's fourth declared exception.
 *
 * It deserves explaining, because the general rule says the opposite and this
 * component was born unanimated citing it. The difference is that nothing
 * APPEARS here: a gap opens, and everything below the accordion shifts. Without
 * a transition that shift is a jump, and whoever just clicked loses their place
 * on the page — which is exactly the harm the «no movement» rule exists to
 * prevent. It is the same category as the side panel, the second exception, and
 * not that of an entrance animation.
 *
 * It sits behind `motion-safe`, lasts `--duration-standard` and uses
 * `--ease-standard`, so it introduces neither a new timing nor a new curve.
 * Whoever asked for less motion still sees the panel appear where it will stay.
 *
 * See `docs/decisions.md` § 20.
 *
 * The chevron, by contrast, rotates with no transition: `transition-standard`
 * only covers color and border, so `rotate` snaps even with the class in place.
 * It is the same treatment `Progress` gives its width.
 *
 * The divider between items is `hairline`, not `border`: it is a reading
 * separation, not the border of a control.
 */
export type AccordionProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>;

export function Accordion({ className, ...props }: AccordionProps) {
  return (
    <AccordionPrimitive.Root
      className={cn('border-hairline w-full border-t', className)}
      {...props}
    />
  );
}

export function AccordionItem({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn('border-hairline border-b', className)} {...props} />;
}

/**
 * The trigger IS the heading, so it goes INSIDE an `<h3>`: Radix wraps the
 * button in `AccordionPrimitive.Header`, which renders whichever element you ask
 * of it. Without that, a screen reader sees a list of loose buttons and loses
 * the page structure, which is precisely what a FAQ needs to keep.
 *
 * `headingLevel` exists because the correct level depends on where it is
 * mounted: on a FAQ page the block hangs off a section `<h2>`, and in a syllabus
 * it may hang off an `<h3>`. Pinning it here would be guessing.
 */
export type AccordionTriggerProps = ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
> & {
  /** The level of the heading wrapping the trigger. */
  headingLevel?: 2 | 3 | 4;
};

export function AccordionTrigger({
  className,
  children,
  headingLevel = 3,
  ...props
}: AccordionTriggerProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <AccordionPrimitive.Header asChild>
      <Heading>
        <AccordionPrimitive.Trigger
          className={cn(
            'gap-step-sm py-step-sm flex w-full cursor-pointer items-center justify-between text-left',
            'font-sans text-lead font-medium text-text-primary',
            'transition-standard',
            'hover:text-accent',
            'focus-ring',
            'disabled:pointer-events-none disabled:opacity-50',
            '[&[data-state=open]>svg]:rotate-180',
            className,
          )}
          {...props}
        >
          {children}
          <ChevronDown className="text-text-muted shrink-0" />
        </AccordionPrimitive.Trigger>
      </Heading>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className={cn(
        'overflow-hidden',
        'motion-safe:data-[state=open]:expand motion-safe:data-[state=closed]:collapse',
      )}
      {...props}
    >
      <div className={cn('pb-step-md font-sans text-ui text-text-secondary max-w-measure', className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}
