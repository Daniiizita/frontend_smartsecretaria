import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Eye } from 'lucide-react';

interface Props {
  nome: string;
  verUrl: string;
  editarUrl?: string; // só para quem pode editar
}

/**
 * Botões "Visualizar" e "Editar" de um item de lista (44px, toque confortável).
 * Ficam acima do link que cobre o cartão/linha inteiro (relative z-10) e não
 * disparam o clique do cartão.
 */
export const AcoesDoItem: React.FC<Props> = ({ nome, verUrl, editarUrl }) => (
  <div className="relative z-10 flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
    <Link
      to={verUrl}
      className="h-11 w-11 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
      aria-label={`Visualizar ${nome}`}
      title="Visualizar"
    >
      <Eye size={20} />
    </Link>
    {editarUrl && (
      <Link
        to={editarUrl}
        className="h-11 w-11 flex items-center justify-center rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100"
        aria-label={`Editar ${nome}`}
        title="Editar"
      >
        <Edit size={20} />
      </Link>
    )}
  </div>
);
