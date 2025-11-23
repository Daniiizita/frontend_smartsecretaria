/**
 * Aplica máscara de CPF (000.000.000-00)
 */
export const maskCPF = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  } else if (numbers.length <= 9) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  } else {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  }
};

/**
 * Remove máscara do CPF
 */
export const unmaskCPF = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Valida CPF
 */
export const isValidCPF = (value: string): boolean => {
  const cpf = value.replace(/\D/g, '');
  
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) return false;
  
  // Validação dos dígitos verificadores
  let sum = 0;
  let remainder;
  
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10))) return false;
  
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11))) return false;
  
  return true;
};

/**
 * Aplica máscara de RG (0.000.000) - Formato brasileiro padrão
 */
export const maskRG = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 0) {
    return '';
  } else if (numbers.length <= 1) {
    return numbers;
  } else if (numbers.length <= 4) {
    return `${numbers.slice(0, 1)}.${numbers.slice(1)}`;
  } else {
    return `${numbers.slice(0, 1)}.${numbers.slice(1, 4)}.${numbers.slice(4, 7)}`;
  }
};

/**
 * Remove máscara do RG
 */
export const unmaskRG = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Valida RG (deve ter exatamente 7 dígitos)
 */
export const isValidRG = (value: string): boolean => {
  const rg = value.replace(/\D/g, '');
  return rg.length === 7;
};

/**
 * Aplica máscara de telefone (00) 00000-0000
 */
export const maskPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 0) {
    return '';
  } else if (numbers.length <= 2) {
    return `(${numbers}`;
  } else if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else if (numbers.length <= 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
};

/**
 * Remove máscara do telefone
 */
export const unmaskPhone = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Formata telefone com código do país (+55)
 */
export const formatPhoneWithCountryCode = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.startsWith('55') && numbers.length > 2) {
    const localNumber = numbers.slice(2);
    return `+55 ${maskPhone(localNumber)}`;
  }
  
  return maskPhone(numbers);
};

/**
 * Aplica máscara de CEP (00000-000)
 */
export const maskCEP = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 5) {
    return numbers;
  } else {
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  }
};

/**
 * Remove máscara do CEP
 */
export const unmaskCEP = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Aplica máscara de data (DD/MM/AAAA)
 */
export const maskDate = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  } else {
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
  }
};

/**
 * Remove máscara da data
 */
export const unmaskDate = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Aplica máscara de moeda brasileira (R$ 0.000,00)
 */
export const maskMoney = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/\D/g, '')) / 100 : value;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numValue);
};

/**
 * Remove máscara de moeda
 */
export const unmaskMoney = (value: string): number => {
  const numbers = value.replace(/\D/g, '');
  return parseFloat(numbers) / 100;
};