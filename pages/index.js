import { useRouter } from 'next/router';
import { IconUser, IconShield } from '../components/Icons';
import styles from '../styles/Home.module.css';

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Logo */}
        <div className={styles.logoArea}>
          <div className={styles.logoMark}>
            <span className={styles.logoDot} />
            <span className={styles.logoText}>Biscoitech</span>
          </div>
          <p className={styles.logoSub}>Avaliação de Desempenho</p>
        </div>

        {/* Headline */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Ciclo de<br />feedback
          </h1>
          <p className={styles.heroSub}>
            Equipe de tecnologia e digital.
            <br />
            Escolha seu perfil para continuar.
          </p>
        </div>

        {/* Cartões de acesso */}
        <div className={styles.cards}>
          <button
            className={`${styles.accessCard} ${styles.cardColab}`}
            onClick={() => router.push('/colaborador')}
          >
            <div className={styles.cardIcon}>
              <IconUser size={22} color="var(--green)" />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardLabel}>Colaborador</span>
              <span className={styles.cardDesc}>Preencher autoavaliação</span>
            </div>
            <div className={styles.cardArrow}>→</div>
          </button>

          <button
            className={`${styles.accessCard} ${styles.cardGestor}`}
            onClick={() => router.push('/gestor')}
          >
            <div className={styles.cardIcon}>
              <IconShield size={22} color="var(--brand-mid)" />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.cardLabel}>Gestor</span>
              <span className={styles.cardDesc}>Ver e analisar avaliações</span>
            </div>
            <div className={styles.cardArrow}>→</div>
          </button>
        </div>

        <p className={styles.footer}>Biscoitech · Uso interno</p>
      </div>
    </div>
  );
}
