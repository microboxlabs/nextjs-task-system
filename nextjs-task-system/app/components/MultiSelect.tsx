import React, { useState, useRef, useEffect } from "react";

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: Option[];
  onChange: (selectedOptions: Option[]) => void;
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (option: Option) => {
    if (selected.some((o) => o.value === option.value)) {
      onChange(selected.filter((o) => o.value !== option.value));
    } else {
      onChange([...selected, option]);
    }
  };

  const isSelected = (option: Option) =>
    selected.some((o) => o.value === option.value);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full max-w-sm" ref={dropdownRef}>
      {/* Input Field */}
      <div
        className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-white p-2 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        onClick={toggleDropdown}
      >
        <div className="flex flex-wrap gap-2">
          {selected.length > 0 ? (
            selected.map((option) => (
              <span
                key={option.value}
                className="rounded-lg bg-blue-100 px-2 py-1 text-sm text-blue-600"
              >
                {option.label}
              </span>
            ))
          ) : (
            <span className="text-gray-400  dark:text-gray-400">
              {placeholder || "Select options..."}
            </span>
          )}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transform text-gray-500 ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414 6.707 9.707a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              className={`flex cursor-pointer items-center px-4 py-2  hover:bg-blue-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-500 ${
                isSelected(option)
                  ? "bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-600"
                  : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              <input
                type="checkbox"
                checked={isSelected(option)}
                readOnly
                className="form-checkbox mr-2 rounded text-blue-600"
              />
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
