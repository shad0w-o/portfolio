import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";
import styles from "../styles/Projects.module.css";

export default function Projects() {
  return (
    <section className={styles.projects}>
      <span className={styles.title}>
        <span className={styles.bracket}>[</span>
        <span className={styles.label}>PROJECTS</span>
        <span className={styles.bracket}>]</span>
      </span>
      <div className={styles.list}>
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
      <span className={styles.textH}>more to come (hopefully...)</span>
    </section>
  );
}
