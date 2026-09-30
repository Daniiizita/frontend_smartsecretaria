import type { Matricula } from '../../types';

export const STATUS_MATRICULA: Record<Matricula['status'], { label: string; cor: string }> = {
  ativo: { label: 'Matrícula ativa', cor: 'bg-green-100 text-green-700' },
  pendente: { label: 'Matrícula pendente', cor: 'bg-amber-100 text-amber-700' },
  cancelado: { label: 'Matrícula cancelada', cor: 'bg-slate-200 text-slate-600' },
  transferido: { label: 'Transferido', cor: 'bg-slate-200 text-slate-600' },
};

export const TIPO_DOCUMENTO: Record<string, string> = {
  historico: 'Histórico escolar',
  declaracao: 'Declaração de matrícula',
  boletim: 'Boletim escolar',
  atestado: 'Atestado de matrícula',
  certificado: 'Certificado de conclusão',
  contagem: 'Contagem de tempo',
  ata: 'Ata de reunião',
  outros: 'Outros',
};

export const formatarData = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

export const iniciais = (nome: string) =>
  nome.split(' ').filter(Boolean).map((parte) => parte[0]).slice(0, 2).join('').toUpperCase();
