
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const state = { sheets: [], current: 0, sourceName: 'uti-mate-pdf-to-excel' };

  function setStatus(message) { const el = $('#pxStatus'); if (el) el.textContent = message; }
  function setProgress(pct) { const el = $('#pxProgress span'); if (el) el.style.width = `${Math.max(0, Math.min(100, pct))}%`; }
  function escapeHtml(v){ return String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;'); }
  function cleanCell(v){ return String(v ?? '').replace(/\s+/g, ' ').trim(); }
  function safeSheetName(name, fallback){ return cleanCell(name || fallback || 'Sheet').replace(/[\\/?*\[\]:]/g, '').slice(0,31) || fallback || 'Sheet'; }
  function slugName(name){ return String(name || 'converted').replace(/\.[^.]+$/,'').replace(/[^a-z0-9]+/gi,'-').replace(/^-+|-+$/g,'').toLowerCase() || 'converted'; }

  function availableLibraries(){
    return { pdfjs: !!window.pdfjsLib, tesseract: !!window.Tesseract, xlsx: !!window.XLSX };
  }

  function initPdfJs(){
    if (!window.pdfjsLib) return false;
    try { window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; } catch(e) {}
    return true;
  }

  function parsePageRange(input, total){
    const raw = cleanCell(input);
    if (!raw) return Array.from({length: total}, (_, i) => i + 1);
    const set = new Set();
    raw.split(',').forEach(part => {
      const m = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
      if (!m) return;
      const a = Math.max(1, Math.min(total, Number(m[1])));
      const b = Math.max(1, Math.min(total, Number(m[2] || m[1])));
      for (let n = Math.min(a,b); n <= Math.max(a,b); n++) set.add(n);
    });
    return Array.from(set).sort((a,b)=>a-b);
  }

  async function fileToImageCanvas(file, maxWidth){
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.decoding = 'async';
      await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = url; });
      const scale = Math.min(1, maxWidth / img.naturalWidth) || 1;
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return canvas;
    } finally { URL.revokeObjectURL(url); }
  }

  async function pdfPageToCanvas(pdf, pageNo, scaleMultiplier, maxWidth){
    const page = await pdf.getPage(pageNo);
    const viewport1 = page.getViewport({ scale: 1 });
    const scale = Math.min(scaleMultiplier, maxWidth / viewport1.width) || scaleMultiplier;
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    return canvas;
  }

  function normalizeWord(word){
    const text = cleanCell(word.text || word.symbols?.map(s => s.text).join('') || '');
    const b = word.bbox || word.boundingBox || word.baseline || {};
    let x0 = Number(b.x0 ?? b.left ?? b.x ?? 0);
    let y0 = Number(b.y0 ?? b.top ?? b.y ?? 0);
    let x1 = Number(b.x1 ?? (x0 + Number(b.width ?? 0)));
    let y1 = Number(b.y1 ?? (y0 + Number(b.height ?? 0)));
    if (!text) return null;
    if (!Number.isFinite(x0)) x0 = 0; if (!Number.isFinite(y0)) y0 = 0; if (!Number.isFinite(x1)) x1 = x0 + text.length * 8; if (!Number.isFinite(y1)) y1 = y0 + 12;
    return { text, x0, y0, x1, y1, midY: (y0 + y1) / 2, h: Math.max(8, y1 - y0), conf: Number(word.confidence ?? word.conf ?? 0) };
  }

  function rowsFromWords(words, options){
    const normalized = (words || []).map(normalizeWord).filter(Boolean).sort((a,b)=>a.midY-b.midY || a.x0-b.x0);
    if (!normalized.length) return [];
    const rows = [];
    let tolerance = Number(options.lineTolerance || 14);
    normalized.forEach(w => {
      let row = rows.find(r => Math.abs(r.midY - w.midY) <= tolerance);
      if (!row) { row = { midY: w.midY, words: [] }; rows.push(row); }
      row.words.push(w);
      row.midY = row.words.reduce((sum,x)=>sum+x.midY,0) / row.words.length;
    });
    rows.sort((a,b)=>a.midY-b.midY);
    rows.forEach(r => r.words.sort((a,b)=>a.x0-b.x0));
    return rows;
  }

  function buildColumnAnchors(rows){
    const xs = [];
    rows.forEach(r => r.words.forEach(w => xs.push(w.x0)));
    xs.sort((a,b)=>a-b);
    const anchors = [];
    const threshold = 42;
    xs.forEach(x => {
      const last = anchors[anchors.length - 1];
      if (last == null || Math.abs(x - last) > threshold) anchors.push(x);
      else anchors[anchors.length - 1] = (last + x) / 2;
    });
    return anchors.slice(0, 24);
  }

  function tableFromOcrData(data, mode, options){
    const text = data?.text || '';
    const words = data?.words || [];
    const ocrRows = rowsFromWords(words, options);
    let table = [];
    if (mode === 'line-text' || !ocrRows.length) {
      table = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean).map(line => {
        const cells = line.split(/\t|\s{2,}|\s+\|\s+|,/).map(cleanCell).filter(Boolean);
        return cells.length ? cells : [line.trim()];
      });
    } else if (mode === 'word-columns') {
      const anchors = buildColumnAnchors(ocrRows);
      table = ocrRows.map(row => {
        const cells = Array.from({length: Math.max(1, anchors.length)}, () => '');
        row.words.forEach(w => {
          let idx = 0, best = Infinity;
          anchors.forEach((x, i) => { const d = Math.abs(w.x0 - x); if (d < best) { best = d; idx = i; } });
          cells[idx] = cleanCell(`${cells[idx]} ${w.text}`);
        });
        while (cells.length && !cells[cells.length - 1]) cells.pop();
        return cells;
      }).filter(row => row.some(Boolean));
    } else {
      table = ocrRows.map(row => {
        const cells = [];
        let current = '';
        let prev = null;
        const avgWidth = row.words.reduce((s,w)=>s+(w.x1-w.x0),0) / Math.max(1,row.words.length);
        const gapThreshold = Math.max(28, avgWidth * 1.15);
        row.words.forEach(w => {
          const gap = prev ? w.x0 - prev.x1 : 0;
          if (prev && gap > gapThreshold) { cells.push(cleanCell(current)); current = w.text; }
          else current = cleanCell(`${current} ${w.text}`);
          prev = w;
        });
        if (current) cells.push(cleanCell(current));
        return cells;
      }).filter(row => row.some(Boolean));
    }
    const maxCols = Math.max(1, ...table.map(r => r.length));
    return table.map(row => row.concat(Array.from({length: Math.max(0, maxCols - row.length)}, () => '')));
  }

  async function ocrCanvas(canvas, label, index, total){
    const lang = $('#pxLanguage')?.value || 'eng';
    const mode = $('#pxDetectionMode')?.value || 'auto-gap';
    const lineTolerance = Number($('#pxLineTolerance')?.value || 14);
    const progressBase = index / total * 100;
    const progressShare = 100 / total;
    setStatus(`OCR running on ${label}...\nThis can take longer for high-resolution scans.`);
    const result = await window.Tesseract.recognize(canvas, lang, {
      logger: m => {
        if (!m || typeof m.progress !== 'number') return;
        const pct = progressBase + (m.progress * progressShare);
        setProgress(pct);
        if (m.status) setStatus(`${label}: ${m.status} ${(m.progress*100).toFixed(0)}%`);
      }
    });
    const data = result?.data || {};
    const rows = buildSheetRows(tableFromOcrData(data, mode, { lineTolerance }), label, data);
    return { name: safeSheetName(label, `Page ${index+1}`), rows, text: data.text || '', confidence: data.confidence || data.conf || '' };
  }

  function buildSheetRows(table, label, data){
    const clean = table.map(r => r.map(cleanCell)).filter(r => r.some(Boolean));
    if (!clean.length) return [[`No readable table/text detected on ${label}. Try a clearer scan, higher resolution, or another detection mode.`]];
    if ($('#pxAddSourceRow')?.checked) {
      return [[`Source: ${label}`, `OCR confidence: ${data.confidence ? Math.round(data.confidence) + '%' : 'n/a'}`], [], ...clean];
    }
    return clean;
  }

  function renderStats(){
    const sheets = state.sheets;
    const rows = sheets.reduce((sum,s)=>sum+s.rows.filter(r=>r.some(Boolean)).length,0);
    const cols = Math.max(0, ...sheets.flatMap(s => s.rows.map(r => r.length)));
    $('#pxStats').innerHTML = `
      <div class="pdf-excel-stat"><strong>${sheets.length}</strong><span>sheet(s)</span></div>
      <div class="pdf-excel-stat"><strong>${rows}</strong><span>row(s)</span></div>
      <div class="pdf-excel-stat"><strong>${cols}</strong><span>max column(s)</span></div>
      <div class="pdf-excel-stat"><strong>${state.sourceName ? escapeHtml(state.sourceName) : 'Ready'}</strong><span>source</span></div>`;
  }

  function renderTabs(){
    const tabs = $('#pxTabs');
    if (!tabs) return;
    tabs.innerHTML = state.sheets.map((s,i)=>`<button class="pdf-excel-tab ${i===state.current?'active':''}" data-sheet="${i}" type="button">${escapeHtml(s.name)}</button>`).join('');
    $$('.pdf-excel-tab', tabs).forEach(btn => btn.addEventListener('click', () => { state.current = Number(btn.dataset.sheet); renderPreview(); }));
  }

  function renderPreview(){
    renderStats(); renderTabs();
    const box = $('#pxPreview');
    if (!box) return;
    const sheet = state.sheets[state.current];
    if (!sheet) {
      box.innerHTML = `<div class="pdf-excel-empty"><div><strong>No extracted data yet.</strong><br>Upload a scanned PDF or image and click Start OCR.</div></div>`;
      return;
    }
    const rows = sheet.rows;
    const maxCols = Math.max(1, ...rows.map(r=>r.length));
    const head = `<thead><tr>${Array.from({length:maxCols},(_,i)=>`<th>Column ${i+1}</th>`).join('')}</tr></thead>`;
    const body = `<tbody>${rows.map((row,ri)=>`<tr>${Array.from({length:maxCols},(_,ci)=>`<td contenteditable="true" data-row="${ri}" data-col="${ci}">${escapeHtml(row[ci] || '')}</td>`).join('')}</tr>`).join('')}</tbody>`;
    box.innerHTML = `<div class="pdf-excel-table-wrap"><table class="pdf-excel-table">${head}${body}</table></div>`;
    $$('td[contenteditable="true"]', box).forEach(td => td.addEventListener('input', () => {
      const r = Number(td.dataset.row), c = Number(td.dataset.col);
      state.sheets[state.current].rows[r][c] = td.textContent.trim();
    }));
  }

  function makeCombinedSheet(){
    const rows = [];
    state.sheets.forEach((s, idx) => {
      if (idx > 0) rows.push([]);
      rows.push([s.name]);
      rows.push(...s.rows);
    });
    return { name: 'Combined OCR', rows };
  }

  function downloadXlsx(){
    if (!state.sheets.length) return setStatus('Run OCR first before downloading Excel.');
    if (!window.XLSX) return setStatus('Excel library did not load. Check internet/CDN access for SheetJS.');
    const wb = XLSX.utils.book_new();
    const combined = makeCombinedSheet();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(combined.rows), safeSheetName(combined.name, 'Combined OCR'));
    if ($('#pxSeparateSheets')?.checked) {
      state.sheets.forEach((s, idx) => XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s.rows), safeSheetName(s.name, `Sheet ${idx+1}`)));
    }
    const filename = `${slugName(state.sourceName)}-editable-excel.xlsx`;
    XLSX.writeFile(wb, filename);
    setStatus(`Downloaded ${filename}`);
  }

  function downloadCsv(){
    if (!state.sheets.length) return setStatus('Run OCR first before downloading CSV.');
    const rows = makeCombinedSheet().rows;
    const csv = rows.map(row => row.map(cell => `"${String(cell ?? '').replaceAll('"','""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${slugName(state.sourceName)}-ocr-table.csv`; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href), 3000);
  }

  async function copyPreview(){
    if (!state.sheets.length) return setStatus('Run OCR first before copying.');
    const text = makeCombinedSheet().rows.map(r => r.join('\t')).join('\n');
    await navigator.clipboard.writeText(text);
    setStatus('Copied extracted table data to clipboard.');
  }

  async function processFiles(){
    const files = Array.from($('#pxFiles')?.files || []);
    if (!files.length) return setStatus('Choose a scanned PDF or image file first.');
    const libs = availableLibraries();
    if (!libs.tesseract) return setStatus('OCR library did not load. Check internet/CDN access for Tesseract.js.');
    if (!libs.xlsx) return setStatus('Excel export library did not load. Check internet/CDN access for SheetJS.');
    if (files.some(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')) && !libs.pdfjs) return setStatus('PDF rendering library did not load. Check internet/CDN access for PDF.js.');
    initPdfJs();
    const scale = Number($('#pxRenderScale')?.value || 2);
    const maxWidth = Number($('#pxMaxWidth')?.value || 1800);
    const limitPages = Math.max(1, Number($('#pxMaxPages')?.value || 25));
    state.sheets = []; state.current = 0; state.sourceName = files.length === 1 ? files[0].name : `${files.length}-files`;
    renderPreview();
    let jobs = [];
    for (const file of files) {
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      if (isPdf) {
        setStatus(`Loading PDF: ${file.name}`);
        const buffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
        const pages = parsePageRange($('#pxPageRange')?.value || '', pdf.numPages).slice(0, limitPages);
        for (const p of pages) jobs.push({ type:'pdf-page', file, pdf, pageNo:p, label:`${file.name} · Page ${p}` });
      } else if (file.type.startsWith('image/')) {
        jobs.push({ type:'image', file, label:file.name });
      }
    }
    if (!jobs.length) return setStatus('No supported files found. Use PDF, JPG, PNG, or WebP images.');
    setProgress(0);
    for (let i=0; i<jobs.length; i++) {
      const job = jobs[i];
      let canvas;
      if (job.type === 'pdf-page') canvas = await pdfPageToCanvas(job.pdf, job.pageNo, scale, maxWidth);
      else canvas = await fileToImageCanvas(job.file, maxWidth);
      const sheet = await ocrCanvas(canvas, job.label, i, jobs.length);
      state.sheets.push(sheet);
      state.current = state.sheets.length - 1;
      renderPreview();
    }
    setProgress(100);
    setStatus(`Done. Extracted ${state.sheets.length} sheet(s). Check the preview, edit any cells if needed, then download Excel.`);
  }

  function resetAll(){
    state.sheets = []; state.current = 0; state.sourceName = 'uti-mate-pdf-to-excel';
    const input = $('#pxFiles'); if (input) input.value = '';
    setProgress(0); setStatus('Ready. Upload a scanned PDF/image and start OCR.'); renderPreview();
  }

  function init(){
    if (!document.body.classList.contains('pdf-excel-body')) return;
    initPdfJs();
    $('#pxStartBtn')?.addEventListener('click', () => processFiles().catch(err => { console.error(err); setStatus(`Could not complete OCR.\n${err.message || err}`); }));
    $('#pxDownloadXlsxBtn')?.addEventListener('click', downloadXlsx);
    $('#pxDownloadCsvBtn')?.addEventListener('click', downloadCsv);
    $('#pxCopyBtn')?.addEventListener('click', () => copyPreview().catch(err => setStatus(err.message)));
    $('#pxResetBtn')?.addEventListener('click', resetAll);
    renderPreview();
    const libs = availableLibraries();
    setStatus(`Ready. Libraries: PDF.js ${libs.pdfjs ? 'loaded' : 'missing'}, OCR ${libs.tesseract ? 'loaded' : 'missing'}, Excel ${libs.xlsx ? 'loaded' : 'missing'}.`);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
