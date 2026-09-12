import {
  Controls,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
} from '@storybook/addon-docs/blocks';

import { AgentUsage } from './agent-usage.tsx';

/**
 * The documentation page every component publishes, and the only reason it is
 * written out by hand is the one block at the end.
 *
 * Storybook's default page is `Title · Subtitle · Description · Primary ·
 * Controls · Stories`, and this is that page with `AgentUsage` spliced between
 * the props table and the stories. There is no supported way to APPEND to the
 * default page — `parameters.docs.page` replaces it — so the five default blocks
 * are re-listed here. If Storybook adds a sixth, it does not appear until this
 * file is updated, and that is the cost of the block.
 *
 * `includePrimary={false}` IS THE WHOLE OF WHY EVERY PAGE SHOWED A STORY TWICE.
 * `Primary` renders the first story, and `Stories` renders all of them unless
 * told otherwise — its default is to include the first, so `Basic` appeared at
 * the top with its controls and again at the head of the list. Every component
 * page in the library had it, and `Code` had it worst: with one story, the page
 * was that story, a props table, and that story again.
 *
 * The flag fixes both at once, because `Stories` renders nothing when the list
 * it is left with is empty. Storybook's own page reaches the single-story case
 * differently — it counts the stories and drops the block — and that is the
 * cost this comment warned about in the paragraph above, arriving: the default
 * grew a guard and a hand-written copy of it cannot grow one by itself. Between
 * the two, the flag is the one that says why rather than when.
 *
 * WHY AFTER `Controls` AND NOT AT THE TOP. The agent section is a footnote for
 * whoever is wiring the component into a project, and it repeats on all fifty
 * pages. Above the props table it would be the first thing a human reads on
 * every component in the library, which is fifty copies of the same paragraph
 * standing between the reader and what they came for.
 *
 * It is set globally in `preview.tsx`, so a story file gets it without asking
 * and can still opt out with `parameters: { docs: { page: null } }`.
 */
export function DocsPage() {
  return (
    <>
      <Title />
      <Subtitle />
      <Description />
      <Primary />
      <Controls />
      <AgentUsage />
      <Stories includePrimary={false} />
    </>
  );
}
