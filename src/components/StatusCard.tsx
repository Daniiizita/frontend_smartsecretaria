import React from 'react';

// Define as variantes de status como constantes imutáveis
const statusStyles = {
  ok: {
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-400',
    dotColor: 'bg-green-500',
    label: 'Operacional',
  },
  alerta: {
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-400',
    dotColor: 'bg-yellow-500',
    label: 'Instabilidade',
  },
  erro: {
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-400',
    dotColor: 'bg-red-500',
    label: 'Fora do Ar',
  },
} as const;

// Inferência automática dos tipos de chave
type StatusType = keyof typeof statusStyles;

// Tipagem das props do componente
interface StatusCardProps {
  service: string;
  status: StatusType;
  lastCheck: string;
}

// Componente tipado com React.FC
export const StatusCard: React.FC<StatusCardProps> = ({
  service,
  status,
  lastCheck,
}) => {
  // Se o status não existir, usa 'alerta' como fallback
  const styles = statusStyles[status] ?? statusStyles.alerta;

  return (
    <div
      className={`
        p-5 rounded-lg border-l-4 shadow-md transition-transform hover:scale-105
        ${styles.bgColor} ${styles.borderColor}
      `}
    >
      <h2 className="font-bold text-lg text-slate-700 truncate">{service}</h2>

      <div className="flex items-center mt-3 mb-4">
        <span className={`h-3 w-3 rounded-full mr-2 ${styles.dotColor}`} />
        <span className={`font-semibold text-sm ${styles.textColor}`}>
          {styles.label}
        </span>
      </div>

      <p className="text-xs text-slate-500">
        Última verificação: {lastCheck}
      </p>
    </div>
  );
};
