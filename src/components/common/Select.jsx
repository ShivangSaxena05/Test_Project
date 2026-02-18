"use client";

import React from "react";

const Select = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  options,
  placeholder = "Select an option",
  required = false,
  className = "",
  disabled = false,
  darkMode = false,
}) => {
  const baseClasses =
    "w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 appearance-none bg-no-repeat";

  // Dark mode classes
  if (darkMode) {
    const stateClasses = error
      ? "border-red-500 focus:ring-red-500/20 focus:border-red-500 bg-gray-700/50"
      : "border-gray-600 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-700/50";

    const disabledClasses = disabled
      ? "bg-gray-700/30 cursor-not-allowed opacity-60"
      : "hover:border-gray-500";

    return (
      <div className={`mb-5 ${className}`}>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        <div className="relative">
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={`${baseClasses} ${stateClasses} ${disabledClasses} pr-10 text-white focus:border-transparent`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "1.5em 1.5em",
            }}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${name}-error` : undefined}
          >
            <option value="" disabled className="bg-gray-700">
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-700">
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <p
            id={`${name}-error`}
            className="mt-1 text-sm text-red-400 animate-fade-in"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }

  // Light mode classes (default)
  const stateClasses = error
    ? "border-red-400 focus:ring-red-200 focus:border-red-400"
    : "border-gray-300 focus:ring-blue-200 focus:border-blue-500";

  const disabledClasses = disabled
    ? "bg-gray-100 cursor-not-allowed opacity-60"
    : "bg-white hover:border-gray-400";

  return (
    <div className={`mb-4 ${className}`}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={`${baseClasses} ${stateClasses} ${disabledClasses} pr-10`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: "right 0.75rem center",
            backgroundSize: "1.5em 1.5em",
          }}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p
          id={`${name}-error`}
          className="mt-1 text-sm text-red-500 animate-fade-in"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;

