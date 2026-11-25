const Gallery = (() => {
  const PLACEHOLDER = "assets/photos/photo-placeholder.svg";
  let currentIndex = 0;
  let returnFocus = null;
  let isOpen = false;

  const gallery = () => document.getElementById("photo-gallery");
  const viewer = () => document.getElementById("photo-viewer");

  function buildTiles() {
    const root = gallery();
    root.replaceChildren();

    CONTENT.surprise.photos.forEach((photo, index) => {
      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "photo-tile";
      tile.style.setProperty("--tile-index", index);
      tile.setAttribute("aria-haspopup", "dialog");
      tile.setAttribute("aria-controls", "photo-viewer");
      tile.setAttribute("aria-label", `Open photo ${index + 1}: ${photo.title}`);
      tile.addEventListener("click", () => open(index, tile));

      const image = document.createElement("img");
      image.className = "photo-tile-image";
      image.src = photo.file || PLACEHOLDER;
      image.alt = "";
      image.loading = "eager";
      image.addEventListener("error", () => {
        if (image.dataset.placeholderFallback) return;
        image.dataset.placeholderFallback = "true";
        image.src = PLACEHOLDER;
      });

      const shade = document.createElement("span");
      shade.className = "photo-tile-shade";
      shade.setAttribute("aria-hidden", "true");

      const copy = document.createElement("span");
      copy.className = "photo-tile-copy";

      const title = document.createElement("span");
      title.className = "photo-tile-title";
      title.textContent = photo.title;

      const hint = document.createElement("span");
      hint.className = "photo-tile-hint";
      hint.textContent = photo.fileName || "Open memory ↗";

      copy.append(title, hint);
      tile.append(image, shade, copy);
      root.appendChild(tile);
    });
  }

  function updateViewerImage() {
    const photo = CONTENT.surprise.photos[currentIndex];
    const image = document.getElementById("photo-viewer-image");
    image.alt = photo.file ? photo.title : "Decorative photo placeholder";
    image.dataset.placeholderFallback = "";
    image.src = photo.file || PLACEHOLDER;
    image.onerror = () => {
      if (image.dataset.placeholderFallback) return;
      image.dataset.placeholderFallback = "true";
      image.src = PLACEHOLDER;
      image.alt = "Decorative photo placeholder";
    };

    document.getElementById("photo-viewer-count").textContent =
      `MEMORY ${String(currentIndex + 1).padStart(2, "0")} / ${String(CONTENT.surprise.photos.length).padStart(2, "0")}`;
    document.getElementById("photo-viewer-title").textContent = photo.title;
    document.getElementById("photo-viewer-message").textContent = photo.message;

    const multiplePhotos = CONTENT.surprise.photos.length > 1;
    document.getElementById("photo-viewer-previous").hidden = !multiplePhotos;
    document.getElementById("photo-viewer-next").hidden = !multiplePhotos;
  }

  function open(index, trigger) {
    if (!CONTENT.surprise.photos.length) return;
    currentIndex = index;
    returnFocus = trigger;
    isOpen = true;
    updateViewerImage();
    viewer().hidden = false;
    document.body.classList.add("photo-viewer-open");
    document.getElementById("photo-viewer-close").focus();
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    viewer().hidden = true;
    document.body.classList.remove("photo-viewer-open");
    document.dispatchEvent(new CustomEvent("photo-viewer:closed"));
    if (returnFocus && returnFocus.isConnected) returnFocus.focus();
  }

  function move(direction) {
    const count = CONTENT.surprise.photos.length;
    if (!count) return;
    currentIndex = (currentIndex + direction + count) % count;
    updateViewerImage();
  }

  function handleKeydown(event) {
    if (!isOpen) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    } else if (event.key === "Tab") {
      const focusable = [...viewer().querySelectorAll("button:not([hidden])")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function init() {
    document.getElementById("photo-gallery-title").textContent =
      CONTENT.surprise.photoGalleryTitle;
    document.getElementById("photo-gallery-subtitle").textContent =
      CONTENT.surprise.photoGallerySubtitle;
    buildTiles();

    document.getElementById("photo-viewer-close").addEventListener("click", close);
    document.getElementById("photo-viewer-previous").addEventListener("click", () => move(-1));
    document.getElementById("photo-viewer-next").addEventListener("click", () => move(1));
    viewer().addEventListener("click", (event) => {
      if (event.target === viewer() || event.target.classList.contains("photo-viewer-shade")) {
        close();
      }
    });
    document.addEventListener("keydown", handleKeydown);
  }

  function reveal() {
    document.getElementById("photo-gallery-wrap").hidden = false;

    const box = document.getElementById("giftbox").getBoundingClientRect();
    const boxX = box.left + box.width / 2;
    const boxY = box.top + box.height / 2;

    gallery().querySelectorAll(".photo-tile").forEach((tile, index) => {
      const rect = tile.getBoundingClientRect();
      tile.style.setProperty("--flight-x", `${boxX - (rect.left + rect.width / 2)}px`);
      tile.style.setProperty("--flight-y", `${boxY - (rect.top + rect.height / 2)}px`);
      tile.style.setProperty("--flight-rotation", `${(index % 2 ? 1 : -1) * (8 + index * 2)}deg`);
      tile.classList.remove("pop-from-box");
      void tile.offsetWidth;
      tile.classList.add("pop-from-box");
      tile.addEventListener(
        "animationend",
        (event) => {
          if (event.animationName === "photoFlyout") tile.classList.remove("pop-from-box");
        },
        { once: true }
      );
    });
  }

  function reset() {
    close();
    document.getElementById("photo-gallery-wrap").hidden = true;
    gallery().querySelectorAll(".photo-tile").forEach((tile) => {
      tile.classList.remove("pop-from-box");
      tile.style.removeProperty("--flight-x");
      tile.style.removeProperty("--flight-y");
      tile.style.removeProperty("--flight-rotation");
    });
  }

  return { init, open, reveal, reset };
})();
