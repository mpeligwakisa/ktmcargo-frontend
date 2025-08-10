import * as React from "react"
import { cn } from "../../lib/utils"

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-row space-y-1.5 p-4 ${className}`}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className,children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(`text-2xl font-semibold leading-none tracking-tight`,
       className)}
    {...props}
  >
    {children}
    </h3> 
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={`p-6 pt-0 ${className}`}
    {...props}>
      {children}
    </div>
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  >
    {children}
  </div>
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardContent }


// import React from "react";

// export const Card = ({ title, value, subtitle, icon, className = "" }) => {
//   return (
//     <div className={`bg-white rounded-lg shadow-md p-6 max-w-sm transition-transform transform hover:scale-105 ${className}`}>
//       <div className="flex justify-between items-start">
//         <div>
//           <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
//           <p className="text-2xl font-bold mt-1 text-gray-900">{value}</p>
//           {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
//         </div>
//         {icon && (
//           <div className="p-3 bg-blue-100 rounded-lg flex items-center justify-center">
//             {icon}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
