import styles from "../styles/SectionDivider.module.css";

export default function SectionDivider() {
  return (
    <div className={styles.divider} aria-hidden="true">
      <span className={styles.cap}>&gt;</span>
      <span className={styles.line} />
      <span className={styles.dots}>
        <span className={styles.dotSmall} />
        <span className={styles.dotBig} />
        <span className={styles.dotSmall} />
      </span>
      <span className={styles.line} />
      <span className={styles.cap}>&lt;</span>
    </div>
  );
}