import React from 'react';
import { AlertCircle, Plus } from 'lucide-react';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  required?: boolean;
  options: Array<{ value: string | number; label: string }>;
  onAddNew?: () => void;
  addNewLabel?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  error,
  required,
  options,
  onAddNew,
  addNewLabel = 'Novo',
  className = '',
  ...selectProps
}) => {
  const selectClasses = `flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
    error 
      ? 'border-red-500 focus:ring-red-500' 
      : 'border-slate-300 focus:ring-blue-500'
  } ${className}`;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-2">
        <select {...selectProps} className={selectClasses}>
          <option value="">Selecione...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {onAddNew && (
          <button
            type="button"
            onClick={onAddNew}
            className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex-shrink-0"
            title={addNewLabel}
          >
            <Plus size={20} />
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
};