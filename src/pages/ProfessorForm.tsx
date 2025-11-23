import React from 'react';
import { ProfessorForm } from '../features/professores/ProfessorForm';

const ProfessorFormPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <ProfessorForm />
    </div>
  );
};

export default ProfessorFormPage;