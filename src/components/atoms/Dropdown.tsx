import React from 'react';

export type DropdownOption = {
  label: string;
  value: string;
};

export interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange, disabled = false, className }) => {
  return (
    <select
      className={`border rounded px-2 py-1 bg-white text-gray-800 focus:outline-none focus:ring ${className || ''}`}
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
