import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { COMPETENCIAS_GESTOR, NOTAS_DESCRICAO_GESTOR, gerarDescricao } from '../lib/competencias';
import styles from '../styles/Resultado.module.css';
import gStyles from '../styles/ResultadoGestor.module.css';

function loadChartJS(cb) {
  if (window.Chart) { cb(); return; }
  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
  s.onload = cb;
  document.head.appendChild(s);
}

export default function ResultadoGestor() {
  const router = useRouter();
  const radarRef = useRef(null);
  const barRef = useRef(null);
  const [dados, setDados] = useState(null);
  const [descricao, setDescricao] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('resultado_gestor');
    if (!raw) { router.push('/'); return; }
    const d = JSON.parse(raw);
    setDados(d);
    setDescricao(gerarDescricao(d.notas, 'gestor'));
  }, []);

  useEffect(() => {
    if (!dados || !descricao) return;
    loadChartJS(() => renderCharts());
  }, [dados, descricao]);

  function renderCharts() {
    const notas = COMPETENCIAS_GESTOR.map(c => dados.notas[c.id] || 0);
    const labels = COMPETENCIAS_GESTOR.map(c => c.nome);

    if (radarRef.current) {
      if (radarRef.current._chart) radarRef.current._chart.destroy();
      radarRef.current._chart = new window.Chart(radarRef.current, {
        type: 'radar',
        data: {
          labels,
          datasets: [{
            label: 'Avaliação da liderança',
            data: notas,
            backgroundColor: 'rgba(15,110,86,0.12)',
            borderColor: '#0F6E56',
            borderWidth: 2,
            pointBackgroundColor: '#0F6E56',
            pointRadius: 4,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              min: 0, max: 5,
              ticks: { stepSize: 1, display: false },
              pointLabels: { font: { size: 11, family: 'Inter' }, color: '#4A4844' },
              grid: { color: '#E4E2DA' },
              angleLines: { color: '#E4E2DA' },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => ` ${ctx.raw}/5 — ${NOTAS_DESCRICAO_GESTOR[ctx.raw] || ''}` } },
          },
        },
      });
    }

    if (barRef.current) {
      if (barRef.current._chart) barRef.current._chart.destroy();
      const cores = notas.map(n => n >= 4 ? '#1A6B50' : n >= 3 ? '#B86E00' : n > 0 ? '#0F6E56' : '#E4E2DA');
      barRef.current._chart = new window.Chart(barRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            data: notas,
            backgroundColor: cores,
            borderRadius: 6,
            borderSkipped: false,
            barThickness: 28,
          }],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { min: 0, max: 5, ticks: { stepSize: 1 }, grid: { color: '#E4E2DA' } },
            y: { grid: { display: false }, ticks: { font: { size: 11 } } },
          },
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => ` ${ctx.raw}/5 — ${NOTAS_DESCRICAO_GESTOR[ctx.raw] || ''}` } },
          },
        },
      });
    }
  }

  if (!dados || !descricao) return <div className={styles.loading}>Carregando...</div>;
  const corNivel = descricao.cor === 'green' ? styles.verde : descricao.cor === 'amber' ? styles.amber : styles.vermelho;
  const alturaBar = Math.max(240, COMPETENCIAS_GESTOR.length * 44 + 40);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.back} onClick={() => router.push('/')}>← Voltar</button>
          <span className={gStyles.tagGestor}>Avaliação do gestor</span>
        </div>

        <div className={`${styles.heroCard} ${gStyles.heroGestor}`}>
          <div className={styles.heroLeft}>
            <div className={gStyles.avatarGestor}>{dados.nomeGestor?.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase() || 'G'}</div>
            <div>
              <div className={styles.heroNome}>{dados.nomeGestor || 'Gestor'}</div>
              <div className={styles.heroMeta}>Avaliado por: {dados.nomeColaborador} · {dados.periodo}</div>
            </div>
          </div>
          <div className={styles.heroMedia}>
            <div className={`${styles.mediaNota} ${corNivel}`}>{descricao.media}</div>
            <div className={styles.mediaNivel}>{descricao.nivel}</div>
          </div>
        </div>

        <div className={styles.chartsRow}>
          <div className={styles.chartCard}>
            <div className={styles.chartTitle}>Visão radar — liderança</div>
            <div className={styles.chartWrap} style={{ height: 280 }}>
              <canvas ref={radarRef} role="img" aria-label="Radar das competências de liderança" />
            </div>
          </div>
          <div className={styles.chartCard}>
            <div className={styles.chartTitle}>Desempenho por dimensão</div>
            <div className={styles.chartWrap} style={{ height: alturaBar }}>
              <canvas ref={barRef} role="img" aria-label="Barras por competência de gestão" />
            </div>
          </div>
        </div>

        <div className={styles.descCard}>
          <div className={styles.descTitle}>Parecer geral da liderança</div>
          <p className={styles.descTexto}>{descricao.parecer}</p>
        </div>

        <div className={styles.ptRow}>
          {descricao.fortes.length > 0 && (
            <div className={`${styles.ptCard} ${styles.ptFortes}`}>
              <div className={styles.ptLabel}>Pontos fortes na liderança</div>
              {descricao.fortes.map(c => (
                <div key={c.id} className={styles.ptItem}>
                  <span className={styles.ptNota}>{c.nota}</span>
                  <div><div className={styles.ptNome}>{c.nome}</div><div className={styles.ptDesc}>{NOTAS_DESCRICAO_GESTOR[c.nota]}</div></div>
                </div>
              ))}
            </div>
          )}
          {descricao.melhorar.length > 0 && (
            <div className={`${styles.ptCard} ${styles.ptMelhorar}`}>
              <div className={styles.ptLabel}>Pontos a desenvolver</div>
              {descricao.melhorar.map(c => (
                <div key={c.id} className={styles.ptItem}>
                  <span className={`${styles.ptNota} ${styles.ptNotaMelhorar}`}>{c.nota}</span>
                  <div><div className={styles.ptNome}>{c.nome}</div><div className={styles.ptDesc}>{NOTAS_DESCRICAO_GESTOR[c.nota]}</div></div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className={styles.rodape}>Biscoitech · Avaliação 360° — feedback da equipe para a liderança</p>
      </div>
    </div>
  );
}