(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const categories = [
    "All",
    "Text Tools",
    "Calculators",
    "Developer Tools",
    "QR Tools",
    "Date & Time Tools",
    "Image Tools",
    "Basic PDF Tools"
  ];

  const tools = [
    { id: "word-counter", title: "Word Counter", category: "Text Tools", desc: "Count words, characters, sentences, paragraphs, and reading time." },
    { id: "character-counter", title: "Character Counter", category: "Text Tools", desc: "Count characters with and without spaces." },
    { id: "case-converter", title: "Case Converter", category: "Text Tools", desc: "Convert text into uppercase, lowercase, title case, sentence case, and alternating case." },
    { id: "remove-duplicate-lines", title: "Remove Duplicate Lines", category: "Text Tools", desc: "Remove repeated lines while keeping the first occurrence." },
    { id: "sort-lines", title: "Sort Lines", category: "Text Tools", desc: "Sort lines alphabetically, reverse alphabetically, or by length." },
    { id: "text-cleaner", title: "Text Cleaner", category: "Text Tools", desc: "Clean messy text, trim lines, normalize spacing, and remove empty lines." },
    { id: "slug-generator", title: "Slug Generator", category: "Text Tools", desc: "Create URL-friendly slugs from text." },
    { id: "find-and-replace", title: "Find and Replace", category: "Text Tools", desc: "Find text or regex patterns and replace them instantly." },
    { id: "remove-extra-spaces", title: "Remove Extra Spaces", category: "Text Tools", desc: "Remove unnecessary spaces, tabs, and repeated blank lines." },
    { id: "reading-time-calculator", title: "Reading Time Calculator", category: "Text Tools", desc: "Estimate reading time based on word count." },

    { id: "percentage-calculator", title: "Percentage Calculator", category: "Calculators", desc: "Calculate percentages, percentage share, and percentage change." },
    { id: "age-calculator", title: "Age Calculator", category: "Calculators", desc: "Calculate age from date of birth." },
    { id: "bmi-calculator", title: "BMI Calculator", category: "Calculators", desc: "Calculate Body Mass Index using height and weight." },
    { id: "discount-calculator", title: "Discount Calculator", category: "Calculators", desc: "Calculate sale price and savings after a discount." },
    { id: "tip-calculator", title: "Tip Calculator", category: "Calculators", desc: "Split bills and calculate tip per person." },
    { id: "loan-calculator", title: "Loan Calculator", category: "Calculators", desc: "Estimate monthly loan payments and total interest." },
    { id: "compound-interest-calculator", title: "Compound Interest Calculator", category: "Calculators", desc: "Calculate future value with compound interest." },
    { id: "profit-margin-calculator", title: "Profit Margin Calculator", category: "Calculators", desc: "Calculate profit, markup, margin, and cost ratio." },
    { id: "date-difference-calculator", title: "Date Difference Calculator", category: "Calculators", desc: "Find days, weeks, months, and years between two dates." },
    { id: "time-duration-calculator", title: "Time Duration Calculator", category: "Calculators", desc: "Calculate the duration between two times." },

    { id: "json-formatter", title: "JSON Formatter", category: "Developer Tools", desc: "Format minified JSON into readable JSON." },
    { id: "json-validator", title: "JSON Validator", category: "Developer Tools", desc: "Validate JSON and show parsing errors." },
    { id: "base64-encoder-decoder", title: "Base64 Encoder/Decoder", category: "Developer Tools", desc: "Encode and decode Base64 text." },
    { id: "url-encoder-decoder", title: "URL Encoder/Decoder", category: "Developer Tools", desc: "Encode and decode URL strings." },
    { id: "uuid-generator", title: "UUID Generator", category: "Developer Tools", desc: "Generate secure random UUID v4 values." },
    { id: "password-generator", title: "Password Generator", category: "Developer Tools", desc: "Generate secure passwords with custom options." },
    { id: "hash-generator", title: "Hash Generator", category: "Developer Tools", desc: "Generate SHA hashes from text using the Web Crypto API." },
    { id: "html-formatter", title: "HTML Formatter", category: "Developer Tools", desc: "Format basic HTML structure with indentation." },
    { id: "css-minifier", title: "CSS Minifier", category: "Developer Tools", desc: "Minify CSS by removing comments and extra whitespace." },
    { id: "javascript-minifier", title: "JavaScript Minifier", category: "Developer Tools", desc: "Lightweight JavaScript minifier for simple scripts." },

    { id: "qr-code-generator", title: "QR Code Generator", category: "QR Tools", desc: "Generate a QR code from any text or URL." },
    { id: "wifi-qr-generator", title: "WiFi QR Generator", category: "QR Tools", desc: "Create WiFi login QR codes for WPA, WEP, or open networks." },
    { id: "whatsapp-link-generator", title: "WhatsApp Link Generator", category: "QR Tools", desc: "Create WhatsApp links and matching QR codes." },
    { id: "email-qr-generator", title: "Email QR Generator", category: "QR Tools", desc: "Create mailto QR codes with email, subject, and body." },
    { id: "sms-qr-generator", title: "SMS QR Generator", category: "QR Tools", desc: "Create QR codes that open SMS drafts." },
    { id: "vcard-qr-generator", title: "vCard QR Generator", category: "QR Tools", desc: "Create contact QR codes for people and businesses." },

    { id: "stopwatch", title: "Stopwatch", category: "Date & Time Tools", desc: "Start, pause, reset, and track elapsed time." },
    { id: "countdown-timer", title: "Countdown Timer", category: "Date & Time Tools", desc: "Run a countdown using hours, minutes, and seconds." },
    { id: "pomodoro-timer", title: "Pomodoro Timer", category: "Date & Time Tools", desc: "Work and rest timer for focused sessions." },
    { id: "unix-timestamp-converter", title: "Unix Timestamp Converter", category: "Date & Time Tools", desc: "Convert Unix timestamps to dates and dates to timestamps." },

    { id: "image-resizer", title: "Image Resizer", category: "Image Tools", desc: "Resize images in your browser and download the result." },
    { id: "image-compressor", title: "Image Compressor", category: "Image Tools", desc: "Compress images as JPG or WebP with quality control." },
    { id: "image-cropper", title: "Image Cropper", category: "Image Tools", desc: "Crop images using exact X, Y, width, and height values." },
    { id: "jpg-to-png", title: "JPG to PNG", category: "Image Tools", desc: "Convert JPG images to PNG." },
    { id: "png-to-jpg", title: "PNG to JPG", category: "Image Tools", desc: "Convert PNG images to JPG." },
    { id: "image-to-webp", title: "Image to WebP", category: "Image Tools", desc: "Convert JPG or PNG images to WebP." },
    { id: "rotate-image", title: "Rotate Image", category: "Image Tools", desc: "Rotate images by 90, 180, or 270 degrees." },
    { id: "flip-image", title: "Flip Image", category: "Image Tools", desc: "Flip images horizontally or vertically." },

    { id: "jpg-to-pdf", title: "JPG to PDF", category: "Basic PDF Tools", desc: "Convert JPG/PNG images into a PDF file." },
    { id: "merge-pdf", title: "Merge PDF", category: "Basic PDF Tools", desc: "Merge multiple PDF files into one PDF in your browser." }
  ];

  const state = {
    category: "All",
    query: "",
    activeTool: "word-counter",
    stopwatch: { elapsed: 0, startedAt: 0, interval: null, running: false },
    countdown: { remaining: 0, interval: null, running: false },
    pomodoro: { remaining: 25 * 60, interval: null, running: false, mode: "Work" }
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function slugify(value) {
    return String(value)
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "untitled";
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function copyText(value) {
    navigator.clipboard.writeText(value).then(() => showToast("Copied to clipboard"));
  }

  function downloadText(filename, text, type = "text/plain") {
    downloadBlob(filename, new Blob([text], { type }));
  }

  function downloadBlob(filename, blob) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();
  }

  function bytesToHex(buffer) {
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  function getWords(text) {
    return (text.trim().match(/\b[\p{L}\p{N}'’-]+\b/gu) || []);
  }

  function getSentences(text) {
    return (text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []).filter(s => s.trim());
  }

  function formatDuration(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const cent = Math.floor((Math.max(0, ms) % 1000) / 10);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cent).padStart(2, "0")}`;
  }

  function formatSeconds(seconds) {
    const total = Math.max(0, Math.floor(seconds));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function numberValue(id) {
    const value = Number($(id)?.value || 0);
    return Number.isFinite(value) ? value : 0;
  }

  function setResult(value, target = "#result") {
    const result = $(target);
    if (result) result.textContent = value;
  }

  function toolHeader(tool) {
    return `
      <div class="tool-header">
        <div>
          <p class="eyebrow">${escapeHtml(tool.category)}</p>
          <h2>${escapeHtml(tool.title)}</h2>
          <p>${escapeHtml(tool.desc)}</p>
        </div>
        <a class="btn small ghost" href="${document.body.dataset.tool ? 'index.html#all-tools' : '#all-tools'}">All Tools</a>
      </div>`;
  }

  function baseTool(tool, body) {
    return `${toolHeader(tool)}<div class="tool-form">${body}</div>`;
  }

  function renderCategories() {
    const tabs = $("#categoryTabs");
    if (!tabs) return;
    tabs.innerHTML = categories.map(cat => `<button type="button" class="${cat === state.category ? "active" : ""}" data-category="${escapeHtml(cat)}">${escapeHtml(cat)}</button>`).join("");
    tabs.addEventListener("click", event => {
      const btn = event.target.closest("button[data-category]");
      if (!btn) return;
      state.category = btn.dataset.category;
      renderToolGrid();
      renderCategories();
    }, { once: true });
  }

  function filteredTools() {
    const q = state.query.trim().toLowerCase();
    return tools.filter(tool => {
      const categoryMatch = state.category === "All" || tool.category === state.category;
      const textMatch = !q || `${tool.title} ${tool.category} ${tool.desc}`.toLowerCase().includes(q);
      return categoryMatch && textMatch;
    });
  }

  function renderToolGrid() {
    const grid = $("#toolGrid");
    if (!grid) return;
    const list = filteredTools();
    grid.innerHTML = list.length ? list.map(tool => `
      <button class="tool-card ${tool.id === state.activeTool ? "active" : ""}" type="button" data-tool="${tool.id}">
        <small>${escapeHtml(tool.category)}</small>
        <strong>${escapeHtml(tool.title)}</strong>
        <span>${escapeHtml(tool.desc)}</span>
      </button>`).join("") : `<div class="empty-stage"><div><h3>No tools found</h3><p>Try another search term.</p></div></div>`;
  }

  function renderActiveTool() {
    const stage = $("#toolStage");
    if (!stage) return;
    const tool = tools.find(item => item.id === state.activeTool) || tools[0];
    state.activeTool = tool.id;
    if (!document.body.dataset.tool) document.title = `${tool.title} — uti-mate`;

    const renderMap = {
      "word-counter": renderWordCounter,
      "character-counter": renderCharacterCounter,
      "case-converter": renderCaseConverter,
      "remove-duplicate-lines": renderRemoveDuplicateLines,
      "sort-lines": renderSortLines,
      "text-cleaner": renderTextCleaner,
      "slug-generator": renderSlugGenerator,
      "find-and-replace": renderFindReplace,
      "remove-extra-spaces": renderRemoveSpaces,
      "reading-time-calculator": renderReadingTime,
      "percentage-calculator": renderPercentageCalculator,
      "age-calculator": renderAgeCalculator,
      "bmi-calculator": renderBmiCalculator,
      "discount-calculator": renderDiscountCalculator,
      "tip-calculator": renderTipCalculator,
      "loan-calculator": renderLoanCalculator,
      "compound-interest-calculator": renderCompoundInterestCalculator,
      "profit-margin-calculator": renderProfitMarginCalculator,
      "date-difference-calculator": renderDateDifferenceCalculator,
      "time-duration-calculator": renderTimeDurationCalculator,
      "json-formatter": renderJsonFormatter,
      "json-validator": renderJsonValidator,
      "base64-encoder-decoder": renderBase64Tool,
      "url-encoder-decoder": renderUrlTool,
      "uuid-generator": renderUuidGenerator,
      "password-generator": renderPasswordGenerator,
      "hash-generator": renderHashGenerator,
      "html-formatter": renderHtmlFormatter,
      "css-minifier": renderCssMinifier,
      "javascript-minifier": renderJsMinifier,
      "qr-code-generator": renderQrCodeGenerator,
      "wifi-qr-generator": renderWifiQrGenerator,
      "whatsapp-link-generator": renderWhatsappGenerator,
      "email-qr-generator": renderEmailQrGenerator,
      "sms-qr-generator": renderSmsQrGenerator,
      "vcard-qr-generator": renderVcardQrGenerator,
      "stopwatch": renderStopwatch,
      "countdown-timer": renderCountdown,
      "pomodoro-timer": renderPomodoro,
      "unix-timestamp-converter": renderUnixConverter,
      "image-resizer": () => renderImageTool(tool, "resize"),
      "image-compressor": () => renderImageTool(tool, "compress"),
      "image-cropper": () => renderImageTool(tool, "crop"),
      "jpg-to-png": () => renderImageTool(tool, "to-png"),
      "png-to-jpg": () => renderImageTool(tool, "to-jpg"),
      "image-to-webp": () => renderImageTool(tool, "to-webp"),
      "rotate-image": () => renderImageTool(tool, "rotate"),
      "flip-image": () => renderImageTool(tool, "flip"),
      "jpg-to-pdf": renderJpgToPdf,
      "merge-pdf": renderMergePdf
    };

    stage.innerHTML = (renderMap[tool.id] || renderGenericComingSoon)(tool);
    bindToolEvents(tool.id);
    renderToolGrid();
    if (!document.body.dataset.tool) location.hash = tool.id;
  }

  function renderGenericComingSoon(tool) {
    return baseTool(tool, `<div class="result-box">This tool is ready to be connected.</div>`);
  }

  function commonTextArea(label = "Input text", placeholder = "Paste or type text here...") {
    return `<div class="field"><label for="inputText">${label}</label><textarea id="inputText" placeholder="${placeholder}"></textarea></div>`;
  }

  function outputArea(label = "Output") {
    return `<div class="field"><span class="label">${label}</span><div class="result-box code-like" id="result"></div></div>`;
  }

  function textActions() {
    return `<div class="action-row"><button class="btn primary" id="processBtn" type="button">Process</button><button class="btn" id="copyBtn" type="button">Copy Result</button><button class="btn" id="downloadTxtBtn" type="button">Download TXT</button></div>`;
  }

  function renderWordCounter(tool) {
    return baseTool(tool, `${commonTextArea()}
      <div class="stats-grid" id="stats"></div>`);
  }

  function renderCharacterCounter(tool) {
    return baseTool(tool, `${commonTextArea()}
      <div class="stats-grid" id="stats"></div>`);
  }

  function renderCaseConverter(tool) {
    return baseTool(tool, `${commonTextArea()}
      <div class="action-row">
        <button class="btn primary" data-case="upper" type="button">UPPERCASE</button>
        <button class="btn" data-case="lower" type="button">lowercase</button>
        <button class="btn" data-case="title" type="button">Title Case</button>
        <button class="btn" data-case="sentence" type="button">Sentence case</button>
        <button class="btn" data-case="alternating" type="button">aLtErNaTiNg</button>
      </div>${outputArea()}`);
  }

  function renderRemoveDuplicateLines(tool) {
    return baseTool(tool, `${commonTextArea()}${textActions()}${outputArea()}`);
  }

  function renderSortLines(tool) {
    return baseTool(tool, `${commonTextArea()}<div class="field"><label for="sortMode">Sort mode</label><select id="sortMode"><option value="az">A to Z</option><option value="za">Z to A</option><option value="short">Shortest first</option><option value="long">Longest first</option></select></div>${textActions()}${outputArea()}`);
  }

  function renderTextCleaner(tool) {
    return baseTool(tool, `${commonTextArea()}<div class="field-row three">
      <label class="field"><span class="label">Trim each line</span><select id="trimLines"><option value="yes">Yes</option><option value="no">No</option></select></label>
      <label class="field"><span class="label">Remove empty lines</span><select id="removeEmpty"><option value="yes">Yes</option><option value="no">No</option></select></label>
      <label class="field"><span class="label">Normalize spaces</span><select id="normalizeSpaces"><option value="yes">Yes</option><option value="no">No</option></select></label>
      </div>${textActions()}${outputArea()}`);
  }

  function renderSlugGenerator(tool) {
    return baseTool(tool, `${commonTextArea("Title or phrase", "Example: Free Online Utility Tools")}${textActions()}${outputArea("Slug")}`);
  }

  function renderFindReplace(tool) {
    return baseTool(tool, `${commonTextArea()}<div class="field-row"><div class="field"><label for="findValue">Find</label><input id="findValue" type="text" placeholder="Text to find" /></div><div class="field"><label for="replaceValue">Replace with</label><input id="replaceValue" type="text" placeholder="Replacement" /></div></div><div class="field"><label for="findMode">Mode</label><select id="findMode"><option value="plain">Plain text</option><option value="regex">Regex</option></select></div>${textActions()}${outputArea()}`);
  }

  function renderRemoveSpaces(tool) {
    return baseTool(tool, `${commonTextArea()}${textActions()}${outputArea()}`);
  }

  function renderReadingTime(tool) {
    return baseTool(tool, `${commonTextArea()}<div class="field"><label for="wpm">Reading speed, words per minute</label><input id="wpm" type="number" min="50" value="200" /></div><div class="stats-grid" id="stats"></div>`);
  }

  function statHtml(items) {
    return items.map(([label, value]) => `<div class="stat"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div>`).join("");
  }

  function bindTextStats(mode) {
    const input = $("#inputText");
    const update = () => {
      const text = input.value;
      const words = getWords(text).length;
      const chars = text.length;
      const charsNoSpaces = text.replace(/\s/g, "").length;
      const lines = text ? text.split(/\r?\n/).length : 0;
      const paragraphs = text.trim() ? text.trim().split(/\n\s*\n/).length : 0;
      const sentences = getSentences(text).length;
      const stats = mode === "chars" ? [
        ["Characters", chars], ["Without spaces", charsNoSpaces], ["Spaces", (text.match(/\s/g) || []).length], ["Lines", lines]
      ] : [
        ["Words", words], ["Characters", chars], ["Sentences", sentences], ["Paragraphs", paragraphs], ["Lines", lines], ["Reading time", `${Math.max(1, Math.ceil(words / 200))} min`]
      ];
      $("#stats").innerHTML = statHtml(stats);
    };
    input.addEventListener("input", update);
    update();
  }

  function titleCase(text) {
    return text.toLowerCase().replace(/\b\p{L}/gu, char => char.toUpperCase());
  }

  function sentenceCase(text) {
    return text.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, char => char.toUpperCase());
  }

  function bindTextAction(toolId) {
    const output = () => $("#result")?.textContent || "";
    $("#copyBtn")?.addEventListener("click", () => copyText(output()));
    $("#downloadTxtBtn")?.addEventListener("click", () => downloadText(`${toolId}.txt`, output()));
    $("#processBtn")?.addEventListener("click", () => {
      const text = $("#inputText").value;
      let result = text;
      if (toolId === "remove-duplicate-lines") {
        const seen = new Set();
        result = text.split(/\r?\n/).filter(line => {
          if (seen.has(line)) return false;
          seen.add(line);
          return true;
        }).join("\n");
      }
      if (toolId === "sort-lines") {
        const mode = $("#sortMode").value;
        const lines = text.split(/\r?\n/);
        const sorted = lines.sort((a, b) => {
          if (mode === "za") return b.localeCompare(a);
          if (mode === "short") return a.length - b.length || a.localeCompare(b);
          if (mode === "long") return b.length - a.length || a.localeCompare(b);
          return a.localeCompare(b);
        });
        result = sorted.join("\n");
      }
      if (toolId === "text-cleaner") {
        let lines = text.split(/\r?\n/);
        if ($("#trimLines").value === "yes") lines = lines.map(line => line.trim());
        if ($("#normalizeSpaces").value === "yes") lines = lines.map(line => line.replace(/[ \t]+/g, " "));
        if ($("#removeEmpty").value === "yes") lines = lines.filter(line => line.trim());
        result = lines.join("\n").trim();
      }
      if (toolId === "slug-generator") result = slugify(text);
      if (toolId === "find-and-replace") {
        const findValue = $("#findValue").value;
        const replaceValue = $("#replaceValue").value;
        if (!findValue) result = text;
        else if ($("#findMode").value === "regex") {
          try { result = text.replace(new RegExp(findValue, "g"), replaceValue); }
          catch (error) { result = `Regex error: ${error.message}`; }
        } else {
          result = text.split(findValue).join(replaceValue);
        }
      }
      if (toolId === "remove-extra-spaces") {
        result = text.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
      }
      setResult(result);
    });
  }

  function bindCaseConverter() {
    $$("[data-case]").forEach(btn => btn.addEventListener("click", () => {
      const text = $("#inputText").value;
      const mode = btn.dataset.case;
      let result = text;
      if (mode === "upper") result = text.toUpperCase();
      if (mode === "lower") result = text.toLowerCase();
      if (mode === "title") result = titleCase(text);
      if (mode === "sentence") result = sentenceCase(text);
      if (mode === "alternating") result = Array.from(text).map((ch, index) => index % 2 ? ch.toLowerCase() : ch.toUpperCase()).join("");
      setResult(result);
    }));
  }

  function bindReadingTime() {
    const update = () => {
      const words = getWords($("#inputText").value).length;
      const wpm = Math.max(1, numberValue("#wpm"));
      const minutes = words / wpm;
      const seconds = Math.round(minutes * 60);
      $("#stats").innerHTML = statHtml([
        ["Words", words],
        ["Speed", `${wpm} wpm`],
        ["Reading time", seconds < 60 ? `${seconds} sec` : `${Math.ceil(minutes)} min`],
        ["Exact time", `${Math.floor(seconds / 60)}m ${seconds % 60}s`]
      ]);
    };
    $("#inputText").addEventListener("input", update);
    $("#wpm").addEventListener("input", update);
    update();
  }

  function renderPercentageCalculator(tool) {
    return baseTool(tool, `<div class="field-row three"><div class="field"><label for="pctA">Value A</label><input id="pctA" type="number" value="10" /></div><div class="field"><label for="pctB">Value B</label><input id="pctB" type="number" value="100" /></div><div class="field"><label for="pctMode">Calculation</label><select id="pctMode"><option value="of">A% of B</option><option value="what">A is what % of B</option><option value="change">% change from A to B</option></select></div></div><div class="action-row"><button class="btn primary" id="calcBtn" type="button">Calculate</button></div>${outputArea()}`);
  }

  function renderAgeCalculator(tool) {
    return baseTool(tool, `<div class="field-row"><div class="field"><label for="dob">Date of birth</label><input id="dob" type="date" /></div><div class="field"><label for="ageAt">Age at date</label><input id="ageAt" type="date" /></div></div><div class="action-row"><button class="btn primary" id="calcBtn" type="button">Calculate Age</button></div>${outputArea()}`);
  }

  function renderBmiCalculator(tool) {
    return baseTool(tool, `<div class="field-row"><div class="field"><label for="heightCm">Height, cm</label><input id="heightCm" type="number" value="170" /></div><div class="field"><label for="weightKg">Weight, kg</label><input id="weightKg" type="number" value="70" /></div></div><div class="action-row"><button class="btn primary" id="calcBtn" type="button">Calculate BMI</button></div>${outputArea()}`);
  }

  function renderDiscountCalculator(tool) {
    return baseTool(tool, `<div class="field-row"><div class="field"><label for="price">Original price</label><input id="price" type="number" value="100" /></div><div class="field"><label for="discount">Discount %</label><input id="discount" type="number" value="20" /></div></div><div class="action-row"><button class="btn primary" id="calcBtn" type="button">Calculate</button></div>${outputArea()}`);
  }

  function renderTipCalculator(tool) {
    return baseTool(tool, `<div class="field-row three"><div class="field"><label for="bill">Bill amount</label><input id="bill" type="number" value="100" /></div><div class="field"><label for="tipPct">Tip %</label><input id="tipPct" type="number" value="10" /></div><div class="field"><label for="people">People</label><input id="people" type="number" value="2" /></div></div><div class="action-row"><button class="btn primary" id="calcBtn" type="button">Calculate</button></div>${outputArea()}`);
  }

  function renderLoanCalculator(tool) {
    return baseTool(tool, `<div class="field-row three"><div class="field"><label for="principal">Loan amount</label><input id="principal" type="number" value="100000" /></div><div class="field"><label for="rate">Annual rate %</label><input id="rate" type="number" value="4.5" step="0.01" /></div><div class="field"><label for="years">Years</label><input id="years" type="number" value="10" /></div></div><div class="action-row"><button class="btn primary" id="calcBtn" type="button">Calculate</button></div>${outputArea()}`);
  }

  function renderCompoundInterestCalculator(tool) {
    return baseTool(tool, `<div class="field-row three"><div class="field"><label for="principal">Principal</label><input id="principal" type="number" value="1000" /></div><div class="field"><label for="rate">Annual rate %</label><input id="rate" type="number" value="5" step="0.01" /></div><div class="field"><label for="years">Years</label><input id="years" type="number" value="10" /></div></div><div class="field-row"><div class="field"><label for="compound">Compounds per year</label><input id="compound" type="number" value="12" /></div><div class="field"><label for="monthlyContribution">Monthly contribution</label><input id="monthlyContribution" type="number" value="0" /></div></div><div class="action-row"><button class="btn primary" id="calcBtn" type="button">Calculate</button></div>${outputArea()}`);
  }

  function renderProfitMarginCalculator(tool) {
    return baseTool(tool, `<div class="field-row"><div class="field"><label for="revenue">Revenue / Selling price</label><input id="revenue" type="number" value="100" /></div><div class="field"><label for="cost">Cost</label><input id="cost" type="number" value="60" /></div></div><div class="action-row"><button class="btn primary" id="calcBtn" type="button">Calculate</button></div>${outputArea()}`);
  }

  function renderDateDifferenceCalculator(tool) {
    return baseTool(tool, `<div class="field-row"><div class="field"><label for="startDate">Start date</label><input id="startDate" type="date" /></div><div class="field"><label for="endDate">End date</label><input id="endDate" type="date" /></div></div><div class="action-row"><button class="btn primary" id="calcBtn" type="button">Calculate</button></div>${outputArea()}`);
  }

  function renderTimeDurationCalculator(tool) {
    return baseTool(tool, `<div class="field-row three"><div class="field"><label for="startTime">Start time</label><input id="startTime" type="time" value="09:00" /></div><div class="field"><label for="endTime">End time</label><input id="endTime" type="time" value="17:30" /></div><div class="field"><label for="overnight">Overnight</label><select id="overnight"><option value="no">No</option><option value="yes">Yes</option></select></div></div><div class="action-row"><button class="btn primary" id="calcBtn" type="button">Calculate</button></div>${outputArea()}`);
  }

  function bindCalculator(toolId) {
    const btn = $("#calcBtn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      let result = "";
      if (toolId === "percentage-calculator") {
        const a = numberValue("#pctA");
        const b = numberValue("#pctB");
        const mode = $("#pctMode").value;
        if (mode === "of") result = `${a}% of ${b} = ${(a / 100 * b).toFixed(4)}`;
        if (mode === "what") result = b === 0 ? "Cannot divide by zero." : `${a} is ${((a / b) * 100).toFixed(4)}% of ${b}`;
        if (mode === "change") result = a === 0 ? "Cannot calculate percentage change from zero." : `Change from ${a} to ${b} = ${(((b - a) / Math.abs(a)) * 100).toFixed(4)}%`;
      }
      if (toolId === "age-calculator") {
        const dob = new Date($("#dob").value);
        const at = $("#ageAt").value ? new Date($("#ageAt").value) : new Date();
        if (Number.isNaN(dob.getTime())) result = "Select a valid date of birth.";
        else {
          let years = at.getFullYear() - dob.getFullYear();
          let months = at.getMonth() - dob.getMonth();
          let days = at.getDate() - dob.getDate();
          if (days < 0) { months -= 1; days += new Date(at.getFullYear(), at.getMonth(), 0).getDate(); }
          if (months < 0) { years -= 1; months += 12; }
          const totalDays = Math.floor((at - dob) / 86400000);
          result = `${years} years, ${months} months, ${days} days\nTotal days: ${totalDays.toLocaleString()}`;
        }
      }
      if (toolId === "bmi-calculator") {
        const h = numberValue("#heightCm") / 100;
        const w = numberValue("#weightKg");
        const bmi = w / (h * h);
        let category = "";
        if (bmi < 18.5) category = "Underweight";
        else if (bmi < 25) category = "Normal";
        else if (bmi < 30) category = "Overweight";
        else category = "Obese";
        result = h > 0 ? `BMI: ${bmi.toFixed(2)}\nCategory: ${category}` : "Enter a valid height.";
      }
      if (toolId === "discount-calculator") {
        const price = numberValue("#price");
        const discount = numberValue("#discount");
        const saved = price * discount / 100;
        result = `Discount: ${saved.toFixed(2)}\nFinal price: ${(price - saved).toFixed(2)}`;
      }
      if (toolId === "tip-calculator") {
        const bill = numberValue("#bill");
        const tip = bill * numberValue("#tipPct") / 100;
        const people = Math.max(1, numberValue("#people"));
        result = `Tip: ${tip.toFixed(2)}\nTotal: ${(bill + tip).toFixed(2)}\nPer person: ${((bill + tip) / people).toFixed(2)}`;
      }
      if (toolId === "loan-calculator") {
        const p = numberValue("#principal");
        const r = numberValue("#rate") / 100 / 12;
        const n = numberValue("#years") * 12;
        const payment = r === 0 ? p / n : p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        result = n > 0 ? `Monthly payment: ${payment.toFixed(2)}\nTotal payment: ${(payment * n).toFixed(2)}\nTotal interest: ${(payment * n - p).toFixed(2)}` : "Enter valid loan term.";
      }
      if (toolId === "compound-interest-calculator") {
        const p = numberValue("#principal");
        const rate = numberValue("#rate") / 100;
        const years = numberValue("#years");
        const c = Math.max(1, numberValue("#compound"));
        const monthly = numberValue("#monthlyContribution");
        const principalFuture = p * Math.pow(1 + rate / c, c * years);
        let contributionFuture = 0;
        const monthlyRate = rate / 12;
        const months = years * 12;
        if (monthlyRate > 0) contributionFuture = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        else contributionFuture = monthly * months;
        const future = principalFuture + contributionFuture;
        const invested = p + monthly * months;
        result = `Future value: ${future.toFixed(2)}\nTotal invested: ${invested.toFixed(2)}\nInterest earned: ${(future - invested).toFixed(2)}`;
      }
      if (toolId === "profit-margin-calculator") {
        const revenue = numberValue("#revenue");
        const cost = numberValue("#cost");
        const profit = revenue - cost;
        result = revenue === 0 ? "Revenue cannot be zero." : `Profit: ${profit.toFixed(2)}\nProfit margin: ${((profit / revenue) * 100).toFixed(2)}%\nMarkup: ${cost === 0 ? "N/A" : ((profit / cost) * 100).toFixed(2) + "%"}`;
      }
      if (toolId === "date-difference-calculator") {
        const start = new Date($("#startDate").value);
        const end = new Date($("#endDate").value);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) result = "Select valid dates.";
        else {
          const days = Math.abs(Math.round((end - start) / 86400000));
          result = `${days.toLocaleString()} days\n${(days / 7).toFixed(2)} weeks\nApprox. ${(days / 30.4375).toFixed(2)} months\nApprox. ${(days / 365.25).toFixed(2)} years`;
        }
      }
      if (toolId === "time-duration-calculator") {
        const [sh, sm] = $("#startTime").value.split(":").map(Number);
        const [eh, em] = $("#endTime").value.split(":").map(Number);
        let start = sh * 60 + sm;
        let end = eh * 60 + em;
        if ($("#overnight").value === "yes" && end < start) end += 1440;
        const minutes = Math.max(0, end - start);
        result = `${Math.floor(minutes / 60)} hours ${minutes % 60} minutes\nTotal minutes: ${minutes}`;
      }
      setResult(result);
    });
    btn.click();
  }

  function renderJsonFormatter(tool) {
    return baseTool(tool, `${commonTextArea("JSON input", "Paste JSON here...")}<div class="action-row"><button class="btn primary" id="processBtn" type="button">Format JSON</button><button class="btn" id="copyBtn" type="button">Copy</button></div>${outputArea("Formatted JSON")}`);
  }

  function renderJsonValidator(tool) {
    return baseTool(tool, `${commonTextArea("JSON input", "Paste JSON here...")}<div class="action-row"><button class="btn primary" id="processBtn" type="button">Validate JSON</button></div>${outputArea("Validation Result")}`);
  }

  function renderBase64Tool(tool) {
    return baseTool(tool, `${commonTextArea("Input", "Text or Base64...")}<div class="action-row"><button class="btn primary" data-base64="encode" type="button">Encode</button><button class="btn" data-base64="decode" type="button">Decode</button><button class="btn" id="copyBtn" type="button">Copy</button></div>${outputArea()}`);
  }

  function renderUrlTool(tool) {
    return baseTool(tool, `${commonTextArea("Input", "URL or text...")}<div class="action-row"><button class="btn primary" data-url="encode" type="button">Encode</button><button class="btn" data-url="decode" type="button">Decode</button><button class="btn" id="copyBtn" type="button">Copy</button></div>${outputArea()}`);
  }

  function renderUuidGenerator(tool) {
    return baseTool(tool, `<div class="field"><label for="uuidCount">Number of UUIDs</label><input id="uuidCount" type="number" min="1" max="100" value="5" /></div><div class="action-row"><button class="btn primary" id="generateBtn" type="button">Generate UUIDs</button><button class="btn" id="copyBtn" type="button">Copy</button></div>${outputArea()}`);
  }

  function renderPasswordGenerator(tool) {
    return baseTool(tool, `<div class="field-row three"><div class="field"><label for="pwLength">Length</label><input id="pwLength" type="number" min="4" max="128" value="16" /></div><div class="field"><label for="pwCount">Quantity</label><input id="pwCount" type="number" min="1" max="50" value="5" /></div><div class="field"><label for="pwSymbols">Symbols</label><select id="pwSymbols"><option value="yes">Yes</option><option value="no">No</option></select></div></div><div class="action-row"><button class="btn primary" id="generateBtn" type="button">Generate Passwords</button><button class="btn" id="copyBtn" type="button">Copy</button></div>${outputArea()}`);
  }

  function renderHashGenerator(tool) {
    return baseTool(tool, `${commonTextArea("Input text", "Text to hash...")}<div class="field"><label for="hashAlgo">Algorithm</label><select id="hashAlgo"><option>SHA-256</option><option>SHA-1</option><option>SHA-384</option><option>SHA-512</option></select></div><div class="action-row"><button class="btn primary" id="generateBtn" type="button">Generate Hash</button><button class="btn" id="copyBtn" type="button">Copy</button></div>${outputArea()}`);
  }

  function renderHtmlFormatter(tool) {
    return baseTool(tool, `${commonTextArea("HTML input", "Paste HTML here...")}<div class="action-row"><button class="btn primary" id="processBtn" type="button">Format HTML</button><button class="btn" id="copyBtn" type="button">Copy</button></div>${outputArea("Formatted HTML")}`);
  }

  function renderCssMinifier(tool) {
    return baseTool(tool, `${commonTextArea("CSS input", "Paste CSS here...")}<div class="action-row"><button class="btn primary" id="processBtn" type="button">Minify CSS</button><button class="btn" id="copyBtn" type="button">Copy</button></div>${outputArea("Minified CSS")}`);
  }

  function renderJsMinifier(tool) {
    return baseTool(tool, `${commonTextArea("JavaScript input", "Paste JavaScript here...")}<p class="note">This is a lightweight whitespace/comment minifier. Use professional build tools for production JavaScript bundles.</p><div class="action-row"><button class="btn primary" id="processBtn" type="button">Minify JS</button><button class="btn" id="copyBtn" type="button">Copy</button></div>${outputArea("Minified JavaScript")}`);
  }

  function formatHtml(html) {
    const cleaned = html.replace(/>\s+</g, "><").replace(/</g, "\n<").trim();
    let indent = 0;
    return cleaned.split("\n").map(line => {
      if (/^<\//.test(line)) indent = Math.max(0, indent - 1);
      const out = "  ".repeat(indent) + line;
      if (/^<[^!?/][^>]*[^/]?>$/.test(line) && !/^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)\b/i.test(line)) indent += 1;
      return out;
    }).join("\n");
  }

  function minifyCss(css) {
    return css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{}:;,>])\s*/g, "$1").replace(/;}/g, "}").trim();
  }

  function minifyJs(js) {
    return js.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1").replace(/\s+/g, " ").replace(/\s*([{}();,:=+\-*/<>])\s*/g, "$1").trim();
  }

  function bindDevTool(toolId) {
    $("#copyBtn")?.addEventListener("click", () => copyText($("#result")?.textContent || ""));
    $("#processBtn")?.addEventListener("click", () => {
      const input = $("#inputText").value;
      let result = "";
      try {
        if (toolId === "json-formatter") result = JSON.stringify(JSON.parse(input), null, 2);
        if (toolId === "json-validator") { JSON.parse(input); result = "Valid JSON."; }
        if (toolId === "html-formatter") result = formatHtml(input);
        if (toolId === "css-minifier") result = minifyCss(input);
        if (toolId === "javascript-minifier") result = minifyJs(input);
      } catch (error) {
        result = `Error: ${error.message}`;
      }
      setResult(result);
    });
    $$("[data-base64]").forEach(btn => btn.addEventListener("click", () => {
      try {
        const input = $("#inputText").value;
        const result = btn.dataset.base64 === "encode" ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input)));
        setResult(result);
      } catch (error) { setResult(`Error: ${error.message}`); }
    }));
    $$("[data-url]").forEach(btn => btn.addEventListener("click", () => {
      try {
        const input = $("#inputText").value;
        setResult(btn.dataset.url === "encode" ? encodeURIComponent(input) : decodeURIComponent(input));
      } catch (error) { setResult(`Error: ${error.message}`); }
    }));
    $("#generateBtn")?.addEventListener("click", async () => {
      if (toolId === "uuid-generator") {
        const count = Math.min(100, Math.max(1, numberValue("#uuidCount")));
        setResult(Array.from({ length: count }, () => crypto.randomUUID()).join("\n"));
      }
      if (toolId === "password-generator") {
        const length = Math.min(128, Math.max(4, numberValue("#pwLength")));
        const count = Math.min(50, Math.max(1, numberValue("#pwCount")));
        const symbols = $("#pwSymbols").value === "yes";
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" + (symbols ? "!@#$%^&*()_+-=[]{}|;:,.<>?" : "");
        const results = [];
        for (let i = 0; i < count; i++) {
          const bytes = crypto.getRandomValues(new Uint32Array(length));
          results.push(Array.from(bytes, value => chars[value % chars.length]).join(""));
        }
        setResult(results.join("\n"));
      }
      if (toolId === "hash-generator") {
        try {
          const input = new TextEncoder().encode($("#inputText").value);
          const algo = $("#hashAlgo").value;
          const hash = await crypto.subtle.digest(algo, input);
          setResult(bytesToHex(hash));
        } catch (error) { setResult(`Error: ${error.message}`); }
      }
    });
  }

  function qrContainer() {
    return `<div class="preview-area"><div class="preview-canvas-wrap"><canvas id="qrCanvas" width="256" height="256" aria-label="Generated QR code"></canvas></div><div class="action-row"><button class="btn primary" id="generateQrBtn" type="button">Generate QR</button><button class="btn" id="downloadQrBtn" type="button">Download PNG</button><button class="btn" id="copyPayloadBtn" type="button">Copy Payload</button></div><div class="result-box code-like" id="qrPayload"></div></div>`;
  }

  function renderQrCodeGenerator(tool) {
    return baseTool(tool, `<div class="field"><label for="qrText">Text or URL</label><textarea id="qrText" placeholder="https://uni-app.com">https://uni-app.com</textarea></div>${qrContainer()}`);
  }

  function renderWifiQrGenerator(tool) {
    return baseTool(tool, `<div class="field-row three"><div class="field"><label for="wifiSsid">Network name</label><input id="wifiSsid" placeholder="My WiFi" /></div><div class="field"><label for="wifiPassword">Password</label><input id="wifiPassword" placeholder="Password" /></div><div class="field"><label for="wifiType">Security</label><select id="wifiType"><option>WPA</option><option>WEP</option><option>nopass</option></select></div></div><div class="field"><label for="wifiHidden">Hidden network?</label><select id="wifiHidden"><option value="false">No</option><option value="true">Yes</option></select></div>${qrContainer()}`);
  }

  function renderWhatsappGenerator(tool) {
    return baseTool(tool, `<div class="field-row"><div class="field"><label for="waPhone">Phone number with country code</label><input id="waPhone" placeholder="60123456789" /></div><div class="field"><label for="waMessage">Message</label><input id="waMessage" placeholder="Hi, I am interested." /></div></div>${qrContainer()}`);
  }

  function renderEmailQrGenerator(tool) {
    return baseTool(tool, `<div class="field-row"><div class="field"><label for="emailTo">Email to</label><input id="emailTo" type="email" placeholder="hello@example.com" /></div><div class="field"><label for="emailSubject">Subject</label><input id="emailSubject" placeholder="Hello" /></div></div><div class="field"><label for="emailBody">Body</label><textarea id="emailBody" placeholder="Write message..."></textarea></div>${qrContainer()}`);
  }

  function renderSmsQrGenerator(tool) {
    return baseTool(tool, `<div class="field-row"><div class="field"><label for="smsNumber">Phone number</label><input id="smsNumber" placeholder="60123456789" /></div><div class="field"><label for="smsMessage">Message</label><input id="smsMessage" placeholder="Hello" /></div></div>${qrContainer()}`);
  }

  function renderVcardQrGenerator(tool) {
    return baseTool(tool, `<div class="field-row"><div class="field"><label for="vcName">Full name</label><input id="vcName" placeholder="Kyren Creative Lab" /></div><div class="field"><label for="vcPhone">Phone</label><input id="vcPhone" placeholder="601166102201" /></div></div><div class="field-row"><div class="field"><label for="vcEmail">Email</label><input id="vcEmail" type="email" placeholder="hello@example.com" /></div><div class="field"><label for="vcOrg">Company</label><input id="vcOrg" placeholder="Uti-App" /></div></div><div class="field"><label for="vcUrl">Website</label><input id="vcUrl" placeholder="https://uni-app.com" /></div>${qrContainer()}`);
  }

  function escapeQr(value) {
    return String(value || "").replace(/[\\;,:"]/g, match => `\\${match}`);
  }

  function getQrPayload(toolId) {
    if (toolId === "qr-code-generator") return $("#qrText").value || "https://uni-app.com";
    if (toolId === "wifi-qr-generator") return `WIFI:T:${$("#wifiType").value};S:${escapeQr($("#wifiSsid").value)};P:${escapeQr($("#wifiPassword").value)};H:${$("#wifiHidden").value};;`;
    if (toolId === "whatsapp-link-generator") {
      const phone = $("#waPhone").value.replace(/[^\d]/g, "");
      const msg = encodeURIComponent($("#waMessage").value);
      return `https://wa.me/${phone}${msg ? `?text=${msg}` : ""}`;
    }
    if (toolId === "email-qr-generator") return `mailto:${$("#emailTo").value}?subject=${encodeURIComponent($("#emailSubject").value)}&body=${encodeURIComponent($("#emailBody").value)}`;
    if (toolId === "sms-qr-generator") return `SMSTO:${$("#smsNumber").value}:${$("#smsMessage").value}`;
    if (toolId === "vcard-qr-generator") return `BEGIN:VCARD\nVERSION:3.0\nFN:${$("#vcName").value}\nORG:${$("#vcOrg").value}\nTEL:${$("#vcPhone").value}\nEMAIL:${$("#vcEmail").value}\nURL:${$("#vcUrl").value}\nEND:VCARD`;
    return "";
  }

  function bindQr(toolId) {
    const generate = async () => {
      const payload = getQrPayload(toolId);
      $("#qrPayload").textContent = payload;
      const canvas = $("#qrCanvas");
      if (!window.QRCode || !window.QRCode.toCanvas) {
        $("#qrPayload").textContent = "QR library did not load. Check qrcode.min.js path.";
        return;
      }
      try { await window.QRCode.toCanvas(canvas, payload, { width: 280, margin: 2 }); }
      catch (error) { $("#qrPayload").textContent = `QR error: ${error.message}`; }
    };
    $("#generateQrBtn").addEventListener("click", generate);
    $("#downloadQrBtn").addEventListener("click", () => {
      $("#qrCanvas").toBlob(blob => downloadBlob(`${toolId}.png`, blob), "image/png");
    });
    $("#copyPayloadBtn").addEventListener("click", () => copyText($("#qrPayload").textContent));
    generate();
  }

  function renderStopwatch(tool) {
    return baseTool(tool, `<div class="timer-display" id="stopwatchDisplay">00:00:00.00</div><div class="action-row"><button class="btn primary" id="swStart" type="button">Start</button><button class="btn" id="swPause" type="button">Pause</button><button class="btn danger" id="swReset" type="button">Reset</button></div>`);
  }

  function renderCountdown(tool) {
    return baseTool(tool, `<div class="field-row three"><div class="field"><label for="cdHours">Hours</label><input id="cdHours" type="number" min="0" value="0" /></div><div class="field"><label for="cdMinutes">Minutes</label><input id="cdMinutes" type="number" min="0" value="5" /></div><div class="field"><label for="cdSeconds">Seconds</label><input id="cdSeconds" type="number" min="0" value="0" /></div></div><div class="timer-display" id="countdownDisplay">00:05:00</div><div class="action-row"><button class="btn primary" id="cdStart" type="button">Start</button><button class="btn" id="cdPause" type="button">Pause</button><button class="btn danger" id="cdReset" type="button">Reset</button></div>`);
  }

  function renderPomodoro(tool) {
    return baseTool(tool, `<div class="field-row"><div class="field"><label for="workMin">Work minutes</label><input id="workMin" type="number" min="1" value="25" /></div><div class="field"><label for="breakMin">Break minutes</label><input id="breakMin" type="number" min="1" value="5" /></div></div><p class="eyebrow" id="pomodoroMode">Work</p><div class="timer-display" id="pomodoroDisplay">00:25:00</div><div class="action-row"><button class="btn primary" id="pomStart" type="button">Start</button><button class="btn" id="pomPause" type="button">Pause</button><button class="btn danger" id="pomReset" type="button">Reset</button></div>`);
  }

  function renderUnixConverter(tool) {
    return baseTool(tool, `<div class="field-row"><div class="field"><label for="unixInput">Unix timestamp</label><input id="unixInput" type="number" placeholder="1710000000" /></div><div class="field"><label for="dateInput">Date and time</label><input id="dateInput" type="datetime-local" /></div></div><div class="action-row"><button class="btn primary" id="unixToDate" type="button">Timestamp to Date</button><button class="btn" id="dateToUnix" type="button">Date to Timestamp</button><button class="btn" id="unixNow" type="button">Use Current Time</button></div>${outputArea()}`);
  }

  function updateStopwatchDisplay() {
    const display = $("#stopwatchDisplay");
    if (!display) return;
    const elapsed = state.stopwatch.running ? state.stopwatch.elapsed + (Date.now() - state.stopwatch.startedAt) : state.stopwatch.elapsed;
    display.textContent = formatDuration(elapsed);
  }

  function bindDateTime(toolId) {
    if (toolId === "stopwatch") {
      updateStopwatchDisplay();
      $("#swStart").addEventListener("click", () => {
        if (state.stopwatch.running) return;
        state.stopwatch.running = true;
        state.stopwatch.startedAt = Date.now();
        state.stopwatch.interval = setInterval(updateStopwatchDisplay, 50);
      });
      $("#swPause").addEventListener("click", () => {
        if (!state.stopwatch.running) return;
        state.stopwatch.elapsed += Date.now() - state.stopwatch.startedAt;
        state.stopwatch.running = false;
        clearInterval(state.stopwatch.interval);
        updateStopwatchDisplay();
      });
      $("#swReset").addEventListener("click", () => {
        clearInterval(state.stopwatch.interval);
        state.stopwatch = { elapsed: 0, startedAt: 0, interval: null, running: false };
        updateStopwatchDisplay();
      });
    }
    if (toolId === "countdown-timer") {
      const setInitial = () => {
        state.countdown.remaining = Math.max(0, numberValue("#cdHours") * 3600 + numberValue("#cdMinutes") * 60 + numberValue("#cdSeconds"));
        $("#countdownDisplay").textContent = formatSeconds(state.countdown.remaining);
      };
      setInitial();
      $("#cdStart").addEventListener("click", () => {
        if (state.countdown.running) return;
        if (state.countdown.remaining <= 0) setInitial();
        state.countdown.running = true;
        state.countdown.interval = setInterval(() => {
          state.countdown.remaining -= 1;
          $("#countdownDisplay").textContent = formatSeconds(state.countdown.remaining);
          if (state.countdown.remaining <= 0) {
            clearInterval(state.countdown.interval);
            state.countdown.running = false;
            showToast("Countdown finished");
          }
        }, 1000);
      });
      $("#cdPause").addEventListener("click", () => { state.countdown.running = false; clearInterval(state.countdown.interval); });
      $("#cdReset").addEventListener("click", () => { state.countdown.running = false; clearInterval(state.countdown.interval); setInitial(); });
      ["#cdHours", "#cdMinutes", "#cdSeconds"].forEach(id => $(id).addEventListener("input", setInitial));
    }
    if (toolId === "pomodoro-timer") {
      const setPomodoro = mode => {
        state.pomodoro.mode = mode || "Work";
        state.pomodoro.remaining = Math.max(1, numberValue(mode === "Break" ? "#breakMin" : "#workMin")) * 60;
        $("#pomodoroMode").textContent = state.pomodoro.mode;
        $("#pomodoroDisplay").textContent = formatSeconds(state.pomodoro.remaining);
      };
      setPomodoro(state.pomodoro.mode || "Work");
      $("#pomStart").addEventListener("click", () => {
        if (state.pomodoro.running) return;
        state.pomodoro.running = true;
        state.pomodoro.interval = setInterval(() => {
          state.pomodoro.remaining -= 1;
          $("#pomodoroDisplay").textContent = formatSeconds(state.pomodoro.remaining);
          if (state.pomodoro.remaining <= 0) {
            const nextMode = state.pomodoro.mode === "Work" ? "Break" : "Work";
            showToast(`${state.pomodoro.mode} session finished`);
            setPomodoro(nextMode);
          }
        }, 1000);
      });
      $("#pomPause").addEventListener("click", () => { state.pomodoro.running = false; clearInterval(state.pomodoro.interval); });
      $("#pomReset").addEventListener("click", () => { state.pomodoro.running = false; clearInterval(state.pomodoro.interval); setPomodoro("Work"); });
      ["#workMin", "#breakMin"].forEach(id => $(id).addEventListener("input", () => setPomodoro(state.pomodoro.mode)));
    }
    if (toolId === "unix-timestamp-converter") {
      $("#unixNow").addEventListener("click", () => { $("#unixInput").value = Math.floor(Date.now() / 1000); $("#unixToDate").click(); });
      $("#unixToDate").addEventListener("click", () => {
        const raw = numberValue("#unixInput");
        const ms = raw > 9999999999 ? raw : raw * 1000;
        const date = new Date(ms);
        setResult(Number.isNaN(date.getTime()) ? "Invalid timestamp." : `${date.toString()}\nISO: ${date.toISOString()}`);
      });
      $("#dateToUnix").addEventListener("click", () => {
        const date = new Date($("#dateInput").value);
        setResult(Number.isNaN(date.getTime()) ? "Invalid date." : `Seconds: ${Math.floor(date.getTime() / 1000)}\nMilliseconds: ${date.getTime()}`);
      });
      $("#unixNow").click();
    }
  }

  function renderImageTool(tool, mode) {
    let controls = "";
    if (mode === "resize") controls = `<div class="field-row"><div class="field"><label for="imgWidth">New width</label><input id="imgWidth" type="number" placeholder="Width" /></div><div class="field"><label for="imgHeight">New height</label><input id="imgHeight" type="number" placeholder="Height" /></div></div>`;
    if (mode === "compress") controls = `<div class="field-row"><div class="field"><label for="quality">Quality: <span id="qualityValue">0.75</span></label><input id="quality" type="range" min="0.1" max="1" step="0.05" value="0.75" /></div><div class="field"><label for="compressFormat">Format</label><select id="compressFormat"><option value="image/jpeg">JPG</option><option value="image/webp">WebP</option></select></div></div>`;
    if (mode === "crop") controls = `<div class="field-row"><div class="field"><label for="cropX">X</label><input id="cropX" type="number" value="0" /></div><div class="field"><label for="cropY">Y</label><input id="cropY" type="number" value="0" /></div></div><div class="field-row"><div class="field"><label for="cropW">Crop width</label><input id="cropW" type="number" placeholder="Width" /></div><div class="field"><label for="cropH">Crop height</label><input id="cropH" type="number" placeholder="Height" /></div></div>`;
    if (mode === "rotate") controls = `<div class="field"><label for="rotateDeg">Rotation</label><select id="rotateDeg"><option value="90">90°</option><option value="180">180°</option><option value="270">270°</option></select></div>`;
    if (mode === "flip") controls = `<div class="field"><label for="flipMode">Flip mode</label><select id="flipMode"><option value="horizontal">Horizontal</option><option value="vertical">Vertical</option></select></div>`;
    return baseTool(tool, `<div class="field"><label for="imageInput">Choose image</label><input id="imageInput" type="file" accept="image/*" /></div>${controls}<div class="action-row"><button class="btn primary" id="processImageBtn" type="button">Process Image</button><button class="btn" id="downloadImageBtn" type="button" disabled>Download Image</button></div><p class="note">All image work happens in your browser using Canvas. Large images may take longer on slower devices.</p><div class="preview-canvas-wrap"><canvas id="imageCanvas"></canvas></div><div class="result-box" id="imageInfo"></div>`);
  }

  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(img.src); resolve(img); };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  function canvasToBlob(canvas, type, quality) {
    return new Promise(resolve => canvas.toBlob(resolve, type, quality));
  }

  async function bindImageTool(toolId) {
    const modeMap = {
      "image-resizer": "resize",
      "image-compressor": "compress",
      "image-cropper": "crop",
      "jpg-to-png": "to-png",
      "png-to-jpg": "to-jpg",
      "image-to-webp": "to-webp",
      "rotate-image": "rotate",
      "flip-image": "flip"
    };
    const mode = modeMap[toolId];
    let currentBlob = null;
    let filename = `${toolId}.png`;
    const quality = $("#quality");
    if (quality) quality.addEventListener("input", () => $("#qualityValue").textContent = quality.value);
    $("#processImageBtn").addEventListener("click", async () => {
      const file = $("#imageInput").files[0];
      if (!file) { showToast("Choose an image first"); return; }
      try {
        const img = await loadImage(file);
        const canvas = $("#imageCanvas");
        const ctx = canvas.getContext("2d");
        let outType = "image/png";
        let outQuality = 0.92;
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        canvas.width = w;
        canvas.height = h;
        ctx.clearRect(0, 0, w, h);

        if (mode === "resize") {
          const targetW = Math.max(1, numberValue("#imgWidth") || w);
          const targetH = Math.max(1, numberValue("#imgHeight") || h);
          canvas.width = targetW;
          canvas.height = targetH;
          ctx.drawImage(img, 0, 0, targetW, targetH);
        } else if (mode === "crop") {
          const x = Math.max(0, numberValue("#cropX"));
          const y = Math.max(0, numberValue("#cropY"));
          const cw = Math.max(1, numberValue("#cropW") || w);
          const ch = Math.max(1, numberValue("#cropH") || h);
          canvas.width = Math.min(cw, w - x);
          canvas.height = Math.min(ch, h - y);
          ctx.drawImage(img, x, y, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        } else if (mode === "rotate") {
          const deg = Number($("#rotateDeg").value);
          const rad = deg * Math.PI / 180;
          const swap = deg === 90 || deg === 270;
          canvas.width = swap ? h : w;
          canvas.height = swap ? w : h;
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(rad);
          ctx.drawImage(img, -w / 2, -h / 2);
        } else if (mode === "flip") {
          canvas.width = w;
          canvas.height = h;
          const horizontal = $("#flipMode").value === "horizontal";
          ctx.translate(horizontal ? w : 0, horizontal ? 0 : h);
          ctx.scale(horizontal ? -1 : 1, horizontal ? 1 : -1);
          ctx.drawImage(img, 0, 0);
        } else {
          canvas.width = w;
          canvas.height = h;
          if (["compress", "to-jpg"].includes(mode)) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, w, h);
          }
          ctx.drawImage(img, 0, 0);
        }

        if (mode === "compress") { outType = $("#compressFormat").value; outQuality = Number($("#quality").value); }
        if (mode === "to-jpg") { outType = "image/jpeg"; outQuality = 0.92; }
        if (mode === "to-webp") { outType = "image/webp"; outQuality = 0.86; }
        if (["resize", "crop", "rotate", "flip", "to-png"].includes(mode)) outType = "image/png";
        const ext = outType === "image/jpeg" ? "jpg" : outType === "image/webp" ? "webp" : "png";
        filename = `${file.name.replace(/\.[^.]+$/, "")}-${toolId}.${ext}`;
        currentBlob = await canvasToBlob(canvas, outType, outQuality);
        $("#downloadImageBtn").disabled = !currentBlob;
        $("#imageInfo").textContent = `Original: ${img.naturalWidth}×${img.naturalHeight}px, ${(file.size / 1024).toFixed(1)} KB\nOutput: ${canvas.width}×${canvas.height}px, ${currentBlob ? (currentBlob.size / 1024).toFixed(1) : "0"} KB`;
      } catch (error) {
        $("#imageInfo").textContent = `Error: ${error.message}`;
      }
    });
    $("#downloadImageBtn").addEventListener("click", () => currentBlob && downloadBlob(filename, currentBlob));
    $("#imageInput").addEventListener("change", async () => {
      const file = $("#imageInput").files[0];
      if (!file) return;
      const img = await loadImage(file);
      if ($("#imgWidth") && !$("#imgWidth").value) $("#imgWidth").value = img.naturalWidth;
      if ($("#imgHeight") && !$("#imgHeight").value) $("#imgHeight").value = img.naturalHeight;
      if ($("#cropW") && !$("#cropW").value) $("#cropW").value = Math.floor(img.naturalWidth / 2);
      if ($("#cropH") && !$("#cropH").value) $("#cropH").value = Math.floor(img.naturalHeight / 2);
      $("#imageInfo").textContent = `Loaded: ${img.naturalWidth}×${img.naturalHeight}px, ${(file.size / 1024).toFixed(1)} KB`;
    });
  }

  function renderJpgToPdf(tool) {
    return baseTool(tool, `<div class="field"><label for="jpgPdfFiles">Choose JPG/PNG images</label><input id="jpgPdfFiles" type="file" accept="image/jpeg,image/png" multiple /></div><div class="action-row"><button class="btn primary" id="makePdfBtn" type="button">Create PDF</button></div><div class="result-box" id="pdfResult"></div>`);
  }

  function renderMergePdf(tool) {
    return baseTool(tool, `<div class="field"><label for="mergePdfFiles">Choose PDF files</label><input id="mergePdfFiles" type="file" accept="application/pdf" multiple /></div><div class="action-row"><button class="btn primary" id="mergePdfBtn" type="button">Merge PDF</button></div><p class="note">Files are merged in the order selected by your browser. Rename files with 01, 02, 03 if you need strict order.</p><div class="result-box" id="pdfResult"></div>`);
  }

  async function bindPdfTool(toolId) {
    if (toolId === "jpg-to-pdf") {
      $("#makePdfBtn").addEventListener("click", async () => {
        const files = Array.from($("#jpgPdfFiles").files || []);
        if (!files.length) { showToast("Choose images first"); return; }
        if (!window.jspdf) { $("#pdfResult").textContent = "PDF library did not load. Check jspdf.umd.min.js path."; return; }
        try {
          const { jsPDF } = window.jspdf;
          let pdf = null;
          for (const [index, file] of files.entries()) {
            const img = await loadImage(file);
            const orientation = img.naturalWidth > img.naturalHeight ? "landscape" : "portrait";
            const format = [img.naturalWidth, img.naturalHeight];
            if (!pdf) pdf = new jsPDF({ orientation, unit: "px", format });
            else pdf.addPage(format, orientation);
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
            pdf.addImage(dataUrl, "JPEG", 0, 0, img.naturalWidth, img.naturalHeight);
            $("#pdfResult").textContent = `Added image ${index + 1} of ${files.length}...`;
          }
          pdf.save("uti-app-images.pdf");
          $("#pdfResult").textContent = `Created PDF with ${files.length} image(s).`;
        } catch (error) { $("#pdfResult").textContent = `Error: ${error.message}`; }
      });
    }
    if (toolId === "merge-pdf") {
      $("#mergePdfBtn").addEventListener("click", async () => {
        const files = Array.from($("#mergePdfFiles").files || []);
        if (files.length < 2) { showToast("Choose at least two PDFs"); return; }
        if (!window.PDFLib) { $("#pdfResult").textContent = "PDF merge library did not load. Check pdf-lib.min.js path."; return; }
        try {
          const { PDFDocument } = window.PDFLib;
          const merged = await PDFDocument.create();
          let pageCount = 0;
          for (const [index, file] of files.entries()) {
            const bytes = await file.arrayBuffer();
            const src = await PDFDocument.load(bytes);
            const copied = await merged.copyPages(src, src.getPageIndices());
            copied.forEach(page => { merged.addPage(page); pageCount += 1; });
            $("#pdfResult").textContent = `Merged file ${index + 1} of ${files.length}...`;
          }
          const mergedBytes = await merged.save();
          downloadBlob("uti-app-merged.pdf", new Blob([mergedBytes], { type: "application/pdf" }));
          $("#pdfResult").textContent = `Merged ${files.length} PDF files with ${pageCount} total page(s).`;
        } catch (error) { $("#pdfResult").textContent = `Error: ${error.message}`; }
      });
    }
  }

  function bindToolEvents(toolId) {
    clearInterval(state.countdown.interval);
    state.countdown.running = false;
    clearInterval(state.pomodoro.interval);
    state.pomodoro.running = false;
    if (toolId === "word-counter") bindTextStats("words");
    if (toolId === "character-counter") bindTextStats("chars");
    if (["remove-duplicate-lines", "sort-lines", "text-cleaner", "slug-generator", "find-and-replace", "remove-extra-spaces"].includes(toolId)) bindTextAction(toolId);
    if (toolId === "case-converter") bindCaseConverter();
    if (toolId === "reading-time-calculator") bindReadingTime();
    if (["percentage-calculator", "age-calculator", "bmi-calculator", "discount-calculator", "tip-calculator", "loan-calculator", "compound-interest-calculator", "profit-margin-calculator", "date-difference-calculator", "time-duration-calculator"].includes(toolId)) bindCalculator(toolId);
    if (["json-formatter", "json-validator", "base64-encoder-decoder", "url-encoder-decoder", "uuid-generator", "password-generator", "hash-generator", "html-formatter", "css-minifier", "javascript-minifier"].includes(toolId)) bindDevTool(toolId);
    if (["qr-code-generator", "wifi-qr-generator", "whatsapp-link-generator", "email-qr-generator", "sms-qr-generator", "vcard-qr-generator"].includes(toolId)) bindQr(toolId);
    if (["stopwatch", "countdown-timer", "pomodoro-timer", "unix-timestamp-converter"].includes(toolId)) bindDateTime(toolId);
    if (["image-resizer", "image-compressor", "image-cropper", "jpg-to-png", "png-to-jpg", "image-to-webp", "rotate-image", "flip-image"].includes(toolId)) bindImageTool(toolId);
    if (["jpg-to-pdf", "merge-pdf"].includes(toolId)) bindPdfTool(toolId);
  }

  function updateThemeIcon() {
    const button = $("#themeToggle");
    if (!button) return;
    button.textContent = document.documentElement.dataset.theme === "dark" ? "☀️" : "🌙";
  }

  function renderRelatedTools() {
    const box = $("#relatedTools");
    if (!box) return;
    const current = tools.find(tool => tool.id === document.body.dataset.tool);
    if (!current) return;
    const related = tools.filter(tool => tool.category === current.category && tool.id !== current.id).slice(0, 9);
    box.innerHTML = related.map(tool => `<a class="mini-link" href="${tool.id}.html">${escapeHtml(tool.title)}</a>`).join("");
  }

  function initialize() {
    if ($("#year")) $("#year").textContent = new Date().getFullYear();
    if ($("#toolCount")) $("#toolCount").textContent = tools.length;

    const storedTheme = localStorage.getItem("uti-theme");
    if (storedTheme === "dark" || storedTheme === "light") document.documentElement.dataset.theme = storedTheme;
    updateThemeIcon();

    $("#themeToggle")?.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("uti-theme", next);
      updateThemeIcon();
    });

    $("#menuToggle")?.addEventListener("click", () => {
      const nav = $("#navActions");
      if (!nav) return;
      const open = nav.classList.toggle("open");
      $("#menuToggle").setAttribute("aria-expanded", String(open));
    });

    // Reliable Tools dropdown for mobile Safari/iPhone and desktop click/touch.
    const toolMenuItems = Array.from(document.querySelectorAll(".nav-menu-item"));
    const closeToolMenus = () => {
      toolMenuItems.forEach(item => {
        item.classList.remove("open");
        item.querySelector(".nav-menu-button")?.setAttribute("aria-expanded", "false");
      });
    };

    toolMenuItems.forEach(item => {
      const button = item.querySelector(".nav-menu-button");
      button?.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        const willOpen = !item.classList.contains("open");
        closeToolMenus();
        if (willOpen) {
          item.classList.add("open");
          button.setAttribute("aria-expanded", "true");
        }
      });

      item.querySelectorAll(".mega-menu a").forEach(link => {
        link.addEventListener("click", () => {
          closeToolMenus();
          const nav = $("#navActions");
          nav?.classList.remove("open");
          $("#menuToggle")?.setAttribute("aria-expanded", "false");
        });
      });
    });

    document.addEventListener("click", event => {
      if (!toolMenuItems.some(item => item.contains(event.target))) closeToolMenus();
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeToolMenus();
    });

    const pageTool = document.body.dataset.tool;
    if (pageTool && tools.some(tool => tool.id === pageTool)) {
      state.activeTool = pageTool;
      renderActiveTool();
      renderRelatedTools();
      return;
    }

    $("#toolSearch")?.addEventListener("input", event => {
      state.query = event.target.value;
      renderToolGrid();
    });

    $("#toolGrid")?.addEventListener("click", event => {
      const btn = event.target.closest("button[data-tool]");
      if (!btn) return;
      state.activeTool = btn.dataset.tool;
      renderActiveTool();
      $("#toolStage")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    $("#randomToolBtn")?.addEventListener("click", () => {
      const random = tools[Math.floor(Math.random() * tools.length)];
      state.activeTool = random.id;
      renderActiveTool();
      $("#all-tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    window.addEventListener("hashchange", () => {
      const id = location.hash.replace("#", "");
      if (tools.some(tool => tool.id === id)) {
        state.activeTool = id;
        renderActiveTool();
      }
    });

    const initial = location.hash.replace("#", "");
    if (tools.some(tool => tool.id === initial)) state.activeTool = initial;
    renderCategories();
    renderToolGrid();
    renderActiveTool();
  }

  document.addEventListener("DOMContentLoaded", initialize);
})();
