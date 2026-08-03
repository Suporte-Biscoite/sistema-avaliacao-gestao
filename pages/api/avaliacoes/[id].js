import { buscarAvaliacao } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ erro: 'Método não permitido.' });
  }

  const pin = req.headers['x-pin'];
  if (pin !== process.env.NEXT_PUBLIC_PIN_GESTOR) {
    return res.status(401).json({ erro: 'Acesso não autorizado.' });
  }

  try {
    const { id } = req.query;
    const avaliacao = await buscarAvaliacao(parseInt(id));
    if (!avaliacao) {
      return res.status(404).json({ erro: 'Avaliação não encontrada.' });
    }
    return res.status(200).json({ avaliacao });
  } catch (err) {
    console.error('Erro ao buscar avaliação:', err);
    return res.status(500).json({ erro: 'Erro ao buscar avaliação.' });
  }
}
