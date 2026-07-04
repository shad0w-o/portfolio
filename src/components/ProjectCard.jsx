import { useRef } from "react";
import styles from "../styles/ProjectCard.module.css";

export default function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;

    glow.style.background = `radial-gradient(350px circle at ${x}px ${y}px, rgba(200,255,0,0.06), transparent 65%)`;

    const rotateX = ((py - 50) / 50) * -5;
    const rotateY = ((px - 50) / 50) * 5;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (glowRef.current) glowRef.current.style.background = "transparent";
    if (cardRef.current)
      card_reset(cardRef.current);
  };

  function card_reset(card) {
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  }

  return (
    <article
      ref={cardRef}
      className={styles.card}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={glowRef} className={styles.glow} aria-hidden="true" />

      {/* Image */}
      {project.image ? (
        <div className={styles.imageWrap}>
          <img src={project.image} alt={project.title} className={styles.image} />
        </div>
      ) : (
        <div className={styles.imagePlaceholder}>
          <span className={styles.placeholderText}>[ add screenshot ]</span>
        </div>
      )}

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
        </div>

        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description}>{project.description}</p>

        <div className={styles.footer}>
          <div className={styles.tags}>
            {project.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>

          <div className={styles.links}>
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className={styles.link}>
                github ↗
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer" className={styles.link}>
                live ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}