import React, { memo } from "react";

type CheckboxProps = {
  name: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

const CheckboxComponent = ({
  name,
  label,
  checked,
  onChange,
  className = "",
}: CheckboxProps) => {
  return (
    <label
      className={`flex items-center gap-2 cursor-pointer text-sm text-gray-700 ${className}`}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-blue-500 cursor-pointer"
      />
      {label}
    </label>
  );
};

export default memo(CheckboxComponent);