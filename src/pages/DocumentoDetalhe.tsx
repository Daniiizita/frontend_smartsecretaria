import React from 'react';
import { DocumentoDetalhe } from '../features/documentos/DocumentoDetalhe';
import { RestritoA } from '../routes/RequireGestor';
import { isGestor } from '../auth/papeis';

// Gestão e responsável (documentos dos próprios filhos; a API faz o recorte).
const DocumentoDetalhePage: React.FC = () => (
  <div className="max-w-4xl mx-auto">
    <RestritoA
      permitir={(u) => isGestor(u) || u?.tipo === 'responsavel'}
      mensagem="Documentos são acessados pela secretaria e pelos responsáveis."
    >
      <DocumentoDetalhe />
    </RestritoA>
  </div>
);

export default DocumentoDetalhePage;
