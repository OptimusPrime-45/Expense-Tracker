import React from "react";

const Select = ({ label, error, className = "", id, children, ...props }) => {
  const selectClasses = `mt-1 block w-full rounded-lg border-2 ${
    error
      ? "border-red-500/50 focus:ring-red-500 focus:border-red-500"
      : "border-neon-green/20 focus:ring-neon-aqua/50 focus:border-neon-aqua"
  } bg-dark-700/30 dark:bg-dark-700/50 text-white backdrop-blur-sm shadow-sm px-4 py-2.5 transition-all duration-300 focus:bg-dark-700/50 focus:shadow-neon-aqua`;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-white mb-1"
        >
          {label}
        </label>
      )}
      <select id={id} className={selectClasses} {...props}>
        {children}
      </select>
      {error && (
        <p className="mt-1.5 text-sm text-red-400 font-medium">{error}</p>
      )}
    </div>
  );
};

export default Select;
