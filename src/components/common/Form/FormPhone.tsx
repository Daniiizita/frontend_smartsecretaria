import React, { useState, useEffect } from 'react';
import { FormInput } from './FormInput';
import { maskPhone, unmaskPhone } from '../../../utils/maskUtils';

interface FormPhoneProps {
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const FormPhone: React.FC<FormPhoneProps> = ({
  label,
  required,
  value,
  onChange,
  error,
}) => {
  const [displayValue, setDisplayValue] = useState(maskPhone(value));

  useEffect(() => {
    setDisplayValue(maskPhone(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskPhone(e.target.value);
    setDisplayValue(masked);
    onChange(unmaskPhone(masked));
  };

  return (
    <FormInput
      label={label}
      required={required}
      value={displayValue}
      onChange={handleChange}
      error={error}
      placeholder="(00) 00000-0000"
      maxLength={15}
      autoComplete="tel"
    />
  );
};