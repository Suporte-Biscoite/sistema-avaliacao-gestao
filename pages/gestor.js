import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  IconArrowLeft, IconShield, IconInbox, IconEye,
  IconCalendar, IconLogout, IconTrend
} from '../components/Icons';
import styles from '../styles/Gestor.module.css';

const COMPETENCIAS = [
  { id: 'atitude', nome: 'Atitude' },
  { id: 'comprometimento', nome: 'Comprometimento' },
  { id: 'pontualidade', nome: 'Pontualidade' },
  { id: 'conhecimento', nome: 'Conhecimento' },
  { id: 'comportamento', nome: 'Comportamento' },
];

const NOTAS_LBL = ['', 'Preciso melhorar', 'Abaixo do esperado', 'Dentro do esperado', 'Acima do esperado', 'Referência'];
const PIN_CORRETO = process.env.NEXT_PUBLIC_PIN_GESTOR || '9999';

function media(row) {
  const vals = COMPETENCIAS
    .map(c => row[`nota_${c.id}`])
    .filter(v => v > 0);
  if (!vals.length) return null;
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
}

function corMedia(m) {
  const v = parseFloat(m);
  if (v >= 4) return styles.mediaGreen;
  if (v >= 3) return styles.mediaAmber;
  return styles.mediaRed;
}

function iniciais(nome) {
  return nome.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join('');
}

export default function Gestor() {
  const router = useRouter();
  const [etapa, setEtapa] = useState('pin'); // pin | painel | detalhe
  const [pinDigits, setPinDigits] = useState(['', '', '', '']);
  const [pinErro, setPinErro] = useState('');
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [selecionada, setSelecionada] = useState(null);
  const pinRefs = [useRef(), useRef(), useRef(), useRef()];

  function handlePinChange(idx, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...pinDigits];
    next[idx] = val;
    setPinDigits(next);
    if (val && idx < 3) pinRefs[idx + 1].current?.focus();
  }

  function handlePinKeyDown(idx, e) {
    if (e.key === 'Backspace' && !pinDigits[idx] && idx > 0) {
      pinRefs[idx - 1].current?.focus();
    }
  }

  async function verificarPin() {
    const pin = pinDigits.join('');
    if (pin === PIN_CORRETO) {
      setPinErro('');
      setCarregando(true);
      try {
        const res = await fetch('/api/avaliacoes', {
          headers: { 'x-pin': pin }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.erro);
        setAvaliacoes(data.avaliacoes || []);
        setEtapa('painel');
      } catch (e) {
        setPinErro('Erro ao carregar avaliações. Tente novamente.');
      } finally {
        setCarregando(false);
      }
    } else {
      setPinErro('Senha incorreta.');
      setPinDigits(['', '', '', '']);
      pinRefs[0].current?.focus();
    }
  }

  function verDetalhe(av) {
    setSelecionada(av);
    setEtapa('detalhe');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function voltarPainel() {
    setSelecionada(null);
    setEtapa('painel');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const mediaGeral = avaliacoes.length
    ? (avaliacoes.reduce((acc, av) => {
        const m = media(av);
        return m ? acc + parseFloat(m) : acc;
      }, 0) / avaliacoes.filter(av => media(av)).length).toFixed(1)
    : null;

  /* ─── PIN ─── */
  if (etapa === 'pin') return (
    <div className={styles.page}>
      <div className={styles.pinCard}>
        <button className={styles.back} onClick={() => router.push('/')}>
          <IconArrowLeft size={16} /> Início
        </button>
        <div className={styles.pinIconWrap}>
          <IconShield size={24} color="var(--brand-mid)" />
        </div>
        <h2 className={styles.pinTitle}>Acesso do gestor</h2>
        <p className={styles.pinSub}>Digite sua senha para acessar o painel de avaliações</p>
        <div className={styles.pinRow}>
          {[0, 1, 2, 3].map(i => (
            <input
              key={i}
              ref={pinRefs[i]}
              className={styles.pinInput}
              type="password"
              maxLength={1}
              inputMode="numeric"
              value={pinDigits[i]}
              onChange={e => handlePinChange(i, e.target.value)}
              onKeyDown={e => handlePinKeyDown(i, e)}
            />
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

  /* ─── PAINEL ─── */
  if (etapa === 'painel') return (
    <div className={styles.page}>
      <div className={styles.painelWrap}>

        {/* Topbar */}
        <div className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <div className={styles.logoDot} />
            <span className={styles.logoText}>Biscoitech</span>
            <span className={styles.tagGestor}>Gestor</span>
          </div>
          <button className={styles.btnLogout} onClick={() => { setEtapa('pin'); setPinDigits(['','','','']); }}>
            <IconLogout size={15} /> Sair
          </button>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statNum}>{avaliacoes.length}</div>
            <div className={styles.statLabel}>Avaliações recebidas</div>
          </div>
          {mediaGeral && (
            <div className={styles.statCard}>
              <div className={`${styles.statNum} ${corMedia(mediaGeral)}`}>{mediaGeral}</div>
              <div className={styles.statLabel}>Média geral da equipe</div>
            </div>
          )}
          <div className={styles.statCard}>
            <div className={styles.statNum}>
              {new Set(avaliacoes.map(a => a.area).filter(Boolean)).size}
            </div>
            <div className={styles.statLabel}>Áreas representadas</div>
          </div>
        </div>

        {/* Lista */}
        <div className={styles.listaHeader}>
          <h2 className={styles.listaTitle}>Avaliações</h2>
        </div>

        {avaliacoes.length === 0 ? (
          <div className={styles.emptyState}>
            <IconInbox size={36} color="var(--ink-3)" />
            <p className={styles.emptyTitle}>Nenhuma avaliação ainda</p>
            <p className={styles.emptySub}>Compartilhe o link com seus colaboradores e peça que acessem com o código <strong>1234</strong>.</p>
          </div>
        ) : (
          <div className={styles.lista}>
            {avaliacoes.map(av => {
              const med = media(av);
              return (
                <div key={av.id} className={styles.respCard}>
                  <div className={styles.respHeader}>
                    <div className={styles.avatar}>
                      {iniciais(av.nome)}
                    </div>
                    <div className={styles.respInfo}>
                      <div className={styles.respNome}>{av.nome}</div>
                      <div className={styles.respMeta}>
                        {av.cargo && <span>{av.cargo}</span>}
                        {av.area && <><span className={styles.dot2}>·</span><span>{av.area}</span></>}
                        {av.criado_em && (
                          <><span className={styles.dot2}>·</span>
                          <span className={styles.dataChip}>
                            <IconCalendar size={11} />
                            {new Date(av.criado_em).toLocaleDateString('pt-BR')}
                          </span></>
                        )}
                      </div>
                    </div>
                    {med && (
                      <div className={styles.mediaWrap}>
                        <div className={`${styles.mediaNum} ${corMedia(med)}`}>{med}</div>
                        <div className={styles.mediaLbl}>média</div>
                      </div>
                    )}
                  </div>

                  {/* Mini gráfico de notas */}
                  <div className={styles.notasGrid}>
                    {COMPETENCIAS.map(c => (
                      <div key={c.id} className={styles.notaItem}>
                        <div className={styles.notaBar}>
                          <div
                            className={styles.notaBarFill}
                            style={{
                              height: `${((av[`nota_${c.id}`] || 0) / 5) * 100}%`,
                              background: av[`nota_${c.id}`] >= 4 ? 'var(--green)' :
                                          av[`nota_${c.id}`] >= 3 ? 'var(--amber)' : 'var(--brand)',
                            }}
                          />
                        </div>
                        <div className={styles.notaVal}>{av[`nota_${c.id}`] || '—'}</div>
                        <div className={styles.notaComp}>{c.nome.slice(0, 5)}.</div>
                      </div>
                    ))}
                  </div>

                  <button className={styles.btnVer} onClick={() => verDetalhe(av)}>
                    <IconEye size={14} /> Ver avaliação completa
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  /* ─── DETALHE ─── */
  if (etapa === 'detalhe' && selecionada) {
    const av = selecionada;
    const med = media(av);
    return (
      <div className={styles.page}>
        <div className={styles.detalheWrap}>
          <div className={styles.topbar}>
            <button className={styles.back} onClick={voltarPainel}>
              <IconArrowLeft size={16} /> Voltar
            </button>
            <span className={styles.tagGestor}>Detalhe</span>
          </div>

          {/* Cabeçalho do colaborador */}
          <div className={styles.detalheHero}>
            <div className={styles.avatarLg}>{iniciais(av.nome)}</div>
            <div>
              <div className={styles.detalheNome}>{av.nome}</div>
              <div className={styles.detalheMeta}>
                {av.cargo} {av.area && `· ${av.area}`} {av.periodo && `· ${av.periodo}`}
              </div>
            </div>
            {med && (
              <div className={`${styles.mediaNumLg} ${corMedia(med)}`}>{med}</div>
            )}
          </div>

          {/* Competências */}
          <div className={styles.secaoLabel}>Competências</div>
          {COMPETENCIAS.map(c => (
            <div key={c.id} className={styles.compRow}>
              <div className={styles.compRowInfo}>
                <span className={styles.compRowNome}>{c.nome}</span>
                {av[`obs_${c.id}`] && (
                  <span className={styles.compRowObs}>"{av[`obs_${c.id}`]}"</span>
                )}
              </div>
              <div className={styles.compRowStars}>
                {[1, 2, 3, 4, 5].map(n => (
                  <div
                    key={n}
                    className={`${styles.starDot} ${(av[`nota_${c.id}`] || 0) >= n ? styles.starDotSel : ''}`}
                  >{n}</div>
                ))}
                <span className={styles.compRowLbl}>{NOTAS_LBL[av[`nota_${c.id}`]] || '—'}</span>
              </div>
            </div>
          ))}

          {/* Reflexão */}
          {[
            ['O que fez bem', av.reflexao_bem],
            ['O que melhoraria', av.reflexao_melhor],
            ['Apoio necessário', av.reflexao_apoio],
            ['Meta do próximo período', av.reflexao_meta],
          ].filter(([, v]) => v).length > 0 && (
            <>
              <div className={styles.secaoLabel}>Reflexão pessoal</div>
              {[
                ['O que fez bem', av.reflexao_bem],
                ['O que melhoraria', av.reflexao_melhor],
                ['Apoio necessário', av.reflexao_apoio],
                ['Meta do próximo período', av.reflexao_meta],
              ].filter(([, v]) => v).map(([lbl, val]) => (
                <div key={lbl} className={styles.reflexaoBlock}>
                  <div className={styles.reflexaoLbl}>{lbl}</div>
                  <div className={styles.reflexaoTxt}>{val}</div>
                </div>
              ))}
            </>
          )}

          {/* Satisfação */}
          {(av.satisfacao_ambiente || av.satisfacao_crescimento) && (
            <>
              <div className={styles.secaoLabel}>Satisfação</div>
              <div className={styles.satGrid}>
                {av.satisfacao_ambiente && (
                  <div className={styles.satCard}>
                    <div className={styles.satLbl}>Ambiente</div>
                    <div className={styles.satVal}>{av.satisfacao_ambiente}</div>
                  </div>
                )}
                {av.satisfacao_crescimento && (
                  <div className={styles.satCard}>
                    <div className={styles.satLbl}>Crescimento</div>
                    <div className={styles.satVal}>{av.satisfacao_crescimento}</div>
                  </div>
                )}
              </div>
            </>
          )}

          {av.mensagem_livre && (
            <div className={styles.msgLivre}>
              <div className={styles.reflexaoLbl}>Mensagem livre</div>
              <div className={styles.reflexaoTxt} style={{ fontStyle: 'italic' }}>"{av.mensagem_livre}"</div>
            </div>
          )}

          {/* Data */}
          <div className={styles.detalheData}>
            Respondido em {new Date(av.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
