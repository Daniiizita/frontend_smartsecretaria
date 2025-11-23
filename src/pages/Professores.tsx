import React from 'react';
import { ProfessorList } from '../features/professores/ProfessorList';

const ProfessoresPage: React.FC = () => {
  return (
    <div className="p-8">
      <ProfessorList />
    </div>
  );
};

export default ProfessoresPage;
