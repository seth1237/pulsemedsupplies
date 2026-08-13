import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-0 text-sm font-semibold whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#eef3f8] active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-br from-[#ffb91a] to-[#e89f00] text-primary-foreground shadow-[5px_5px_12px_rgb(254_174_3_/_0.35),_-3px_-3px_8px_rgb(255_255_255_/_0.7),inset_0_1px_0_rgb(255_255_255_/_0.35)] hover:from-[#ffc133] hover:to-[#feae03]',
        secondary:
          'bg-gradient-to-br from-[#06b8f7] to-[#0499d4] text-white shadow-[5px_5px_12px_rgb(5_175_237_/_0.35),_-3px_-3px_8px_rgb(255_255_255_/_0.7),inset_0_1px_0_rgb(255_255_255_/_0.25)] hover:from-[#18c0fa] hover:to-[#05afed]',
        outline:
          'bg-[#eef3f8] text-ink shadow-[5px_5px_10px_rgb(163_177_198_/_0.4),_-5px_-5px_10px_rgb(255_255_255_/_0.95)] hover:text-ink hover:shadow-[3px_3px_8px_rgb(163_177_198_/_0.35),_-3px_-3px_8px_rgb(255_255_255_/_0.95)] active:shadow-[inset_4px_4px_8px_rgb(163_177_198_/_0.45),inset_-4px_-4px_8px_rgb(255_255_255_/_0.9)]',
        ghost:
          'bg-transparent text-foreground shadow-none hover:bg-[#eef3f8] hover:shadow-[inset_3px_3px_6px_rgb(163_177_198_/_0.25),inset_-3px_-3px_6px_rgb(255_255_255_/_0.8)]',
        dark:
          'bg-[#0b1220] text-white shadow-[5px_5px_12px_rgb(11_18_32_/_0.35),_-3px_-3px_8px_rgb(255_255_255_/_0.55)] hover:bg-[#152033]',
        destructive:
          'bg-[#eef3f8] text-destructive shadow-[5px_5px_10px_rgb(163_177_198_/_0.35),_-5px_-5px_10px_rgb(255_255_255_/_0.9)] hover:text-destructive',
        link: 'rounded-none px-0 text-secondary underline-offset-4 shadow-none hover:underline',
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 rounded-lg px-3.5 text-xs',
        lg: 'h-12 px-7 text-base',
        xl: 'h-14 px-8 text-base',
        icon: 'size-11',
        'icon-sm': 'size-9 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
