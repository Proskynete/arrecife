import { useOf } from '@storybook/addon-docs/blocks';

/**
 * «Using it with an agent», printed on EVERY component's documentation page.
 *
 * WHY IT IS A BLOCK AND NOT FIFTY STORIES. The obvious way to put this on every
 * component is to write it into every `*.stories.tsx`, and that is fifty copies
 * of one paragraph that drift the first time the import path changes — which is
 * the exact failure this whole library exists to stop. It is generated instead,
 * from the two facts the docs page already knows: the story's `title`, which
 * says which subpath the component is published at, and its `component`, which
 * says what the import is called.
 *
 * WHAT IT ACTUALLY SAYS is one instruction and it is deliberately not a tutorial:
 * read `llms.txt` first. That file is generated from the TypeScript compiler on
 * every build, so it cannot describe a prop that does not exist, and it travels
 * inside the tarball — an agent working in a consuming project already has it on
 * disk, at a path this block prints. A prompt that pastes the API into the chat
 * instead is a copy, and a copy goes stale.
 *
 * THE PROMPT IS IN ENGLISH like the rest of the documentation. It is not
 * user-facing copy: nobody reading a consuming site ever sees it. See
 * «The language of the code» in AGENTS.md.
 */

/** Which subpath a story's category is published at. The root is the default. */
const SUBPATH: Record<string, string> = {
  Icons: '/icons',
  Forms: '/form',
  Charts: '/chart',
  Brand: '/brand',
  Tokens: '/tokens',
};

type MetaLike = {
  title?: string;
  component?: { displayName?: string; name?: string };
};

/**
 * Reads the story file's own `meta`.
 *
 * `useOf('meta')` is the documented way in and it throws when a docs page has no
 * meta attached — which cannot happen for an autodocs page, but this block is
 * also mounted by the custom page below, so the guard is cheap and the
 * alternative is a blank documentation page.
 */
function useMeta(): MetaLike | null {
  try {
    const resolved = useOf('meta', ['meta']);
    return (resolved.csfFile.meta ?? null) as MetaLike | null;
  } catch {
    return null;
  }
}

export function AgentUsage() {
  const meta = useMeta();
  const title = meta?.title ?? '';
  const [category = ''] = title.split('/');
  const name = meta?.component?.displayName ?? meta?.component?.name ?? '';

  // No component on the meta means a page about the system rather than about a
  // piece of it — the token sheet, the brand assets, the recipes. There is
  // nothing to write an import for, so nothing is printed.
  if (!name) return null;

  const pkg = '@eduardoalvarez/arrecife';
  const entry = `${pkg}${SUBPATH[category] ?? ''}`;

  const prompt = [
    `Read node_modules/${pkg}/llms.txt first.`,
    '',
    `Then use ${name} from ${entry} for <what you are building>.`,
    '',
    'Rules that are not negotiable:',
    `- import { ${name} } from '${entry}' — never copy the component into the repo.`,
    '- Take every colour, size and space from a token utility (bg-surface-raised,',
    '  text-h1, p-step-md). No hex values and no arbitrary values.',
    '- Pass what the props allow. className is for position in the page, not for',
    '  restyling the component.',
    '- An icon comes from @phosphor-icons/react drawn through Icon from',
    "  '@eduardoalvarez/arrecife/icons'. Never an emoji.",
  ].join('\n');

  return (
    <section>
      <h2>Using it with an agent</h2>

      <p>
        The package ships its own manifest at <code>{pkg}/llms.txt</code>.
        It is generated from the TypeScript compiler on every build, so it lists this
        component&rsquo;s real props and cannot describe one that does not exist. Point the
        agent at that file rather than pasting an API into the conversation: a pasted
        API is a copy, and a copy goes stale.
      </p>

      <pre>
        <code>{prompt}</code>
      </pre>

      <p>
        The three rules at the bottom are the ones an agent gets wrong on its own, in
        that order: it reaches for a hex before it reaches for a token, it restyles
        through <code>className</code> instead of asking whether the variant exists, and
        it reproduces the component in the project rather than importing it. The rest of
        what it needs to know is in <code>llms.txt</code>.
      </p>
    </section>
  );
}
