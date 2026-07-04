import { useEffect, useRef } from "react";

export default function DotGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const SPACING = 24;

    function getDots() {
      const dots = [];
      for (let x = 0; x < canvas.width; x += SPACING) {
        for (let y = 0; y < canvas.height; y += SPACING) {
          const cx = canvas.width / 2;
          const inContent = x > cx - 340 && x < cx + 340;
          if (!inContent) dots.push({ x, y, glow: 0 });
        }
      }
      return dots;
    }

    let dots = getDots();
    window.addEventListener("resize", () => { dots = getDots(); });

    let bolts = [];

    function spawnBolt() {
      if (dots.length < 2) return;
      const a = dots[Math.floor(Math.random() * dots.length)];
      const nearby = dots.filter(d => {
        const dx = d.x - a.x, dy = d.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist > 20 && dist < 100;
      });
      if (!nearby.length) return;
      const b = nearby[Math.floor(Math.random() * nearby.length)];
      a.glow = 1.0;
      b.glow = 1.0;

      // generate zigzag points between a and b
      const segments = 8;
      const points = [{ x: a.x, y: a.y }];
      for (let i = 1; i < segments; i++) {
        const t = i / segments;
        const bx = a.x + (b.x - a.x) * t;
        const by = a.y + (b.y - a.y) * t;
        // perpendicular offset
        const dx = b.x - a.x, dy = b.y - a.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const px = -dy / len, py = dx / len;
        const offset = (Math.random() - 0.5) * 14;
        points.push({ x: bx + px * offset, y: by + py * offset });
      }
      points.push({ x: b.x, y: b.y });

      bolts.push({ points, life: 1.0, flicker: 0 });
    }

    let frame = 0;

    function drawBolt(points, alpha) {
      // outer glow pass
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = `rgba(160, 160, 160, ${alpha * 0.3})`;
      ctx.lineWidth = 3;
      ctx.shadowColor = `rgba(200, 200, 200, ${alpha * 0.4})`;
      ctx.shadowBlur = 8;
      ctx.stroke();

      // core bright line
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = `rgba(230, 230, 230, ${alpha})`;
      ctx.lineWidth = 0.8;
      ctx.shadowBlur = 0;
      ctx.stroke();
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // dots
      for (const d of dots) {
        if (d.glow > 0) {
          ctx.beginPath();
          ctx.arc(d.x, d.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 200, 200, ${d.glow})`;
          ctx.shadowColor = `rgba(220, 220, 220, ${d.glow})`;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
          d.glow = Math.max(0, d.glow - 0.015);
        } else {
          ctx.beginPath();
          ctx.arc(d.x, d.y, 1, 0, Math.PI * 2);
          ctx.fillStyle = "#2a2828";
          ctx.fill();
        }
      }

      frame++;
      if (frame % 40 === 0) spawnBolt();

      // bolts
      bolts = bolts.filter(b => b.life > 0);
      for (const bolt of bolts) {
        bolt.flicker++;
        // redraw zigzag every few frames for flicker
        if (bolt.flicker % 3 === 0) {
          // re-jitter midpoints slightly
          for (let i = 1; i < bolt.points.length - 1; i++) {
            bolt.points[i].x += (Math.random() - 0.5) * 2;
            bolt.points[i].y += (Math.random() - 0.5) * 2;
          }
        }
        drawBolt(bolt.points, bolt.life);
        bolt.life -= 0.04;
      }

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}