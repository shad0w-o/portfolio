import styles from "../styles/Nav.module.css";

const links = [
  { label: "about", href: "#about" },
  { label: "skills", href: "#skills" },
  { label: "projects", href: "#projects" },
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