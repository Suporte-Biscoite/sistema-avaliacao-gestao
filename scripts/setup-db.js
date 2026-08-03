// Este script cria as tabelas no banco Vercel Postgres automaticamente
// É executado após o npm install via postinstall

const { sql } = require('@vercel/postgres');

async function setup() {
  try {
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
    console.log('✅ Tabela avaliacoes criada/verificada com sucesso.');
  } catch (err) {
    console.error('Erro ao criar tabela (provavelmente sem banco configurado ainda):', err.message);
  }
}

setup();
