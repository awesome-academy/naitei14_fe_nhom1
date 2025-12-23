import React from "react";

export const Button = React.forwardRef<HTMLButtonElement, any>(
    ({ children, onClick, variant, size, ...props }, ref) => (
        <button ref={ref} onClick={onClick} data-variant={variant} data-size={size} {...props}>
            {children}
        </button>
    )
);

Button.displayName = "Button";
