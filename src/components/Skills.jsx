import { skillGroups } from "../data/skills.js";
import styles from "../styles/Skills.module.css";

export default function Skills() {
  return (
    <section className={styles.skills}>

      <span className={styles.title}>
        <span className={styles.bracket}>[</span>
        <span className={styles.label}>SKILLS</span>
        <span className={styles.bracket}>]</span>
      </span>
      <div className={styles.groups}>
        {skillGroups.map((group) => (
          <div key={group.label} className={group.label === "Tools & Platforms" ? styles.splgroup : styles.group}>
            <span className={styles.groupLabel}>{group.label}</span>
            <div className={styles.chips}>
              {group.skills.map((skill) => (
                <span key={skill} className={styles.chip}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
