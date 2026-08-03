import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IconArrowLeft, IconArrowRight, IconCheck, IconUser, IconLock } from '../components/Icons';
import styles from '../styles/Colaborador.module.css';

import { COMPETENCIAS_COLABORADOR as COMPETENCIAS } from '../lib/competencias';

import { NOTAS_DESCRICAO as NOTAS_LBL } from '../lib/competencias';

const AREAS = [
  'IA', 'Performance', 'Processos', 'E-commerce', 'Venda Digital',
  'Loja', 'CRM', 'Suporte (TI)', 'Cadastro de Produtos', 'BI',
  'Desenvolvimento de Sistemas', 'Desenvolvimento Humano', 'Expansão de Franquias',
];

const PIN_CORRETO = process.env.NEXT_PUBLIC_PIN_COLABORADOR || '1234';

export default function Colaborador() {
  const router = useRouter();
  const [etapa, setEtapa] = useState('pin'); // pin | form | sucesso
  const [step, setStep] = useState(1);
  const [pinDigits, setPinDigits] = useState(['', '', '', '']);
  const [pinErro, setPinErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState('');
  const [nomeEnviado, setNomeEnviado] = useState('');

  const pinRefs = [useRef(), useRef(), useRef(), useRef()];

  const [form, setForm] = useState({
    nome: '', cargo: '', area: '', periodo: '',
    nota_atitude: 0, nota_comprometimento: 0, nota_pontualidade: 0,
    nota_conhecimento: 0, nota_comportamento: 0,
    obs_atitude: '', obs_comprometimento: '', obs_pontualidade: '',
    obs_conhecimento: '', obs_comportamento: '',
    reflexao_bem: '', reflexao_melhor: '', reflexao_apoio: '', reflexao_meta: '',
    satisfacao_ambiente: '', satisfacao_crescimento: '', mensagem_livre: '',
  });

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

  function verificarPin() {
    const pin = pinDigits.join('');
    if (pin === PIN_CORRETO) {
      setPinErro('');
      setEtapa('form');
    } else {
      setPinErro('Código incorreto. Solicite ao seu gestor.');
      setPinDigits(['', '', '', '']);
      pinRefs[0].current?.focus();
    }
  }

  function setNota(comp, val) {
    setForm(f => ({ ...f, [`nota_${comp}`]: val }));
  }

  function setObs(comp, val) {
    setForm(f => ({ ...f, [`obs_${comp}`]: val }));
  }

  function setField(key, val) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function goStep(n) {
    setStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function enviar() {
    if (!form.nome.trim()) { setErroEnvio('Preencha seu nome antes de enviar.'); return; }
    setEnviando(true);
    setErroEnvio('');
    try {
      const res = await fetch('/api/avaliacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || 'Erro desconhecido');
      sessionStorage.setItem('resultado_colaborador', JSON.stringify({
        nome: form.nome, cargo: form.cargo, area: form.area, periodo: form.periodo,
        notas: {
          atitude: form.nota_atitude, comprometimento: form.nota_comprometimento,
          pontualidade: form.nota_pontualidade, conhecimento: form.nota_conhecimento,
          comportamento: form.nota_comportamento, colaboracao: form.nota_colaboracao,
          adaptabilidade: form.nota_adaptabilidade,
        },
      }));
      router.push('/resultado');
    } catch (e) {
      setErroEnvio(e.message);
    } finally {
      setEnviando(false);
    }
  }

  const progresso = step === 1 ? 25 : step === 2 ? 50 : step === 3 ? 75 : 100;
  const stepLabels = ['Identificação', 'Competências', 'Reflexão', 'Satisfação'];

  if (etapa === 'pin') return (
    <div className={styles.page}>
      <div className={styles.pinCard}>
        <button className={styles.back} onClick={() => router.push('/')}>
          <IconArrowLeft size={16} /> Início
        </button>
        <div className={styles.pinIconWrap}>
          <IconUser size={24} color="var(--green)" />
        </div>
        <h2 className={styles.pinTitle}>Acesso do colaborador</h2>
        <p className={styles.pinSub}>Digite o código de 4 dígitos fornecido pelo seu gestor</p>
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
        <button className={styles.btnPrimary} onClick={verificarPin}>
          Entrar
        </button>
        <p className={styles.pinHint}>Código padrão: <strong>1234</strong></p>
      </div>
    </div>
  );

  if (etapa === 'sucesso') return (
    <div className={styles.page}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}>
          <IconCheck size={28} color="var(--green)" />
        </div>
        <h2 className={styles.successTitle}>Avaliação enviada</h2>
        <p className={styles.successSub}>
          Obrigado, <strong>{nomeEnviado}</strong>. Suas respostas foram salvas com sucesso.
          Seu gestor vai analisar e agendar a conversa de feedback em breve.
        </p>
        <button className={styles.btnOutline} onClick={() => router.push('/')}>
          Voltar ao início
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.formCard}>
        {/* Header */}
        <div className={styles.formHeader}>
          <button className={styles.back} onClick={() => router.push('/')}>
            <IconArrowLeft size={16} /> Sair
          </button>
          <span className={styles.tag}>Autoavaliação</span>
        </div>

        {/* Progresso */}
        <div className={styles.progress}>
          <div className={styles.progressInfo}>
            <span>{stepLabels[step - 1]}</span>
            <span>{progresso}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressBar} style={{ width: `${progresso}%` }} />
          </div>
          <div className={styles.stepDots}>
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`${styles.dot} ${s <= step ? styles.dotActive : ''}`} />
            ))}
          </div>
        </div>

        {/* Step 1 — Identificação */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Quem é você?</h3>
            <p className={styles.stepSub}>Preencha suas informações antes de começar.</p>

            <div className={styles.field}>
              <label>Nome completo</label>
              <input type="text" value={form.nome} onChange={e => setField('nome', e.target.value)} placeholder="Seu nome" />
            </div>
            <div className={styles.twoCol}>
              <div className={styles.field}>
                <label>Cargo</label>
                <input type="text" value={form.cargo} onChange={e => setField('cargo', e.target.value)} placeholder="Ex: Analista de CRM" />
              </div>
              <div className={styles.field}>
                <label>Área</label>
                <select value={form.area} onChange={e => setField('area', e.target.value)}>
                  <option value="">Selecione...</option>
                  {AREAS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
            </div>
            <div className={styles.field}>
              <label>Período de avaliação</label>
              <input type="text" value={form.periodo} onChange={e => setField('periodo', e.target.value)} placeholder="Ex: Janeiro – Junho 2025" />
            </div>

            <div className={styles.btnRow}>
              <div />
              <button className={styles.btnPrimary} onClick={() => goStep(2)}>
                Próximo <IconArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Competências */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Como você se avalia?</h3>
            <p className={styles.stepSub}>Marque de 1 a 5 em cada competência. 1 = preciso melhorar muito · 5 = referência na equipe.</p>

            {COMPETENCIAS.map((c, idx) => (
              <div key={c.id} className={styles.compCard}>
                <div className={styles.compHeader}>
                  <div>
                    <div className={styles.compNome}>{c.nome}</div>
                    <div className={styles.compDesc}>{c.desc}</div>
                  </div>
                  {form[`nota_${c.id}`] > 0 && (
                    <div className={styles.notaBadge}>{form[`nota_${c.id}`]}</div>
                  )}
                </div>
                <div className={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      className={`${styles.starBtn} ${form[`nota_${c.id}`] >= n ? styles.starSel : ''}`}
                      onClick={() => setNota(c.id, n)}
                      title={NOTAS_LBL[n]}
                    >
                      {n}
                    </button>
                  ))}
                  {form[`nota_${c.id}`] > 0 && (
                    <span className={styles.notaLabel}>{NOTAS_LBL[form[`nota_${c.id}`]]}</span>
                  )}
                </div>
                <div className={styles.obsWrap}>
                  <input
                    type="text"
                    placeholder="Comentário opcional..."
                    value={form[`obs_${c.id}`]}
                    onChange={e => setObs(c.id, e.target.value)}
                  />
                </div>
              </div>
            ))}

            <div className={styles.btnRow}>
              <button className={styles.btnOutline} onClick={() => goStep(1)}>
                <IconArrowLeft size={16} /> Anterior
              </button>
              <button className={styles.btnPrimary} onClick={() => goStep(3)}>
                Próximo <IconArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Reflexão */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Reflexão pessoal</h3>
            <p className={styles.stepSub}>Responda com sinceridade. Não há resposta certa ou errada.</p>

            <div className={styles.field}>
              <label>O que você fez bem neste período?</label>
              <textarea value={form.reflexao_bem} onChange={e => setField('reflexao_bem', e.target.value)} placeholder="Suas principais conquistas, entregas e pontos fortes..." rows={3} />
            </div>
            <div className={styles.field}>
              <label>O que poderia ter feito melhor?</label>
              <textarea value={form.reflexao_melhor} onChange={e => setField('reflexao_melhor', e.target.value)} placeholder="Seja honesto — isso é o que vai te fazer crescer..." rows={3} />
            </div>
            <div className={styles.field}>
              <label>Que apoio você precisa do gestor ou da empresa?</label>
              <textarea value={form.reflexao_apoio} onChange={e => setField('reflexao_apoio', e.target.value)} placeholder="Treinamentos, ferramentas, mais feedback..." rows={3} />
            </div>
            <div className={styles.field}>
              <label>Qual é seu principal objetivo para o próximo período?</label>
              <textarea value={form.reflexao_meta} onChange={e => setField('reflexao_meta', e.target.value)} placeholder="Uma meta clara e mensurável..." rows={3} />
            </div>

            <div className={styles.btnRow}>
              <button className={styles.btnOutline} onClick={() => goStep(2)}>
                <IconArrowLeft size={16} /> Anterior
              </button>
              <button className={styles.btnPrimary} onClick={() => goStep(4)}>
                Próximo <IconArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Satisfação */}
        {step === 4 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Satisfação geral</h3>
            <p className={styles.stepSub}>Como você se sente no trabalho atualmente?</p>

            <div className={styles.field}>
              <label>Como você avalia seu ambiente de trabalho?</label>
              <div className={styles.optGroup}>
                {['Muito bom', 'Bom', 'Regular', 'Ruim'].map(op => (
                  <button
                    key={op}
                    className={`${styles.optBtn} ${form.satisfacao_ambiente === op ? styles.optSel : ''}`}
                    onClick={() => setField('satisfacao_ambiente', op)}
                  >{op}</button>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label>Como você se sente em relação ao seu crescimento?</label>
              <div className={styles.optGroup}>
                {['Muito satisfeito', 'Satisfeito', 'Neutro', 'Insatisfeito'].map(op => (
                  <button
                    key={op}
                    className={`${styles.optBtn} ${form.satisfacao_crescimento === op ? styles.optSel : ''}`}
                    onClick={() => setField('satisfacao_crescimento', op)}
                  >{op}</button>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label>Mensagem livre para o gestor <span className={styles.optional}>(opcional)</span></label>
              <textarea value={form.mensagem_livre} onChange={e => setField('mensagem_livre', e.target.value)} placeholder="Algo que queira compartilhar..." rows={3} />
            </div>

            {erroEnvio && <p className={styles.erro}>{erroEnvio}</p>}

            <div className={styles.btnRow}>
              <button className={styles.btnOutline} onClick={() => goStep(3)}>
                <IconArrowLeft size={16} /> Anterior
              </button>
              <button className={styles.btnGreen} onClick={enviar} disabled={enviando}>
                {enviando ? 'Enviando...' : <><IconCheck size={16} /> Enviar avaliação</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
