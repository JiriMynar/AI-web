import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

/**
 * Plátno s barevnými tečkami pro landing: tečky volně driftují,
 * myš je silně přitahuje jako magnet, explode() je rozmetá od daného bodu.
 * Respektuje prefers-reduced-motion (nevykresluje se nic).
 */
export type ParticleFieldHandle = { explode: (x: number, y: number) => void };

type P = {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  color: string;
  alpha: number;
};

const COLORS = ["#4FC3F7", "#FF8896", "#43DD9A", "#FFB547"];

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

    let w = 0, h = 0, dpr = 1;
    let particles: P[] = [];
    let raf = 0;
    const mouse = { x: -9999, y: -9999, active: false };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.min(220, Math.floor((w * h) / 9000));
      while (particles.length < target) particles.push(spawn());
      particles.length = target;
    };

    const spawn = (): P => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 1.2 + Math.random() * 2.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.35 + Math.random() * 0.55,
    });

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onLeave = () => { mouse.active = false; };

    ctrl.current.explode = (x: number, y: number) => {
      ctrl.current.explodedUntil = performance.now() + 1400;
      for (const p of particles) {
        const dx = p.x - x;
        const dy = p.y - y;
        const dist = Math.max(Math.hypot(dx, dy), 8);
        const power = 26 * Math.max(0.25, 1 - dist / Math.hypot(w, h)) + Math.random() * 6;
        p.vx += (dx / dist) * power;
        p.vy += (dy / dist) * power;
      }
    };

    const step = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      const exploding = now < ctrl.current.explodedUntil;
      const R = Math.min(Math.max(Math.min(w, h) * 0.42, 240), 460); // dosah magnetu

      for (const p of particles) {
        // jemný drift
        p.vx += (Math.random() - 0.5) * 0.06;
        p.vy += (Math.random() - 0.5) * 0.06;

        // magnet myši (vypnutý během exploze)
        if (!exploding && mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < R && dist > 24) {
            const f = 0.55 * (1 - dist / R);
            p.vx += (dx / dist) * f;
            p.vy += (dy / dist) * f;
          }
        }

        // tření + limit rychlosti
        const friction = exploding ? 0.965 : 0.94;
        p.vx *= friction;
        p.vy *= friction;
        const speed = Math.hypot(p.vx, p.vy);
        const maxSpeed = exploding ? 30 : 4.5;
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        p.x += p.vx;
        p.y += p.vy;

        // měkké odrážení od okrajů
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(step);
    };

    resize();
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

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
});

export default ParticleField;
