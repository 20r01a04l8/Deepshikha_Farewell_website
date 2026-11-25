const Ambient = (() => {
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let particles = [];
  let stars = [];
  let rafId = null;
  let running = false;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 10 + Math.random() * 40,
      radius: 1 + Math.random() * 2.2,
      speedY: 0.15 + Math.random() * 0.45,
      driftX: (Math.random() - 0.5) * 0.3,
      alpha: 0.15 + Math.random() * 0.5,
      flicker: Math.random() * Math.PI * 2,
    };
  }

  function createStar() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.7,
      radius: 0.5 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
      speed: 0.008 + Math.random() * 0.02,
    };
  }

  function populate() {
    const count = reducedMotion ? 0 : Math.min(70, Math.floor(window.innerWidth / 18));
    particles = Array.from({ length: count }, () => {
      const p = createParticle();
      p.y = Math.random() * canvas.height; // spread initially
      return p;
    });
    stars = Array.from({ length: reducedMotion ? 25 : 60 }, createStar);
  }

  function drawStars() {
    for (const s of stars) {
      s.phase += s.speed;
      const glow = 0.3 + Math.abs(Math.sin(s.phase)) * 0.7;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(247, 241, 227, ${glow * 0.8})`;
      ctx.shadowColor = "rgba(232, 194, 104, 0.8)";
      ctx.shadowBlur = 6 * glow;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function drawParticles() {
    for (const p of particles) {
      p.y -= p.speedY;
      p.x += p.driftX + Math.sin(p.flicker) * 0.15;
      p.flicker += 0.02;

      if (p.y < -12) Object.assign(p, createParticle());

      const flickerAlpha = p.alpha * (0.7 + Math.sin(p.flicker * 2) * 0.3);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232, 194, 104, ${flickerAlpha})`;
      ctx.shadowColor = "rgba(255, 217, 138, 0.9)";
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawParticles();
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    resize();
    populate();
    loop();
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener("resize", () => {
    if (!running) return;
    resize();
    populate();
  });

  // Pause the loop when the tab is hidden to save battery.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    } else if (running && !rafId) {
      loop();
    }
  });

  return { start, stop, reducedMotion };
})();

/* ============================================================
   Scroll reveal — fades elements in as they enter the viewport.
   ============================================================ */

const Reveal = (() => {
  let observer = null;

  function init() {
    const elements = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("in-view"));
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
  }

  function reset() {
    if (observer) observer.disconnect();
    document.querySelectorAll(".reveal.in-view").forEach((el) => el.classList.remove("in-view"));
    init();
  }

  return { init, reset };
})();
