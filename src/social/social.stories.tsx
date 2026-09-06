import type { Meta, StoryObj } from '@storybook/react-vite';

import { Block, Note, Row } from '../../stories/utils.tsx';
import { Text } from '../primitives/typography.tsx';
import { socialGlyphs, socialNames, socialSvg } from './data.ts';
import * as icons from './index.tsx';

/**
 * The catalogue, drawn twice from one description.
 *
 * The stories are what make the two renderings comparable: the React column and
 * the string column are painted side by side from the same `data.ts`, so a shape
 * that only reaches one of them is visible rather than theoretical.
 *
 * It titles under `Icons/` and not under a `Social/` of its own. These are the
 * library's ten icons and `Icons/Icon` is the eleventh rule — how a project's
 * own icons get DRAWN — so a reader looking for «what does this library know
 * about icons» finds both in one place. The repo already describes them that
 * way: the map calls `src/social/` «the social icons» and the generated
 * inventory titles the section «Social icons». Storybook orders the top level
 * alphabetically, so a `Social/` section lands ten entries away from `Icons/`
 * for no reason a reader can see.
 *
 * The SOURCE does not move with the title. `src/social/` is its own published
 * subpath because a namespace object cannot cross the RSC boundary and `./icons`
 * asks for an optional peer dependency these ten must never need. See
 * `docs/decisions/0.7.md` § 26 and § 29.
 */
const meta = { title: 'Icons/Social' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

/** Footer size: 19px in plankton, hovering to biolume. */
const SIZE = 'text-[19px] text-text-muted';

export const Catalogue: Story = {
  render: () => (
    <Block title="Los diez glifos">
      <div className="gap-step-md grid grid-cols-2 sm:grid-cols-5">
        {socialNames.map((name) => {
          const Icon = icons[name];
          return (
            <div key={name} className="gap-step-xs flex flex-col items-center">
              <span className={SIZE}>
                <Icon />
              </span>
              <Text as="span" variant="chip" tone="muted" className="font-mono">
                {name}
              </Text>
              <Text as="span" variant="chip" tone="muted">
                {socialGlyphs[name].kind}
              </Text>
            </div>
          );
        })}
      </div>
      <Note>
        Six brands go solid and four are drawn with a 1.6 stroke. A row that mixes the two pens is
        the normal case: the owner's silhouette cannot be outlined and a symbol the system draws
        itself has no owner to be faithful to.
      </Note>
    </Block>
  ),
};

/**
 * The tenth. It is the one that stops a footer from borrowing a globe from another
 * icon set, so what matters is that it sits in a row of brand marks without
 * looking like a visitor.
 */
export const Website: Story = {
  render: () => (
    <Block title="Website, entre marcas">
      <Row>
        <span className={SIZE}>
          <icons.GitHub />
        </span>
        <span className={SIZE}>
          <icons.LinkedIn />
        </span>
        <span className={SIZE}>
          <icons.Website />
        </span>
        <span className={SIZE}>
          <icons.YouTube />
        </span>
        <span className={SIZE}>
          <icons.Email />
        </span>
      </Row>
      <Note>
        The footer of `cursos`, at its real size. `Website` and `Email` are the two strokes in the
        row; they carry the same 1.6 and the same 2.75 of margin, which is what Phosphor&rsquo;s
        globe did not.
      </Note>
    </Block>
  ),
};

/**
 * The proof that the string renderer and the React renderer are one drawing.
 *
 * `dangerouslySetInnerHTML` is what an `.astro` does with `set:html`, and it is
 * confined to this story: the library never injects markup at runtime. What is
 * being tested is that the two columns are indistinguishable.
 */
export const AsMarkup: Story = {
  render: () => (
    <Block title="React y cadena, lado a lado">
      <div className="gap-step-md grid grid-cols-[auto_auto_auto] items-center">
        {(['GitHub', 'Rss', 'Email', 'Website'] as const).map((name) => {
          const Icon = icons[name];
          return (
            <div key={name} className="contents">
              <Text as="span" variant="chip" tone="muted" className="font-mono">
                {name}
              </Text>
              <span className={SIZE}>
                <Icon />
              </span>
              {/*
                What an `.astro` does with `set:html`, and it stays inside this
                story: the library never injects markup at runtime. The input is
                a template literal built from this repo's own data, not from
                anything a user typed.
              */}
              <span className={SIZE} dangerouslySetInnerHTML={{ __html: socialSvg(name) }} />
            </div>
          );
        })}
      </div>
      <Note>
        The middle column is the React component and the right one is `socialSvg`, the string an
        Astro template drops in with `set:html`. They come from the same shapes, so any difference
        between the columns is a bug in one of the two renderers.
      </Note>
    </Block>
  ),
};
