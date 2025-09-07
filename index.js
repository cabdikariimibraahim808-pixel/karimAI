const chatHistory = document.getElementById("chat-history");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const newChatBtn = document.getElementById("new-chat-btn");
const chatList = document.getElementById("chat-list");
const chatTitle = document.getElementById("chat-title");
const typingIndicator = document.getElementById("typing-indicator");
const clearAllBtn = document.getElementById("clear-all-btn");

// Responses: 50 Q&A + 50 websites (partial example, extendable)
const responses = [
  { keywords:["hello","hi"], reply:"👋 Greetings, traveler of the future."},
  { keywords:["who are you"], reply:"🤖 I am Karim AI, a futuristic assistant."},
  { keywords:["help"], reply:"⚡ I can assist with knowledge, simulations, and neon wisdom."},
  { keywords:["bye"], reply:"👾 Powering down. See you soon!"},
  { keywords:["raazim bus"], reply:"🚌 RAAZIM Bus is a premium bus service in Somaliland. Visit: https://raazimbus.com"},
  { keywords:["animekai"], reply:"🎥 AnimeKai streams anime online. Visit: https://animekai.to/home"},
  { keywords:["starbus"], reply:"🚍 StarBus booking: https://starbus.com"},
  { keywords:["hianime"], reply:"📺 HiAnime streaming: https://hianime.com"},
  { keywords:["google"], reply:"🌐 Google: https://www.google.com"},
  { keywords:["youtube"], reply:"📹 YouTube: https://www.youtube.com"},
  { keywords:["github"], reply:"💻 GitHub: https://github.com"},
  { keywords:["stackoverflow"], reply:"📝 StackOverflow: https://stackoverflow.com"},
  { keywords:["news"], reply:"📰 Latest news: https://www.bbc.com/news"},
  { keywords:["maps"], reply:"🗺️ Google Maps: https://www.google.com/maps"},
  { keywords:["translate"], reply:"🌐 Translate: https://translate.google.com"},
  { keywords:["netflix"], reply:"🎬 Netflix: https://www.netflix.com"},
  { keywords:["spotify"], reply:"🎵 Spotify: https://www.spotify.com"},
  { keywords:["tiktok"], reply:"📱 TikTok: https://www.tiktok.com"},
  { keywords:["facebook"], reply:"📘 Facebook: https://www.facebook.com"},
  { keywords:["twitter"], reply:"🐦 Twitter: https://twitter.com"},
  { keywords:["instagram"], reply:"📸 Instagram: https://www.instagram.com"},
  { keywords:["linkedin"], reply:"💼 LinkedIn: https://www.linkedin.com"},
  { keywords:["reddit"], reply:"👽 Reddit: https://www.reddit.com"},
  { keywords:["wikipedia"], reply:"📚 Wikipedia: https://www.wikipedia.org"},
  { keywords:["amazon"], reply:"🛒 Amazon: https://www.amazon.com"},
  { keywords:["ebay"], reply:"🛍️ eBay: https://www.ebay.com"},
  { keywords:["cnn"], reply:"📰 CNN: https://www.cnn.com"},
  { keywords:["bbc"], reply:"📰 BBC: https://www.bbc.com"},
  { keywords:["quora"], reply:"❓ Quora: https://www.quora.com"},
  { keywords:["medium"], reply:"✍️ Medium: https://medium.com"},
  { keywords:["khan academy"], reply:"📖 Khan Academy: https://www.khanacademy.org"},
  { keywords:["edx"], reply:"🎓 edX: https://www.edx.org"},
  { keywords:["coursera"], reply:"📚 Coursera: https://www.coursera.org"},
  { keywords:["udemy"], reply:"🎓 Udemy: https://www.udemy.com"},
  { keywords:["freecodecamp"], reply:"💻 FreeCodeCamp: https://www.freecodecamp.org"},
];

// Sessions management
let sessions = JSON.parse(localStorage.getItem("karimAISessions")) || [[]];
let currentSessionIndex = sessions.length - 1;

function saveSessions() {
  localStorage.setItem("karimAISessions", JSON.stringify(sessions));
}

// Render chat
function renderChat() {
  chatHistory.innerHTML = "";
  if (sessions[currentSessionIndex].length === 0) {
    chatHistory.innerHTML = `<div class="welcome-screen">
      <h2>👾 Welcome to Karim AI</h2>
      <p>Your futuristic AI assistant is ready.</p>
    </div>`;
  } else {
    sessions[currentSessionIndex].forEach(msg => appendMessage(msg.text, msg.className, false));
  }
  renderChatList();
}

// Append a message to chat
function appendMessage(text, className, save = true) {
  const msg = document.createElement("div");
  msg.classList.add("chat-message", className);
  msg.innerHTML = text.includes("https://") ? text.replace(/(https?:\/\/\S+)/g, '<a href="$1" target="_blank">$1</a>') : text;

  if (className === "ai-message") {
    const copyBtn = document.createElement("button");
    copyBtn.classList.add("copy-btn");
    copyBtn.textContent = "📋";
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(text);
      alert("Copied!");
    });
    msg.appendChild(copyBtn);
  }

  chatHistory.appendChild(msg);
  chatHistory.scrollTop = chatHistory.scrollHeight;

  if (save) {
    sessions[currentSessionIndex].push({ text, className });
    saveSessions();
    renderChatList();
  }
}

// Find response
function findResponse(message) {
  message = message.toLowerCase();
  for (let res of responses) {
    for (let key of res.keywords) {
      if (message.includes(key)) return res.reply;
    }
  }
  return "✨ The future is uncertain, but I’m here to guide you.";
}

// Send message
sendBtn.addEventListener("click", () => {
  const message = userInput.value.trim();
  if (!message) return;
  appendMessage(message, "user-message");
  userInput.value = "";

  typingIndicator.classList.remove("hidden");

  setTimeout(() => {
    typingIndicator.classList.add("hidden");
    const response = findResponse(message);
    appendMessage(response, "ai-message");
  }, 1000);
});

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

// New chat
newChatBtn.addEventListener("click", () => {
  sessions.push([]);
  currentSessionIndex = sessions.length - 1;
  saveSessions();
  renderChat();
  chatTitle.textContent = "New Chat";
});

// Render chat list
function renderChatList() {
  chatList.innerHTML = "";
  sessions.forEach((session, index) => {
    const div = document.createElement("div");
    div.classList.add("chat-item");

    const title = document.createElement("span");
    title.textContent = session.length > 0 ? session[0].text.slice(0, 20) + "..." : "Empty Chat";
    title.addEventListener("click", () => {
      currentSessionIndex = index;
      renderChat();
      chatTitle.textContent = title.textContent;
    });

    const delBtn = document.createElement("button");
    delBtn.classList.add("delete-btn");
    delBtn.textContent = "🗑";
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      sessions.splice(index, 1);
      if (currentSessionIndex >= sessions.length) currentSessionIndex = sessions.length - 1;
      saveSessions();
      renderChat();
    });

    div.appendChild(title);
    div.appendChild(delBtn);
    chatList.appendChild(div);
  });
}

// Clear all
clearAllBtn.addEventListener("click", () => {
  if (confirm("Clear all chats?")) {
    sessions = [[]];
    currentSessionIndex = 0;
    saveSessions();
    renderChat();
    chatTitle.textContent = "Welcome";
  }
});

// Initial render
renderChat();
