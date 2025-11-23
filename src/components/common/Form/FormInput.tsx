import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  icon?: React.ReactNode;
  onIconClick?: () => void;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, required, hint, icon, onIconClick, className = '', ...inputProps }, ref) => {
    const inputClasses = `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
      error 
        ? 'border-red-500 focus:ring-red-500' 
        : 'border-slate-300 focus:ring-blue-500'
    } ${className}`;

    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <input ref={ref} {...inputProps} className={inputClasses} />
          {icon && (
            <button
              type="button"
              onClick={onIconClick}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {icon}
            </button>
          )}
        </div>
        {error && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle size={12} />
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-slate-500 text-xs mt-1">{hint}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';