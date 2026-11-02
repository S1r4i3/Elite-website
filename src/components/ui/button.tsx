import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "btn-primary-anim bg-brand-600 text-white shadow-[0_1px_2px_rgb(200_16_46/0.3),0_6px_16px_rgb(200_16_46/0.22)] hover:bg-brand-700",
        dark: "bg-navy-900 text-white hover:bg-navy-800",
        secondary: "border border-line-strong bg-white text-navy-900 hover:border-navy-900/30 hover:bg-canvas",
        ghost: "text-navy-900 hover:bg-canvas",
        outlineLight: "border border-white/25 bg-white/5 text-white hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10",
        white: "bg-white text-navy-900 hover:-translate-y-0.5 hover:bg-brand-50 hover:shadow-lg",
        link: "px-0 text-brand-600 hover:text-brand-700 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-13 px-6 text-[15px] sm:text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Pending state: disables the button (no double submits), shows a spinner and optional `loadingText`. */
  loading?: boolean;
  loadingText?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, loading = false, loadingText, disabled, children, ...props }, ref) => {
  if (asChild) return <Slot className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props}>{children}</Slot>;
  return (
    <button className={cn(buttonVariants({ variant, size }), loading && "cursor-progress", className)} ref={ref} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading ? (
        <>
          <Loader2 className="animate-spin" aria-hidden /> {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </button>
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
