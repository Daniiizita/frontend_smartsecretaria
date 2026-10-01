import type { Turma } from '../../types';

/** "3º Ano A" a partir de "3º Ano - Ensino Fundamental I" + letra. */
export const tituloCurto = (turma: Pick<Turma, 'serie_label' | 'turma_letra'>) =>
  `${turma.serie_label.split(' - ')[0]} ${turma.turma_letra}`;

export const valoresUnicos = <T,>(lista: T[]) => [...new Set(lista)];
