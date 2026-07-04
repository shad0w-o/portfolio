import { skillGroups } from "../data/skills.js";
import styles from "../styles/Skills.module.css";

export default function Skills() {
  return (
    <section className={styles.skills}>
      <div className={styles.groups}>
        {skillGroups.map((group) => (
          <div key={group.label} className={styles.group}>
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
