import * as React from "react";
import { AlertTriangle, Info, X } from "lucide-react";

const getVariantClasses = (variant = "default") => {
  const baseClasses = "relative w-full rounded-lg border p-4";
  
  const variantClasses = {
    default: "bg-white text-gray-900 border-gray-200",
    destructive: "border-red-500/50 text-red-600 dark:border-red-500",
    warning: "border-yellow-500/50 text-yellow-600 dark:border-yellow-500",
    success: "border-green-500/50 text-green-600 dark:border-green-500"
  };

  return `${baseClasses} ${variantClasses[variant] || variantClasses.default}`;
};

const Alert = React.forwardRef(
  ({ className = "", variant = "default", icon, onClose, children, ...props }, ref) => {
    const Icon = icon || {
      default: Info,
      destructive: AlertTriangle,
      warning: AlertTriangle,
      success: Info,
    }[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={`${getVariantClasses(variant)} ${className}`}
        {...props}
      >
        <Icon className="absolute left-4 top-4 h-4 w-4" />
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="pl-7">{children}</div>
      </div>
    );
  }
);

Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className = "", ...props }, ref) => (
  <h5 ref={ref}
  className={`mb-1 font-medium leading-none tracking-tight ${className}`}
  {...props}>
    {}
  </h5>
));

AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm leading-relaxed ${className}`}
    {...props}
  />
));

AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };