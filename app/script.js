const statuses = [
  "Neutral",
  "Engaged",
  "Confused",
  "Bored",
  "Skeptical",
  "Taking notes",
  "Interested",
];

const personas = [
  "detail-oriented",
  "supportive",
  "skeptical",
  "curious",
  "distractible",
];

const questionsByPersona = {
  "detail-oriented": [
    "Could you clarify the methodology you used to validate the results?",
    "What was your sample size, and how did you control for confounding variables?",
  ],
  supportive: [
    "How do you see this work influencing future research directions?",
    "What is the most exciting implication of your findings?",
  ],
  skeptical: [
    "How do you address alternative explanations for the observed effect?",
    "Which limitations are most likely to impact the conclusions?",
  ],
  curious: [
    "Could you expand on how this relates to prior literature?",
    "What surprised you most when analyzing the data?",
  ],
  distractible: [
    "Was there any part of the study that didn't go as expected?",
    "How would you explain this in one sentence to a non-expert?",
  ],
};

const sessionState = {
  remainingSeconds: 600,
  running: false,
  allowInterruptions: false,
  timerId: null,
  reactionId: null,
};

const timerEl = document.getElementById("timer");
const logEl = document.getElementById("log");
const questionList = document.getElementById("question-list");
const interruptToggle = document.getElementById("interrupt");

const updateTimer = () => {
  const minutes = String(Math.floor(sessionState.remainingSeconds / 60)).padStart(2, "0");
  const seconds = String(sessionState.remainingSeconds % 60).padStart(2, "0");
  timerEl.textContent = `${minutes}:${seconds}`;
};

const writeLog = (message) => {
  const entry = document.createElement("p");
  entry.textContent = message;
  logEl.appendChild(entry);
  logEl.scrollTop = logEl.scrollHeight;
};

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

const setStatus = (index, status) => {
  const statusEl = document.getElementById(`status-${index}`);
  if (!statusEl) return;
  statusEl.textContent = status;
  statusEl.className = "status";
  const lower = status.toLowerCase();
  if (lower.includes("engaged") || lower.includes("interested")) {
    statusEl.classList.add("engaged");
  } else if (lower.includes("confused")) {
    statusEl.classList.add("confused");
  } else if (lower.includes("bored")) {
    statusEl.classList.add("bored");
  } else if (lower.includes("skeptical")) {
    statusEl.classList.add("skeptical");
  }
};

const reactToTranscript = () => {
  const transcript = document.getElementById("transcript").value.toLowerCase();
  const clarityMarkers = ["in summary", "in conclusion", "this means", "key takeaway", "therefore"];
  const uncertaintyMarkers = ["maybe", "not sure", "uncertain", "could be", "possibly"];
  const markerHit = clarityMarkers.some((marker) => transcript.includes(marker));
  const uncertainHit = uncertaintyMarkers.some((marker) => transcript.includes(marker));

  for (let i = 0; i < 5; i += 1) {
    let status = randomItem(statuses);
    if (markerHit && Math.random() > 0.4) {
      status = "Engaged";
    }
    if (uncertainHit && Math.random() > 0.5) {
      status = "Confused";
    }
    setStatus(i, status);
  }

  if (sessionState.allowInterruptions && uncertainHit && Math.random() > 0.6) {
    const persona = randomItem(personas);
    writeLog(`Interruption from ${persona}: Could you clarify that last point?`);
  }
};

const tickSession = () => {
  if (!sessionState.running) return;
  if (sessionState.remainingSeconds > 0) {
    sessionState.remainingSeconds -= 1;
    updateTimer();
  }
  if (sessionState.remainingSeconds === 0) {
    sessionState.running = false;
    clearInterval(sessionState.timerId);
    clearInterval(sessionState.reactionId);
    writeLog("Session complete! Wrap up the talk and invite questions.");
  }
};

const startSession = () => {
  if (sessionState.running) return;
  sessionState.running = true;
  sessionState.timerId = setInterval(tickSession, 1000);
  sessionState.reactionId = setInterval(reactToTranscript, 12000);
  writeLog("Session started. Audience reactions updated every 12 seconds.");
};

const pauseSession = () => {
  sessionState.running = false;
  clearInterval(sessionState.timerId);
  clearInterval(sessionState.reactionId);
  writeLog("Session paused.");
};

const resetSession = () => {
  pauseSession();
  sessionState.remainingSeconds = 600;
  updateTimer();
  questionList.innerHTML = "";
  for (let i = 0; i < 5; i += 1) {
    setStatus(i, "Neutral");
  }
  writeLog("Session reset.");
};

const askQuestions = () => {
  questionList.innerHTML = "";
  const asked = new Set();
  for (let i = 0; i < 2; i += 1) {
    const persona = randomItem(personas);
    const question = randomItem(questionsByPersona[persona]);
    const combined = `${persona}: ${question}`;
    if (asked.has(combined)) {
      continue;
    }
    asked.add(combined);
    const li = document.createElement("li");
    li.textContent = combined;
    questionList.appendChild(li);
  }
  writeLog("Audience questions generated.");
};

interruptToggle.addEventListener("change", (event) => {
  sessionState.allowInterruptions = event.target.checked;
  writeLog(`Interruptions ${sessionState.allowInterruptions ? "enabled" : "disabled"}.`);
});

document.getElementById("start").addEventListener("click", startSession);
document.getElementById("pause").addEventListener("click", pauseSession);
document.getElementById("reset").addEventListener("click", resetSession);
document.getElementById("questions").addEventListener("click", askQuestions);

updateTimer();
