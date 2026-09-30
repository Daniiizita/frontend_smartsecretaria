import React from 'react';
import { CalendarDays } from 'lucide-react';
import type { Evento } from '../../types';
import { formatarData, iniciais } from './formatos';

export const Avatar: React.FC<{ nome: string; foto?: string | null; tamanho?: 'sm' | 'md' }> = ({
  nome,
  foto,
  tamanho = 'md',
}) => {
  const classe = `${tamanho === 'sm' ? 'h-8 w-8 text-xs' : 'h-14 w-14 text-lg'} shrink-0`;
  return foto ? (
    <img src={foto} alt={nome} className={`${classe} rounded-full object-cover`} />
  ) : (
    <div
      className={`${classe} rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center`}
      aria-hidden="true"
    >
      {iniciais(nome)}
    </div>
  );
};

export const Carregando: React.FC = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
  </div>
);

export const Aviso: React.FC<{ titulo: string; children: React.ReactNode }> = ({ titulo, children }) => (
  <div className="max-w-xl bg-white rounded-lg shadow-md p-6">
    <h2 className="text-lg font-semibold text-slate-800 mb-2">{titulo}</h2>
    <div className="text-slate-600 space-y-2">{children}</div>
  </div>
);

export const ProximosEventos: React.FC<{ eventos: Evento[] }> = ({ eventos }) => (
  <section className="bg-white rounded-lg shadow-md p-6">
    <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
      <CalendarDays size={20} className="text-blue-500" />
      Próximos eventos
    </h2>
    {eventos.length === 0 ? (
      <p className="text-slate-500 text-sm">Nenhum evento agendado.</p>
    ) : (
      <ul className="divide-y divide-slate-100">
        {eventos.map((evento) => (
          <li key={evento.id} className="py-3 flex justify-between gap-4">
            <span className="text-slate-800">{evento.titulo}</span>
            <span className="text-sm text-slate-500 whitespace-nowrap">{formatarData(evento.data_inicio)}</span>
          </li>
        ))}
      </ul>
    )}
  </section>
);
