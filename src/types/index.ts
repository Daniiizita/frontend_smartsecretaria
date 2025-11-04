export interface Aluno {
  id: number;
  nome_completo: string;
  data_nascimento: string; // formato: date
  nome_pai?: string | null;
  nome_mae?: string | null;
  cpf?: string | null;
  rg?: string | null;
  endereco: string;
  telefone_contato: string;
  email?: string | null;
  nome_responsavel?: string | null;
  foto?: string | null; // formato: uri
  turma: number;
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
  usuario: { username: string; }; // Supondo que o usuário seja um objeto aninhado
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

// Você pode adicionar outras interfaces aqui para Professor, Turma, etc.
// baseando-se no seu arquivo SmartSecretaria API.yaml
