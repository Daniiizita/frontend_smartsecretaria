import React from 'react';
import { AlunoList } from '../features/alunos/AlunoList';

const AlunosPage: React.FC = () => {
  return (
    <div className="p-8">
      <AlunoList />
    </div>
  );
};

export default AlunosPage;

