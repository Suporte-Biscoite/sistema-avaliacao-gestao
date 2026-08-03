// Definição central das competências — usada em todo o sistema

export const COMPETENCIAS_COLABORADOR = [
  {
    id: 'atitude',
    nome: 'Atitude',
    desc: 'Proatividade, iniciativa e postura diante dos desafios',
    framework: 'Lominger #28 Initiative · #51 Self-Development',
    indicadores: [
      'Toma iniciativa sem esperar ser solicitado',
      'Propõe soluções, não apenas aponta problemas',
      'Demonstra disposição para assumir novos desafios',
      'Mantém postura positiva mesmo sob pressão',
    ],
  },
  {
    id: 'comprometimento',
    nome: 'Comprometimento',
    desc: 'Responsabilidade com entregas, metas e com a equipe',
    framework: 'Lominger #43 Perseverance · #53 Drive for Results',
    indicadores: [
      'Entrega o que promete dentro do prazo',
      'Assume responsabilidade pelos próprios erros',
      'Vai além do mínimo quando necessário',
      'Mantém foco nas metas mesmo com distrações',
    ],
  },
  {
    id: 'pontualidade',
    nome: 'Pontualidade',
    desc: 'Respeito a horários, prazos e compromissos assumidos',
    framework: 'Lominger #47 Planning · #62 Time Management',
    indicadores: [
      'Cumpre horários de entrada, reuniões e prazos',
      'Avisa com antecedência quando não consegue cumprir',
      'Organiza suas tarefas com prioridade clara',
      'Respeita o tempo dos colegas e do gestor',
    ],
  },
  {
    id: 'conhecimento',
    nome: 'Conhecimento',
    desc: 'Domínio técnico e busca contínua por aprendizado',
    framework: 'Lominger #32 Learning Agility · #61 Technical Skills',
    indicadores: [
      'Domina as ferramentas e processos da sua função',
      'Busca aprender por conta própria',
      'Compartilha conhecimento com a equipe',
      'Aplica aprendizados para melhorar resultados',
    ],
  },
  {
    id: 'comportamento',
    nome: 'Comportamento',
    desc: 'Relacionamento interpessoal, ética e postura profissional',
    framework: 'Lominger #31 Interpersonal Savvy · #3 Approachability',
    indicadores: [
      'Trata colegas e líderes com respeito',
      'Comunica-se de forma clara e construtiva',
      'Age com ética e transparência',
      'Contribui para um ambiente de trabalho saudável',
    ],
  },
  {
    id: 'colaboracao',
    nome: 'Colaboração',
    desc: 'Trabalho em equipe, comunicação e apoio aos pares',
    framework: 'Lominger #42 Peer Relationships · #33 Listening',
    indicadores: [
      'Apoia colegas quando necessário',
      'Compartilha informações relevantes com a equipe',
      'Sabe receber e dar feedback de forma construtiva',
      'Contribui ativamente em projetos coletivos',
    ],
  },
  {
    id: 'adaptabilidade',
    nome: 'Adaptabilidade',
    desc: 'Resposta a mudanças, inovação e mentalidade de crescimento',
    framework: 'Lominger #2 Dealing with Ambiguity · #51 Self-Development',
    indicadores: [
      'Adapta-se a mudanças de prioridade com agilidade',
      'Sugere melhorias nos processos',
      'Mantém produtividade em situações incertas',
      'Experimenta novas formas de fazer as coisas',
    ],
  },
];

export const COMPETENCIAS_GESTOR = [
  {
    id: 'direcao',
    nome: 'Clareza de direcionamento',
    desc: 'Define metas claras e comunica expectativas',
    framework: 'LEA Directing · Situational Leadership Telling/Selling',
    indicadores: [
      'Define metas e objetivos de forma clara',
      'Comunica as expectativas com antecedência',
      'Conecta o trabalho da equipe à estratégia da empresa',
      'Prioriza e organiza as demandas do time',
    ],
  },
  {
    id: 'desenvolvimento',
    nome: 'Suporte e desenvolvimento',
    desc: 'Investe no crescimento profissional da equipe',
    framework: 'LEA Developing · Hersey-Blanchard Coaching',
    indicadores: [
      'Oferece oportunidades de aprendizado e crescimento',
      'Dedica tempo para desenvolver as pessoas',
      'Apoia na resolução de obstáculos',
      'Reconhece e valoriza o progresso individual',
    ],
  },
  {
    id: 'feedback',
    nome: 'Feedback e reconhecimento',
    desc: 'Qualidade e frequência do retorno dado à equipe',
    framework: 'LEA Feedback · 360° Feedback best practices',
    indicadores: [
      'Dá feedback de forma frequente e específica',
      'Reconhece conquistas e bom desempenho',
      'Aborda pontos de melhoria de forma respeitosa',
      'Cria um ambiente seguro para errar e aprender',
    ],
  },
  {
    id: 'acessibilidade',
    nome: 'Acessibilidade e confiança',
    desc: 'Presença, abertura e segurança psicológica',
    framework: 'Google Project Aristotle · Psychological Safety',
    indicadores: [
      'Está disponível quando o time precisa',
      'Ouve com atenção antes de responder',
      'Mantém o que promete',
      'Cria ambiente onde todos se sentem seguros para falar',
    ],
  },
  {
    id: 'gestao_recursos',
    nome: 'Gestão e organização',
    desc: 'Remove obstáculos e organiza bem os processos',
    framework: 'LEA Managing · PMI Leadership Competencies',
    indicadores: [
      'Remove impedimentos que bloqueiam a equipe',
      'Distribui o trabalho de forma justa e equilibrada',
      'Organiza reuniões e processos com eficiência',
      'Usa bem os recursos disponíveis',
    ],
  },
  {
    id: 'inspiracao',
    nome: 'Inspiração e propósito',
    desc: 'Conecta o trabalho ao todo e motiva a equipe',
    framework: 'Transformational Leadership · Simon Sinek Why',
    indicadores: [
      'Compartilha a visão e o propósito da empresa',
      'Motiva o time mesmo em momentos difíceis',
      'Age como exemplo dos valores da organização',
      'Celebra as conquistas coletivas',
    ],
  },
];

export const NOTAS_DESCRICAO = [
  '',
  'Precisa melhorar muito',
  'Abaixo do esperado',
  'Dentro do esperado',
  'Acima do esperado',
  'Referência na equipe',
];

export const NOTAS_DESCRICAO_GESTOR = [
  '',
  'Ausente nesta área',
  'Precisa desenvolver',
  'Atende o esperado',
  'Acima do esperado',
  'Referência em liderança',
];

// Gera descrição automática baseada nas notas
export function gerarDescricao(notas, tipo = 'colaborador') {
  const comps = tipo === 'gestor' ? COMPETENCIAS_GESTOR : COMPETENCIAS_COLABORADOR;
  const pares = comps.map(c => ({ ...c, nota: notas[c.id] || 0 })).filter(c => c.nota > 0);

  if (!pares.length) return null;

  const media = pares.reduce((s, c) => s + c.nota, 0) / pares.length;
  const fortes = pares.filter(c => c.nota >= 4).sort((a, b) => b.nota - a.nota);
  const melhorar = pares.filter(c => c.nota <= 2).sort((a, b) => a.nota - b.nota);
  const ok = pares.filter(c => c.nota === 3);

  let nivel, cor;
  if (media >= 4.5) { nivel = 'Excepcional'; cor = 'green'; }
  else if (media >= 4.0) { nivel = 'Acima do esperado'; cor = 'green'; }
  else if (media >= 3.0) { nivel = 'Dentro do esperado'; cor = 'amber'; }
  else if (media >= 2.0) { nivel = 'Abaixo do esperado'; cor = 'amber'; }
  else { nivel = 'Crítico — requer atenção imediata'; cor = 'red'; }

  const parecer = tipo === 'gestor'
    ? gerarParecer9BoxGestor(pares, media, fortes, melhorar)
    : gerarParecer9BoxColab(pares, media, fortes, melhorar);

  return { media: +media.toFixed(1), nivel, cor, fortes, melhorar, ok, parecer };
}

function gerarParecer9BoxColab(pares, media, fortes, melhorar) {
  const nomeFortes = fortes.map(c => c.nome.toLowerCase()).join(', ');
  const nomeMelhorar = melhorar.map(c => c.nome.toLowerCase()).join(', ');

  if (media >= 4.5) {
    return `Profissional de desempenho excepcional. Demonstra domínio consistente em todas as competências avaliadas${nomeFortes ? ', com destaque para ' + nomeFortes : ''}. É uma referência para a equipe e está pronto para assumir responsabilidades maiores ou atuar como multiplicador de conhecimento.`;
  }
  if (media >= 4.0) {
    return `Desempenho acima do esperado. Entrega com qualidade e consistência${nomeFortes ? ', especialmente em ' + nomeFortes : ''}. ${melhorar.length ? 'Há espaço para evoluir em ' + nomeMelhorar + ', o que pode elevar ainda mais seu impacto na equipe.' : 'Próximo passo é consolidar esse nível e ampliar sua influência positiva no time.'}`;
  }
  if (media >= 3.0) {
    return `Desempenho dentro do esperado para a função. ${fortes.length ? 'Apresenta pontos fortes em ' + nomeFortes + '.' : ''} ${melhorar.length ? 'Para avançar, é importante trabalhar o desenvolvimento em ' + nomeMelhorar + '.' : 'O desafio agora é consistência e busca de excelência.'} Um plano de desenvolvimento claro pode acelerar a evolução.`;
  }
  if (media >= 2.0) {
    return `Desempenho abaixo do esperado em boa parte das competências. ${melhorar.length ? 'As áreas que mais precisam de atenção são ' + nomeMelhorar + '.' : ''} É necessário um plano de ação estruturado com metas claras e acompanhamento próximo do gestor. ${fortes.length ? 'Os pontos fortes em ' + nomeFortes + ' podem ser usados como base para a recuperação.' : ''}`;
  }
  return `Situação crítica que requer intervenção imediata. O colaborador está significativamente abaixo do esperado na maioria das competências. É fundamental alinhar expectativas em uma conversa direta, definir um PDI com prazos concretos e estabelecer marcos de acompanhamento frequentes.`;
}

function gerarParecer9BoxGestor(pares, media, fortes, melhorar) {
  const nomeFortes = fortes.map(c => c.nome.toLowerCase()).join(', ');
  const nomeMelhorar = melhorar.map(c => c.nome.toLowerCase()).join(', ');

  if (media >= 4.5) {
    return `Liderança de alto impacto. A equipe percebe um gestor que inspira, desenvolve e cria as condições para que todos performem bem${nomeFortes ? ', com reconhecimento especial em ' + nomeFortes : ''}. Este é o perfil de liderança que retém talentos e multiplica resultados.`;
  }
  if (media >= 4.0) {
    return `Liderança eficaz e bem avaliada pelo time. ${nomeFortes ? 'O gestor se destaca em ' + nomeFortes + '.' : ''} ${melhorar.length ? 'Investir em ' + nomeMelhorar + ' pode elevar a percepção geral da liderança para o nível de excelência.' : 'O próximo passo é aprofundar as práticas que já funcionam bem.'}`;
  }
  if (media >= 3.0) {
    return `Liderança dentro do esperado. ${fortes.length ? 'A equipe valoriza especialmente ' + nomeFortes + '.' : ''} ${melhorar.length ? 'Os pontos que a equipe indica para desenvolvimento são ' + nomeMelhorar + ' — áreas que, quando fortalecidas, aumentam diretamente o engajamento e a entrega do time.' : ''} Uma escuta ativa das necessidades do time pode revelar oportunidades de melhoria valiosas.`;
  }
  return `A avaliação da equipe indica aspectos importantes de liderança que precisam de atenção. ${melhorar.length ? 'As áreas mais críticas são ' + nomeMelhorar + '.' : ''} Recomenda-se uma conversa aberta com o time para entender as expectativas e definir compromissos concretos de mudança.`;
}
