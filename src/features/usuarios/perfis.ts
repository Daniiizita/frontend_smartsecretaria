import type { TipoUsuario } from '../../types';

// O que cada nível de acesso pode fazer — exibido ao escolher o perfil de uma conta.
export const DESCRICAO_DOS_PERFIS: Record<TipoUsuario, string> = {
  admin: 'Controle total do sistema, inclusive contas da secretaria e de outros administradores.',
  secretario:
    'Administra a escola: alunos, professores, turmas, matrículas, documentos e contas de professores, responsáveis e alunos.',
  professor: 'Consulta as próprias turmas e os dados pedagógicos dos seus alunos. Não altera cadastros.',
  responsavel: 'Consulta os dados, matrículas e documentos dos próprios dependentes. Não altera cadastros.',
  aluno: 'Reservado para uso futuro: por enquanto não acessa dados.',
};

export const CORES_DOS_PERFIS: Record<TipoUsuario, string> = {
  admin: 'bg-purple-100 text-purple-700',
  secretario: 'bg-blue-100 text-blue-700',
  professor: 'bg-emerald-100 text-emerald-700',
  responsavel: 'bg-amber-100 text-amber-700',
  aluno: 'bg-slate-100 text-slate-700',
};
