const CONTENT = {
  // The guest of honour. Change this one line to rename the whole site.
  name: "Deepshikha Prasad",

  // ---------- Section 1: Welcome Screen ----------
  welcome: {
    heading: "Every Great Journey Deserves a Beautiful Goodbye",
    subheading: "A little something for someone who made a big difference.",
    button: "Open Your Surprise ✨",
  },

  // ---------- Section 2: A Special Celebration ----------
  celebration: {
    eyebrow: "Today, We Celebrate You",
    tagline: "More than a team lead. A mentor. A guide. An inspiration.",
  },

  // ---------- Section 3: The Memory Wall ----------
  memoriesTitle: "The Memory Wall",
  memoriesSubtitle: "Click a card to flip it and read a note of appreciation.",
  memories: [
    { icon: "🧭", title: "The Guidance",    message: "Thank you for always showing us the right direction." },
    { icon: "🤝", title: "The Support",     message: "Your encouragement made difficult days easier." },
    { icon: "📚", title: "The Learning",    message: "Every challenge became an opportunity to learn." },
    { icon: "👑", title: "The Leadership",  message: "Your leadership made teamwork meaningful." },
    { icon: "😄", title: "The Laughter",    message: "The little moments made the journey special." },
    { icon: "🌟", title: "The Inspiration", message: "Your dedication will continue to inspire us." },
  ],

  // ---------- Section 4: Messages from the Team ----------
  messagesTitle: "Messages from the Team",
  messagesSubtitle: "A few words from the people whose days you brightened.",
  revealButton: "Reveal Another Message ✉️",
  allRevealedNote: "Every message has been revealed. 💛",
  teamMessages: [
    "Thank you for your guidance and constant support.",
    "Working with you has been a wonderful learning experience.",
    "Your patience and encouragement made a difference.",
    "Wishing you happiness and success in everything ahead.",
    "You will always be remembered as an inspiring leader.",
    "Aapke guidance aur support ke liye dil se shukriya.",
    "Aapke saath kaam karna ek yaadgaar experience raha.",
    "Aapki positivity aur encouragement hamesha yaad rahegi.",
    "Aapke naye safar ke liye bahut saari shubhkamnayein.",
  ],
  addMessage: {
    formTitle: "Add Your Own Message",
    namePlaceholder: "Your name (optional)",
    messagePlaceholder: "Write your farewell message here…",
    submitButton: "Pin It to the Board 📌",
    emptyError: "Please write a message before pinning it.",
    tooLongError: "Please keep your message under 280 characters.",
    readError: "Saved messages could not be read from this browser.",
    saveError: "Could not save your message in this browser. Please try again.",
    deleteError: "Could not delete the message. Please try again.",
    savedNote: "Your message has been pinned! It will stay here even after a refresh.",
  },

  // ---------- Section 5: Interactive Appreciation Wall ----------
  appreciationTitle: "The Appreciation Wall",
  appreciationSubtitle: "Tap a quality to see what it meant to us.",
  appreciation: [
    { key: "mentor",      icon: "🎓", label: "Mentor",
      message: "You never just gave answers — you taught us how to find them. Aapne humein seekhna sikhaya." },
    { key: "inspiration", icon: "✨", label: "Inspiration",
      message: "Watching you work with such dedication inspired all of us to aim higher every single day." },
    { key: "support",     icon: "🫶", label: "Support",
      message: "On the hardest days, your calm words were the safety net we could always count on." },
    { key: "leadership",  icon: "🧭", label: "Leadership",
      message: "You led from the front, but never left anyone behind. That is true leadership." },
    { key: "positivity",  icon: "🌻", label: "Positivity",
      message: "Aapki smile aur positivity se mushkil din bhi aasaan lagte the." },
    { key: "teamspirit",  icon: "🤗", label: "Team Spirit",
      message: "You turned a group of colleagues into a family. Yeh team spirit aapki den hai." },
  ],

  // ---------- Section 6: The Surprise Box ----------
  surprise: {
    title: "There's One More Surprise...",
    button: "Unlock Your Surprise 🎁",
    message:
      "Some people make a difference in our work. Some make a difference in our journey. You have done both.",
    closing: "Thank you, Deepshikha!",
    photoGalleryTitle: "A Few Moments to Keep",
    photoGallerySubtitle: "Open a photo for a little note of appreciation.",
    photos: [
      {
        file: "assets/photos/Photo2.jpeg",
        fileName: "photo-01.jpg",
        title: "A Moment to Remember",
        message: "Every shared moment becomes part of a journey worth celebrating.",
      },
      {
        file: "assets/photos/Photo1.jpeg",
        fileName: "photo-02.jpg",
        title: "The Team, Together",
        message: "The best memories are the ones we make together.",
      },
      {
        file: "assets/photos/Photo3.jpeg",
        fileName: "photo-03.jpg",
        title: "Little Things, Big Memories",
        message: "It is often the little moments that stay with us the longest.",
      },
      {
        file: "assets/photos/Photo4.jpeg",
        fileName: "photo-04.jpg",
        title: "A Chapter We Shared",
        message: "Thank you for making this chapter brighter for me.",
      },
      {
        file: "assets/photos/Photo5.jpeg",
        fileName: "photo-05.jpg",
        title: "Smiles We Shared as a Team",
        message: "The smiles and memories we shared as a team will stay with us long after this chapter ends.",
      },
      {
        file: "assets/photos/Photo6.png",
        fileName: "photo-06.jpg",
        title: "On to New Adventures",
        message: "Wherever you go next, a little piece of this team goes with you.",
      },
    ],
  },

  // ---------- Section 7: The Final Farewell ----------
  finale: {
    lines: [
      "New Beginnings. New Opportunities. New Adventures.",
      "May your next chapter be filled with happiness, success, and unforgettable moments.",
      "Your guidance will stay with us, wherever the journey takes us.",
    ],
    thankYou: "Thank You, Deepshikha Prasad ❤️",
    legacy: "Some leaders leave a position. Great leaders leave a legacy.",
    replayButton: "Replay the Experience 🔁",
  },

  // ---------- Navigation labels ----------
  nav: [
    { id: "celebration",  label: "Celebration" },
    { id: "memories",     label: "Memories" },
    { id: "messages",     label: "Messages" },
    { id: "appreciation", label: "Appreciation" },
    { id: "surprise",     label: "Surprise" },
    { id: "finale",       label: "Farewell" },
  ],

  // ---------- Music ----------
  music: {
    // Drop your royalty-free instrumental at this path to enable music.
    file: "assets/audio/background-music.mp3",
    missingNote:
      "No music file found. Add assets/audio/background-music.mp3 to enable background music.",
  },
};
