import { useState } from 'react';
import { isAxiosError } from 'axios';

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  validate?: (values: T) => Record<string, string>;
}

export const useForm = <T extends object>({
  initialValues,
  onSubmit,
  validate,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = <K extends keyof T>(name: K, value: T[K]) => {
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
    } catch (error: unknown) {
      const data: unknown = isAxiosError(error) ? error.response?.data : undefined;
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        // Erros de validação da API: { campo: ["mensagem"] } ou { detail: "mensagem" }.
        const apiErrors: Record<string, string> = {};
        Object.entries(data as Record<string, unknown>).forEach(([key, valor]) => {
          apiErrors[key === 'detail' ? 'general' : key] = String(Array.isArray(valor) ? valor[0] : valor);
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