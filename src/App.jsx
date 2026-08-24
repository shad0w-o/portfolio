import { useState, useEffect } from "react";
import { PullCord } from "pullcord";
import "pullcord/pullcord.css";
import "./styles/global.css";
import "./styles/layout.css";
import Header from "./components/Header";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import SectionDivider from "./components/SectionDivider";
import Nav from "./components/Nav";
import DotGrid from "./components/DotGrid";

export default function App() {
  const [bitsOn, setBitsOn] = useState(() => {
    try {
      const v = localStorage.getItem("bitsOn");
      return v ? JSON.parse(v) : true;
    } catch { return true; }
  });

  useEffect(() => {
    localStorage.setItem("bitsOn", JSON.stringify(bitsOn));
  }, [bitsOn]);

  useEffect(() => {
    console.log(
      "credits : %c PullCord %c by Sarthak Navalekar - https://feralui.dev/pullcord ",
      "background:#c8ff00;color:#000;padding:3px 8px;font-family:'JetBrains Mono',monospace;font-weight:700",
      "color:#ece7dd;background:#111;padding:3px 8px;font-family:'JetBrains Mono',monospace"
    );
  }, []);

  // visit tracking — skip owner (set ?owner=1 once) and localhost
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("owner") === "1") {
        localStorage.setItem("isOwner", "1");
        console.log("owner mode: visits not tracked");
      }
      if (localStorage.getItem("isOwner") === "1") return;
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return;
      console.log("visit tracked");
    } catch {}
  }, []);

  // Toggle ONLY on drag-release past threshold
  useEffect(() => {
    let startY = 0;
    let moved = 0;
    let dragging = false;
    const threshold = 18;
    const onDown = (e) => {
      const knob = document.querySelector(".pullcord-knob");
      if (!knob) return;
      if (!(e.target instanceof Element) || !e.target.closest(".pullcord-knob")) return;
      dragging = true;
      startY = e.clientY;
      moved = 0;
    };
    const onMove = (e) => {
      if (!dragging) return;
      moved = Math.max(moved, e.clientY - startY);
    };
    const onUp = () => {
      if (dragging && moved >= threshold) {
        setBitsOn((p) => !p);
      }
      dragging = false;
      moved = 0;
      startY = 0;
    };
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div className="site-wrap">
      <DotGrid bitsOn={bitsOn} />
      <PullCord
        pulled={bitsOn}
        ariaLabel="Toggle bits"
        config={{ stretchToggle: 999 }}
      />
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
