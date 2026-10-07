import React from 'react';
import { DocumentoList } from '../features/documentos/DocumentoList';
import { RequireGestor } from '../routes/RequireGestor';

const DocumentosPage: React.FC = () => (
  <RequireGestor>
    <DocumentoList />
  </RequireGestor>
);

export default DocumentosPage;
