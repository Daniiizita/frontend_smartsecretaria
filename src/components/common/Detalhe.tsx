import React from 'react';
import type { LucideIcon } from 'lucide-react';

/** Bloco de uma tela de visualização (cartão com título). */
export const Secao: React.FC<{ titulo: string; icone?: LucideIcon; acao?: React.ReactNode; children: React.ReactNode }> = ({
  titulo,
  icone: Icone,
  acao,
  children,
}) => (
  <section className="bg-white rounded-lg shadow-md p-4 sm:p-6">
    <div className="flex items-center justify-between gap-3 mb-4">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
        {Icone && <Icone size={20} className="text-blue-500" />}
        {titulo}
      </h3>
      {acao}
    </div>
    {children}
  </section>
);

/** Grade de campos rótulo/valor (2 colunas a partir do tablet). */
export const Campos: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">{children}</dl>
);

/** Um campo; não aparece quando o valor está vazio. */
export const Campo: React.FC<{ rotulo: string; children?: React.ReactNode; largo?: boolean }> = ({ rotulo, children, largo }) =>
  children === undefined || children === null || children === '' ? null : (
    <div className={largo ? 'sm:col-span-2' : undefined}>
      <dt className="text-sm text-slate-500">{rotulo}</dt>
      <dd className="text-slate-900 break-words">{children}</dd>
    </div>
  );
