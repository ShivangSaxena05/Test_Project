"use client";

import React from "react";

const Textarea = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  rows = 4,
  className = "",
  disabled = false,
  minLength,
  darkMode = false,
}) => {
  const baseClasses =
    "w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 resize-none";

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
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          minLength={minLength}
          className={`${baseClasses} ${stateClasses} ${disabledClasses} text-white placeholder-gray-400 focus:border-transparent`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
        />
        {error && (
          <p
            id={`${name}-error`}
            className="mt-1 text-sm text-red-400 animate-fade-in"
            role="alert"
          >
            {error}
          </p>
        )}
        {minLength && value && value.length < minLength && (
          <p className="mt-1 text-sm text-gray-500">
            {value.length}/{minLength} characters minimum
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
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        minLength={minLength}
        className={`${baseClasses} ${stateClasses} ${disabledClasses}`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p
          id={`${name}-error`}
          className="mt-1 text-sm text-red-500 animate-fade-in"
          role="alert"
        >
          {error}
        </p>
      )}
      {minLength && value && value.length < minLength && (
        <p className="mt-1 text-sm text-gray-500">
          {value.length}/{minLength} characters minimum
        </p>
      )}
    </div>
  );
};

export default Textarea;

