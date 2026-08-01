import styles from "../styles/Nav.module.css";

const links = [
  { label: "[ABOUT]", href: "#about" },
  { label: "[SKILLS]", href: "#skills" },
  { label: "[PROJECTS]", href: "#projects" },
];

export default function Nav() {
  return (
    <nav className={styles.nav}>
      {links.map((l, i) => (
        <a key={l.label} href={l.href} className={styles.link}>
          {l.label}
        </a>
      ))}
    </nav>
  );
}