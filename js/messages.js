const Messages = (() => {
  const STORAGE_KEY = "farewell.userMessages";
  const REVEAL_KEY = "farewell.revealedCount";
  const MAX_LENGTH = 280;

  let revealedCount = 0;

  const board = () => document.getElementById("message-board");

  function createMessageId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }

  /* ---------- Rendering ---------- */
  function buildCard(text, author, isUser, messageId = "") {
    const card = document.createElement("article");
    card.className = "message-card pop" + (isUser ? " user-message" : "");

    const p = document.createElement("p");
    p.textContent = text; // textContent = safe, no HTML injection
    card.appendChild(p);

    if (author) {
      const span = document.createElement("span");
      span.className = "message-author";
      span.textContent = "— " + author;
      card.appendChild(span);
    }

    if (isUser) {
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "message-delete";
      deleteButton.textContent = "×";
      deleteButton.setAttribute(
        "aria-label",
        author ? `Delete message from ${author}` : "Delete your message"
      );
      deleteButton.title = "Delete this message";
      deleteButton.addEventListener("click", () => deleteMessage(messageId, card));
      card.appendChild(deleteButton);
    }

    return card;
  }

  function loadUserMessages() {
    let raw;
    try {
      raw = localStorage.getItem(STORAGE_KEY);
    } catch {
      App.toast(CONTENT.addMessage.readError);
      return null;
    }

    if (!raw) return [];

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      App.toast(CONTENT.addMessage.readError);
      return null;
    }

    if (!Array.isArray(parsed)) {
      App.toast(CONTENT.addMessage.readError);
      return null;
    }

    const validMessages = parsed.filter(
      (message) => message && typeof message === "object" && typeof message.text === "string"
    );
    let needsMigration = validMessages.length !== parsed.length;
    const messages = validMessages.map((message) => {
      const normalized = {
        id: typeof message.id === "string" && message.id ? message.id : createMessageId(),
        text: message.text,
        author: typeof message.author === "string" ? message.author : "",
      };
      if (normalized.id !== message.id || normalized.author !== message.author) {
        needsMigration = true;
      }
      return normalized;
    });

    if (needsMigration) {
      try {
        saveUserMessages(messages);
      } catch {
        App.toast(CONTENT.addMessage.saveError);
        return null;
      }
    }
    return messages;
  }

  function saveUserMessages(messages) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }

  function deleteMessage(messageId, card) {
    const messages = loadUserMessages();
    if (!messages) return;

    try {
      saveUserMessages(messages.filter((message) => message.id !== messageId));
      card.remove();
      Sound.sfx.click();
    } catch {
      App.toast(CONTENT.addMessage.deleteError);
    }
  }

  /* ---------- Reveal flow ---------- */
  function revealNext() {
    if (revealedCount >= CONTENT.teamMessages.length) return;

    const card = buildCard(CONTENT.teamMessages[revealedCount], "", false);
    board().appendChild(card);
    revealedCount++;
    sessionStorage.setItem(REVEAL_KEY, String(revealedCount));

    Sound.sfx.reveal();
    updateRevealButton();

    card.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function updateRevealButton() {
    const btn = document.getElementById("reveal-btn");
    const note = document.getElementById("all-revealed-note");
    const done = revealedCount >= CONTENT.teamMessages.length;
    btn.disabled = done;
    btn.style.opacity = done ? "0.45" : "1";
    note.textContent = done ? CONTENT.allRevealedNote : "";
  }

  /* ---------- User message form ---------- */
  function setFeedback(text, kind) {
    const el = document.getElementById("form-feedback");
    el.textContent = text;
    el.className = "form-feedback" + (kind ? " " + kind : "");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nameInput = document.getElementById("msg-name");
    const textInput = document.getElementById("msg-text");

    const name = nameInput.value.trim().slice(0, 60);
    const text = textInput.value.trim();

    if (!text) {
      setFeedback(CONTENT.addMessage.emptyError, "error");
      textInput.focus();
      return;
    }
    if (text.length > MAX_LENGTH) {
      setFeedback(CONTENT.addMessage.tooLongError, "error");
      textInput.focus();
      return;
    }

    const messages = loadUserMessages();
    if (!messages) {
      setFeedback(CONTENT.addMessage.readError, "error");
      return;
    }
    const message = { id: createMessageId(), text, author: name };
    messages.push(message);
    try {
      saveUserMessages(messages);
    } catch {
      setFeedback(CONTENT.addMessage.saveError, "error");
      return;
    }

    board().appendChild(buildCard(text, name, true, message.id));
    Sound.sfx.celebrate();
    FX.confettiBurst(window.innerWidth / 2, window.innerHeight * 0.6, 50);

    textInput.value = "";
    nameInput.value = "";
    setFeedback(CONTENT.addMessage.savedNote, "success");
  }

  /* ---------- Init / reset ---------- */
  function init() {
    // Restore reveal progress for this browsing session.
    revealedCount = 0;
    const saved = parseInt(sessionStorage.getItem(REVEAL_KEY) || "0", 10);
    const target = Math.min(
      Number.isNaN(saved) ? 0 : saved,
      CONTENT.teamMessages.length
    );

    // Always start with at least one message visible.
    board().replaceChildren();
    const initial = Math.max(target, 1);
    for (let i = 0; i < initial; i++) {
      board().appendChild(buildCard(CONTENT.teamMessages[i], "", false));
    }
    revealedCount = initial;
    sessionStorage.setItem(REVEAL_KEY, String(revealedCount));

    // Restore pinned user messages (persist across refreshes).
    const savedMessages = loadUserMessages();
    for (const m of savedMessages || []) {
      board().appendChild(buildCard(m.text, m.author, true, m.id));
    }

    updateRevealButton();

    document.getElementById("reveal-btn").addEventListener("click", revealNext);
    document.getElementById("message-form").addEventListener("submit", handleSubmit);
  }

  // Used by the Replay button: collapse back to one revealed message
  // but keep the user's pinned messages.
  function resetReveals() {
    sessionStorage.removeItem(REVEAL_KEY);
    revealedCount = 0;
    board().replaceChildren();
    board().appendChild(buildCard(CONTENT.teamMessages[0], "", false));
    revealedCount = 1;
    const savedMessages = loadUserMessages();
    for (const m of savedMessages || []) {
      board().appendChild(buildCard(m.text, m.author, true, m.id));
    }
    updateRevealButton();
    setFeedback("", "");
  }

  return { init, resetReveals };
})();
