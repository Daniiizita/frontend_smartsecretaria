import React, { useState } from 'react';
import { useProfessores } from './useProfessores';
import { useDisciplinas } from '../../hooks/useDisciplinas';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Mail, Phone, MapPin, Calendar, AlertTriangle, BookOpen } from 'lucide-react';
import { deleteProfessor } from '../../api/professorService';

export const ProfessorList: React.FC = () => {
  const { professores, loading: loadingProf, error: errorProf, refetch } = useProfessores();
  const { disciplinasMap, loading: loadingDisc } = useDisciplinas();
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [professorToDelete, setProfessorToDelete] = useState<number | null>(null);

  const filteredProfessores = professores.filter(professor =>
    professor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professor.cpf.includes(searchTerm)
  );

  const handleDeleteClick = (id: number) => {
    setProfessorToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (professorToDelete === null) return;

    setDeletingId(professorToDelete);
    try {
      await deleteProfessor(professorToDelete);
      refetch();
      setShowDeleteModal(false);
      setProfessorToDelete(null);
    } catch (error) {
      console.error('Erro ao deletar professor:', error);
      alert('Erro ao deletar professor. Tente novamente.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loadingProf || loadingDisc) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (errorProf) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {errorProf}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Lista de Professores</h2>
        <Link
          to="/professores/novo"
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          Novo Professor
        </Link>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Buscar professor por nome, email ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfessores.map((professor) => {
          // Pega os nomes das disciplinas a partir dos IDs
          const disciplinaNomes = professor.disciplinas
            .map(id => disciplinasMap.get(id))
            .filter(Boolean);

          return (
            <div key={professor.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              {/* Foto e Nome */}
              <div className="flex items-center gap-4 mb-4">
                {professor.foto ? (
                  <img 
                    src={professor.foto} 
                    alt={professor.nome} 
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-xl">
                      {professor.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 text-lg">{professor.nome}</h3>
                  <p className="text-sm text-slate-500">CPF: {professor.cpf}</p>
                </div>
              </div>

              {/* Informações de Contato */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  <span className="truncate">{professor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone size={16} className="text-slate-400 shrink-0" />
                  <span>{professor.telefone_contato}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin size={16} className="text-slate-400 shrink-0" />
                  <span className="truncate">{professor.naturalidade}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar size={16} className="text-slate-400 shrink-0" />
                  <span>Admitido em {new Date(professor.data_admissao).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {/* Disciplinas */}
              {disciplinaNomes.length > 0 && (
                <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={16} className="text-slate-500" />
                    <p className="text-xs font-medium text-slate-500 uppercase">Disciplinas</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {disciplinaNomes.map((nome, idx) => (
                      <span 
                        key={idx}
                        className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                      >
                        {nome}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <Link
                  to={`/professores/${professor.id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                >
                  <Edit size={16} />
                  Editar
                </Link>
                <button
                  onClick={() => handleDeleteClick(professor.id)}
                  disabled={deletingId === professor.id}
                  className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProfessores.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-slate-500">Nenhum professor encontrado.</p>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Confirmar Exclusão</h3>
            </div>
            
            <p className="text-slate-600 mb-6">
              Tem certeza que deseja excluir este professor? Esta ação não pode ser desfeita.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProfessorToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                disabled={deletingId !== null}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:bg-red-300"
              >
                {deletingId !== null ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};