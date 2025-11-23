import { isValidCPF, isValidRG } from './maskUtils';
import { isValidDate } from './dateUtils';

export interface AlunoFormData {
  nome_completo: string;
  data_nascimento: string;
  cpf?: string;
  rg?: string;
  email?: string;
  endereco: string;
  telefone_contato: string;
  turma: number;
  [key: string]: any;
}

export const validateAlunoForm = (
  data: Partial<AlunoFormData>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.nome_completo?.trim()) {
    errors.nome_completo = 'Nome completo é obrigatório';
  } else if (data.nome_completo.trim().length < 3) {
    errors.nome_completo = 'Nome deve ter no mínimo 3 caracteres';
  }

  if (!data.data_nascimento?.trim()) {
    errors.data_nascimento = 'Data de nascimento é obrigatória';
  }

  if (!data.endereco?.trim()) {
    errors.endereco = 'Endereço é obrigatório';
  }

  if (!data.telefone_contato?.trim()) {
    errors.telefone_contato = 'Telefone é obrigatório';
  } else if (data.telefone_contato.replace(/\D/g, '').length < 10) {
    errors.telefone_contato = 'Telefone inválido';
  }

  if (!data.turma || data.turma === 0) {
    errors.turma = 'Selecione uma turma';
  }

  if (data.cpf && data.cpf.replace(/\D/g, '').length > 0) {
    if (!isValidCPF(data.cpf)) {
      errors.cpf = 'CPF inválido';
    }
  }

  if (data.rg && data.rg.replace(/\D/g, '').length > 0) {
    if (!isValidRG(data.rg)) {
      errors.rg = 'RG deve ter 7 dígitos';
    }
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Email inválido';
  }

  return errors;
};

export const validateProfessorForm = (data: any): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.nome?.trim()) {
    errors.nome = 'Nome é obrigatório';
  }

  if (!data.cpf) {
    errors.cpf = 'CPF é obrigatório';
  } else if (!isValidCPF(data.cpf)) {
    errors.cpf = 'CPF inválido';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email é obrigatório';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Email inválido';
  }

  if (!data.telefone_contato?.trim()) {
    errors.telefone_contato = 'Telefone é obrigatório';
  }

  if (!data.data_admissao) {
    errors.data_admissao = 'Data de admissão é obrigatória';
  }

  return errors;
};

export const validateTurmaForm = (data: any): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Nome não precisa mais de validação, é gerado automaticamente

  if (!data.serie) {
    errors.serie = 'Série é obrigatória';
  }

  if (!data.turma_letra?.trim()) {
    errors.turma_letra = 'Letra da turma é obrigatória';
  }

  if (!data.ano) {
    errors.ano = 'Ano letivo é obrigatório';
  } else if (data.ano < 2000 || data.ano > 2100) {
    errors.ano = 'Ano inválido';
  }

  if (!data.periodo?.trim()) {
    errors.periodo = 'Período é obrigatório';
  }

  if (!data.professor_responsavel || data.professor_responsavel === 0) {
    errors.professor_responsavel = 'Professor responsável é obrigatório';
  }

  return errors;
};