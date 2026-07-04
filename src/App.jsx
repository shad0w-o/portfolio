import "./styles/global.css";
import "./styles/layout.css";
import Header from "./components/Header";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import SectionDivider from "./components/SectionDivider";
import Nav from "./components/Nav";

export default function App() {
  return (
    <div className="site-wrap">
      <main>
        <Nav />
        <section id="about">
          <Header />
        </section>
        <SectionDivider />
        <section id="skills">
          <Skills />
        </section>
        <SectionDivider />
        <section id="projects">
          <Projects />
        </section>
      </main>
    </div>
  );
}