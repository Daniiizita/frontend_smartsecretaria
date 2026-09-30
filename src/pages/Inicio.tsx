import React from 'react';
import { useUsuario } from '../auth/useUsuario';
import { isGestor } from '../auth/papeis';
import { Aviso, Carregando } from '../features/inicio/componentes';
import { InicioProfessor } from '../features/inicio/InicioProfessor';
import { InicioResponsavel } from '../features/inicio/InicioResponsavel';
import Dashboard from './Dashboard';

// Tela inicial de cada perfil: cada pessoa vê primeiro o que precisa no dia a dia.
const InicioPage: React.FC = () => {
  const { usuario, carregando } = useUsuario();

  if (carregando) return <Carregando />;
  if (!usuario) {
    return (
      <div className="p-8">
        <Aviso titulo="Sessão não encontrada">Entre novamente para continuar.</Aviso>
      </div>
    );
  }
  if (isGestor(usuario)) return <Dashboard />;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {usuario.tipo === 'professor' && <InicioProfessor usuario={usuario} />}
      {usuario.tipo === 'responsavel' && <InicioResponsavel usuario={usuario} />}
      {usuario.tipo === 'aluno' && (
        <Aviso titulo="Bem-vindo(a)">
          <p>Por enquanto, o acesso de alunos é feito pelo responsável.</p>
        </Aviso>
      )}
    </div>
  );
};

export default InicioPage;
