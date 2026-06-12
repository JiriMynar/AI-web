import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

/**
 * Datové pole velínu — interaktivní pozadí landing page:
 * - barevné datové body s dohasínajícími světelnými stopami,
 * - blízké body se propojují do živé sítě,
 * - kolem kurzoru (reaktorového jádra) body orbitují jako ve víru,
 * - bez myši jádro autonomně křižuje obrazovkou a vleče roj za sebou,
 * - explode() vyšle tlakovou vlnu (světelné prstence) a roj rozmetá.
 * Respektuje prefers-reduced-motion (nevykresluje se nic).
 */
export type ParticleFieldHandle = { explode: (x: number, y: number) => void };

type P = { x: number; y: number; vx: number; vy: number; r: number; ci: number; alpha: number };
type Ring = { x: number; y: number; born: number };

const COLORS = ["#4FC3F7", "#FF8896", "#43DD9A", "#FFB547"];
const LINK_DIST = 100;
const BG_FADE = "rgba(10, 16, 23, 0.30)"; // stopy: pozadí se nemaže, jen dohasíná

function makeSprite(color: string): HTMLCanvasElement {
  const s = document.createElement("canvas");
  s.width = 64;
  s.height = 64;
  const c = s.getContext("2d")!;
  const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, color);
  g.addColorStop(0.35, color + "AA");
  g.addColorStop(1, color + "00");
  c.fillStyle = g;
  c.fillRect(0, 0, 64, 64);
  return s;
}

const ParticleField = forwardRef<ParticleFieldHandle>(function ParticleField(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctrl = useRef({ explodedUntil: 0, explode: (_x: number, _y: number) => {} });

  useImperativeHandle(ref, () => ({
    explode: (x: number, y: number) => ctrl.current.explode(x, y),
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sprites = COLORS.map(makeSprite);
    let w = 0, h = 0;
    let particles: P[] = [];
    let rings: Ring[] = [];
    let raf = 0;
    const mouse = { x: 0, y: 0, active: false };
    const core = { x: 0, y: 0 }; // reaktorové jádro (plynule sleduje cíl)

    const spawn = (): P => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: 1.3 + Math.random() * 2.4,
      ci: Math.floor(Math.random() * COLORS.length),
      alpha: 0.45 + Math.random() * 0.5,
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.min(230, Math.floor((w * h) / 8200));
      while (particles.length < target) particles.push(spawn());
      particles.length = target;
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onLeave = () => { mouse.active = false; };

    ctrl.current.explode = (x: number, y: number) => {
      const now = performance.now();
      ctrl.current.explodedUntil = now + 1500;
      rings.push({ x, y, born: now }, { x, y, born: now + 130 }, { x, y, born: now + 280 });
      for (const p of particles) {
        const dx = p.x - x;
        const dy = p.y - y;
        const dist = Math.max(Math.hypot(dx, dy), 10);
        const power = 46 * Math.max(0.3, 1 - dist / Math.hypot(w, h)) + Math.random() * 10;
        p.vx += (dx / dist) * power;
        p.vy += (dy / dist) * power;
        p.alpha = Math.min(1, p.alpha + 0.3); // záblesk energie
      }
    };

    const step = (now: number) => {
      // dohasínající stopy místo mazání
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = BG_FADE;
      ctx.fillRect(0, 0, w, h);

      const exploding = now < ctrl.current.explodedUntil;

      // cíl jádra: myš, jinak autonomní křižování (Lissajous)
      const tx = mouse.active ? mouse.x : w / 2 + Math.cos(now * 0.00031) * w * 0.3;
      const ty = mouse.active ? mouse.y : h / 2 + Math.sin(now * 0.00047) * h * 0.24;
      core.x += (tx - core.x) * 0.07;
      core.y += (ty - core.y) * 0.07;

      const R = Math.min(Math.max(Math.min(w, h) * 0.46, 280), 520);

      // fyzika
      for (const p of particles) {
        p.vx += (Math.random() - 0.5) * 0.06;
        p.vy += (Math.random() - 0.5) * 0.06;

        if (!exploding) {
          const dx = core.x - p.x;
          const dy = core.y - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < R) {
            const t = 1 - dist / R;
            const pull = 0.5 * t;            // přítah k jádru
            const swirl = 0.85 * t;          // tangenciální složka → orbitování
            p.vx += (dx / dist) * pull + (-dy / dist) * swirl;
            p.vy += (dy / dist) * pull + (dx / dist) * swirl;
            if (dist < 70) {                  // jádro odpuzuje zblízka → stabilní prstenec
              const push = 0.9 * (1 - dist / 70);
              p.vx -= (dx / dist) * push;
              p.vy -= (dy / dist) * push;
            }
          }
        }

        const friction = exploding ? 0.97 : 0.93;
        p.vx *= friction;
        p.vy *= friction;
        const speed = Math.hypot(p.vx, p.vy);
        const maxSpeed = exploding ? 38 : 6.5;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -24) p.x = w + 24;
        if (p.x > w + 24) p.x = -24;
        if (p.y < -24) p.y = h + 24;
        if (p.y > h + 24) p.y = -24;
      }

      // datová síť — linky mezi blízkými body (aditivní svícení)
      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = 1;
      const L2 = LINK_DIST * LINK_DIST;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          if (dx > LINK_DIST || dx < -LINK_DIST) continue;
          const dy = a.y - b.y;
          if (dy > LINK_DIST || dy < -LINK_DIST) continue;
          const d2 = dx * dx + dy * dy;
          if (d2 > L2) continue;
          ctx.globalAlpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.22;
          ctx.strokeStyle = COLORS[a.ci];
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // datové body se září
      for (const p of particles) {
        const size = p.r * 7;
        ctx.globalAlpha = p.alpha;
        ctx.drawImage(sprites[p.ci], p.x - size / 2, p.y - size / 2, size, size);
        if (p.alpha > 0.95) p.alpha -= 0.004; // záblesk po explozi pomalu dohasíná
      }

      // reaktorové jádro: zář, pulzující prstenec a zaměřovací kříž velínu
      const pulse = 4 * Math.sin(now * 0.004);
      ctx.globalAlpha = 0.9;
      ctx.drawImage(sprites[0], core.x - 26, core.y - 26, 52, 52);
      ctx.globalAlpha = 0.55;
      ctx.strokeStyle = "#4FC3F7";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(core.x, core.y, 24 + pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      const tick = 34 + pulse;
      ctx.moveTo(core.x - tick, core.y); ctx.lineTo(core.x - tick + 10, core.y);
      ctx.moveTo(core.x + tick, core.y); ctx.lineTo(core.x + tick - 10, core.y);
      ctx.moveTo(core.x, core.y - tick); ctx.lineTo(core.x, core.y - tick + 10);
      ctx.moveTo(core.x, core.y + tick); ctx.lineTo(core.x, core.y + tick - 10);
      ctx.stroke();

      // tlakové vlny exploze
      rings = rings.filter((ring) => now - ring.born < 900 && now >= ring.born);
      for (const ring of rings) {
        const t = (now - ring.born) / 900;
        const radius = t * Math.max(w, h) * 0.75;
        ctx.globalAlpha = (1 - t) * 0.8;
        ctx.strokeStyle = "#4FC3F7";
        ctx.lineWidth = 3 * (1 - t) + 1;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = (1 - t) * 0.35;
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, radius * 0.92, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(step);
    };

    resize();
    // první frame: plné pozadí, ať stopy nezačínají na průhledné ploše
    ctx.fillStyle = "#0A1017";
    ctx.fillRect(0, 0, w, h);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-0" />;
});

export default ParticleField;
