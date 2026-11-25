const Sound = (() => {
  const STORAGE_KEY = "farewell.sfxEnabled";

  let audioEl = null;        // <audio> element for background music
  let musicAvailable = true; // flips to false if the file can't load
  let musicPlaying = false;
  let sfxEnabled = localStorage.getItem(STORAGE_KEY) !== "false";
  let audioCtx = null;       // lazily created WebAudio context

  /* ---------- Background music ---------- */
  // Keep the music subtle — quiet background ambience, not a concert.
  const MUSIC_VOLUME = 1;
  let fadeTimer = 0.3;

  function initMusic() {
    audioEl = document.getElementById("bg-music");
    audioEl.loop = true;
    audioEl.volume = MUSIC_VOLUME;

    audioEl.addEventListener("error", () => {
      musicAvailable = false;
      updateMusicButtons();
    });
  }

  // Gently ramps the volume up so the music eases in instead of starting abruptly.
  function fadeIn() {
    clearInterval(fadeTimer);
    audioEl.volume = 0;
    fadeTimer = setInterval(() => {
      const next = Math.min(audioEl.volume + MUSIC_VOLUME / 20, MUSIC_VOLUME);
      audioEl.volume = next;
      if (next >= MUSIC_VOLUME) clearInterval(fadeTimer);
    }, 150);
  }

  function playMusic(silent = false) {
    if (!musicAvailable) {
      if (!silent) App.toast(CONTENT.music.missingNote);
      return;
    }
    // The file is only requested on the first play attempt, so a missing
    // MP3 never causes errors while the page loads.
    if (!audioEl.getAttribute("src")) audioEl.src = CONTENT.music.file;
    audioEl
      .play()
      .then(() => {
        musicPlaying = true;
        fadeIn();
        updateMusicButtons();
      })
      .catch(() => {
        musicAvailable = false;
        updateMusicButtons();
        if (!silent) App.toast(CONTENT.music.missingNote);
      });
  }

  function pauseMusic() {
    if (!audioEl) return;
    clearInterval(fadeTimer);
    audioEl.pause();
    musicPlaying = false;
    updateMusicButtons();
  }

  function toggleMusic() {
    if (musicPlaying) pauseMusic();
    else playMusic();
  }

  function toggleMute() {
    if (!audioEl) return;
    audioEl.muted = !audioEl.muted;
    updateMusicButtons();
  }

  function updateMusicButtons() {
    const playBtn = document.getElementById("music-toggle");
    const muteBtn = document.getElementById("mute-toggle");
    if (!playBtn || !muteBtn) return;

    playBtn.textContent = musicPlaying ? "⏸️" : "🎵";
    playBtn.setAttribute("aria-pressed", String(musicPlaying));
    playBtn.setAttribute(
      "aria-label",
      musicPlaying ? "Pause background music" : "Play background music"
    );
    playBtn.classList.toggle("disabled", !musicAvailable);

    const muted = audioEl ? audioEl.muted : false;
    muteBtn.textContent = muted ? "🔇" : "🔊";
    muteBtn.setAttribute("aria-pressed", String(muted));
    muteBtn.setAttribute("aria-label", muted ? "Unmute music" : "Mute music");
    muteBtn.classList.toggle("disabled", !musicAvailable);
  }

  /* ---------- Sound effects (generated — no files needed) ---------- */
  function getCtx() {
    if (!audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioCtx = new Ctx();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  // Plays a soft chime made of one or more sine tones.
  function chime(frequencies, duration = 0.35, volume = 0.12) {
    if (!sfxEnabled) return;
    const ctx = getCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.02 + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + i * 0.06);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.04);
      osc.stop(now + duration + i * 0.08);
    });
  }

  const sfx = {
    click: () => chime([660], 0.18, 0.08),
    flip: () => chime([440, 660], 0.3, 0.09),
    reveal: () => chime([523, 659, 784], 0.45, 0.1),
    celebrate: () => chime([523, 659, 784, 1046], 0.8, 0.12),
  };

  function toggleSfx() {
    sfxEnabled = !sfxEnabled;
    localStorage.setItem(STORAGE_KEY, String(sfxEnabled));
    updateSfxButton();
    if (sfxEnabled) sfx.click();
  }

  function updateSfxButton() {
    const btn = document.getElementById("sfx-toggle");
    if (!btn) return;
    btn.textContent = sfxEnabled ? "🔔" : "🔕";
    btn.setAttribute("aria-pressed", String(sfxEnabled));
    btn.setAttribute(
      "aria-label",
      sfxEnabled ? "Turn sound effects off" : "Turn sound effects on"
    );
  }

  function init() {
    initMusic();
    updateMusicButtons();
    updateSfxButton();

    document.getElementById("music-toggle").addEventListener("click", toggleMusic);
    document.getElementById("mute-toggle").addEventListener("click", toggleMute);
    document.getElementById("sfx-toggle").addEventListener("click", toggleSfx);
  }

  return { init, playMusic, pauseMusic, sfx };
})();
