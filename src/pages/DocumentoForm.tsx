import React from 'react';
import { DocumentoForm } from '../features/documentos/DocumentoForm';
import { RequireGestor } from '../routes/RequireGestor';

const DocumentoFormPage: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <RequireGestor>
      <DocumentoForm />
    </RequireGestor>
  </div>
);

export default DocumentoFormPage;
