import { cva } from 'class-variance-authority';

/**
 * The system's FOUR variants, and only those four.
 *
 * Brand rule 2, as code rather than as documentation: in light mode the primary
 * button cannot be biolume or sand, so it switches to solid hull. There is no
 * literal hex anywhere — `brand.hull` is a token, and the hover reuses
 * `textSecondary` instead of inventing a `hullHover`.
 *
 * Brand rule 3: `conversion` appears ONCE per screen. That is documented in the
 * story and not enforced at runtime: two conversion buttons on one page are a
 * design problem, not an error that should take the render down.
 *
 * `secondary` is NEVER filled. It is border and text: at rest, hover hairline
 * and foam; on hover, both move to biolume. A filled secondary is a badly tinted
 * primary, and that is what this file used to do.
 *
 * `tertiary` is the system's CLI aesthetic: mono, `./action →` format, no box.
 * It shows up on every card, so it is not a generic `ghost` under another name —
 * the text format is part of the variant.
 *
 * There ARE two danger variants, and they arrived the way the previous comment
 * said they would: into the document first and in here second. The rule they
 * replace — «the system's error lives in alerts and in field validation, not in
 * a red button» — still holds INSIDE an `AlertDialog`, where a title explains
 * what is about to happen, focus starts on cancel and clicking outside does not
 * close it. The context does the work there and the confirm button is still not
 * red.
 *
 * It stops holding in a table row. `cursos` has eight destructive buttons in row
 * actions and toolbars, next to «Editar» and «Duplicar», with no context to tell
 * them apart: with every one rendered as `secondary`, «Eliminar curso» looked
 * exactly like «Cancelar» and only the word separated them. See
 * `docs/decisions.md` § 21.
 *
 * `destructiveOutline` fills on hover, and that IS an exception to «secondary is
 * never filled» — declared here rather than discovered later. A destructive
 * button that looks identical to a secondary until you read it is the problem
 * this variant exists to fix, and at rest it is still only border and text.
 */
const button = cva(
  [
    'inline-flex cursor-pointer items-center justify-center gap-step-xs whitespace-nowrap select-none',
    'rounded-control font-sans font-medium',
    'transition-standard',
    'focus-ring',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-accent text-accent-on hover:bg-accent-hover',
          'light:bg-brand-hull light:text-accent-on light:hover:bg-text-secondary',
        ],
        // The one control whose focus ring is not biolume. It is the system's
        // only sand fill, and a biolume ring three pixels off a sand button puts
        // both of the brand's accents in the same glance. See `decisions.md` § 37.
        conversion: 'bg-warm text-warm-on hover:bg-warm-hover focus-ring-warm',
        secondary: [
          'border-hairline-hover border bg-transparent text-text-primary',
          'hover:border-accent hover:text-accent',
        ],
        tertiary: [
          'bg-transparent font-mono font-normal text-text-secondary',
          'hover:text-accent hover:underline hover:underline-offset-4',
        ],
        /** Irreversible only. Never for «cancel» on a form. */
        destructive: 'bg-danger text-danger-on hover:bg-danger-hover',
        destructiveOutline: [
          'border-danger text-danger border bg-transparent',
          'hover:bg-danger hover:text-danger-on',
        ],
      },
      size: {
        sm: 'h-8 px-control-sm text-label',
        md: 'h-10 px-control-md text-ui',
        lg: 'h-12 px-control-lg text-lead',
        /** A 42×42 square, no text. `aria-label` is mandatory on it. */
        icon: 'size-control-icon p-0',
        /** 32×32, for a table row. Same height as `sm`, and same mandatory `aria-label`. */
        'icon-sm': 'size-control-icon-sm p-0',
      },
    },
    compoundVariants: [
      /**
       * The tertiary has no box: neither horizontal padding nor control height.
       * It goes here rather than as `px-0` on the variant so it beats the size's
       * `px-*` without depending on the order cva concatenates classes in.
       */
      { variant: 'tertiary', size: ['sm', 'md', 'lg'], class: 'h-auto px-0' },
    ],
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export { button as buttonVariants };
