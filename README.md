import { useEffect, useRef } from "react";

export default function DotGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const spacingDesktop = 24;
    const spacingMobile = 32;
    const dimColor = "136,135,135";
    const shockColor = "200,255,0";
    const sparkColor = "230,230,235"; // greyish-white
    const dimAlpha = 0.5;
    const repelRadius = 90;
    const repelStrength = 22;
    const ease = 0.18;

    const shockEveryFrames = 9;   // was 14 — bits flip a bit more often
    const chargeFrames = 10;
    const holdFrames = 80;
    const decayFrames = 18;

    let vw, vh, dpr, spacing, half, dots = [];
    let pointer = { x: -9999, y: -9999 };
    let rafId, resizeTimer, frame = 0;

    function getMaxW() {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--max-w");
      const n = parseFloat(v);
      return isNaN(n) ? 680 : n;
    }

    function sizeCanvas() {
      vw = window.innerWidth;
      vh = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = vw * dpr;
      canvas.height = vh * dpr;
      canvas.style.width = vw + "px";
      canvas.style.height = vh + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function buildDots() {
      const docH = document.documentElement.scrollHeight;
      spacing = vw < 640 ? spacingMobile : spacingDesktop;
      half = getMaxW() / 2;
      const centerX = vw / 2;
      const rows = Math.ceil(docH / spacing) + 2;
      const kMax = Math.ceil((vw / 2) / spacing) + 2;

      dots = [];
      for (let k = -kMax; k <= kMax; k++) {
        const x = centerX + k * spacing;
        if (x < -spacing || x > vw + spacing) continue;
        if (Math.abs(x - centerX) <= half) continue;
        for (let j = 0; j < rows; j++) {
          dots.push({
            ox: x, oy: j * spacing,
            x, y: j * spacing,
            value: 0,
            phase: "idle",
            timer: 0,
          });
        }
      }
    }

    function rebuild() {
      sizeCanvas();
      buildDots();
    }

    function triggerShock() {
      const count = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        const d = dots[Math.floor(Math.random() * dots.length)];
        if (d && d.phase === "idle") {
          d.phase = "charging";
          d.timer = chargeFrames;
        }
      }
    }

    function stepDot(d) {
      switch (d.phase) {
        case "charging":
          d.timer--;
          if (d.timer <= 0) {
            d.phase = "held";
            d.timer = holdFrames;
            d.value = 1;
          }
          break;
        case "held":
          d.timer--;
          if (d.timer <= 0) {
            d.phase = "decay";
            d.timer = decayFrames;
          }
          break;
        case "decay":
          d.timer--;
          if (d.timer <= 0) {
            d.phase = "idle";
            d.value = 0;
          }
          break;
        default:
          break;
      }
    }

    // recursively grows a jagged branch, occasionally forking off sub-branches —
    // this is what gives real lightning its "cracked glass" look instead of a single line
    function growBranch(x, y, angle, length, depth, out) {
      const segments = 3;
      let cx = x, cy = y, a = angle;
      const pts = [{ x: cx, y: cy }];
      for (let s = 0; s < segments; s++) {
        const stepLen = length / segments;
        a += (Math.random() - 0.5) * 1.0;
        cx += Math.cos(a) * stepLen;
        cy += Math.sin(a) * stepLen;
        pts.push({ x: cx, y: cy });
        if (depth < 1 && Math.random() < 0.4) {
          const subAngle = a + (Math.random() - 0.5) * 1.6;
          growBranch(cx, cy, subAngle, length * 0.5, depth + 1, out);
        }
      }
      out.push({ pts, depth });
    }

    // localized forked spark, radius stays small (~half a grid cell) so it
    // never reaches a neighboring bit
    function drawSpark(cx, cy, intensity) {
      const branches = [];
      const mainCount = 3 + Math.floor(Math.random() * 2);
      for (let i = 0; i < mainCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const length = 6 + Math.random() * 7;
        growBranch(cx, cy, angle, length, 0, branches);
      }

      // soft outer glow, all branches, one pass
      for (const b of branches) {
        ctx.beginPath();
        ctx.moveTo(b.pts[0].x, b.pts[0].y);
        for (let i = 1; i < b.pts.length; i++) ctx.lineTo(b.pts[i].x, b.pts[i].y);
        ctx.strokeStyle = `rgba(${sparkColor}, ${intensity * 0.25})`;
        ctx.lineWidth = b.depth === 0 ? 3 : 2;
        ctx.shadowColor = `rgba(${sparkColor}, ${intensity * 0.5})`;
        ctx.shadowBlur = 6;
        ctx.stroke();
      }
      // bright hot core, thinner
      for (const b of branches) {
        ctx.beginPath();
        ctx.moveTo(b.pts[0].x, b.pts[0].y);
        for (let i = 1; i < b.pts.length; i++) ctx.lineTo(b.pts[i].x, b.pts[i].y);
        ctx.strokeStyle = `rgba(255,255,255,${intensity * (b.depth === 0 ? 0.95 : 0.7)})`;
        ctx.lineWidth = b.depth === 0 ? 0.9 : 0.6;
        ctx.shadowBlur = 0;
        ctx.stroke();
      }
      // small bright core glow at the origin, like the flash in the reference
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 8);
      grad.addColorStop(0, `rgba(255,255,255,${intensity * 0.8})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawDot(d, scrollY) {
      const px = d.x, py = d.y - scrollY;

      if (d.phase === "charging") {
        const flicker = Math.random() > 0.35;
        ctx.fillStyle = flicker ? `rgba(${sparkColor}, 0.95)` : `rgba(${dimColor}, ${dimAlpha})`;
        ctx.shadowBlur = 0;
        ctx.fillText(d.value, px, py);
        if (flicker) drawSpark(px, py, 0.6 + Math.random() * 0.4);
        return;
      }
      if (d.phase === "held") {
        ctx.fillStyle = `rgba(${shockColor}, 1)`;
        ctx.shadowColor = `rgba(${shockColor}, 0.6)`;
        ctx.shadowBlur = 6;
        ctx.fillText(d.value, px, py);
        return;
      }
      if (d.phase === "decay") {
        const t = d.timer / decayFrames;
        ctx.fillStyle = `rgba(${shockColor}, ${0.4 + t * 0.6})`;
        ctx.shadowColor = `rgba(${shockColor}, ${t * 0.6})`;
        ctx.shadowBlur = 6 * t;
        ctx.fillText(d.value, px, py);
        return;
      }
      ctx.fillStyle = `rgba(${dimColor}, ${dimAlpha})`;
      ctx.shadowBlur = 0;
      ctx.fillText(d.value, px, py);
    }

    function animate() {
      ctx.clearRect(0, 0, vw, vh);
      const scrollY = window.scrollY;
      const margin = 50;
      ctx.font = `${spacing < 32 ? 11 : 13}px "JetBrains Mono", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (const d of dots) {
        stepDot(d); // always advance, even off-screen, to avoid stuck bits after scroll

        if (d.oy < scrollY - margin || d.oy > scrollY + vh + margin) continue;

        const dx = d.ox - pointer.x;
        const dy = d.oy - pointer.y;
        const dist = Math.hypot(dx, dy);
        let tx = d.ox, ty = d.oy;
        if (dist < repelRadius) {
          const force = (1 - dist / repelRadius) * repelStrength;
          const angle = Math.atan2(dy, dx);
          tx += Math.cos(angle) * force;
          ty += Math.sin(angle) * force;
        }
        d.x += (tx - d.x) * ease;
        d.y += (ty - d.y) * ease;

        drawDot(d, scrollY);
      }
      ctx.shadowBlur = 0;

      frame++;
      if (frame % shockEveryFrames === 0) triggerShock();

      rafId = requestAnimationFrame(animate);
    }

    function handlePointerMove(e) {
      pointer.x = e.clientX;
      pointer.y = e.clientY + window.scrollY;
    }
    function handlePointerLeave() {
      pointer.x = -9999;
      pointer.y = -9999;
    }
    function handleResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(rebuild, 150);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", handleResize);
    const ro = new ResizeObserver(handleResize);
    ro.observe(document.body);

    rebuild();
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}
