import type { TipoDocumento } from '../../types';

// Mesmos tipos do backend (documentos.models.Documento.TIPOS_DOCUMENTO).
export const TIPOS_DOCUMENTO: { value: TipoDocumento; label: string }[] = [
  { value: 'declaracao', label: 'Declaração de matrícula' },
  { value: 'atestado', label: 'Atestado de matrícula' },
  { value: 'historico', label: 'Histórico escolar' },
  { value: 'boletim', label: 'Boletim escolar' },
  { value: 'certificado', label: 'Certificado de conclusão' },
  { value: 'contagem', label: 'Contagem de tempo' },
  { value: 'ata', label: 'Ata de reunião' },
  { value: 'outros', label: 'Outros' },
];

export const ehTipo = (valor: string | null): valor is TipoDocumento =>
  !!valor && TIPOS_DOCUMENTO.some((t) => t.value === valor);
