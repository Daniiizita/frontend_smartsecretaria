import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Usuario } from '../../types';
import { getUsuarios } from '../../api/usuarioService';
import { getProfessores } from '../../api/professorService';
import { nomeDeExibicao } from '../../auth/papeis';
import { FormSelect } from '../../components/common/Form/FormSelect';

interface Props {
  value: number | null | undefined;
  onChange: (usuarioId: number | null) => void;
  professorId?: number; // cadastro em edição: a própria conta continua disponível
  error?: string;
}

/** Contas do tipo professor que ainda não estão ligadas a outro cadastro. */
export const ContaProfessorSelect: React.FC<Props> = ({ value, onChange, professorId, error }) => {
  const [contas, setContas] = useState<Usuario[]>([]);
  const [falha, setFalha] = useState(false);

  useEffect(() => {
    Promise.all([getUsuarios(), getProfessores()])
      .then(([usuarios, professores]) => {
        const emUso = new Set(
          professores.filter((p) => p.usuario && p.id !== professorId).map((p) => p.usuario)
        );
        setContas(usuarios.filter((u) => u.tipo === 'professor' && !emUso.has(u.id)));
      })
      .catch((err) => {
        console.error(err);
        setFalha(true);
      });
  }, [professorId]);

  return (
    <div className="space-y-1">
      <FormSelect
        label="Conta de acesso"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        error={error ?? (falha ? 'Não foi possível carregar as contas.' : undefined)}
        options={contas.map((u) => ({ value: u.id, label: `${nomeDeExibicao(u)} (@${u.username})` }))}
      />
      <p className="text-xs text-slate-500">
        Opcional. Liga este cadastro a uma conta do tipo professor, para que a pessoa veja suas turmas
        e seus alunos. Não encontrou a conta? <Link to="/usuarios/novo" className="text-blue-600 hover:underline">Crie em Usuários</Link>.
      </p>
    </div>
  );
};
