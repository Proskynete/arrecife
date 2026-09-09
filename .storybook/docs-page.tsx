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
      <Stories />
    </>
  );
}
