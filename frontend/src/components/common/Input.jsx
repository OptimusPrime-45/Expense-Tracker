import React from "react";

const Input = ({
  label,
  error,
  className = "",
  type = "text",
  id,
  ...props
}) => {
  const inputClasses = `mt-1 block w-full rounded-lg border-2 ${
    error
      ? "border-red-500/50 focus:ring-red-500 focus:border-red-500"
      : "border-neon-green/20 focus:ring-neon-aqua/50 focus:border-neon-aqua"
  } bg-dark-700/30 dark:bg-dark-700/50 text-white backdrop-blur-sm shadow-sm px-4 py-2.5 transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:bg-dark-700/50 focus:shadow-neon-aqua`;

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
      <input type={type} id={id} className={inputClasses} {...props} />
      {error && (
        <p className="mt-1.5 text-sm text-red-400 font-medium">{error}</p>
      )}
    </div>
  );
};

export default Input;
