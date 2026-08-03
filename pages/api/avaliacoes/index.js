import { inserirAvaliacao, listarAvaliacoes } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const dados = req.body;

      if (!dados.nome || dados.nome.trim() === '') {
        return res.status(400).json({ erro: 'Nome é obrigatório.' });
      }

      const resultado = await inserirAvaliacao({
        nome: dados.nome?.trim() || '',
        cargo: dados.cargo?.trim() || '',
        area: dados.area || '',
        periodo: dados.periodo?.trim() || '',
        nota_atitude: parseInt(dados.nota_atitude) || null,
        nota_comprometimento: parseInt(dados.nota_comprometimento) || null,
        nota_pontualidade: parseInt(dados.nota_pontualidade) || null,
        nota_conhecimento: parseInt(dados.nota_conhecimento) || null,
        nota_comportamento: parseInt(dados.nota_comportamento) || null,
        obs_atitude: dados.obs_atitude?.trim() || '',
        obs_comprometimento: dados.obs_comprometimento?.trim() || '',
        obs_pontualidade: dados.obs_pontualidade?.trim() || '',
        obs_conhecimento: dados.obs_conhecimento?.trim() || '',
        obs_comportamento: dados.obs_comportamento?.trim() || '',
        reflexao_bem: dados.reflexao_bem?.trim() || '',
        reflexao_melhor: dados.reflexao_melhor?.trim() || '',
        reflexao_apoio: dados.reflexao_apoio?.trim() || '',
        reflexao_meta: dados.reflexao_meta?.trim() || '',
        satisfacao_ambiente: dados.satisfacao_ambiente || '',
        satisfacao_crescimento: dados.satisfacao_crescimento || '',
        mensagem_livre: dados.mensagem_livre?.trim() || '',
      });

      return res.status(201).json({ sucesso: true, id: resultado.id });
    } catch (err) {
      console.error('Erro ao salvar avaliação:', err);
      return res.status(500).json({ erro: 'Erro ao salvar avaliação. Tente novamente.' });
    }
  }

  if (req.method === 'GET') {
    // Verifica PIN do gestor via header
    const pin = req.headers['x-pin'];
    if (pin !== process.env.NEXT_PUBLIC_PIN_GESTOR) {
      return res.status(401).json({ erro: 'Acesso não autorizado.' });
    }

    try {
      const avaliacoes = await listarAvaliacoes();
      return res.status(200).json({ avaliacoes });
    } catch (err) {
      console.error('Erro ao listar avaliações:', err);
      return res.status(500).json({ erro: 'Erro ao buscar avaliações.' });
    }
  }

  return res.status(405).json({ erro: 'Método não permitido.' });
}
