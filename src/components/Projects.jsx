import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";
import styles from "../styles/Projects.module.css";

export default function Projects() {
  return (
    <section className={styles.projects}>
      <div className={styles.list}>
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
      <span className={styles.textH}>more to come (hopefully...)</span>
    </section>
  );
}
