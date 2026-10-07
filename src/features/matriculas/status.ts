import type { StatusMatricula } from '../../types';

export const STATUS: Record<StatusMatricula, { label: string; plural: string; cor: string }> = {
  ativo: { label: 'Ativa', plural: 'ativas', cor: 'bg-green-100 text-green-700' },
  pendente: { label: 'Pendente', plural: 'pendentes', cor: 'bg-amber-100 text-amber-700' },
  cancelado: { label: 'Cancelada', plural: 'canceladas', cor: 'bg-slate-200 text-slate-600' },
  transferido: { label: 'Transferida', plural: 'transferidas', cor: 'bg-slate-200 text-slate-600' },
};

export const ORDEM_STATUS: StatusMatricula[] = ['ativo', 'pendente', 'cancelado', 'transferido'];

export const ehStatus = (valor: string | null): valor is StatusMatricula =>
  !!valor && (ORDEM_STATUS as string[]).includes(valor);
