/* ============================================================
   CONFETTI.JS — celebration effects on the top canvas layer:
   golden bursts, confetti rain, and fireworks.
   ============================================================ */

const FX = (() => {
  const canvas = document.getElementById("fx-canvas");
  const ctx = canvas.getContext("2d");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const GOLD_SHADES = ["#e8c268", "#ffd98a", "#f7e2b0", "#d4a94c"];
  const CONFETTI_COLORS = ["#e8c268", "#ffd98a", "#a78bfa", "#f7f1e3", "#c4b5fd", "#d4a94c"];

  let pieces = []; // every active effect particle
  let rockets = []; // fireworks on the way up
  let rafId = null;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function ensureLoop() {
    if (!rafId) rafId = requestAnimationFrame(loop);
  }

  /* ---------- Golden particle burst (welcome click, gift box) ---------- */
  function goldenBurst(x, y, count = 90) {
    if (reducedMotion) count = Math.min(count, 25);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;
      pieces.push({
        kind: "spark",
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        radius: 1.5 + Math.random() * 2.5,
        color: GOLD_SHADES[Math.floor(Math.random() * GOLD_SHADES.length)],
        life: 1,
        decay: 0.01 + Math.random() * 0.015,
      });
    }
    ensureLoop();
  }

  /* ---------- Confetti rain / burst ---------- */
  function confettiBurst(x, y, count = 120) {
    if (reducedMotion) count = Math.min(count, 30);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 8;
      pieces.push({
        kind: "confetti",
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        w: 5 + Math.random() * 6,
        h: 3 + Math.random() * 5,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.3,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        life: 1,
        decay: 0.004 + Math.random() * 0.006,
      });
    }
    ensureLoop();
  }

  function confettiRain(duration = 2500) {
    if (reducedMotion) duration = 800;
    const start = performance.now();
    const spawn = () => {
      if (performance.now() - start > duration) return;
      for (let i = 0; i < 6; i++) {
        pieces.push({
          kind: "confetti",
          x: Math.random() * canvas.width,
          y: -12,
          vx: (Math.random() - 0.5) * 2,
          vy: 2 + Math.random() * 3,
          w: 5 + Math.random() * 6,
          h: 3 + Math.random() * 5,
          rotation: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.3,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          life: 1,
          decay: 0.003,
        });
      }
      ensureLoop();
      setTimeout(spawn, 90);
    };
    spawn();
  }

  /* ---------- Fireworks ---------- */
  function launchFirework() {
    rockets.push({
      x: canvas.width * (0.2 + Math.random() * 0.6),
      y: canvas.height,
      vy: -(8 + Math.random() * 4),
      targetY: canvas.height * (0.18 + Math.random() * 0.3),
      color: GOLD_SHADES[Math.floor(Math.random() * GOLD_SHADES.length)],
    });
    ensureLoop();
  }

  function explodeFirework(x, y, color) {
    const count = reducedMotion ? 20 : 70;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
      const speed = 2 + Math.random() * 5;
      pieces.push({
        kind: "spark",
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.2 + Math.random() * 2,
        color,
        life: 1,
        decay: 0.008 + Math.random() * 0.012,
      });
    }
  }

  let fireworksTimer = null;

  function fireworksShow(duration = 8000) {
    stopFireworks();
    if (reducedMotion) {
      // Gentle alternative: a couple of soft bursts only.
      goldenBurst(canvas.width / 2, canvas.height * 0.3, 25);
      return;
    }
    const start = performance.now();
    const tick = () => {
      if (performance.now() - start > duration) {
        fireworksTimer = null;
        return;
      }
      launchFirework();
      if (Math.random() > 0.5) launchFirework();
      fireworksTimer = setTimeout(tick, 420 + Math.random() * 380);
    };
    tick();
  }

  function stopFireworks() {
    if (fireworksTimer) {
      clearTimeout(fireworksTimer);
      fireworksTimer = null;
    }
  }

  /* ---------- Main render loop (runs only while effects exist) ---------- */
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rockets rising
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.y += r.vy;
      ctx.beginPath();
      ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = r.color;
      ctx.shadowColor = r.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
      if (r.y <= r.targetY) {
        explodeFirework(r.x, r.y, r.color);
        rockets.splice(i, 1);
      }
    }

    // Sparks and confetti
    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.kind === "confetti" ? 0.12 : 0.06; // gravity
      p.vx *= 0.99;
      p.life -= p.decay;

      if (p.life <= 0 || p.y > canvas.height + 30) {
        pieces.splice(i, 1);
        continue;
      }

      ctx.globalAlpha = Math.max(p.life, 0);
      if (p.kind === "confetti") {
        p.rotation += p.spin;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
    }

    if (pieces.length > 0 || rockets.length > 0) {
      rafId = requestAnimationFrame(loop);
    } else {
      // Nothing left to draw — stop the loop entirely.
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rafId = null;
    }
  }

  function clear() {
    stopFireworks();
    pieces = [];
    rockets = [];
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  return { goldenBurst, confettiBurst, confettiRain, fireworksShow, stopFireworks, clear };
})();
