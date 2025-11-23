export interface Aluno {
  id: number;
  nome_completo: string;
  data_nascimento: string;
  nome_pai?: string;
  nome_mae?: string;
  cpf?: string;
  rg?: string;
  orgao_expedidor: string;
  endereco: string;
  telefone_contato: string;
  email?: string;
  nome_responsavel?: string;
  turma: number;
  foto?: string | null;
}

interface UltimoAluno {
  id: number;
  nome_completo: string;
  foto: string | null;
}

interface ProximoEvento {
  id: number;
  titulo: string;
  data_inicio: string;
  tipo: string;
}

interface UltimaAtividade {
  id: number;
  acao: string;
  data_hora: string;
  usuario: { username: string; };
}

export interface UserCredentials {
  username?: string;
  password?: string;
}

export interface DashboardData {
  total_alunos: number;
  total_professores: number;
  total_turmas: number;
  total_matriculas_ativas: number;
  documentos_mes_atual: number;
  proximos_eventos: ProximoEvento[];
  ultimos_alunos: UltimoAluno[];
  ultimas_atividades: UltimaAtividade[];
}

export interface TokenObtainPair {
  access: string;
  refresh: string;
}

export interface Professor {
  id: number;
  nome: string;
  cpf: string;
  rg: string;
  orgao_expedidor: string;
  data_nascimento: string;
  endereco: string;
  telefone_contato: string;
  email: string;
  data_admissao: string;
  naturalidade: string;
  foto?: string | null;
  disciplinas: number[];
}

export interface Turma {
  id: number;
  nome: string;
  serie: number;
  nivel?: string;
  turma_letra: string;
  ano: number;
  periodo: string;
  professor_responsavel: number;
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface Disciplina {
  id: number;
  nome: string;
}
