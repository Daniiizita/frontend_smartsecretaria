import apiClient from './axios';
import type { Documento, DocumentoPayload, TipoDocumento } from '../types';

export interface FiltrosDocumento {
  aluno?: number;
  tipo?: TipoDocumento;
  ano?: number;
}

// A API devolve apenas o que o perfil logado pode ver; os filtros só restringem.
export const listarDocumentos = async (filtros: FiltrosDocumento = {}): Promise<Documento[]> =>
  (await apiClient.get<Documento[]>('/documentos/', { params: filtros })).data;

export const getDocumento = async (id: number): Promise<Documento> =>
  (await apiClient.get<Documento>(`/documentos/${id}/`)).data;

export const createDocumento = async (dados: DocumentoPayload): Promise<Documento> =>
  (await apiClient.post<Documento>('/documentos/', dados)).data;

export const updateDocumento = async (id: number, dados: Partial<DocumentoPayload>): Promise<Documento> =>
  (await apiClient.patch<Documento>(`/documentos/${id}/`, dados)).data;

export const deleteDocumento = async (id: number): Promise<void> => {
  await apiClient.delete(`/documentos/${id}/`);
};

// Texto-modelo preenchido com os dados do aluno (para a secretaria revisar).
export const gerarTextoModelo = async (aluno: number, tipo: TipoDocumento, dataEmissao?: string): Promise<string> =>
  (await apiClient.post<{ conteudo: string }>('/documentos/modelo/', { aluno, tipo, data_emissao: dataEmissao })).data.conteudo;
