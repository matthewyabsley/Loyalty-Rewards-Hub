import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl bg-card border border-border-light shadow-sm",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const GlassCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl glass border border-white/20 shadow-lg",
        className
      )}
      {...props}
    />
  )
);
GlassCard.displayName = "GlassCard";

const DarkCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-[22px] overflow-hidden",
        className
      )}
      style={{ background: "linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)" }}
      {...props}
    />
  )
);
DarkCard.displayName = "DarkCard";

export { Card, GlassCard, DarkCard };
