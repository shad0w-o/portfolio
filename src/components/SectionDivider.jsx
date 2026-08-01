import styles from "../styles/SectionDivider.module.css";

export default function SectionDivider() {
  return (
    <div className={styles.divider} aria-hidden="true">
      <span className={styles.line} />
      <span className={styles.marker}>
        <span className={styles.bracket}>[</span>
        <span className={styles.glyph}>x</span>
        <span className={styles.bracket}>]</span>
      </span>
      <span className={styles.line} />
    </div>
  );
}