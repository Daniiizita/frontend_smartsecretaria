/**
 * Remove campos que não devem voltar para a API ao salvar um formulário:
 * o `id` (vai na URL) e a `foto` quando é o endereço da imagem já salva —
 * a API só aceita arquivo nesse campo, e ainda não há upload pela interface.
 */
export const semCamposSomenteLeitura = <T extends { id?: unknown; foto?: unknown }>(dados: T) => {
  const { id: _id, foto, ...resto } = dados;
  void _id;
  return typeof foto === 'string' ? resto : { ...resto, foto };
};
