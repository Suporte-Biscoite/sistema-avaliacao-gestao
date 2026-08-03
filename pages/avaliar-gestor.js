import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { COMPETENCIAS_GESTOR, NOTAS_DESCRICAO_GESTOR } from '../lib/competencias';
import { IconArrowLeft, IconArrowRight, IconCheck } from '../components/Icons';
import styles from '../styles/Colaborador.module.css';
import gStyles from '../styles/AvaliarGestor.module.css';

const AREAS = ['IA','Performance','Processos','E-commerce','Venda Digital','Loja','CRM','Suporte (TI)','Cadastro de Produtos','BI','Desenvolvimento de Sistemas','Desenvolvimento Humano','Expansão de Franquias'];
const PIN_CORRETO = process.env.NEXT_PUBLIC_PIN_COLABORADOR || '1234';

export default function AvaliarGestor() {
  const router = useRouter();
  const [etapa, setEtapa] = useState('pin');
  const [step, setStep] = useState(1);
  const [pinDigits, setPinDigits] = useState(['','','','']);
  const [pinErro, setPinErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState('');
  const pinRefs = [useRef(), useRef(), useRef(), useRef()];

  const [form, setForm] = useState({
    nomeColaborador: '', cargo: '', area: '', periodo: '',
    nomeGestor: '',
    nota_direcao: 0, nota_desenvolvimento: 0, nota_feedback: 0,
    nota_acessibilidade: 0, nota_gestao_recursos: 0, nota_inspiracao: 0,
    obs_direcao:'', obs_desenvolvimento:'', obs_feedback:'',
    obs_acessibilidade:'', obs_gestao_recursos:'', obs_inspiracao:'',
    pontos_fortes: '', sugestoes: '', mensagem_livre: '',
  });

  function handlePinChange(idx, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...pinDigits]; next[idx] = val; setPinDigits(next);
    if (val && idx < 3) pinRefs[idx+1].current?.focus();
  }
  function handlePinKeyDown(idx, e) {
    if (e.key === 'Backspace' && !pinDigits[idx] && idx > 0) pinRefs[idx-1].current?.focus();
  }
  function verificarPin() {
    if (pinDigits.join('') === PIN_CORRETO) { setPinErro(''); setEtapa('form'); }
    else { setPinErro('Código incorreto.'); setPinDigits(['','','','']); pinRefs[0].current?.focus(); }
  }
  function setNota(id, val) { setForm(f => ({...f, [`nota_${id}`]: val})); }
  function setObs(id, val) { setForm(f => ({...f, [`obs_${id}`]: val})); }
  function setField(k, v) { setForm(f => ({...f, [k]: v})); }
  function goStep(n) { setStep(n); window.scrollTo({top:0, behavior:'smooth'}); }

  async function enviar() {
    if (!form.nomeColaborador.trim()) { setErroEnvio('Preencha seu nome.'); return; }
    setEnviando(true); setErroEnvio('');
    try {
      const res = await fetch('/api/avaliacoes-gestor', {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.erro || 'Erro');
      sessionStorage.setItem('resultado_gestor', JSON.stringify({
        nomeGestor: form.nomeGestor,
        nomeColaborador: form.nomeColaborador,
        periodo: form.periodo,
        notas: {
          direcao: form.nota_direcao, desenvolvimento: form.nota_desenvolvimento,
          feedback: form.nota_feedback, acessibilidade: form.nota_acessibilidade,
          gestao_recursos: form.nota_gestao_recursos, inspiracao: form.nota_inspiracao,
        },
      }));
      router.push('/resultado-gestor');
    } catch(e) { setErroEnvio(e.message); }
    finally { setEnviando(false); }
  }

  const progresso = step === 1 ? 33 : step === 2 ? 66 : 100;
  const stepLabels = ['Identificação', 'Avaliação da liderança', 'Reflexão e envio'];

  if (etapa === 'pin') return (
    <div className={styles.page}>
      <div className={styles.pinCard}>
        <button className={styles.back} onClick={() => router.push('/')}>← Início</button>
        <div className={gStyles.pinIconGestor}><span style={{fontSize:24}}>★</span></div>
        <h2 className={styles.pinTitle}>Avaliar meu gestor</h2>
        <p className={styles.pinSub}>Use o mesmo código de acesso do colaborador</p>
        <div className={styles.pinRow}>
          {[0,1,2,3].map(i => (
            <input key={i} ref={pinRefs[i]} className={styles.pinInput} type="password" maxLength={1} inputMode="numeric"
              value={pinDigits[i]} onChange={e => handlePinChange(i, e.target.value)} onKeyDown={e => handlePinKeyDown(i, e)} />
          ))}
        </div>
        {pinErro && <p className={styles.erro}>{pinErro}</p>}
        <button className={styles.btnGreen} onClick={verificarPin} style={{maxWidth:200, margin:'0 auto'}}>Entrar</button>
        <p className={styles.pinHint}>Código padrão: <strong>1234</strong></p>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <button className={styles.back} onClick={() => router.push('/')}>← Sair</button>
          <span className={gStyles.tagGestor}>Avaliação do gestor</span>
        </div>
        <div className={styles.progress}>
          <div className={styles.progressInfo}><span>{stepLabels[step-1]}</span><span>{progresso}%</span></div>
          <div className={styles.progressTrack}><div className={`${styles.progressBar} ${gStyles.progressGreen}`} style={{width:`${progresso}%`}} /></div>
          <div className={styles.stepDots}>{[1,2,3].map(s=><div key={s} className={`${styles.dot} ${s<=step?styles.dotActive:''}`}/>)}</div>
        </div>

        {step === 1 && (
          <div>
            <h3 className={styles.stepTitle}>Sobre você e seu gestor</h3>
            <p className={styles.stepSub}>Esta avaliação é confidencial e será usada para o desenvolvimento da liderança.</p>
            <div className={styles.field}><label>Seu nome</label><input type="text" value={form.nomeColaborador} onChange={e=>setField('nomeColaborador',e.target.value)} placeholder="Seu nome completo" /></div>
            <div className={styles.twoCol}>
              <div className={styles.field}><label>Cargo</label><input type="text" value={form.cargo} onChange={e=>setField('cargo',e.target.value)} placeholder="Ex: Analista" /></div>
              <div className={styles.field}><label>Área</label><select value={form.area} onChange={e=>setField('area',e.target.value)}><option value="">Selecione...</option>{AREAS.map(a=><option key={a}>{a}</option>)}</select></div>
            </div>
            <div className={styles.twoCol}>
              <div className={styles.field}><label>Nome do seu gestor</label><input type="text" value={form.nomeGestor} onChange={e=>setField('nomeGestor',e.target.value)} placeholder="Nome do gestor" /></div>
              <div className={styles.field}><label>Período avaliado</label><input type="text" value={form.periodo} onChange={e=>setField('periodo',e.target.value)} placeholder="Ex: Jan – Jun 2025" /></div>
            </div>
            <div className={styles.btnRow} style={{justifyContent:'flex-end'}}>
              <button className={styles.btnGreen} onClick={()=>goStep(2)}>Próximo <IconArrowRight size={16}/></button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className={styles.stepTitle}>Como você avalia a liderança?</h3>
            <p className={styles.stepSub}>Avalie de 1 a 5 cada dimensão da liderança do seu gestor. Seja honesto — isso ajuda no crescimento dele.</p>
            {COMPETENCIAS_GESTOR.map(c => (
              <div key={c.id} className={styles.compCard}>
                <div className={styles.compHeader}>
                  <div><div className={styles.compNome}>{c.nome}</div><div className={styles.compDesc}>{c.desc}</div></div>
                  {form[`nota_${c.id}`] > 0 && <div className={gStyles.notaBadgeGestor}>{form[`nota_${c.id}`]}</div>}
                </div>
                <div className={styles.starsRow}>
                  {[1,2,3,4,5].map(n=>(
                    <button key={n} className={`${styles.starBtn} ${form[`nota_${c.id}`]>=n?gStyles.starSelGreen:''}`}
                      onClick={()=>setNota(c.id,n)} title={NOTAS_DESCRICAO_GESTOR[n]}>{n}</button>
                  ))}
                  {form[`nota_${c.id}`]>0 && <span className={styles.notaLabel}>{NOTAS_DESCRICAO_GESTOR[form[`nota_${c.id}`]]}</span>}
                </div>
                <div className={styles.obsWrap}>
                  <input type="text" placeholder="Comentário opcional..." value={form[`obs_${c.id}`]} onChange={e=>setObs(c.id,e.target.value)} />
                </div>
              </div>
            ))}
            <div className={styles.btnRow}>
              <button className={styles.btnOutline} onClick={()=>goStep(1)}><IconArrowLeft size={16}/> Anterior</button>
              <button className={styles.btnGreen} onClick={()=>goStep(3)}>Próximo <IconArrowRight size={16}/></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className={styles.stepTitle}>Reflexão final</h3>
            <p className={styles.stepSub}>Suas respostas são confidenciais e ajudam diretamente no desenvolvimento da liderança.</p>
            <div className={styles.field}><label>O que seu gestor faz muito bem?</label><textarea rows={3} value={form.pontos_fortes} onChange={e=>setField('pontos_fortes',e.target.value)} placeholder="Descreva comportamentos concretos que você admira na liderança dele..." /></div>
            <div className={styles.field}><label>O que ele poderia fazer diferente para apoiar melhor o time?</label><textarea rows={3} value={form.sugestoes} onChange={e=>setField('sugestoes',e.target.value)} placeholder="Seja específico e construtivo..." /></div>
            <div className={styles.field}><label>Alguma mensagem direta para ele? <span className={styles.optional}>(opcional)</span></label><textarea rows={2} value={form.mensagem_livre} onChange={e=>setField('mensagem_livre',e.target.value)} placeholder="Algo que você nunca disse mas gostaria que ele soubesse..." /></div>
            {erroEnvio && <p className={styles.erro}>{erroEnvio}</p>}
            <div className={styles.btnRow}>
              <button className={styles.btnOutline} onClick={()=>goStep(2)}><IconArrowLeft size={16}/> Anterior</button>
              <button className={styles.btnGreen} onClick={enviar} disabled={enviando}>
                {enviando ? 'Enviando...' : <><IconCheck size={16}/> Enviar avaliação</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
