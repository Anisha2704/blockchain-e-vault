import React from 'react';

const Input = ({
  label,
  id,
  type = 'text',
  error,
  icon: Icon,
  className = '',
  placeholder,
  ...props
}) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`block w-full rounded-lg bg-white border ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-cyan-600 focus:ring-cyan-600/20'
          } ${
            Icon ? 'pl-10' : 'pl-3.5'
          } pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors duration-200 ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
    </div>
  );
};

export default Input;
