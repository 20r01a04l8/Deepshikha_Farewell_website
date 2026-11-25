
const App = (() => {
  const VISITED_KEY = "farewell.visitedSections";

  let finaleStarted = false;
  let finaleTimers = [];
  let visited = new Set();

  /* ================= Toast ================= */
  let toastTimer = null;
  function toast(text) {
    const el = document.getElementById("toast");
    el.textContent = text;
    el.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("visible"), 4000);
  }

  /* ================= Build static text from CONTENT ================= */
  function populateText() {
    document.title = `A Farewell for ${CONTENT.name}`;

    setText("welcome-heading", CONTENT.welcome.heading);
    setText("welcome-subheading", CONTENT.welcome.subheading);
    setText("welcome-btn", CONTENT.welcome.button);

    setText("nav-brand", `For ${CONTENT.name} ✨`);

    setText("celebration-eyebrow", CONTENT.celebration.eyebrow);
    setText("celebration-name", CONTENT.name);
    setText("celebration-tagline", CONTENT.celebration.tagline);

    setText("memories-title", CONTENT.memoriesTitle);
    setText("memories-subtitle", CONTENT.memoriesSubtitle);

    setText("messages-title", CONTENT.messagesTitle);
    setText("messages-subtitle", CONTENT.messagesSubtitle);
    setText("reveal-btn", CONTENT.revealButton);
    setText("form-title", CONTENT.addMessage.formTitle);
    document.getElementById("msg-name").placeholder = CONTENT.addMessage.namePlaceholder;
    document.getElementById("msg-text").placeholder = CONTENT.addMessage.messagePlaceholder;
    setText("msg-submit", CONTENT.addMessage.submitButton);

    setText("appreciation-title", CONTENT.appreciationTitle);
    setText("appreciation-subtitle", CONTENT.appreciationSubtitle);

    setText("surprise-title", CONTENT.surprise.title);
    setText("surprise-btn", CONTENT.surprise.button);
    setText("surprise-message", CONTENT.surprise.message);
    setText("surprise-closing", CONTENT.surprise.closing);

    setText("finale-thankyou", CONTENT.finale.thankYou);
    setText("finale-legacy", CONTENT.finale.legacy);
    setText("replay-btn", CONTENT.finale.replayButton);
  }

  function setText(id, text) {
    document.getElementById(id).textContent = text;
  }

  /* ================= Navigation ================= */
  function buildNav() {
    const ul = document.getElementById("nav-links");
    ul.replaceChildren();
    for (const item of CONTENT.nav) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#" + item.id;
      a.textContent = item.label;
      a.dataset.section = item.id;
      a.addEventListener("click", () => {
        Sound.sfx.click();
        document.getElementById("nav-links").classList.remove("open");
      });
      li.appendChild(a);
      ul.appendChild(li);
    }

    document.getElementById("nav-toggle").addEventListener("click", () => {
      const links = document.getElementById("nav-links");
      const open = links.classList.toggle("open");
      document
        .getElementById("nav-toggle")
        .setAttribute("aria-expanded", String(open));
    });
  }

  /* ================= Section tracking (progress + active link) ================= */
  function initSectionTracking() {
    try {
      const raw = localStorage.getItem(VISITED_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      visited = new Set(Array.isArray(arr) ? arr : []);
    } catch {
      visited = new Set();
    }
    applyVisitedMarks();

    const sections = document.querySelectorAll("main .section");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;

          // Mark visited (remembered across visits via LocalStorage)
          if (!visited.has(id)) {
            visited.add(id);
            localStorage.setItem(VISITED_KEY, JSON.stringify([...visited]));
            applyVisitedMarks();
          }

          // Highlight the active nav link
          document.querySelectorAll(".nav-links a").forEach((a) => {
            a.classList.toggle("active", a.dataset.section === id);
          });

          // Start the finale automatically when it scrolls into view
          if (id === "finale") startFinale();
        }
      },
      { threshold: 0.4 }
    );
    sections.forEach((s) => observer.observe(s));
  }

  function applyVisitedMarks() {
    document.querySelectorAll(".nav-links a").forEach((a) => {
      a.classList.toggle("visited", visited.has(a.dataset.section));
    });
  }

  /* ================= Scroll progress bar + back to top ================= */
  function initScrollUI() {
    const bar = document.getElementById("progress-bar");
    const backToTop = document.getElementById("back-to-top");

    window.addEventListener(
      "scroll",
      () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
        bar.style.width = pct.toFixed(2) + "%";
        backToTop.classList.toggle("visible", window.scrollY > 500);
      },
      { passive: true }
    );

    backToTop.addEventListener("click", () => {
      Sound.sfx.click();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ================= Fullscreen ================= */
  function initFullscreen() {
    const btn = document.getElementById("fullscreen-toggle");
    btn.addEventListener("click", () => {
      Sound.sfx.click();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {
          toast("Fullscreen is not available in this browser.");
        });
      } else {
        document.exitFullscreen();
      }
    });
    document.addEventListener("fullscreenchange", () => {
      btn.textContent = document.fullscreenElement ? "🗗" : "⛶";
      btn.setAttribute(
        "aria-label",
        document.fullscreenElement ? "Exit full screen" : "Enter full screen"
      );
    });
  }

  /* ================= Welcome flow ================= */
  function initWelcome() {
    const btn = document.getElementById("welcome-btn");
    btn.addEventListener("click", () => {
      const rect = btn.getBoundingClientRect();
      FX.goldenBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 120);
      Sound.sfx.celebrate();
      Sound.playMusic(true); // silent attempt — no toast if music file is absent

      document.getElementById("welcome-screen").classList.add("hidden");
      document.body.classList.remove("locked");
      document.body.classList.add("revealed");

      setTimeout(() => {
        document.getElementById("celebration").scrollIntoView({ behavior: "smooth" });
      }, 350);
    });
  }

  /* ================= Memory wall ================= */
  function buildMemoryWall() {
    const grid = document.getElementById("memory-grid");
    grid.replaceChildren();

    CONTENT.memories.forEach((memory, i) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "memory-card reveal";
      card.style.transitionDelay = `${(i % 3) * 0.12}s`;
      card.setAttribute("aria-pressed", "false");
      card.setAttribute(
        "aria-label",
        `${memory.title} memory card. Press to flip and read the message.`
      );

      const inner = document.createElement("div");
      inner.className = "memory-card-inner";

      const front = document.createElement("div");
      front.className = "memory-face memory-front";
      const icon = document.createElement("span");
      icon.className = "memory-icon";
      icon.textContent = memory.icon;
      const title = document.createElement("h3");
      title.textContent = memory.title;
      const hint = document.createElement("span");
      hint.className = "flip-hint";
      hint.textContent = "Click to flip";
      front.append(icon, title, hint);

      const back = document.createElement("div");
      back.className = "memory-face memory-back";
      const msg = document.createElement("p");
      msg.textContent = memory.message;
      back.appendChild(msg);

      inner.append(front, back);
      card.appendChild(inner);

      card.addEventListener("click", () => {
        const flipped = card.classList.toggle("flipped");
        card.setAttribute("aria-pressed", String(flipped));
        Sound.sfx.flip();
      });

      grid.appendChild(card);
    });
  }

  /* ================= Appreciation wall ================= */
  function buildAppreciationWall() {
    const grid = document.getElementById("appreciation-grid");
    const display = document.getElementById("appreciation-display");
    grid.replaceChildren();

    CONTENT.appreciation.forEach((item, i) => {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "appreciation-tile reveal";
      tile.style.transitionDelay = `${(i % 3) * 0.1}s`;

      const icon = document.createElement("span");
      icon.className = "tile-icon";
      icon.textContent = item.icon;
      const label = document.createElement("span");
      label.textContent = item.label;
      tile.append(icon, label);

      tile.addEventListener("click", () => {
        grid.querySelectorAll(".appreciation-tile").forEach((t) =>
          t.classList.remove("selected")
        );
        tile.classList.add("selected");

        const p = document.createElement("p");
        p.className = "swap";
        p.textContent = item.message;
        display.replaceChildren(p);

        Sound.sfx.reveal();
        const rect = tile.getBoundingClientRect();
        FX.goldenBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
      });

      grid.appendChild(tile);
    });

    const placeholder = document.createElement("p");
    placeholder.className = "placeholder";
    placeholder.textContent = "Choose a quality above to reveal a message…";
    display.replaceChildren(placeholder);
  }

  /* ================= Surprise box ================= */
  function initSurprise() {
    const btn = document.getElementById("surprise-btn");
    const box = document.getElementById("giftbox");
    const reveal = document.getElementById("surprise-reveal");

    btn.addEventListener("click", () => {
      if (box.classList.contains("open")) return;
      Sound.sfx.click();
      box.classList.add("shaking");

      setTimeout(() => {
        box.classList.remove("shaking");
        box.classList.add("open");

        const rect = box.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        FX.goldenBurst(cx, cy, 110);
        FX.confettiBurst(cx, cy - 40, 140);
        Sound.sfx.celebrate();

        reveal.classList.add("shown");
        btn.style.visibility = "hidden";

        setTimeout(() => {
          if (box.classList.contains("open")) {
            Gallery.open(0, btn);
          }
        }, 350);
      }, 1000);
    });

    document.addEventListener("photo-viewer:closed", resetSurprise);
  }

  function resetSurprise() {
    document.getElementById("giftbox").classList.remove("open");
    document.getElementById("surprise-reveal").classList.remove("shown");
    Gallery.reset();
    document.getElementById("surprise-btn").style.visibility = "visible";
  }

  /* ================= Finale ================= */
  function buildFinaleLines() {
    const holder = document.getElementById("finale-lines");
    holder.replaceChildren();
    for (const line of CONTENT.finale.lines) {
      const p = document.createElement("p");
      p.className = "finale-line";
      p.textContent = line;
      holder.appendChild(p);
    }
  }

  function startFinale() {
    if (finaleStarted) return;
    finaleStarted = true;

    const lines = document.querySelectorAll("#finale-lines .finale-line");
    let delay = 400;

    lines.forEach((line) => {
      finaleTimers.push(setTimeout(() => line.classList.add("shown"), delay));
      delay += 1700;
    });

    finaleTimers.push(
      setTimeout(() => {
        document.getElementById("finale-thankyou").classList.add("shown");
        document.getElementById("finale-legacy").classList.add("shown");
        Sound.sfx.celebrate();
        FX.fireworksShow(9000);
        FX.confettiRain(3000);
      }, delay + 400)
    );
  }

  function resetFinale() {
    finaleStarted = false;
    finaleTimers.forEach(clearTimeout);
    finaleTimers = [];
    document
      .querySelectorAll("#finale-lines .finale-line, #finale-thankyou, #finale-legacy")
      .forEach((el) => el.classList.remove("shown"));
  }

  /* ================= Replay ================= */
  function initReplay() {
    document.getElementById("replay-btn").addEventListener("click", () => {
      Sound.sfx.click();
      FX.clear();

      resetFinale();
      resetSurprise();
      Messages.resetReveals();

      // Reset visited progress for a fresh run (pinned messages are kept).
      visited = new Set();
      localStorage.removeItem(VISITED_KEY);
      applyVisitedMarks();

      // Unflip all memory cards.
      document.querySelectorAll(".memory-card.flipped").forEach((c) => {
        c.classList.remove("flipped");
        c.setAttribute("aria-pressed", "false");
      });

      // Clear the appreciation selection.
      document.querySelectorAll(".appreciation-tile.selected").forEach((t) =>
        t.classList.remove("selected")
      );
      const display = document.getElementById("appreciation-display");
      const placeholder = document.createElement("p");
      placeholder.className = "placeholder";
      placeholder.textContent = "Choose a quality above to reveal a message…";
      display.replaceChildren(placeholder);

      Reveal.reset();

      // Back to the welcome screen.
      window.scrollTo({ top: 0, behavior: "auto" });
      document.body.classList.remove("revealed");
      document.body.classList.add("locked");
      document.getElementById("welcome-screen").classList.remove("hidden");
      Sound.pauseMusic();
    });
  }

  /* ================= Init ================= */
  function init() {
    document.body.classList.add("locked");

    populateText();
    buildNav();
    buildMemoryWall();
    buildAppreciationWall();
    buildFinaleLines();

    Sound.init();
    Messages.init();
    Gallery.init();

    initWelcome();
    initSectionTracking();
    initScrollUI();
    initFullscreen();
    initSurprise();
    initReplay();

    Reveal.init();
    Ambient.start();
  }

  document.addEventListener("DOMContentLoaded", init);

  return { toast };
})();
