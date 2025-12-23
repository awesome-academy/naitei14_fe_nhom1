import React from "react";

export const Select = ({ children, value, onValueChange }: any) => {
    const handleChange = (e: any) => {
        if (onValueChange) {
            onValueChange(e.target.value);
        }
    };
    return (
        <div data-testid="select-wrapper">
            <select value={value} onChange={handleChange} data-value={value}>
                {children}
            </select>
        </div>
    );
};

export const SelectTrigger = ({ children }: any) => (
    <div role="combobox" data-testid="select-trigger">
        {children}
    </div>
);

export const SelectValue = ({ placeholder }: any) => (
    <span data-testid="select-value">{placeholder}</span>
);

export const SelectContent = ({ children }: any) => (
    <div data-testid="select-content">{children}</div>
);

export const SelectItem = ({ value, children }: any) => (
    <option value={value}>{children}</option>
);
