import { Pool } from 'pg';

// Supabase via Vercel: usa POSTGRES_URL_NON_POOLING (conexão direta, sem pgBouncer)
let baseUrl =
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL;

if (!baseUrl) {
  console.error('[db] ERRO: Nenhuma variável de conexão encontrada.');
}

// Remove qualquer sslmode existente e força sslmode=require + uselibpqcompat
// Isso resolve o erro "self-signed certificate in certificate chain" no Supabase
function buildConnectionString(url) {
  if (!url) return url;
  const u = new URL(url);
  u.searchParams.delete('sslmode');
  u.searchParams.delete('uselibpqcompat');
  u.searchParams.set('sslmode', 'require');
  u.searchParams.set('uselibpqcompat', 'true');
  return u.toString();
}

const connectionString = buildConnectionString(baseUrl);

function getClient() {
  return new Pool({
    connectionString,
    // ssl: false aqui — deixamos o sslmode da URL controlar o SSL
    max: 1,
    connectionTimeoutMillis: 8000,
    idleTimeoutMillis: 10000,
  });
}

async function query(text, params) {
  const pool = getClient();
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
    await pool.end();
  }
}

export async function ensureTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS avaliacoes (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      cargo TEXT,
      area TEXT,
      periodo TEXT,
      nota_atitude INTEGER,
      nota_comprometimento INTEGER,
      nota_pontualidade INTEGER,
      nota_conhecimento INTEGER,
      nota_comportamento INTEGER,
      obs_atitude TEXT,
      obs_comprometimento TEXT,
      obs_pontualidade TEXT,
      obs_conhecimento TEXT,
      obs_comportamento TEXT,
      reflexao_bem TEXT,
      reflexao_melhor TEXT,
      reflexao_apoio TEXT,
      reflexao_meta TEXT,
      satisfacao_ambiente TEXT,
      satisfacao_crescimento TEXT,
      mensagem_livre TEXT,
      criado_em TIMESTAMP DEFAULT NOW()
    );
  `);
}

export async function inserirAvaliacao(dados) {
  await ensureTable();
  const { rows } = await query(
    `INSERT INTO avaliacoes (
      nome, cargo, area, periodo,
      nota_atitude, nota_comprometimento, nota_pontualidade, nota_conhecimento, nota_comportamento,
      obs_atitude, obs_comprometimento, obs_pontualidade, obs_conhecimento, obs_comportamento,
      reflexao_bem, reflexao_melhor, reflexao_apoio, reflexao_meta,
      satisfacao_ambiente, satisfacao_crescimento, mensagem_livre
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21
    ) RETURNING id, criado_em`,
    [
      dados.nome, dados.cargo, dados.area, dados.periodo,
      dados.nota_atitude, dados.nota_comprometimento, dados.nota_pontualidade,
      dados.nota_conhecimento, dados.nota_comportamento,
      dados.obs_atitude, dados.obs_comprometimento, dados.obs_pontualidade,
      dados.obs_conhecimento, dados.obs_comportamento,
      dados.reflexao_bem, dados.reflexao_melhor, dados.reflexao_apoio, dados.reflexao_meta,
      dados.satisfacao_ambiente, dados.satisfacao_crescimento, dados.mensagem_livre,
    ]
  );
  return rows[0];
}

export async function listarAvaliacoes() {
  await ensureTable();
  const { rows } = await query(
    `SELECT * FROM avaliacoes ORDER BY criado_em DESC`
  );
  return rows;
}

export async function buscarAvaliacao(id) {
  await ensureTable();
  const { rows } = await query(
    `SELECT * FROM avaliacoes WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}
