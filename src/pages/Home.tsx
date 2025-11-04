import React from 'react';
import { Link } from 'react-router-dom';

const FeatureCard: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 text-3xl mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600">{children}</p>
  </div>
);

const HomePage: React.FC = () => {
  return (
    <div className="bg-slate-50 text-slate-700">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-extrabold text-blue-600">SmartSecretaria</h1>
          <p className="mt-4 text-xl text-slate-600">Sistema integrado para gestão escolar completa</p>
          <Link
            to="/login"
            className="mt-8 inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Entrar no Sistema
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Principais Recursos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard icon="👨‍🎓" title="Gestão de Alunos">
            Cadastro completo e organizado de alunos, incluindo documentos, informações de contato e histórico escolar.
          </FeatureCard>
          <FeatureCard icon="👩‍🏫" title="Gestão de Professores">
            Cadastre professores, associe às disciplinas e acompanhe todas as informações relevantes.
          </FeatureCard>
          <FeatureCard icon="🏫" title="Gestão de Turmas">
            Organize suas turmas, associe professores responsáveis e gerencie períodos e séries.
          </FeatureCard>
          <FeatureCard icon="📝" title="Matrículas">
            Sistema completo para gestão de matrículas, com controle de status e histórico.
          </FeatureCard>
          <FeatureCard icon="📅" title="Calendário Escolar">
            Organize eventos, feriados e reuniões em um calendário intuitivo e de fácil visualização.
          </FeatureCard>
          <FeatureCard icon="📄" title="Documentos">
            Gere e gerencie documentos oficiais para alunos, como históricos, declarações e boletins.
          </FeatureCard>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="container mx-auto px-6 py-12 text-center text-white">
          <h2 className="text-3xl font-bold">Simplifique a gestão escolar com o SmartSecretaria</h2>
          <p className="mt-2">Um sistema completo, intuitivo e eficiente para secretarias escolares.</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="container mx-auto px-6 py-4 text-center text-slate-500">
          <p>Versão 1.0.0 | SmartSecretaria © 2023-2025</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
