import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { IconArrowLeft, IconShield, IconInbox, IconEye, IconCalendar, IconLogout, IconUser } from '../components/Icons';
import styles from '../styles/Gestor.module.css';

const COMPETENCIAS = [
  { id: 'atitude', nome: 'Atitude' },
  { id: 'comprometimento', nome: 'Comprometimento' },
  { id: 'pontualidade', nome: 'Pontualidade' },
  { id: 'conhecimento', nome: 'Conhecimento' },
  { id: 'comportamento', nome: 'Comportamento' },
  { id: 'colaboracao', nome: 'Colaboração' },
  { id: 'adaptabilidade', nome: 'Adaptabilidade' },
];

const COMP_GESTOR = [
  { id: 'direcao', nome: 'Direcionamento' },
  { id: 'desenvolvimento', nome: 'Desenvolvimento' },
  { id: 'feedback', nome: 'Feedback' },
  { id: 'acessibilidade', nome: 'Acessibilidade' },
  { id: 'gestao_recursos', nome: 'Gestão' },
  { id: 'inspiracao', nome: 'Inspiração' },
];

const NOTAS_LBL = ['', 'Preciso melhorar', 'Abaixo do esperado', 'Dentro do esperado', 'Acima do esperado', 'Referência'];
const NOTAS_LBL_G = ['', 'Ausente', 'Precisa desenvolver', 'Atende o esperado', 'Acima do esperado', 'Referência'];
const PIN_CORRETO = process.env.NEXT_PUBLIC_PIN_GESTOR || '9999';

function media(notas, comps) {
  const vals = comps.map(c => notas[`nota_${c.id}`] || 0).filter(v => v > 0);
  return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null;
}

function corMedia(m) {
  const v = parseFloat(m);
  return v >= 4 ? styles.mediaGreen : v >= 3 ? styles.mediaAmber : styles.mediaRed;
}

function iniciais(nome) {
  return (nome || '').split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('');
}

export default function Gestor() {
  const router = useRouter();
  const [etapa, setEtapa] = useState('pin');
  const [pinDigits, setPinDigits] = useState(['', '', '', '']);
  const [pinErro, setPinErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [aba, setAba] = useState('colaboradores'); // 'colaboradores' | 'minha-avaliacao'
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [avaliacoesGestor, setAvaliacoesGestor] = useState([]);
  const [selecionada, setSelecionada] = useState(null);
  const [tipoDetalhe, setTipoDetalhe] = useState(null);
  const pinRefs = [useRef(), useRef(), useRef(), useRef()];

  function handlePinChange(idx, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...pinDigits]; next[idx] = val; setPinDigits(next);
    if (val && idx < 3) pinRefs[idx + 1].current?.focus();
  }

  function handlePinKeyDown(idx, e) {
    if (e.key === 'Backspace' && !pinDigits[idx] && idx > 0) pinRefs[idx - 1].current?.focus();
  }

  async function verificarPin() {
    const pin = pinDigits.join('');
    if (pin !== PIN_CORRETO) {
      setPinErro('Senha incorreta.');
      setPinDigits(['', '', '', '']);
      pinRefs[0].current?.focus();
      return;
    }
    setPinErro('');
    setCarregando(true);
    try {
      const [r1, r2] = await Promise.all([
        fetch('/api/avaliacoes', { headers: { 'x-pin': pin } }),
        fetch('/api/avaliacoes-gestor', { headers: { 'x-pin': pin } }),
      ]);
      const d1 = await r1.json();
      const d2 = await r2.json();
      setAvaliacoes(d1.avaliacoes || []);
      setAvaliacoesGestor(d2.avaliacoes || []);
      setEtapa('painel');
    } catch (e) {
      setPinErro('Erro ao carregar. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  function verDetalhe(av, tipo) {
    setSelecionada(av);
    setTipoDetalhe(tipo);
    setEtapa('detalhe');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function sair() { setEtapa('pin'); setPinDigits(['', '', '', '']); }

  const mediaGeralColab = avaliacoes.length
    ? (avaliacoes.reduce((acc, av) => {
        const m = media(av, COMPETENCIAS);
        return m ? acc + parseFloat(m) : acc;
      }, 0) / avaliacoes.filter(av => media(av, COMPETENCIAS)).length).toFixed(1)
    : null;

  const mediaGeralGestor = avaliacoesGestor.length
    ? (avaliacoesGestor.reduce((acc, av) => {
        const m = media(av, COMP_GESTOR);
        return m ? acc + parseFloat(m) : acc;
      }, 0) / avaliacoesGestor.filter(av => media(av, COMP_GESTOR)).length).toFixed(1)
    : null;

  // ─── PIN ───
  if (etapa === 'pin') return (
    <div className={styles.page}>
      <div className={styles.pinCard}>
        <button className={styles.back} onClick={() => router.push('/')}>← Início</button>
        <div className={styles.pinIconWrap}><IconShield size={24} color="var(--brand-mid)" /></div>
        <h2 className={styles.pinTitle}>Acesso do gestor</h2>
        <p className={styles.pinSub}>Digite sua senha para acessar o painel</p>
        <div className={styles.pinRow}>
          {[0, 1, 2, 3].map(i => (
            <input key={i} ref={pinRefs[i]} className={styles.pinInput} type="password" maxLength={1}
              inputMode="numeric" value={pinDigits[i]}
              onChange={e => handlePinChange(i, e.target.value)}
              onKeyDown={e => handlePinKeyDown(i, e)} />
          ))}
        </div>
        {pinErro && <p className={styles.erro}>{pinErro}</p>}
        <button className={styles.btnPrimary} onClick={verificarPin} disabled={carregando}>
          {carregando ? 'Carregando...' : 'Entrar'}
        </button>
        <p className={styles.pinHint}>Senha padrão: <strong>9999</strong></p>
      </div>
    </div>
  );

  // ─── PAINEL ───
  if (etapa === 'painel') return (
    <div className={styles.page}>
      <div className={styles.painelWrap}>
        <div className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <div className={styles.logoDot} />
            <span className={styles.logoText}>Biscoitech</span>
            <span className={styles.tagGestor}>Gestor</span>
          </div>
          <button className={styles.btnLogout} onClick={sair}><IconLogout size={15} /> Sair</button>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statNum}>{avaliacoes.length}</div>
            <div className={styles.statLabel}>Autoavaliações recebidas</div>
          </div>
          {mediaGeralColab && (
            <div className={styles.statCard}>
              <div className={`${styles.statNum} ${corMedia(mediaGeralColab)}`}>{mediaGeralColab}</div>
              <div className={styles.statLabel}>Média geral da equipe</div>
            </div>
          )}
          <div className={styles.statCard}>
            <div className={styles.statNum}>{avaliacoesGestor.length}</div>
            <div className={styles.statLabel}>Avaliações de liderança</div>
          </div>
          {mediaGeralGestor && (
            <div className={styles.statCard}>
              <div className={`${styles.statNum} ${corMedia(mediaGeralGestor)}`}>{mediaGeralGestor}</div>
              <div className={styles.statLabel}>Sua média como gestor</div>
            </div>
          )}
        </div>

        {/* Abas */}
        <div className={styles.abas}>
          <button className={`${styles.aba} ${aba === 'colaboradores' ? styles.abaAtiva : ''}`} onClick={() => setAba('colaboradores')}>
            <IconUser size={15} /> Autoavaliações da equipe
          </button>
          <button className={`${styles.aba} ${aba === 'minha-avaliacao' ? styles.abaAtiva : ''}`} onClick={() => setAba('minha-avaliacao')}>
            <IconShield size={15} /> Minha avaliação como gestor
            {avaliacoesGestor.length > 0 && <span className={styles.badge}>{avaliacoesGestor.length}</span>}
          </button>
        </div>

        {/* Aba colaboradores */}
        {aba === 'colaboradores' && (
          <div className={styles.lista}>
            {avaliacoes.length === 0 ? (
              <div className={styles.emptyState}>
                <IconInbox size={36} color="var(--ink-3)" />
                <p className={styles.emptyTitle}>Nenhuma autoavaliação ainda</p>
                <p className={styles.emptySub}>Compartilhe o link com seus colaboradores e peça que acessem com o código <strong>1234</strong>.</p>
              </div>
            ) : avaliacoes.map(av => {
              const med = media(av, COMPETENCIAS);
              return (
                <div key={av.id} className={styles.respCard}>
                  <div className={styles.respHeader}>
                    <div className={styles.avatar}>{iniciais(av.nome)}</div>
                    <div className={styles.respInfo}>
                      <div className={styles.respNome}>{av.nome}</div>
                      <div className={styles.respMeta}>
                        {av.cargo && <span>{av.cargo}</span>}
                        {av.area && <><span className={styles.dot2}>·</span><span>{av.area}</span></>}
                        {av.criado_em && <><span className={styles.dot2}>·</span><span><IconCalendar size={11} />{' '}{new Date(av.criado_em).toLocaleDateString('pt-BR')}</span></>}
                      </div>
                    </div>
                    {med && <div className={styles.mediaWrap}><div className={`${styles.mediaNum} ${corMedia(med)}`}>{med}</div><div className={styles.mediaLbl}>média</div></div>}
                  </div>
                  <div className={styles.notasGrid}>
                    {COMPETENCIAS.map(c => (
                      <div key={c.id} className={styles.notaItem}>
                        <div className={styles.notaBar}>
                          <div className={styles.notaBarFill} style={{ height: `${((av[`nota_${c.id}`] || 0) / 5) * 100}%`, background: av[`nota_${c.id}`] >= 4 ? 'var(--green)' : av[`nota_${c.id}`] >= 3 ? 'var(--amber)' : 'var(--brand)' }} />
                        </div>
                        <div className={styles.notaVal}>{av[`nota_${c.id}`] || '—'}</div>
                        <div className={styles.notaComp}>{c.nome.slice(0, 5)}.</div>
                      </div>
                    ))}
                  </div>
                  <button className={styles.btnVer} onClick={() => verDetalhe(av, 'colaborador')}><IconEye size={14} /> Ver avaliação completa</button>
                </div>
              );
            })}
          </div>
        )}

        {/* Aba minha avaliação como gestor */}
        {aba === 'minha-avaliacao' && (
          <div className={styles.lista}>
            {avaliacoesGestor.length === 0 ? (
              <div className={styles.emptyState}>
                <IconInbox size={36} color="var(--ink-3)" />
                <p className={styles.emptyTitle}>Nenhuma avaliação de liderança ainda</p>
                <p className={styles.emptySub}>Quando seus colaboradores avaliarem você, as respostas aparecerão aqui.</p>
              </div>
            ) : (
              <>
                {mediaGeralGestor && (
                  <div className={styles.mediaGestorBanner}>
                    <div>
                      <div className={styles.mediaGestorNum}>{mediaGeralGestor}</div>
                      <div className={styles.mediaGestorLabel}>sua média geral como gestor</div>
                    </div>
                    <div className={styles.mediaGestorSub}>
                      Baseado em {avaliacoesGestor.length} avaliação{avaliacoesGestor.length > 1 ? 'ões' : ''} da equipe
                    </div>
                  </div>
                )}
                {avaliacoesGestor.map(av => {
                  const med = media(av, COMP_GESTOR);
                  return (
                    <div key={av.id} className={styles.respCard}>
                      <div className={styles.respHeader}>
                        <div className={`${styles.avatar} ${styles.avatarGestor}`}>{iniciais(av.nome_colaborador)}</div>
                        <div className={styles.respInfo}>
                          <div className={styles.respNome}>{av.nome_colaborador}</div>
                          <div className={styles.respMeta}>
                            {av.cargo && <span>{av.cargo}</span>}
                            {av.area && <><span className={styles.dot2}>·</span><span>{av.area}</span></>}
                            {av.criado_em && <><span className={styles.dot2}>·</span><span>{new Date(av.criado_em).toLocaleDateString('pt-BR')}</span></>}
                          </div>
                        </div>
                        {med && <div className={styles.mediaWrap}><div className={`${styles.mediaNum} ${corMedia(med)}`}>{med}</div><div className={styles.mediaLbl}>média</div></div>}
                      </div>
                      <div className={styles.notasGrid}>
                        {COMP_GESTOR.map(c => (
                          <div key={c.id} className={styles.notaItem}>
                            <div className={styles.notaBar}>
                              <div className={styles.notaBarFill} style={{ height: `${((av[`nota_${c.id}`] || 0) / 5) * 100}%`, background: av[`nota_${c.id}`] >= 4 ? 'var(--green)' : av[`nota_${c.id}`] >= 3 ? 'var(--amber)' : 'var(--brand)' }} />
                            </div>
                            <div className={styles.notaVal}>{av[`nota_${c.id}`] || '—'}</div>
                            <div className={styles.notaComp}>{c.nome.slice(0, 5)}.</div>
                          </div>
                        ))}
                      </div>
                      <button className={styles.btnVer} onClick={() => verDetalhe(av, 'gestor')}><IconEye size={14} /> Ver avaliação completa</button>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // ─── DETALHE ───
  if (etapa === 'detalhe' && selecionada) {
    const av = selecionada;
    const isGestor = tipoDetalhe === 'gestor';
    const comps = isGestor ? COMP_GESTOR : COMPETENCIAS;
    const notasLbl = isGestor ? NOTAS_LBL_G : NOTAS_LBL;
    const med = media(av, comps);
    const nome = isGestor ? av.nome_colaborador : av.nome;

    return (
      <div className={styles.page}>
        <div className={styles.detalheWrap}>
          <div className={styles.topbar}>
            <button className={styles.back} onClick={() => setEtapa('painel')}>← Voltar</button>
            <span className={isGestor ? styles.tagGestorVerde : styles.tagGestor}>{isGestor ? 'Avaliação de liderança' : 'Autoavaliação'}</span>
          </div>

          <div className={styles.detalheHero}>
            <div className={isGestor ? `${styles.avatarLg} ${styles.avatarGestor}` : styles.avatarLg}>{iniciais(nome)}</div>
            <div>
              <div className={styles.detalheNome}>{nome}</div>
              <div className={styles.detalheMeta}>
                {isGestor ? `Avaliou: ${av.nome_gestor || 'gestor'} · ${av.area || ''} · ${av.periodo || ''}` : `${av.cargo || ''} · ${av.area || ''} · ${av.periodo || ''}`}
              </div>
            </div>
            {med && <div className={`${styles.mediaNumLg} ${corMedia(med)}`}>{med}</div>}
          </div>

          <div className={styles.secaoLabel}>Competências avaliadas</div>
          {comps.map(c => (
            <div key={c.id} className={styles.compRow}>
              <div className={styles.compRowInfo}>
                <span className={styles.compRowNome}>{c.nome}</span>
                {av[`obs_${c.id}`] && <span className={styles.compRowObs}>"{av[`obs_${c.id}`]}"</span>}
              </div>
              <div className={styles.compRowStars}>
                {[1,2,3,4,5].map(n => (
                  <div key={n} className={`${styles.starDot} ${(av[`nota_${c.id}`]||0)>=n?styles.starDotSel:''}`}>{n}</div>
                ))}
                <span className={styles.compRowLbl}>{notasLbl[av[`nota_${c.id}`]] || '—'}</span>
              </div>
            </div>
          ))}

          {isGestor ? (
            <>
              {av.pontos_fortes && (
                <><div className={styles.secaoLabel}>O que o gestor faz bem</div>
                <div className={styles.reflexaoBlock}><div className={styles.reflexaoTxt}>{av.pontos_fortes}</div></div></>
              )}
              {av.sugestoes && (
                <><div className={styles.secaoLabel}>Sugestões para o gestor</div>
                <div className={styles.reflexaoBlock}><div className={styles.reflexaoTxt}>{av.sugestoes}</div></div></>
              )}
              {av.mensagem_livre && (
                <><div className={styles.secaoLabel}>Mensagem direta</div>
                <div className={styles.reflexaoBlock}><div className={styles.reflexaoTxt} style={{fontStyle:'italic'}}>"{av.mensagem_livre}"</div></div></>
              )}
            </>
          ) : (
            <>
              {[['O que fez bem', av.reflexao_bem], ['O que melhoraria', av.reflexao_melhor], ['Apoio necessário', av.reflexao_apoio], ['Meta do próximo período', av.reflexao_meta]].filter(([,v])=>v).length > 0 && (
                <><div className={styles.secaoLabel}>Reflexão pessoal</div>
                {[['O que fez bem', av.reflexao_bem], ['O que melhoraria', av.reflexao_melhor], ['Apoio necessário', av.reflexao_apoio], ['Meta do próximo período', av.reflexao_meta]].filter(([,v])=>v).map(([lbl,val])=>(
                  <div key={lbl} className={styles.reflexaoBlock}><div className={styles.reflexaoLbl}>{lbl}</div><div className={styles.reflexaoTxt}>{val}</div></div>
                ))}</>
              )}
              {(av.satisfacao_ambiente || av.satisfacao_crescimento) && (
                <><div className={styles.secaoLabel}>Satisfação</div>
                <div className={styles.satGrid}>
                  {av.satisfacao_ambiente && <div className={styles.satCard}><div className={styles.satLbl}>Ambiente</div><div className={styles.satVal}>{av.satisfacao_ambiente}</div></div>}
                  {av.satisfacao_crescimento && <div className={styles.satCard}><div className={styles.satLbl}>Crescimento</div><div className={styles.satVal}>{av.satisfacao_crescimento}</div></div>}
                </div></>
              )}
              {av.mensagem_livre && (
                <div className={styles.reflexaoBlock}><div className={styles.reflexaoLbl}>Mensagem livre</div><div className={styles.reflexaoTxt} style={{fontStyle:'italic'}}>"{av.mensagem_livre}"</div></div>
              )}
            </>
          )}

          <div className={styles.detalheData}>
            Respondido em {new Date(av.criado_em).toLocaleDateString('pt-BR', { day:'2-digit', month:'long', year:'numeric' })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}