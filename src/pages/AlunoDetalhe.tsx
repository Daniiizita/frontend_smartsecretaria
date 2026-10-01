import React from 'react';
import { AlunoDetalhe } from '../features/alunos/AlunoDetalhe';

// Gestão, professor e responsável: a API devolve só o que cada perfil pode ver.
const AlunoDetalhePage: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <AlunoDetalhe />
  </div>
);

export default AlunoDetalhePage;
