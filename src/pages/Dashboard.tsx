import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardData } from '../api/dashboardService';
import type { DashboardData } from '../types';
import { StatCard } from '../components/dashboard/StatCard';
import { DashboardCard } from '../components/dashboard/DashboardCard';
;

// Ícones de placeholder (idealmente, use uma biblioteca como react-icons)
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 13a5.995 5.995 0 00-3-5.197" /></svg>;
const AcademicCapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ClipboardListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Buscando dados do dashboard...');
        const dashboardData = await getDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError('Falha ao carregar os dados do dashboard. Verifique se você está logado.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Carregando dashboard...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-slate-500">Nenhum dado para exibir.</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>

      {/* Seção de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Alunos" value={data.total_alunos} icon={<UserIcon />} />
        <StatCard label="Professores" value={data.total_professores} icon={<AcademicCapIcon />} />
        <StatCard label="Turmas" value={data.total_turmas} icon={<UsersIcon />} />
        <StatCard label="Matrículas Ativas" value={data.total_matriculas_ativas} icon={<ClipboardListIcon />} />
      </div>

      {/* Seção Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <DashboardCard title="Ações Rápidas">
            <div className="flex flex-wrap gap-3">
              <Link to="/alunos/novo" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">Novo Aluno</Link>
              <Link to="/professores/novo" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">Novo Professor</Link>
              <Link to="/turmas/nova" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">Nova Turma</Link>
              <Link to="/matriculas/nova" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">Nova Matrícula</Link>
            </div>
          </DashboardCard>
          <DashboardCard title="Próximos Eventos">
            {data.proximos_eventos.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {data.proximos_eventos.map(evento => (
                  <li key={evento.id} className="py-3">{evento.titulo} - {new Date(evento.data_inicio).toLocaleDateString()}</li>
                ))}
              </ul>
            ) : <p className="text-slate-500">Não há eventos próximos.</p>}
          </DashboardCard>
        </div>

        <div className="space-y-8">
          <DashboardCard title="Últimos Alunos Cadastrados">
            {data.ultimos_alunos.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {data.ultimos_alunos.map(aluno => (
                  <li key={aluno.id} className="py-3">{aluno.nome_completo}</li>
                ))}
              </ul>
            ) : <p className="text-slate-500">Nenhum aluno cadastrado recentemente.</p>}
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
