// Rota temporária de diagnóstico — REMOVA após resolver o problema
export default async function handler(req, res) {
  const info = {
    node_version: process.version,
    env_vars_presentes: {
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      POSTGRES_URL_NON_POOLING: !!process.env.POSTGRES_URL_NON_POOLING,
      POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
      DATABASE_URL: !!process.env.DATABASE_URL,
      POSTGRES_HOST: !!process.env.POSTGRES_HOST,
      POSTGRES_USER: !!process.env.POSTGRES_USER,
      POSTGRES_PASSWORD: !!process.env.POSTGRES_PASSWORD,
      POSTGRES_DATABASE: !!process.env.POSTGRES_DATABASE,
      PIN_GESTOR: !!process.env.PIN_GESTOR,
      NEXT_PUBLIC_PIN_GESTOR: !!process.env.NEXT_PUBLIC_PIN_GESTOR,
      NEXT_PUBLIC_PIN_COLABORADOR: !!process.env.NEXT_PUBLIC_PIN_COLABORADOR,
    },
    // Mostra prefixo da URL para confirmar qual banco está sendo usado (sem expor a senha)
    url_preview: process.env.POSTGRES_URL_NON_POOLING
      ? process.env.POSTGRES_URL_NON_POOLING.replace(/:([^@]+)@/, ':***@').substring(0, 80) + '...'
      : process.env.POSTGRES_URL
      ? process.env.POSTGRES_URL.replace(/:([^@]+)@/, ':***@').substring(0, 80) + '...'
      : 'NENHUMA URL ENCONTRADA',
  };

  // Testa conexão real com o banco
  let db_status = 'não testado';
  let db_erro = null;
  try {
    const { Pool } = await import('pg');
    const connectionString =
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.POSTGRES_URL;

    if (!connectionString) throw new Error('Nenhuma connection string disponível');

    const pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 1,
      connectionTimeoutMillis: 5000,
    });
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as agora');
    client.release();
    await pool.end();
    db_status = 'CONECTADO — ' + result.rows[0].agora;
  } catch (e) {
    db_status = 'FALHOU';
    db_erro = e.message;
  }

  return res.status(200).json({ ...info, db_status, db_erro });
}
