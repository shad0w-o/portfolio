import styles from "../styles/Header.module.css";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { MdDescription } from "react-icons/md";

const socials = [
  { label: "Github", href: "https://github.com/20SHADOW05", icon: FaGithub },
  { label: "Linkedin", href: "https://www.linkedin.com/in/ankababu-s-351829358/", icon: FaLinkedin },
  { label: "Mail", href: "mailto:ankababu774@gmail.com", icon: IoMdMail },
  { label: "Resume", href: "#", icon: MdDescription }
];

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.nameBlock}>
        <h1 className={styles.name}>Ankababu</h1>
        <span className={styles.handle}>[ shad0w_05 ]</span>
      </div>

      <div className={styles.row1}>
        <ul className={styles.socials}>
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target={s.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer"
                className={styles.socialLink}
              >
                <s.icon size={18} />
                <span>{s.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <p className={styles.summary}>
          CSE student focused on backend systems, with a growing interest in
          low-level systems and how things actually work under the hood.
          Recently getting into agentic systems and developer tooling.
        </p>
      </div>

      <div className={styles.row2}>
        <div className={styles.fact}>
          <span className={styles.factKey}>STATUS</span>
          <span className={styles.factVal}>
            <span className={styles.dot} />student • open to internships
          </span>
        </div>
        <div className={styles.fact}>
          <span className={styles.factKey}>FOCUS</span>
          <span className={styles.factVal}>backend • full stack • systems</span>
        </div>
        <div className={styles.fact}>
          <span className={styles.factKey}>BUILDING</span>
          <span className={styles.factVal}>depGraph — npm dependency viz</span>
        </div>
      </div>
    </header>
  );
}