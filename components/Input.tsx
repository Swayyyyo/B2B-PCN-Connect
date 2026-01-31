
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  helperText, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <input
        className={`
          px-4 py-2.5 rounded-lg border-2 transition-all outline-none text-sm
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-50' 
            : 'border-slate-200 focus:border-brand focus:ring-4 focus:ring-brand/5 hover:border-slate-300'
          }
          bg-white placeholder:text-slate-400
          disabled:bg-slate-50 disabled:cursor-not-allowed
        `}
        {...props}
      />
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};

export default Input;
