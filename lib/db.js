import { sql } from '@vercel/postgres';

export async function ensureTable() {
  await sql`
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
  `;
}

export async function inserirAvaliacao(dados) {
  await ensureTable();
  const { rows } = await sql`
    INSERT INTO avaliacoes (
      nome, cargo, area, periodo,
      nota_atitude, nota_comprometimento, nota_pontualidade, nota_conhecimento, nota_comportamento,
      obs_atitude, obs_comprometimento, obs_pontualidade, obs_conhecimento, obs_comportamento,
      reflexao_bem, reflexao_melhor, reflexao_apoio, reflexao_meta,
      satisfacao_ambiente, satisfacao_crescimento, mensagem_livre
    ) VALUES (
      ${dados.nome}, ${dados.cargo}, ${dados.area}, ${dados.periodo},
      ${dados.nota_atitude}, ${dados.nota_comprometimento}, ${dados.nota_pontualidade},
      ${dados.nota_conhecimento}, ${dados.nota_comportamento},
      ${dados.obs_atitude}, ${dados.obs_comprometimento}, ${dados.obs_pontualidade},
      ${dados.obs_conhecimento}, ${dados.obs_comportamento},
      ${dados.reflexao_bem}, ${dados.reflexao_melhor}, ${dados.reflexao_apoio}, ${dados.reflexao_meta},
      ${dados.satisfacao_ambiente}, ${dados.satisfacao_crescimento}, ${dados.mensagem_livre}
    )
    RETURNING id, criado_em;
  `;
  return rows[0];
}

export async function listarAvaliacoes() {
  await ensureTable();
  const { rows } = await sql`
    SELECT * FROM avaliacoes ORDER BY criado_em DESC;
  `;
  return rows;
}

export async function buscarAvaliacao(id) {
  await ensureTable();
  const { rows } = await sql`
    SELECT * FROM avaliacoes WHERE id = ${id};
  `;
  return rows[0] || null;
}
