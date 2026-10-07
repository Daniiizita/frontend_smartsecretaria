import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardData } from '../api/dashboardService';
import type { DashboardData } from '../types';
import { StatCard } from '../components/dashboard/StatCard';
import { DashboardCard } from '../components/dashboard/DashboardCard';
import {
  User,
  GraduationCap,
  Users,
  ClipboardList,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await getDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError('Não foi possível carregar a visão geral da escola. Tente novamente em instantes.');
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
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6">Visão geral da escola</h1>

      {/* Seção de Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <StatCard label="Alunos" value={data.total_alunos} icon={<User size={24} />} to="/alunos" />
        <StatCard label="Professores" value={data.total_professores} icon={<GraduationCap size={24} />} to="/professores" />
        <StatCard label="Turmas" value={data.total_turmas} icon={<Users size={24} />} to="/turmas" />
        <StatCard label="Matrículas Ativas" value={data.total_matriculas_ativas} icon={<ClipboardList size={24} />} to="/matriculas?status=ativo" />
      </div>

      {/* Seção Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          <DashboardCard title="Ações Rápidas">
            <div className="flex flex-wrap gap-3">
              <Link to="/alunos/novo" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">Novo Aluno</Link>
              <Link to="/professores/novo" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">Novo Professor</Link>
              <Link to="/turmas/nova" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">Nova Turma</Link>
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

        <div className="space-y-6 lg:space-y-8">
          <DashboardCard title="Últimos Alunos Cadastrados">
            {data.ultimos_alunos.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {data.ultimos_alunos.map(aluno => (
                  <li key={aluno.id}>
                    <Link to={`/alunos/${aluno.id}`} className="flex items-center min-h-11 py-2 text-slate-800 hover:text-blue-700 hover:underline">
                      {aluno.nome_completo}
                    </Link>
                  </li>
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
