/**
 * Converte data do formato ISO (YYYY-MM-DD) para formato brasileiro (DD/MM/YYYY)
 */
export const formatDateToBR = (isoDate: string): string => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

/**
 * Converte data do formato brasileiro (DD/MM/YYYY) para formato ISO (YYYY-MM-DD)
 */
export const formatDateToISO = (brDate: string): string => {
  if (!brDate) return '';
  
  // Remove caracteres não numéricos
  const cleanDate = brDate.replace(/\D/g, '');
  
  if (cleanDate.length !== 8) return '';
  
  const day = cleanDate.substring(0, 2);
  const month = cleanDate.substring(2, 4);
  const year = cleanDate.substring(4, 8);
  
  return `${year}-${month}-${day}`;
};

/**
 * Formata a data enquanto o usuário digita (aplica máscara DD/MM/YYYY)
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
 * Valida se a data está no formato correto e é válida
 */
export const isValidDate = (brDate: string): boolean => {
  const cleanDate = brDate.replace(/\D/g, '');
  
  if (cleanDate.length !== 8) return false;
  
  const day = parseInt(cleanDate.substring(0, 2));
  const month = parseInt(cleanDate.substring(2, 4));
  const year = parseInt(cleanDate.substring(4, 8));
  
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > 2100) return false;
  
  // Verifica se a data é válida
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && 
         date.getMonth() === month - 1 && 
         date.getDate() === day;
};

/**
 * Formata data para exibição legível (1 de Janeiro de 2024)
 */
export const formatDateToReadable = (isoDate: string): string => {
  if (!isoDate) return '';
  
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

/**
 * Formata data e hora para exibição (01/01/2024 às 14:30)
 */
export const formatDateTimeToReadable = (isoDateTime: string): string => {
  if (!isoDateTime) return '';
  
  const date = new Date(isoDateTime);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/**
 * Calcula idade a partir da data de nascimento
 */
export const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Verifica se uma data é maior de idade
 */
export const isAdult = (birthDate: string): boolean => {
  return calculateAge(birthDate) >= 18;
};

/**
 * Retorna o dia da semana de uma data
 */
export const getDayOfWeek = (isoDate: string): string => {
  const date = new Date(isoDate);
  const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  return days[date.getDay()];
};