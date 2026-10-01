import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  to?: string; // quando informado, o cartão leva à lista que ele resume
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, to }) => {
  const conteudo = (
    <>
      <div className="text-blue-500 bg-blue-100 p-2 sm:p-3 rounded-full self-start sm:self-auto">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xl sm:text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs sm:text-sm text-slate-500">{label}</p>
      </div>
      {to && <ChevronRight size={18} className="hidden sm:block text-slate-400 shrink-0" aria-hidden="true" />}
    </>
  );
  const classes = 'bg-white p-4 sm:p-6 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4';

  return to ? (
    <Link
      to={to}
      className={`${classes} hover:shadow-lg hover:ring-1 hover:ring-blue-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500`}
      aria-label={`${label}: ${value}. Ver lista`}
    >
      {conteudo}
    </Link>
  ) : (
    <div className={classes}>{conteudo}</div>
  );
};
