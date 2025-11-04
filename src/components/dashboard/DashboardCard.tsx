import React from 'react';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-3 mb-4">{title}</h3>
      {children}
    </div>
  );
};
