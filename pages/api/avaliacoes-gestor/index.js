import { Pool } from 'pg';

const connectionString =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL;

function getClient() {
  return new Pool({ connectionString, ssl: { rejectUnauthorized: false }, max: 1, connectionTimeoutMillis: 8000 });
}

async function query(text, params) {
  const pool = getClient();
  const client = await pool.connect();
  try { return await client.query(text, params); }
  finally { client.release(); await pool.end(); }
}

const PIN_GESTOR = process.env.PIN_GESTOR || process.env.NEXT_PUBLIC_PIN_GESTOR || '9999';

async function ensureTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS avaliacoes_gestor (
      id SERIAL PRIMARY KEY,
      nome_colaborador TEXT NOT NULL,
      cargo TEXT, area TEXT, periodo TEXT, nome_gestor TEXT,
      nota_direcao INTEGER, nota_desenvolvimento INTEGER, nota_feedback INTEGER,
      nota_acessibilidade INTEGER, nota_gestao_recursos INTEGER, nota_inspiracao INTEGER,
      obs_direcao TEXT, obs_desenvolvimento TEXT, obs_feedback TEXT,
      obs_acessibilidade TEXT, obs_gestao_recursos TEXT, obs_inspiracao TEXT,
      pontos_fortes TEXT, sugestoes TEXT, mensagem_livre TEXT,
      criado_em TIMESTAMP DEFAULT NOW()
    );
  `);
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const d = req.body;
      if (!d?.nomeColaborador?.trim() && !d?.nome_colaborador?.trim()) {
        return res.status(400).json({ erro: 'Nome é obrigatório.' });
      }
      await ensureTable();
      const { rows } = await query(
        `INSERT INTO avaliacoes_gestor (
          nome_colaborador, cargo, area, periodo, nome_gestor,
          nota_direcao, nota_desenvolvimento, nota_feedback,
          nota_acessibilidade, nota_gestao_recursos, nota_inspiracao,
          obs_direcao, obs_desenvolvimento, obs_feedback,
          obs_acessibilidade, obs_gestao_recursos, obs_inspiracao,
          pontos_fortes, sugestoes, mensagem_livre
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) RETURNING id`,
        [
          (d.nomeColaborador||d.nome_colaborador||'').trim(),
          d.cargo||'', d.area||'', d.periodo||'', d.nomeGestor||'',
          parseInt(d.nota_direcao)||null, parseInt(d.nota_desenvolvimento)||null,
          parseInt(d.nota_feedback)||null, parseInt(d.nota_acessibilidade)||null,
          parseInt(d.nota_gestao_recursos)||null, parseInt(d.nota_inspiracao)||null,
          d.obs_direcao||'', d.obs_desenvolvimento||'', d.obs_feedback||'',
          d.obs_acessibilidade||'', d.obs_gestao_recursos||'', d.obs_inspiracao||'',
          d.pontos_fortes||'', d.sugestoes||'', d.mensagem_livre||'',
        ]
      );
      return res.status(201).json({ sucesso: true, id: rows[0].id });
    } catch(err) {
      console.error('[POST avaliacoes-gestor]', err.message);
      return res.status(500).json({ erro: 'Erro ao salvar.', detalhe: process.env.NODE_ENV==='development'?err.message:undefined });
    }
  }
  if (req.method === 'GET') {
    if (req.headers['x-pin'] !== PIN_GESTOR) return res.status(401).json({ erro: 'Não autorizado.' });
    try {
      await ensureTable();
      const { rows } = await query(`SELECT * FROM avaliacoes_gestor ORDER BY criado_em DESC`);
      return res.status(200).json({ avaliacoes: rows });
    } catch(err) { return res.status(500).json({ erro: 'Erro ao buscar.' }); }
  }
  return res.status(405).json({ erro: 'Método não permitido.' });
}
