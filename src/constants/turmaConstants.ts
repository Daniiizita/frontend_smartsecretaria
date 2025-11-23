export const PERIODOS_TURMA = [
  { value: 'M', label: 'Matutino' },
  { value: 'V', label: 'Vespertino' },
  { value: 'N', label: 'Noturno' },
  { value: 'I', label: 'Integral' },
] as const;

export type PeriodoTurma = typeof PERIODOS_TURMA[number]['value'];