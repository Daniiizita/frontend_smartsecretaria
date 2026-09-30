import React from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <div className="text-blue-500 bg-blue-100 p-2 sm:p-3 rounded-full self-start sm:self-auto">{icon}</div>
      <div className="min-w-0">
        <p className="text-xl sm:text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs sm:text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
};
