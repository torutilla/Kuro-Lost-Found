import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@shared/index.ts";
import LoadingComponent from "./LoadingComponent.tsx";

const buttonVariants = cva(
  `min-h-9 rounded-xl p-2 px-4 w-auto shrink-0
  flex items-center justify-center gap-2 text-sm font-medium
  cursor-pointer select-none
  transition-[transform,box-shadow,background-color,filter,color] duration-200 ease-out
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1
  disabled:cursor-not-allowed disabled:opacity-85 disabled:saturate-50`,
  {
    variants: {
      variant: {
        solid:
          "text-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0",
        outline:
          "bg-transparent border hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0",
        icon: "bg-transparent hover:brightness-90 hover:scale-105 active:scale-95",
      },
      color: {
        primary: "",
        secondary: "",
        black: "",
        grayscale: "",
      },
    },
    compoundVariants: [
      {
        variant: "solid",
        color: "primary",
        className: "bg-primary hover:shadow-primary/30",
      },
      {
        variant: "solid",
        color: "secondary",
        className: "bg-secondary hover:shadow-secondary/30",
      },
      {
        variant: "solid",
        color: "black",
        className: "bg-black hover:shadow-black/30",
      },
      {
        variant: "solid",
        color: "grayscale",
        className: "bg-neutral-300 text-black hover:shadow-black/10",
      },
      { variant: "icon", color: "primary", className: "text-primary" },
      { variant: "icon", color: "secondary", className: "text-secondary" },
      { variant: "icon", color: "black", className: "text-black" },

      {
        variant: "outline",
        color: "primary",
        className: " border-primary text-primary hover:bg-primary/5",
      },
      {
        variant: "outline",
        color: "secondary",
        className: " border-secondary text-secondary hover:bg-secondary/5",
      },
      {
        variant: "outline",
        color: "black",
        className: "border-black text-black hover:bg-neutral-400/20",
      },
      {
        variant: "outline",
        color: "grayscale",
        className: "border-neutral-300 text-black hover:bg-neutral-300/20",
      },
    ],
    defaultVariants: {
      variant: "solid",
      color: "primary",
    },
  },
);
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

function Button({
  className,
  type = "button",
  variant = "solid",
  color = "primary",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      {...props}
      className={cn(buttonVariants({ color, variant }), className)}
    >
      {disabled ? <LoadingComponent /> : children}
    </button>
  );
}

export default Button;
