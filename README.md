# Biscoitech · Sistema de Feedback

App de avaliação de desempenho para a equipe de tecnologia e digital da Biscoitech.
Construído com Next.js + Vercel Postgres.

---

## Deploy na Vercel — passo a passo

### 1. Criar conta na Vercel
Acesse [vercel.com](https://vercel.com) e crie uma conta gratuita (pode usar o login do GitHub).

### 2. Instalar a Vercel CLI (opcional, mas recomendado)
```bash
npm install -g vercel
```

### 3. Fazer upload do projeto

**Opção A — Via GitHub (recomendado)**
1. Crie um repositório no GitHub e suba os arquivos
2. Na Vercel, clique em "Add New Project"
3. Conecte ao repositório e clique em "Deploy"

**Opção B — Via CLI**
```bash
cd biscoitech-feedback
npm install
vercel
```

### 4. Criar o banco de dados Vercel Postgres
1. No painel da Vercel, acesse seu projeto
2. Vá em **Storage** → **Create Database** → **Postgres**
3. Dê o nome `biscoitech-db` e clique em **Create**
4. Clique em **Connect to Project** para vincular ao seu projeto
5. As variáveis de ambiente do banco serão adicionadas automaticamente

### 5. Criar a tabela no banco
Após o banco estar conectado, vá em **Storage → biscoitech-db → Query** e execute:

```sql
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
```

### 6. Configurar variáveis de ambiente (opcional)
Por padrão os PINs são `1234` (colaborador) e `9999` (gestor).
Para alterar, adicione no painel da Vercel em **Settings → Environment Variables**:

```
NEXT_PUBLIC_PIN_COLABORADOR=seu_pin_colaborador
NEXT_PUBLIC_PIN_GESTOR=seu_pin_gestor
```

### 7. Fazer redeploy
Após adicionar variáveis de ambiente, vá em **Deployments** → clique nos 3 pontos do último deploy → **Redeploy**.

---

## Estrutura do projeto

```
biscoitech-feedback/
├── pages/
│   ├── index.js          # Tela inicial — seleção de perfil
│   ├── colaborador.js    # Formulário de autoavaliação (4 etapas)
│   ├── gestor.js         # Painel do gestor com todas as avaliações
│   └── api/
│       └── avaliacoes/
│           ├── index.js  # POST (enviar) e GET (listar)
│           └── [id].js   # GET por ID
├── components/
│   └── Icons.js          # SVGs dos ícones
├── lib/
│   └── db.js             # Funções de acesso ao banco
├── styles/
│   ├── globals.css       # Design tokens e reset
│   ├── Home.module.css
│   ├── Colaborador.module.css
│   └── Gestor.module.css
└── README.md
```

## Desenvolvimento local

```bash
npm install
# Crie um arquivo .env.local com as variáveis do banco (copie de .env.example)
npm run dev
# Acesse http://localhost:3000
```

## Credenciais padrão

| Perfil       | Código |
|--------------|--------|
| Colaborador  | 1234   |
| Gestor       | 9999   |

**Importante:** Altere os PINs antes de usar em produção via variáveis de ambiente.
