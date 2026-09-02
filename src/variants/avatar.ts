import { cva } from 'class-variance-authority';

const avatar = cva(
  'relative flex shrink-0 overflow-hidden rounded-pill bg-surface-raised border border-hairline',
  {
    variants: {
      size: {
        sm: 'size-8',
        md: 'size-10',
        lg: 'size-14',
        xl: 'size-24',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export { avatar as avatarVariants };
