# 🌟 A Farewell Celebration — Interactive Website

A premium, cinematic, interactive farewell website built as a digital gift.
Pure HTML, CSS and vanilla JavaScript — **no internet connection, backend,
installs or paid services required**.

---

## 🚀 How to Run (10 seconds)

1. Open the `farewell-website` folder in File Explorer.
2. Double-click **`index.html`**.
3. It opens in your default browser (Chrome or Edge recommended).
4. Click **"Open Your Surprise ✨"** and enjoy.

That's it. Everything works offline, straight from the file.

### Open it on your phone

To view the website on a phone, the phone and computer must be on the same
private Wi-Fi network. `localhost` on the phone refers to the phone itself,
so use the computer's local network address instead.

```powershell
Set-Location "C:\Users\konduvi\OneDrive - Mercedes-Benz (corpdir.onmicrosoft.com)\Team_photos\farewell-website"
python -m http.server 8000 --bind 0.0.0.0
```

1. If Windows Firewall asks, allow Python on **Private networks only**.
2. In another PowerShell window, run `ipconfig` and find the computer's
   **IPv4 Address** under its Wi-Fi adapter (for example, `192.168.1.25`).
3. On the phone, open Chrome/Safari and visit
   `http://192.168.1.25:8000` (replace that example with your computer's IP).
4. Leave the PowerShell server window running while browsing. Press `Ctrl+C`
   there when finished.

If your company network blocks device-to-device connections, try a private
home Wi-Fi network or a phone hotspot. Do not expose the server to a public
network. The `python` command requires Python installed on the computer.

### Optional: local desktop server

For desktop-only testing, run the server inside the project folder:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

---

## 📁 Project Structure

```
farewell-website/
├── index.html            ← The entire page structure. Open this file to run.
├── README.md             ← This guide.
├── .gitignore            ← Keeps OS junk and MP3s out of git.
│
├── css/
│   ├── style.css         ← Theme colours, layout, glassmorphism, components.
│   ├── animations.css    ← Keyframes, reveals, flips, glows, reduced-motion.
│   └── responsive.css    ← Tablet and mobile layouts, mobile nav menu.
│
├── js/
│   ├── content.js        ← ✏️ ALL text lives here. Edit this to customise.
│   ├── app.js            ← Main logic: navigation, sections, surprise, finale.
│   ├── animations.js     ← Floating gold particles, stars, scroll reveals.
│   ├── confetti.js       ← Confetti bursts, golden bursts, fireworks.
│   ├── messages.js       ← Message board + user messages + LocalStorage.
│   ├── photo-gallery.js  ← Gift-reveal photo gallery + fullscreen viewer.
│   └── music.js          ← Music controls + generated sound effects.
│
├── assets/
│   ├── audio/            ← Put background-music.mp3 here (see note inside).
│   ├── photos/           ← Add your photos here (gallery placeholders included).
│   └── icons/            ← favicon.svg
│
└── screenshots/          ← Optional: save screenshots here for sharing.
```

---

## ✏️ Customising the Content

Open **`js/content.js`** in any editor (VS Code, Notepad). Everything the
website says is in that one file:

| What you want to change        | Where in content.js        |
|--------------------------------|----------------------------|
| The person's name              | `name:` (first line)       |
| Welcome screen text            | `welcome:`                 |
| Memory wall cards              | `memories:`                |
| Team messages (EN + Hindi)     | `teamMessages:`            |
| Appreciation wall categories   | `appreciation:`            |
| Surprise box message           | `surprise:`                |
| Final farewell lines           | `finale:`                  |

Save the file and refresh the browser — no build step needed.

---

## 🖼️ Adding Photos to the Surprise Gallery

The photo gallery appears immediately after the gift box opens. It starts with
six JPG placeholders that pop into view. Each tile shows the exact filename to
replace. Clicking a tile opens its photo as a full-screen backdrop with a
personal message; use the arrows or keyboard left/right keys to browse, and
press Escape to close.

Replace the matching JPG in `assets/photos/` with your own image, keeping the
same filename. No code changes are needed:

| Photo tile | Replace this file |
|---|---|
| A Moment to Remember | `photo-01.jpg` |
| The Team, Together | `photo-02.jpg` |
| Little Things, Big Memories | `photo-03.jpg` |
| A Chapter We Shared | `photo-04.jpg` |
| Smiles Along the Way | `photo-05.jpg` |
| On to New Adventures | `photo-06.jpg` |

Keep the filenames and JPG format the same, then refresh the page. The title
and short message for each image can still be changed in the matching entry
under `surprise.photos` in `js/content.js`. The photos stay local and work
offline.

---

## 🎵 Adding Background Music

1. Download a **royalty-free** celebratory instrumental as an MP3
   (e.g. from pixabay.com/music — check the licence; never use copyrighted songs).
2. Rename it to `background-music.mp3`.
3. Put it in `assets/audio/`.
4. Refresh the page. Music starts after the first click (browsers block
   autoplay before user interaction — this is normal and intended).

**No music file? No problem.** The site runs silently and shows a friendly
note if someone presses the music button. Sound effects (chimes) are
generated in the browser and work with no files at all.

---

## 🎮 Features & Controls

| Control | Where | What it does |
|---|---|---|
| 🎵 / ⏸️ | top bar | Play / pause background music |
| 🔊 / 🔇 | top bar | Mute / unmute music |
| 🔔 / 🔕 | top bar | Sound effects on / off (remembered) |
| ⛶ | top bar | Full-screen mode |
| ☰ | top bar (mobile) | Open navigation menu |
| ↑ | bottom-right | Back to top |
| Replay 🔁 | final section | Restart the whole experience |

- **Progress bar** — the thin gold line at the very top shows scroll progress.
- **Section ✓ marks** — nav links get a ✓ once visited (remembered in LocalStorage).
- **User messages** — stored as JSON data in this browser's LocalStorage, persist
  across refreshes, and can be individually deleted with the small × on each card.
  This is browser storage, not a JSON file in the project folder.
- **Keyboard** — Tab to any card/button, Enter/Space to activate.
- **Reduced motion** — if Windows "animation effects" are off, heavy motion is disabled automatically.

---

## ✅ Testing Checklist

Open `index.html` and verify each row. Press `F12` → Console to check for errors.

| # | Test | How to verify |
|---|------|---------------|
| 1 | Website opens | Double-click index.html → welcome screen appears |
| 2 | Welcome button | Click it → gold burst, overlay fades, celebration shown |
| 3 | Navigation | Click each nav link → smooth-scrolls to the section |
| 4 | Memory cards flip | Click each of the 6 cards → flips and shows message |
| 5 | Message reveal | Click "Reveal Another Message" → new card pops in each time |
| 6 | Add a message | Type a message → "Pin It" → card appears with confetti |
| 7 | Persistence and delete | Press F5 → message remains; tap its small × → it is removed |
| 8 | Validation | Submit an empty message → friendly error, nothing added |
| 9 | Appreciation wall | Click each quality → message appears, tile glows |
| 10 | Surprise box | Click "Unlock Your Surprise" → box shakes, opens, confetti |
| 11 | Photo gallery | Six photo placeholders appear after opening the gift |
| 12 | Photo backdrop | Open a tile → full-screen photo, message and arrows appear |
| 13 | Gallery keyboard | Left/right browses; Escape closes and returns focus |
| 14 | Finale | Scroll to the last section → lines appear one by one, fireworks |
| 15 | Music controls | 🎵/🔊/🔔 buttons toggle correctly |
| 16 | Replay | Click "Replay the Experience" → gallery and gift reset |
| 17 | Mobile layout | F12 → device toolbar (Ctrl+Shift+M) → pick a phone → no sideways scrolling |
| 18 | Phone access | Open the computer's LAN IP and port 8000 on a phone on the same Wi-Fi |
| 19 | Keyboard | Tab through cards and buttons, press Enter → they activate |
| 20 | Offline | Turn off Wi-Fi → refresh → everything still works |
| 21 | Console clean | F12 → Console → no red errors |


## 🔒 Privacy & Safety Notes

- No personal photos are bundled. The gallery starts with local placeholders;
  any photos you add stay in the project folder and are never uploaded.
- No data leaves the browser. User messages live only in that browser's
  LocalStorage.
- User-submitted text is rendered safely (`textContent`) — HTML/script
  injection is not possible.

Enjoy, and happy farewell! 💛
