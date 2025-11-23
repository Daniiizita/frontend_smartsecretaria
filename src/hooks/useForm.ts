import { useState } from 'react';

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  validate?: (values: T) => Record<string, string>;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo
    if (errors[name as string]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar
    if (validate) {
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }
    
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (error: any) {
      if (error.response?.data) {
        const apiErrors: Record<string, string> = {};
        Object.keys(error.response.data).forEach(key => {
          apiErrors[key] = Array.isArray(error.response.data[key])
            ? error.response.data[key][0]
            : error.response.data[key];
        });
        setErrors(apiErrors);
      } else {
        setErrors({ general: 'Erro ao salvar. Tente novamente.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    loading,
    handleChange,
    handleSubmit,
  };
};