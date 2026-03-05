import * as React from "react";
import type { LucideIcon } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass" | "outline";
  icon?: LucideIcon;
}

// The "Button" name here must match the { Button } in your imports
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", icon: Icon, children, ...props }, ref) => {
    // Core logic for premium SaaS look
    const baseStyles =
      "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      primary:
        "bg-sky-400 text-sky-950 hover:bg-sky-300 shadow-[0_0_20px_rgba(65,164,245,0.2)]", // ACCENT for primary buttons
      secondary:
        "bg-zinc-900 text-white border border-white/10 hover:bg-zinc-800",
      glass:
        "bg-sky-950/20 text-white border border-sky-400/10 hover:bg-sky-900/30 backdrop-blur-xl", // GLASS token
      outline:
        "bg-transparent border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-400",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {/* If an icon is passed, it renders here automatically */}
        {Icon && <Icon className="w-4 h-4" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
