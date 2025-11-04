import React from 'react';
import { StatusCard } from './components/StatusCard';

// Importa o tipo de status do componente para garantir consistência
type StatusType = 'ok' | 'alerta' | 'erro';

// Interface para tipar os itens do array systemStatus
interface SystemStatus {
  id: number;
  service: string;
  status: StatusType;
  lastCheck: string;
}

const App: React.FC = () => {
  // Dados de exemplo, simulando uma resposta de API
  const systemStatus: SystemStatus[] = [
    { id: 1, service: 'API de Transações', status: 'ok', lastCheck: '2 min atrás' },
    { id: 2, service: 'Servidor de Autenticação', status: 'ok', lastCheck: '3 min atrás' },
    { id: 3, service: 'Processamento de Lotes', status: 'alerta', lastCheck: '15 min atrás' },
    { id: 4, service: 'Gateway de Pagamentos', status: 'erro', lastCheck: '1 min atrás' },
  ];

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800">Dashboard de Monitoramento</h1>
          <p className="text-lg text-slate-600 mt-2">Status dos sistemas críticos</p>
        </header>

        {/* Grid responsivo para os cards de status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systemStatus.map((system) => (
            <StatusCard
              key={system.id}
              service={system.service}
              status={system.status}
              lastCheck={system.lastCheck}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default App;
