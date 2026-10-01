import React from 'react';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useUsuario } from '../auth/useUsuario';
import { isGestor } from '../auth/papeis';
import type { MeuPerfil } from '../types';

interface RestritoAProps {
  permitir: (usuario: MeuPerfil | null) => boolean;
  mensagem?: string;
  children: React.ReactNode;
}

/**
 * Mostra o conteúdo só para os perfis permitidos.
 * É uma conveniência de interface: a API recusa o acesso de qualquer forma.
 */
export const RestritoA: React.FC<RestritoAProps> = ({ permitir, mensagem, children }) => {
  const { usuario, carregando } = useUsuario();

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (!permitir(usuario)) {
    return (
      <div className="max-w-lg mx-auto mt-12 bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
        <ShieldAlert className="mx-auto text-amber-500 mb-4" size={40} />
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Acesso restrito</h2>
        <p className="text-slate-600">
          {mensagem ?? 'Esta área é exclusiva da administração e da secretaria da escola.'}
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

/** Gestão escolar: administração e secretaria. */
export const RequireGestor: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RestritoA permitir={isGestor}>{children}</RestritoA>
);

/** Gestão escolar ou professor (ex.: consulta de turmas). */
export const RequireGestorOuProfessor: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RestritoA
    permitir={(u) => isGestor(u) || u?.tipo === 'professor'}
    mensagem="Esta área é exclusiva da gestão escolar e dos professores."
  >
    {children}
  </RestritoA>
);
