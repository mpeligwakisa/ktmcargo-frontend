import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
          "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === "destructive",
          "border border-input hover:bg-accent hover:text-accent-foreground": variant === "outline",
          "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
          "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
          "h-10 px-4 py-2": size === "default",
          "h-9 rounded-md px-3": size === "sm",
          "h-11 rounded-md px-8": size === "lg",
        },
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
// import React from "react";

// const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
//   const variants = {
//     default: "bg-blue-500 text-white hover:bg-blue-600",
//     secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
//     destructive: "bg-red-500 text-white hover:bg-red-600",
//     outline: "border border-gray-200 hover:bg-gray-100",
//     ghost: "hover:bg-gray-100",
//     link: "text-blue-500 underline-offset-4 hover:underline"
//   };

//   const sizes = {
//     default: "h-10 px-4 py-2",
//     sm: "h-9 px-3",
//     lg: "h-11 px-8",
//     icon: "h-10 w-10"
//   };

//   return (
//     <button
//       ref={ref}
//       className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
//       {...props}
//     />
//   );
// });
// Button.displayName = "Button";

// export { Button };