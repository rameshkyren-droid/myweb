/* =========================================================
   Uti-Mate Spin The Wheel — isolated feature script
   Runs only on .spin-wheel-page
   ========================================================= */
(() => {
  "use strict";

  const page = document.querySelector(".spin-wheel-page");
  if (!page) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const STORAGE_KEY = "utiMateSpinWheel.v4";
  const HISTORY_LIMIT = 40;
  const TAU = Math.PI * 2;

  const themes = {
    neon: {
      name: "Neon Rush",
      className: "sw-theme-neon",
      colors: ["#39ff14", "#00e5ff", "#ff00ff", "#ffff00", "#00ff9d", "#ff3131", "#8a2be2", "#00bfff"]
    },
    bubblegum: {
      name: "Bubblegum Pop",
      className: "sw-theme-bubblegum",
      colors: ["#ff4ecd", "#22d3ee", "#facc15", "#fb7185", "#a78bfa", "#34d399", "#f97316", "#60a5fa"]
    },
    galaxy: {
      name: "Galaxy Glow",
      className: "sw-theme-galaxy",
      colors: ["#7c3aed", "#ec4899", "#38bdf8", "#f472b6", "#a855f7", "#22d3ee", "#c084fc", "#fb7185"]
    },
    sunset: {
      name: "Sunset Pop",
      className: "sw-theme-sunset",
      colors: ["#fb7185", "#f59e0b", "#fde68a", "#f97316", "#f43f5e", "#fbbf24", "#e879f9", "#fda4af"]
    },
    ocean: {
      name: "Ocean Wave",
      className: "sw-theme-ocean",
      colors: ["#0ea5e9", "#14b8a6", "#a7f3d0", "#38bdf8", "#06b6d4", "#22d3ee", "#0891b2", "#67e8f9"]
    },
    arcade: {
      name: "Arcade Blast",
      className: "sw-theme-arcade",
      colors: ["#22c55e", "#eab308", "#ef4444", "#3b82f6", "#a855f7", "#f97316", "#06b6d4", "#84cc16"]
    },
    luxury: {
      name: "Luxury Gold",
      className: "sw-theme-luxury",
      colors: ["#d4af37", "#f8e7a1", "#8b5a2b", "#f5c542", "#3b2f1b", "#c8a951", "#fff2b2", "#a67c00"]
    },
    ice: {
      name: "Ice Chrome",
      className: "sw-theme-ice",
      colors: ["#2563eb", "#7c3aed", "#06b6d4", "#bfdbfe", "#60a5fa", "#22d3ee", "#c4b5fd", "#93c5fd"]
    },
    forest: {
      name: "Forest Lime",
      className: "sw-theme-forest",
      colors: ["#16a34a", "#65a30d", "#f59e0b", "#22c55e", "#84cc16", "#15803d", "#facc15", "#10b981"]
    },
    mono: {
      name: "Mono Clean",
      className: "sw-theme-mono",
      colors: ["#0f172a", "#475569", "#94a3b8", "#e2e8f0", "#334155", "#64748b", "#cbd5e1", "#1e293b"]
    }
  };

  const templates = [
    { id: "food", title: "Food Picker", desc: "Dinner, snacks, takeout", entries: ["Pizza | 2 | 🍕", "Burgers | 1 | 🍔", "Sushi | 1 | 🍣", "Tacos | 1 | 🌮", "Pasta | 1 | 🍝", "Ramen | 1 | 🍜", "Thai food | 1 | 🍛", "Korean food | 1 | 🍲", "BBQ | 1 | 🍖", "Salad | 1 | 🥗"] },
    { id: "giveaway", title: "Giveaway", desc: "Winner picker", entries: ["Alex", "Mia", "Noah", "Sophia", "Ethan", "Ava", "Liam", "Emma", "Lucas", "Olivia", "Amelia", "Leo"] },
    { id: "truthdare", title: "Truth/Dare", desc: "Party prompts", entries: ["Truth: last thing you searched? | 1 | 👀", "Dare: sing 20 seconds | 1 | 🎤", "Truth: biggest crush? | 1 | 💘", "Dare: funny dance | 1 | 🕺", "Truth: embarrassing moment? | 1 | 😳", "Dare: act like a celebrity | 1 | 🎬", "Truth: secret talent? | 1 | ⭐", "Dare: no laughing 1 minute | 1 | 😂"] },
    { id: "challenge", title: "Challenge", desc: "Games and streams", entries: ["No healing | 1 | ❤️", "Pistol only | 1 | 🔫", "One hand for 30 sec | 1 | ✋", "Random character | 1 | 🎮", "Silent round | 1 | 🤫", "Highest difficulty | 1 | 🔥", "Speedrun attempt | 1 | ⏱️", "Swap controls | 1 | 🎲"] },
    { id: "yesno", title: "Yes / No", desc: "Quick decisions", entries: ["Yes | 1 | ✅", "No | 1 | ❌", "Maybe | 1 | 🤔", "Ask again | 1 | 🔁"] },
    { id: "team", title: "Teams", desc: "Split choices", entries: ["Team Red | 1 | 🔴", "Team Blue | 1 | 🔵", "Team Green | 1 | 🟢", "Team Yellow | 1 | 🟡", "Team Purple | 1 | 🟣", "Team Orange | 1 | 🟠"] },
    { id: "study", title: "Study Break", desc: "Break ideas", entries: ["Stretch 5 minutes | 1 | 🧘", "Drink water | 1 | 💧", "Short walk | 1 | 🚶", "Clean desk | 1 | 🧼", "Breathing exercise | 1 | 🌬️", "No phone break | 1 | 📵", "Snack break | 1 | 🍎", "Power nap | 1 | 😴"] },
    { id: "chores", title: "Chores", desc: "Home tasks", entries: ["Wash dishes | 1 | 🍽️", "Take trash out | 1 | 🗑️", "Vacuum | 1 | 🧹", "Laundry | 1 | 👕", "Wipe table | 1 | 🧽", "Water plants | 1 | 🪴", "Organize shelf | 1 | 📚", "Clean bathroom | 1 | 🚿"] },
    { id: "date", title: "Date Ideas", desc: "Cute choices", entries: ["Movie night | 1 | 🎬", "Coffee date | 1 | ☕", "Picnic | 1 | 🧺", "Arcade | 1 | 🕹️", "Museum | 1 | 🖼️", "Dessert hunt | 1 | 🍰", "Sunset walk | 1 | 🌅", "Cook together | 1 | 🍳"] },
    { id: "number", title: "Numbers", desc: "1 to 20", entries: Array.from({ length: 20 }, (_, i) => String(i + 1)) }
  ];

  const el = {
    shell: $("#spinWheelStudio"),
    workspace: $("#swWorkspace"),
    canvas: $("#swWheelCanvas"),
    confettiCanvas: $("#swConfettiCanvas"),
    wrap: $("#swWheelWrap"),
    displayTitle: $("#swDisplayTitle"),
    titleInput: $("#swWheelTitle"),
    entriesInput: $("#swEntries"),
    templateGrid: $("#swTemplateGrid"),
    entryCount: $("#swEntryCount"),
    spinCount: $("#swSpinCount"),
    modeName: $("#swModeName"),
    resultText: $("#swResultText"),
    resultMeta: $("#swResultMeta"),
    historyList: $("#swHistoryList"),
    themeSelect: $("#swThemeSelect"),
    paletteStyle: $("#swPaletteStyle"),
    wheelTexture: $("#swWheelTexture"),
    fontSelect: $("#swFontSelect"),
    soundPack: $("#swSoundPack"),
    duration: $("#swDurationSelect"),
    wheelSize: $("#swWheelSize"),
    textSize: $("#swTextSize"),
    confettiAmount: $("#swConfettiAmount"),
    removeWinner: $("#swRemoveWinner"),
    noRepeat: $("#swNoRepeat"),
    weightedVisual: $("#swWeightedVisual"),
    hideLabels: $("#swHideLabels"),
    autoSave: $("#swAutoSave"),
    winnerMessage: $("#swWinnerMessage"),
    centerInput: $("#swCenterInput"),
    centerText: $("#swCenterText"),
    soundToggle: $("#swSoundToggle"),
    confettiToggle: $("#swConfettiToggle"),
    fullscreenBtn: $("#swFullscreenBtn"),
    modal: $("#swWinnerModal"),
    modalName: $("#swWinnerModalName"),
    modalMessage: $("#swWinnerModalMessage"),
    modalMeta: $("#swWinnerModalMeta")
  };

  const state = {
    entries: [],
    rotation: 0,
    spinning: false,
    history: [],
    lastWinner: null,
    spinCount: 0,
    sound: true,
    confetti: true,
    audioContext: null,
    tickTimer: null
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function showToast(message) {
    const toast = document.querySelector("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function safeNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function normalizeAngle(angle) {
    return ((angle % TAU) + TAU) % TAU;
  }

  function parseEntryLine(line, index) {
    const parts = String(line || "").split("|").map(part => part.trim());
    const text = parts[0];
    if (!text) return null;
    let weight = 1;
    let emoji = "";
    if (parts[1]) {
      const maybeWeight = Number(parts[1]);
      if (Number.isFinite(maybeWeight) && maybeWeight > 0) weight = Math.min(999, maybeWeight);
      else emoji = parts[1];
    }
    if (parts[2]) emoji = parts[2];
    return { text, weight, emoji, index, key: `${text.toLowerCase()}-${index}` };
  }

  function parseEntries() {
    const list = el.entriesInput.value
      .split(/\r?\n/)
      .map(parseEntryLine)
      .filter(Boolean)
      .slice(0, 500);
    state.entries = list;
    return list;
  }

  function entryDisplay(entry) {
    return `${entry.emoji ? entry.emoji + " " : ""}${entry.text}`;
  }

  function getTheme() {
    return themes[el.themeSelect.value] || themes.neon;
  }

  function getPalette() {
    const base = getTheme().colors.slice();
    const style = el.paletteStyle.value;
    if (style === "soft") return base.map(c => mixColor(c, "#ffffff", 0.33));
    if (style === "mono") return base.map((_, i) => mixColor(base[0], i % 2 ? "#ffffff" : "#000000", i % 2 ? 0.36 : 0.12));
    if (style === "contrast") return base.map((c, i) => i % 2 ? "#111827" : c);
    return base;
  }

  function mixColor(hex, other, amount) {
    const a = hexToRgb(hex);
    const b = hexToRgb(other);
    const r = Math.round(a.r + (b.r - a.r) * amount);
    const g = Math.round(a.g + (b.g - a.g) * amount);
    const bl = Math.round(a.b + (b.b - a.b) * amount);
    return `rgb(${r}, ${g}, ${bl})`;
  }

  function hexToRgb(hex) {
    const h = hex.replace("#", "").trim();
    const full = h.length === 3 ? h.split("").map(x => x + x).join("") : h;
    return {
      r: parseInt(full.slice(0, 2), 16) || 0,
      g: parseInt(full.slice(2, 4), 16) || 0,
      b: parseInt(full.slice(4, 6), 16) || 0
    };
  }

  function getSegments() {
    const entries = state.entries.length ? state.entries : [parseEntryLine("Add entries", 0)];
    const weighted = el.weightedVisual.checked;
    const total = weighted ? entries.reduce((sum, e) => sum + Math.max(0.001, e.weight), 0) : entries.length;
    let cursor = 0;
    return entries.map((entry) => {
      const share = weighted ? Math.max(0.001, entry.weight) / total : 1 / total;
      const start = cursor;
      const end = cursor + share * TAU;
      cursor = end;
      return { entry, start, end, center: start + (end - start) / 2 };
    });
  }

  function drawWheel() {
    parseEntries();
    updateStats();
    const canvas = el.canvas;
    const ctx = canvas.getContext("2d");
    const size = 1200;
    const center = size / 2;
    const radius = 540;
    ctx.clearRect(0, 0, size, size);

    const segments = getSegments();
    const colors = getPalette();
    const texture = el.wheelTexture.value;
    const textSize = safeNumber(el.textSize.value, 28);
    const hideLabels = state.spinning && el.hideLabels.checked;

    // outer glow
    const glow = ctx.createRadialGradient(center, center, 120, center, center, 590);
    glow.addColorStop(0, "rgba(255,255,255,.16)");
    glow.addColorStop(.72, "rgba(255,255,255,.08)");
    glow.addColorStop(1, "rgba(0,0,0,.18)");
    ctx.beginPath();
    ctx.arc(center, center, 590, 0, TAU);
    ctx.fillStyle = glow;
    ctx.fill();

    segments.forEach((seg, i) => {
      const start = state.rotation + seg.start;
      const end = state.rotation + seg.end;
      const color = colors[i % colors.length];
      const next = colors[(i + 1) % colors.length];
      const grad = ctx.createRadialGradient(center, center, 40, center, center, radius);
      grad.addColorStop(0, mixColor(color, "#ffffff", .32));
      grad.addColorStop(.62, color);
      grad.addColorStop(1, mixColor(next, "#000000", .1));

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,.72)";
      ctx.lineWidth = 5;
      ctx.stroke();

      if (texture === "glass") {
        ctx.save();
        ctx.globalAlpha = .24;
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius * .82, start, end);
        ctx.closePath();
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.restore();
      }

      if (texture === "arcade") {
        ctx.save();
        ctx.strokeStyle = "rgba(255,255,255,.35)";
        ctx.lineWidth = 2;
        for (let r = 170; r < radius; r += 82) {
          ctx.beginPath();
          ctx.arc(center, center, r, start, end);
          ctx.stroke();
        }
        ctx.restore();
      }

      if (texture === "comic") {
        ctx.save();
        ctx.strokeStyle = "rgba(0,0,0,.18)";
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.restore();
      }

      if (!hideLabels && segments.length <= 80) drawLabel(ctx, seg, start, end, center, radius, textSize, i);
    });

    // ring
    ctx.beginPath();
    ctx.arc(center, center, radius + 4, 0, TAU);
    ctx.strokeStyle = "rgba(255,255,255,.78)";
    ctx.lineWidth = 14;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(center, center, radius + 16, 0, TAU);
    ctx.strokeStyle = "rgba(0,0,0,.18)";
    ctx.lineWidth = 4;
    ctx.stroke();

    // hub shadow behind button
    const hub = ctx.createRadialGradient(center, center, 20, center, center, 115);
    hub.addColorStop(0, "rgba(255,255,255,.92)");
    hub.addColorStop(1, "rgba(0,0,0,.18)");
    ctx.beginPath();
    ctx.arc(center, center, 94, 0, TAU);
    ctx.fillStyle = hub;
    ctx.fill();
  }

  function drawLabel(ctx, seg, start, end, center, radius, textSize, i) {
    const arc = end - start;
    if (arc < 0.055) return;
    const angle = start + arc / 2;
    const label = entryDisplay(seg.entry);
    const weightNote = seg.entry.weight > 1 ? ` ×${seg.entry.weight}` : "";
    const text = `${label}${weightNote}`;
    const font = el.fontSelect.value;
    const family = font === "mono" ? "ui-monospace, SFMono-Regular, Menlo, monospace" : font === "playful" ? "Trebuchet MS, Comic Sans MS, system-ui" : "Inter, system-ui, sans-serif";
    const weight = font === "rounded" || font === "playful" ? 900 : 1000;

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(angle);
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.font = `${weight} ${Math.max(12, Math.min(textSize, arc * 170))}px ${family}`;
    ctx.fillStyle = shouldUseDarkText(i) ? "rgba(15,23,42,.92)" : "rgba(255,255,255,.98)";
    ctx.shadowColor = shouldUseDarkText(i) ? "rgba(255,255,255,.24)" : "rgba(0,0,0,.36)";
    ctx.shadowBlur = 3;
    const maxWidth = radius * .69;
    ctx.fillText(truncateText(ctx, text, maxWidth), radius - 36, 0, maxWidth);
    ctx.restore();
  }

  function shouldUseDarkText(index) {
    const theme = el.themeSelect.value;
    return ["ice", "bubblegum", "forest", "sunset", "mono", "ocean"].includes(theme) && index % 3 !== 0;
  }

  function truncateText(ctx, text, maxWidth) {
    if (ctx.measureText(text).width <= maxWidth) return text;
    let out = text;
    while (out.length > 4 && ctx.measureText(out + "…").width > maxWidth) out = out.slice(0, -1);
    return out + "…";
  }

  function updateStats() {
    el.entryCount.textContent = state.entries.length;
    el.spinCount.textContent = state.spinCount;
    el.modeName.textContent = el.weightedVisual.checked ? "Weighted" : "Classic";
    el.displayTitle.textContent = el.titleInput.value.trim() || "Spin The Wheel";
    el.centerText.textContent = (el.centerInput.value.trim() || "SPIN").slice(0, 12);
    el.wrap.style.setProperty("--sw-wheel-size", `${safeNumber(el.wheelSize.value, 660)}px`);
  }

  function chooseWinner() {
    const entries = parseEntries();
    if (!entries.length) return null;
    let pool = entries;
    if (el.noRepeat.checked && state.lastWinner && entries.length > 1) {
      pool = entries.filter(e => e.text !== state.lastWinner.text || e.emoji !== state.lastWinner.emoji);
    }
    const total = pool.reduce((sum, e) => sum + Math.max(0.001, e.weight), 0);
    let pick = Math.random() * total;
    for (const entry of pool) {
      pick -= Math.max(0.001, entry.weight);
      if (pick <= 0) return entry;
    }
    return pool[pool.length - 1];
  }

  function findSegmentForEntry(entry) {
    const segments = getSegments();
    return segments.find(seg => seg.entry.index === entry.index && seg.entry.text === entry.text) || segments[0];
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function spin() {
    if (state.spinning) return;
    const entries = parseEntries();
    if (entries.length < 2) {
      showToast("Add at least two entries to spin.");
      return;
    }
    const winner = chooseWinner();
    if (!winner) return;

    state.spinning = true;
    el.resultText.textContent = "Spinning...";
    el.resultMeta.textContent = "Result is being selected randomly in your browser.";
    const winnerSeg = findSegmentForEntry(winner);
    const current = normalizeAngle(state.rotation);
    const targetBase = normalizeAngle(-Math.PI / 2 - winnerSeg.center);
    let delta = targetBase - current;
    if (delta < 0) delta += TAU;
    const spins = 7 + Math.floor(Math.random() * 4);
    const jitter = (Math.random() - .5) * Math.min(0.08, (winnerSeg.end - winnerSeg.start) * .45);
    const endRotation = state.rotation + spins * TAU + delta + jitter;
    const startRotation = state.rotation;
    const duration = safeNumber(el.duration.value, 5.5) * 1000;
    const startTime = performance.now();

    startTickSound();
    drawWheel();

    function frame(now) {
      const t = Math.min(1, (now - startTime) / duration);
      state.rotation = startRotation + (endRotation - startRotation) * easeOutCubic(t);
      drawWheel();
      if (t < 1) requestAnimationFrame(frame);
      else finishSpin(winner);
    }
    requestAnimationFrame(frame);
  }

  function finishSpin(winner) {
    state.rotation = normalizeAngle(state.rotation);
    state.spinning = false;
    stopTickSound();
    state.lastWinner = winner;
    state.spinCount += 1;
    const record = { text: entryDisplay(winner), rawText: winner.text, emoji: winner.emoji, weight: winner.weight, timestamp: Date.now(), spin: state.spinCount };
    state.history.unshift(record);
    state.history = state.history.slice(0, HISTORY_LIMIT);
    showWinner(record);
    if (state.confetti) launchConfetti();
    playWinSound();
    if (el.removeWinner.checked) removeWinnerFromInput(winner);
    updateStats();
    renderHistory();
    saveIfNeeded();
    drawWheel();
  }

  function showWinner(record) {
    const msg = el.winnerMessage.value.trim() || "The wheel picked";
    const title = el.titleInput.value.trim() || "Spin The Wheel";
    el.resultText.textContent = record.text;
    el.resultMeta.textContent = `${msg} • Spin #${record.spin} • ${new Date(record.timestamp).toLocaleTimeString()}`;
    el.modalName.textContent = record.text;
    el.modalMessage.textContent = `${msg} from “${title}”`;
    el.modalMeta.textContent = `Spin #${record.spin} • ${new Date(record.timestamp).toLocaleString()}`;
    el.modal.classList.add("show");
    el.modal.setAttribute("aria-hidden", "false");
  }

  function removeWinnerFromInput(winner) {
    const lines = el.entriesInput.value.split(/\r?\n/);
    let removed = false;
    const next = lines.filter(line => {
      if (removed) return true;
      const parsed = parseEntryLine(line, 0);
      if (parsed && parsed.text === winner.text && parsed.emoji === winner.emoji) {
        removed = true;
        return false;
      }
      return true;
    });
    el.entriesInput.value = next.join("\n");
    parseEntries();
  }

  function renderHistory() {
    if (!state.history.length) {
      el.historyList.innerHTML = `<div class="sw-history-item"><strong>No winners yet</strong><small>Spin first</small></div>`;
      return;
    }
    el.historyList.innerHTML = state.history.map(item => `
      <div class="sw-history-item">
        <strong>${escapeHtml(item.text)}</strong>
        <small>#${item.spin}</small>
      </div>`).join("");
  }

  // Better browser-generated sounds; no outdated external audio files.
  function getAudio() {
    if (!state.audioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      state.audioContext = new AudioContext();
    }
    if (state.audioContext.state === "suspended") state.audioContext.resume();
    return state.audioContext;
  }

  function playTone(freq, duration = 0.08, type = "sine", gainValue = 0.05, delay = 0) {
    if (!state.sound) return;
    const ctx = getAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(gainValue, ctx.currentTime + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration + 0.02);
  }

  function startTickSound() {
    stopTickSound();
    if (!state.sound) return;
    const pack = el.soundPack.value;
    let step = 0;
    state.tickTimer = setInterval(() => {
      if (!state.spinning) return;
      if (pack === "drum") playTone(step % 2 ? 120 : 95, .035, "square", .035);
      else if (pack === "arcade") playTone([440, 660, 880, 990][step % 4], .035, "square", .025);
      else if (pack === "soft") playTone([620, 740, 880][step % 3], .04, "sine", .022);
      else playTone([520, 680, 840, 1040][step % 4], .035, "triangle", .025);
      step += 1;
    }, 95);
  }

  function stopTickSound() {
    if (state.tickTimer) clearInterval(state.tickTimer);
    state.tickTimer = null;
  }

  function playWinSound() {
    if (!state.sound) return;
    const pack = el.soundPack.value;
    if (pack === "drum") {
      [160, 220, 300, 420, 600].forEach((f, i) => playTone(f, .13, "sawtooth", .055, i * .09));
      return;
    }
    if (pack === "arcade") {
      [523, 659, 784, 1046].forEach((f, i) => playTone(f, .16, "square", .05, i * .075));
      return;
    }
    if (pack === "soft") {
      [440, 554, 659, 880].forEach((f, i) => playTone(f, .22, "sine", .042, i * .10));
      return;
    }
    [622, 784, 988, 1244].forEach((f, i) => playTone(f, .18, "triangle", .048, i * .08));
  }

  function launchConfetti() {
    const canvas = el.confettiCanvas;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    const colors = getPalette();
    const amount = safeNumber(el.confettiAmount.value, 120);
    const pieces = Array.from({ length: amount }, () => ({
      x: canvas.width / 2,
      y: canvas.height * .42,
      vx: (Math.random() - .5) * 18 * dpr,
      vy: (Math.random() - 1.25) * 16 * dpr,
      gravity: (0.22 + Math.random() * .22) * dpr,
      size: (5 + Math.random() * 9) * dpr,
      rot: Math.random() * TAU,
      vr: (Math.random() - .5) * .35,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 100 + Math.random() * 40
    }));
    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rot += p.vr;
        p.life -= 1;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * .55);
        ctx.restore();
      });
      frame += 1;
      if (frame < 150 && pieces.some(p => p.life > 0 && p.y < canvas.height + 80 * dpr)) requestAnimationFrame(animate);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    animate();
  }

  function updateTheme() {
    Object.values(themes).forEach(t => page.classList.remove(t.className));
    page.classList.add(getTheme().className);
    drawWheel();
    saveIfNeeded();
  }

  function renderTemplates() {
    el.templateGrid.innerHTML = templates.map(t => `
      <button class="sw-template-btn" type="button" data-template="${escapeHtml(t.id)}">
        <strong>${escapeHtml(t.title)}</strong>
        <span>${escapeHtml(t.desc)}</span>
      </button>`).join("");
  }

  function renderThemeOptions() {
    el.themeSelect.innerHTML = Object.entries(themes).map(([id, t]) => `<option value="${escapeHtml(id)}">${escapeHtml(t.name)}</option>`).join("");
  }

  function loadTemplate(id) {
    const t = templates.find(item => item.id === id) || templates[0];
    el.entriesInput.value = t.entries.join("\n");
    el.titleInput.value = `${t.title} Wheel`;
    el.winnerMessage.value = id === "giveaway" ? "Giveaway winner" : "The wheel picked";
    updateStats();
    drawWheel();
    saveIfNeeded();
    showToast(`${t.title} loaded`);
  }

  function removeDuplicates() {
    const seen = new Set();
    const lines = el.entriesInput.value.split(/\r?\n/).filter(line => {
      const parsed = parseEntryLine(line, 0);
      if (!parsed) return false;
      const key = `${parsed.text.toLowerCase()}|${parsed.emoji}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    el.entriesInput.value = lines.join("\n");
    drawWheel();
    saveIfNeeded();
  }

  function shuffleEntries() {
    const lines = el.entriesInput.value.split(/\r?\n/).filter(Boolean);
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }
    el.entriesInput.value = lines.join("\n");
    drawWheel();
    saveIfNeeded();
  }

  function sortEntries() {
    const lines = el.entriesInput.value.split(/\r?\n/).filter(Boolean).sort((a, b) => a.localeCompare(b));
    el.entriesInput.value = lines.join("\n");
    drawWheel();
    saveIfNeeded();
  }

  function exportEntries() {
    const blob = new Blob([el.entriesInput.value], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "spin-wheel-entries.txt";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();
  }

  function shareWheel() {
    const data = {
      title: el.titleInput.value,
      entries: el.entriesInput.value,
      theme: el.themeSelect.value,
      palette: el.paletteStyle.value,
      texture: el.wheelTexture.value,
      font: el.fontSelect.value,
      center: el.centerInput.value,
      message: el.winnerMessage.value
    };
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    const url = `${location.origin}${location.pathname}?wheel=${encodeURIComponent(encoded)}`;
    navigator.clipboard?.writeText(url).then(() => showToast("Share link copied"), () => {
      prompt("Copy this wheel link:", url);
    });
  }

  function loadSharedWheel() {
    const params = new URLSearchParams(location.search);
    const raw = params.get("wheel");
    if (!raw) return false;
    try {
      const data = JSON.parse(decodeURIComponent(escape(atob(raw))));
      applyData(data, false);
      showToast("Shared wheel loaded");
      return true;
    } catch (error) {
      return false;
    }
  }

  function saveData() {
    const data = collectData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    showToast("Wheel saved locally");
  }

  function saveIfNeeded() {
    if (el.autoSave.checked) localStorage.setItem(STORAGE_KEY, JSON.stringify(collectData()));
  }

  function collectData() {
    return {
      title: el.titleInput.value,
      entries: el.entriesInput.value,
      theme: el.themeSelect.value,
      palette: el.paletteStyle.value,
      texture: el.wheelTexture.value,
      font: el.fontSelect.value,
      soundPack: el.soundPack.value,
      duration: el.duration.value,
      wheelSize: el.wheelSize.value,
      textSize: el.textSize.value,
      confettiAmount: el.confettiAmount.value,
      removeWinner: el.removeWinner.checked,
      noRepeat: el.noRepeat.checked,
      weightedVisual: el.weightedVisual.checked,
      hideLabels: el.hideLabels.checked,
      autoSave: el.autoSave.checked,
      winnerMessage: el.winnerMessage.value,
      center: el.centerInput.value,
      history: state.history,
      spinCount: state.spinCount
    };
  }

  function applyData(data, includeHistory = true) {
    if (!data || typeof data !== "object") return;
    if (data.title) el.titleInput.value = data.title;
    if (data.entries) el.entriesInput.value = data.entries;
    if (data.theme && themes[data.theme]) el.themeSelect.value = data.theme;
    if (data.palette) el.paletteStyle.value = data.palette;
    if (data.texture) el.wheelTexture.value = data.texture;
    if (data.font) el.fontSelect.value = data.font;
    if (data.soundPack) el.soundPack.value = data.soundPack;
    if (data.duration) el.duration.value = data.duration;
    if (data.wheelSize) el.wheelSize.value = data.wheelSize;
    if (data.textSize) el.textSize.value = data.textSize;
    if (data.confettiAmount) el.confettiAmount.value = data.confettiAmount;
    if (typeof data.removeWinner === "boolean") el.removeWinner.checked = data.removeWinner;
    if (typeof data.noRepeat === "boolean") el.noRepeat.checked = data.noRepeat;
    if (typeof data.weightedVisual === "boolean") el.weightedVisual.checked = data.weightedVisual;
    if (typeof data.hideLabels === "boolean") el.hideLabels.checked = data.hideLabels;
    if (typeof data.autoSave === "boolean") el.autoSave.checked = data.autoSave;
    if (data.winnerMessage) el.winnerMessage.value = data.winnerMessage;
    if (data.center) el.centerInput.value = data.center;
    if (includeHistory && Array.isArray(data.history)) state.history = data.history.slice(0, HISTORY_LIMIT);
    if (includeHistory && Number.isFinite(Number(data.spinCount))) state.spinCount = Number(data.spinCount);
    updateTheme();
    updateStats();
    renderHistory();
  }

  function loadSaved() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (data) applyData(data, true);
      return !!data;
    } catch (error) {
      return false;
    }
  }

  async function importFile(file) {
    const text = await file.text();
    const lines = text.split(/\r?\n|,/).map(s => s.trim()).filter(Boolean);
    el.entriesInput.value = lines.join("\n");
    drawWheel();
    saveIfNeeded();
    showToast("Entries imported");
  }

  function downloadResultCard() {
    const latest = state.history[0];
    if (!latest) {
      showToast("Spin first to create a result card.");
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = 1400;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    const theme = getTheme();
    const colors = getPalette();
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(.55, colors[1] || colors[0]);
    grad.addColorStop(1, colors[2] || colors[0]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,.16)";
    for (let i = 0; i < 36; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 10 + Math.random() * 50, 0, TAU);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(0,0,0,.22)";
    roundRect(ctx, 70, 70, 1260, 660, 44);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "900 44px Inter, system-ui, sans-serif";
    ctx.fillText(el.winnerMessage.value || "The wheel picked", 130, 165);
    ctx.font = "1000 112px Inter, system-ui, sans-serif";
    wrapText(ctx, latest.text, 130, 340, 1140, 120);
    ctx.font = "700 30px Inter, system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,.84)";
    ctx.fillText(`${el.titleInput.value || "Spin The Wheel"} • ${new Date(latest.timestamp).toLocaleString()}`, 130, 650);
    ctx.fillText("Created with uti-mate.com", 130, 700);
    canvas.toBlob(blob => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "spin-wheel-result.png";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(a.href);
      a.remove();
    }, "image/png");
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = String(text).split(" ");
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, y);
        line = word;
        y += lineHeight;
      } else line = test;
    }
    ctx.fillText(line, x, y);
  }

  function toggleFullscreen() {
    const willOpen = !el.shell.classList.contains("sw-fullscreen");
    el.shell.classList.toggle("sw-fullscreen", willOpen);
    el.fullscreenBtn.textContent = willOpen ? "↙" : "⛶";
    if (willOpen && el.shell.requestFullscreen) {
      el.shell.requestFullscreen().catch(() => {});
    } else if (!willOpen && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setTimeout(drawWheel, 150);
  }

  function resetDesign() {
    el.themeSelect.value = "neon";
    el.paletteStyle.value = "vivid";
    el.wheelTexture.value = "glass";
    el.fontSelect.value = "rounded";
    el.soundPack.value = "spark";
    el.duration.value = "5.5";
    el.wheelSize.value = "660";
    el.textSize.value = "28";
    el.confettiAmount.value = "120";
    el.centerInput.value = "SPIN";
    updateTheme();
    updateStats();
    saveIfNeeded();
  }

  function bindEvents() {
    el.templateGrid.addEventListener("click", event => {
      const btn = event.target.closest("[data-template]");
      if (btn) loadTemplate(btn.dataset.template);
    });

    [el.titleInput, el.entriesInput, el.paletteStyle, el.wheelTexture, el.fontSelect, el.duration, el.wheelSize, el.textSize, el.confettiAmount, el.removeWinner, el.noRepeat, el.weightedVisual, el.hideLabels, el.autoSave, el.winnerMessage, el.centerInput, el.soundPack]
      .forEach(input => input.addEventListener("input", () => { updateStats(); drawWheel(); saveIfNeeded(); }));

    el.themeSelect.addEventListener("change", updateTheme);
    $("#swSpinBtn").addEventListener("click", spin);
    $("#swSpinBtnBottom").addEventListener("click", spin);
    $("#swShuffleBtn").addEventListener("click", shuffleEntries);
    $("#swSortBtn").addEventListener("click", sortEntries);
    $("#swDedupeBtn").addEventListener("click", removeDuplicates);
    $("#swExportBtn").addEventListener("click", exportEntries);
    $("#swClearBtn").addEventListener("click", () => { el.entriesInput.value = ""; drawWheel(); saveIfNeeded(); });
    $("#swResetDesignBtn").addEventListener("click", resetDesign);
    $("#swShareBtn").addEventListener("click", shareWheel);
    $("#swSaveBtn").addEventListener("click", saveData);
    $("#swCardBtn").addEventListener("click", downloadResultCard);
    $("#swClearHistoryBtn").addEventListener("click", () => { state.history = []; renderHistory(); saveIfNeeded(); });
    $("#swImportFile").addEventListener("change", event => { if (event.target.files[0]) importFile(event.target.files[0]); });
    el.soundToggle.addEventListener("click", () => { state.sound = !state.sound; el.soundToggle.textContent = state.sound ? "🔊" : "🔇"; el.soundToggle.setAttribute("aria-pressed", String(state.sound)); });
    el.confettiToggle.addEventListener("click", () => { state.confetti = !state.confetti; el.confettiToggle.textContent = state.confetti ? "🎉" : "🚫"; el.confettiToggle.setAttribute("aria-pressed", String(state.confetti)); });
    el.fullscreenBtn.addEventListener("click", toggleFullscreen);
    $("#swModalClose").addEventListener("click", closeModal);
    $("#swSpinAgainBtn").addEventListener("click", () => { closeModal(); spin(); });
    $("#swCopyWinnerBtn").addEventListener("click", () => {
      const latest = state.history[0];
      if (!latest) return;
      navigator.clipboard?.writeText(latest.text).then(() => showToast("Winner copied"));
    });
    el.modal.addEventListener("click", event => { if (event.target === el.modal) closeModal(); });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeModal();
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "enter") spin();
    });
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement && el.shell.classList.contains("sw-fullscreen")) {
        el.shell.classList.remove("sw-fullscreen");
        el.fullscreenBtn.textContent = "⛶";
        setTimeout(drawWheel, 150);
      }
    });
    window.addEventListener("resize", () => requestAnimationFrame(drawWheel));
  }

  function closeModal() {
    el.modal.classList.remove("show");
    el.modal.setAttribute("aria-hidden", "true");
  }

  function init() {
    renderThemeOptions();
    renderTemplates();
    el.themeSelect.value = "neon";
    el.paletteStyle.value = "vivid";
    el.wheelTexture.value = "glass";
    el.fontSelect.value = "rounded";
    el.soundPack.value = "spark";
    if (!loadSharedWheel()) {
      if (!loadSaved()) loadTemplate("food");
    }
    updateTheme();
    updateStats();
    renderHistory();
    bindEvents();
    drawWheel();
  }

  init();
})();
