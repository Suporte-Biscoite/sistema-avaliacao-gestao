import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { COMPETENCIAS_COLABORADOR, NOTAS_DESCRICAO, gerarDescricao } from '../lib/competencias';
import styles from '../styles/Resultado.module.css';

function loadChartJS(cb) {
  if (window.Chart) { cb(); return; }
  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js';
  s.onload = cb;
  document.head.appendChild(s);
}

export default function Resultado() {
  const router = useRouter();
  const radarRef = useRef(null);
  const barRef = useRef(null);
  const [dados, setDados] = useState(null);
  const [descricao, setDescricao] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('resultado_colaborador');
    if (!raw) { router.push('/'); return; }
    const d = JSON.parse(raw);
    setDados(d);
    setDescricao(gerarDescricao(d.notas, 'colaborador'));
  }, []);

  useEffect(() => {
    if (!dados || !descricao) return;
    loadChartJS(() => renderCharts());
  }, [dados, descricao]);

  function renderCharts() {
    const notas = COMPETENCIAS_COLABORADOR.map(c => dados.notas[c.id] || 0);
    const labels = COMPETENCIAS_COLABORADOR.map(c => c.nome);

    if (radarRef.current) {
      if (radarRef.current._chart) radarRef.current._chart.destroy();
      radarRef.current._chart = new window.Chart(radarRef.current, {
        type: 'radar',
        data: {
          labels,
          datasets: [{
            label: 'Autoavaliação',
            data: notas,
            backgroundColor: 'rgba(60,52,137,0.12)',
            borderColor: '#3C3489',
            borderWidth: 2,
            pointBackgroundColor: '#3C3489',
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
            tooltip: { callbacks: { label: ctx => ` ${ctx.raw}/5 — ${NOTAS_DESCRICAO[ctx.raw] || ''}` } },
          },
        },
      });
    }

    if (barRef.current) {
      if (barRef.current._chart) barRef.current._chart.destroy();
      const cores = notas.map(n => n >= 4 ? '#1A6B50' : n >= 3 ? '#B86E00' : n > 0 ? '#3C3489' : '#E4E2DA');
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
            y: { grid: { display: false }, ticks: { font: { size: 12 } } },
          },
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => ` ${ctx.raw}/5 — ${NOTAS_DESCRICAO[ctx.raw] || ''}` } },
          },
        },
      });
    }
  }

  if (!dados || !descricao) return <div className={styles.loading}>Carregando...</div>;

  const corNivel = descricao.cor === 'green' ? styles.verde : descricao.cor === 'amber' ? styles.amber : styles.vermelho;
  const alturaBar = Math.max(240, COMPETENCIAS_COLABORADOR.length * 44 + 40);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.back} onClick={() => router.push('/')}>← Voltar</button>
          <span className={styles.tag}>Resultado da avaliação</span>
        </div>

        <div className={styles.heroCard}>
          <div className={styles.heroLeft}>
            <div className={styles.avatar}>{dados.nome?.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()}</div>
            <div>
              <div className={styles.heroNome}>{dados.nome}</div>
              <div className={styles.heroMeta}>{[dados.cargo, dados.area, dados.periodo].filter(Boolean).join(' · ')}</div>
            </div>
          </div>
          <div className={styles.heroMedia}>
            <div className={`${styles.mediaNota} ${corNivel}`}>{descricao.media}</div>
            <div className={styles.mediaNivel}>{descricao.nivel}</div>
          </div>
        </div>

        <div className={styles.chartsRow}>
          <div className={styles.chartCard}>
            <div className={styles.chartTitle}>Visão radar — competências</div>
            <div className={styles.chartWrap} style={{ height: 260 }}>
              <canvas ref={radarRef} role="img" aria-label="Radar das competências" />
            </div>
          </div>
          <div className={styles.chartCard}>
            <div className={styles.chartTitle}>Desempenho por competência</div>
            <div className={styles.chartWrap} style={{ height: alturaBar }}>
              <canvas ref={barRef} role="img" aria-label="Barras por competência" />
            </div>
          </div>
        </div>

        <div className={styles.descCard}>
          <div className={styles.descTitle}>Parecer geral</div>
          <p className={styles.descTexto}>{descricao.parecer}</p>
        </div>

        <div className={styles.ptRow}>
          {descricao.fortes.length > 0 && (
            <div className={`${styles.ptCard} ${styles.ptFortes}`}>
              <div className={styles.ptLabel}>Pontos fortes</div>
              {descricao.fortes.map(c => (
                <div key={c.id} className={styles.ptItem}>
                  <span className={styles.ptNota}>{c.nota}</span>
                  <div>
                    <div className={styles.ptNome}>{c.nome}</div>
                    <div className={styles.ptDesc}>{NOTAS_DESCRICAO[c.nota]}</div>
                  </div>
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
                  <div>
                    <div className={styles.ptNome}>{c.nome}</div>
                    <div className={styles.ptDesc}>{NOTAS_DESCRICAO[c.nota]}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className={styles.rodape}>Biscoitech · Resultado gerado automaticamente com base nas respostas</p>
      </div>
    </div>
  );
}