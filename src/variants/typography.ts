import { cva } from 'class-variance-authority';

const text = cva('', {
  variants: {
    variant: {
      display: 'text-display font-display',
      // Large metrics: 46px of display. It is the only scale designed for a
      // number, which is why its line height is 1.
      stat: 'text-stat font-display',
      h1: 'text-h1 font-display',
      h2: 'text-h2 font-display',
      h3: 'text-h3 font-display',
      body: 'text-body font-sans',
      // 17px: the deck on interior pages and the large button.
      lead: 'text-lead font-sans',
      ui: 'text-ui font-sans',
      label: 'text-label font-sans',
      // The two badge scales. `tag` is status (sans 12.5/500) and `chip` is
      // category and metric (mono 11.5). Neither transforms the text.
      tag: 'text-tag font-sans',
      chip: 'text-chip font-mono',
      // Mono with NO transform: dates, paths, versions, file names and the
      // footer signature. It is the step that was missing, and the reason every
      // call site ended up writing `variant="eyebrow" className="normal-case"`.
      meta: 'text-meta font-mono',
      // `uppercase` does not fit in a size token: text-transform is not a
      // modifier of --text-*. Which is why the variant sets it, not theme.css.
      eyebrow: 'text-eyebrow font-mono uppercase',
    },
    tone: {
      primary: 'text-text-primary',
      secondary: 'text-text-secondary',
      muted: 'text-text-muted',
      accent: 'text-accent',
      warm: 'text-warm',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-error',
    },
  },
  defaultVariants: { variant: 'body', tone: 'primary' },
});

export { text as textVariants };
