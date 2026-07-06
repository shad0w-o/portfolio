import styles from "../styles/Header.module.css";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { GoDownload } from "react-icons/go";
import { IoMdMail } from "react-icons/io";
import { MdDescription, MdFileDownload } from "react-icons/md";

const socials = [
  { label: "Resume", href: "/resume.pdf", icon: MdDescription },
  { label: "Github", href: "https://github.com/shad0w-o", icon: FaGithub },
  { label: "Linkedin", href: "https://www.linkedin.com/in/ankababu-s-351829358/", icon: FaLinkedin },
  { label: "Mail", href: "mailto:ankababu774@gmail.com", icon: IoMdMail }
];

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.nameBlock}>
        <img src="/pfp.jpeg" alt="Ankababu" className={styles.pfp} />
        <div className={styles.nameText}>
          <h1 className={styles.name}>Ankababu</h1>
          <span className={styles.handle}>[ shad0w_o ]</span>
        </div>
      </div>

      <div className={styles.summaryRow}>
        <p className={styles.summary}>
          Hi, i'm a cse student trying to get better at backend systems and full
          stack development. i wanna get into low level programming and
          inference engineering next. outside of academics, i spend most of my time writing code,
          watching anime, following mma and esports, or listening to music.
          recently, i've been getting into ctf challenges. oh! almost forgot, i use arch btw ;)
        </p>
      </div>

      <ul className={styles.socials}>
        <span className={styles.factKey}>CONTACT &nbsp;{"--->"} </span>
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
            {s.label === "Resume" && (
              <a
                href="/resume.pdf"
                download="Ankababu_Resume.pdf"
                className={styles.socialLink}
                aria-label="Download resume"
              >
                <MdFileDownload size={18} />
              </a>
            )}
          </li>
        ))}
      </ul>

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