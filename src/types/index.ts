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
  responsaveis?: number[]; // contas de login dos responsáveis
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
  email: string;
  telefone_contato: string;
  data_admissao: string;
  foto?: string | null;
  disciplinas: number[];
  usuario?: number | null; // conta de login do professor
  rg?: string;
  orgao_expedidor?: string;
  data_nascimento?: string;
  endereco?: string;
  naturalidade?: string;
}

export interface Turma {
  id: number;
  nome: string; // gerado pelo backend a partir de série, letra, período e ano
  serie: number;
  serie_label: string;
  turma_letra: string;
  ano: number;
  periodo: string;
  nivel_ensino_sigla: string;
  nivel_label: string;
  horario_aulas?: string | null;
  professor_responsavel: number; // regente
  professor_responsavel_nome: string;
  total_alunos: number;
}

// Campos que o formulário envia ao criar/editar uma turma.
export interface TurmaPayload {
  serie: number;
  turma_letra: string;
  periodo: string;
  ano: number;
  horario_aulas?: string | null;
  professor_responsavel: number;
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export type TipoUsuario = 'admin' | 'secretario' | 'professor' | 'aluno' | 'responsavel';

export interface Usuario {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  tipo: TipoUsuario;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login: string | null;
  date_joined: string;
}

// /api/usuarios/me/: a conta logada e os cadastros aos quais está ligada.
export interface MeuPerfil extends Usuario {
  professor: number | null;
  dependentes: number[];
}

export interface Disciplina {
  id: number;
  nome: string;
}

export interface Atribuicao {
  id: number;
  turma: number;
  disciplina: number;
  disciplina_nome: string;
  professor: number;
  professor_nome: string;
}

export interface Evento {
  id: number;
  titulo: string;
  descricao?: string | null;
  data_inicio: string;
  data_fim: string;
  tipo: string;
}

export interface Matricula {
  id: number;
  aluno: number;
  turma: number;
  ano_letivo: number;
  data_matricula: string;
  status: 'ativo' | 'pendente' | 'cancelado' | 'transferido';
}

export interface Notificacao {
  id: number;
  tipo: 'evento' | 'documento' | 'matricula' | 'sistema';
  titulo: string;
  mensagem: string;
  link: string | null;
  lida: boolean;
  criada_em: string;
}

export interface Documento {
  id: number;
  aluno: number;
  tipo: string;
  data_emissao: string;
  conteudo: string;
}

// Campos que a API aceita ao criar/editar uma conta (a senha nunca volta da API).
export interface UsuarioPayload {
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  tipo?: TipoUsuario;
  is_active?: boolean;
  password?: string;
}
