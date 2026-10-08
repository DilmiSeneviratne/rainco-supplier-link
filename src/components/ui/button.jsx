import * as React from "react";
import MuiButton from "@mui/material/Button";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
    variants: {
        variant: {
            module: "module-button",
            navigation: "navigation-button",
            tab: "tab-button",
            default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
            outline: "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline",
        },
        size: {
            default: "h-9 px-4 py-2",
            sm: "h-8 rounded-md px-3 text-xs",
            lg: "h-10 rounded-md px-8",
            icon: "h-9 w-9 min-w-9 p-0",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});
const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    if (asChild || variant === "module" || variant === "navigation" || variant === "tab") {
        const Comp = asChild ? Slot : "button";
        return (<Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
          {children}
        </Comp>);
    }
    const muiVariant = variant === "outline"
        ? "outlined"
        : variant === "ghost" || variant === "link"
            ? "text"
            : "contained";
    const muiColor = variant === "destructive"
        ? "error"
        : variant === "secondary"
            ? "secondary"
            : variant === "ghost"
                ? "inherit"
                : "primary";
    const muiSize = size === "sm" || size === "icon" ? "small" : size === "lg" ? "large" : "medium";
    return (<MuiButton ref={ref} variant={muiVariant} color={muiColor} size={muiSize} disableElevation={variant === "secondary" || variant === "ghost" || variant === "link"} className={cn("gap-1.5 [&_svg]:size-4 [&_svg]:shrink-0", size === "icon" && "!min-w-8 !w-8 !h-8 !p-0", size === "sm" && "!text-xs !py-1 !px-3 !min-h-8", size === "default" && "!text-xs !py-1.5 !px-3.5 !min-h-9", variant === "secondary" &&
            "!bg-secondary !text-secondary-foreground hover:!bg-secondary/80", className)} sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "6px",
            letterSpacing: "0.01em",
        }} {...props}>
        {children}
      </MuiButton>);
});
Button.displayName = "Button";
export { Button, buttonVariants };
