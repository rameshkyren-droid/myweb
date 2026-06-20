
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const tool = document.body.dataset.pdfTool;
  if (!tool) return;

  const PDFJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  const PDFJS_WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  const state = { files: [], pageCount: 0, lastBlob: null, lastName: "uti-mate-output.pdf" };
  const el = {
    file: $('#pdfFileInput'),
    fileList: $('#pdfFileList'),
    status: $('#pdfStatus'),
    progress: $('#pdfProgress'),
    bar: $('#pdfProgressBar'),
    output: $('#pdfOutput')
  };

  const niceBytes = (bytes) => {
    if (!Number.isFinite(bytes)) return '0 B';
    const units = ['B','KB','MB','GB'];
    let v = bytes, i = 0;
    while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
    return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
  };

  function setStatus(msg) { if (el.status) el.status.textContent = msg || ''; }
  function setProgress(percent, msg) {
    if (el.progress) el.progress.classList.toggle('show', percent > 0 && percent < 100);
    if (el.bar) el.bar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
    if (msg) setStatus(msg);
  }
  function toast(msg) {
    const t = $('#toast');
    if (!t) { setStatus(msg); return; }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => t.classList.remove('show'), 2200);
  }
  function downloadBlob(filename, blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  function showDownload(filename, blob, details = '') {
    state.lastBlob = blob;
    state.lastName = filename;
    const reduction = state.files[0] ? `Original: ${niceBytes(state.files[0].size)} • Output: ${niceBytes(blob.size)}` : `Output: ${niceBytes(blob.size)}`;
    if (!el.output) return;
    el.output.innerHTML = `
      <div class="pdf-download-card">
        <strong>Ready: ${escapeHtml(filename)}</strong>
        <span>${escapeHtml(reduction)}${details ? ' • ' + escapeHtml(details) : ''}</span>
        <div class="pdf-actions">
          <button class="btn primary" type="button" id="pdfDownloadReady">Download file</button>
          <button class="btn ghost" type="button" id="pdfResetOutput">Clear result</button>
        </div>
      </div>`;
    $('#pdfDownloadReady')?.addEventListener('click', () => downloadBlob(filename, blob));
    $('#pdfResetOutput')?.addEventListener('click', () => renderEmptyOutput());
  }
  function renderEmptyOutput() {
    if (!el.output) return;
    el.output.innerHTML = `<div class="pdf-output-empty"><div><strong>Your result will appear here.</strong><p>Choose a file, adjust the options, then run the tool.</p></div></div>`;
  }
  function escapeHtml(value) {
    return String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  }
  function sanitizeName(name) {
    return String(name || 'uti-mate-file').replace(/\.[^.]+$/, '').replace(/[^a-z0-9_-]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'uti-mate-file';
  }
  function requirePdfLib() {
    if (!window.PDFLib || !window.PDFLib.PDFDocument) {
      throw new Error('pdf-lib.min.js did not load. Upload pdf-lib.min.js in the same folder.');
    }
    return window.PDFLib;
  }
  function getPdfPageCount(doc) {
    if (doc && typeof doc.getPageCount === 'function') return doc.getPageCount();
    if (doc && typeof doc.getPages === 'function') return doc.getPages().length;
    if (doc && typeof doc.getPageIndices === 'function') return doc.getPageIndices().length;
    if (doc && Array.isArray(doc.pageRefs)) return doc.pageRefs.length;
    return 0;
  }
  function getPdfPageIndices(doc) {
    if (doc && typeof doc.getPageIndices === 'function') return doc.getPageIndices();
    const total = getPdfPageCount(doc);
    return Array.from({ length: total }, (_, i) => i);
  }
  async function loadPdfDoc(file, opts = {}) {
    const { PDFDocument } = requirePdfLib();
    return await PDFDocument.load(await file.arrayBuffer(), opts);
  }
  function pageRangeString(total) { return total ? `1-${total}` : '1-10'; }
  function parseNumbers(input, total) {
    const text = String(input || '').trim();
    if (!text) return Array.from({ length: total }, (_, i) => i);
    const out = [];
    for (const part of text.split(',')) {
      const p = part.trim();
      if (!p) continue;
      const m = p.match(/^(\d+)\s*-\s*(\d+)$/);
      if (m) {
        let a = Math.max(1, parseInt(m[1], 10));
        let b = Math.min(total, parseInt(m[2], 10));
        const step = a <= b ? 1 : -1;
        for (let n = a; step > 0 ? n <= b : n >= b; n += step) out.push(n - 1);
      } else if (/^\d+$/.test(p)) {
        const n = parseInt(p, 10);
        if (n >= 1 && n <= total) out.push(n - 1);
      }
    }
    return Array.from(new Set(out));
  }
  function parseRangeGroups(input, total) {
    const text = String(input || '').trim();
    if (!text) return [Array.from({ length: total }, (_, i) => i)];
    return text.split(',').map(part => parseNumbers(part, total)).filter(group => group.length);
  }
  function readHexColor(hex, fallback = '#64748b') {
    const clean = String(hex || fallback).replace('#','');
    const value = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
    const n = parseInt(value || fallback.replace('#',''), 16);
    return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
  }

  let pdfJsPromise = null;
  function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
        if (src.includes('pdf.min.js') && window.pdfjsLib) resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Could not load required script: ${src}`));
      document.head.appendChild(script);
    });
  }
  async function ensurePdfJs() {
    if (!window.pdfjsLib) {
      if (!pdfJsPromise) pdfJsPromise = loadScriptOnce(PDFJS_URL);
      await pdfJsPromise;
    }
    if (!window.pdfjsLib) throw new Error('PDF.js did not load. This tool needs PDF.js to render PDF pages.');
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
    return window.pdfjsLib;
  }
  function requireFullJsPdf() {
    const jsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!jsPDF) throw new Error('Full jsPDF library did not load. Check CDN access for jspdf.umd.min.js.');
    let test;
    try { test = new jsPDF({ unit: 'px', format: [120, 120], encryption: { userPassword: 'u', ownerPassword: 'o' } }); } catch (error) {}
    if (!test || typeof test.output !== 'function' || typeof test.addImage !== 'function') {
      throw new Error('Password protection needs the full jsPDF build. Check CDN access for jspdf.umd.min.js.');
    }
    return jsPDF;
  }

  // Minimal ZIP writer with stored entries. Enough for browser-generated PDF/JPG sets.
  const crcTable = (() => {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[i] = c >>> 0;
    }
    return table;
  })();
  function crc32(bytes) {
    let c = 0xffffffff;
    for (let i = 0; i < bytes.length; i++) c = crcTable[(c ^ bytes[i]) & 255] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  }
  function dosDateTime(date = new Date()) {
    const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
    const dosDate = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
    return { time, date: dosDate };
  }
  function u16(n) { return [n & 255, (n >>> 8) & 255]; }
  function u32(n) { return [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255]; }
  function textBytes(text) { return new TextEncoder().encode(text); }
  function makeZip(entries) {
    const fileParts = [];
    const central = [];
    let offset = 0;
    const dt = dosDateTime();
    for (const entry of entries) {
      const name = textBytes(entry.name);
      const data = entry.data instanceof Uint8Array ? entry.data : new Uint8Array(entry.data);
      const crc = crc32(data);
      const local = new Uint8Array([
        ...u32(0x04034b50), ...u16(20), ...u16(0), ...u16(0), ...u16(dt.time), ...u16(dt.date),
        ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(name.length), ...u16(0)
      ]);
      fileParts.push(local, name, data);
      const centralHeader = new Uint8Array([
        ...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0), ...u16(0), ...u16(dt.time), ...u16(dt.date),
        ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(name.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0),
        ...u32(0), ...u32(offset)
      ]);
      central.push(centralHeader, name);
      offset += local.length + name.length + data.length;
    }
    const centralSize = central.reduce((s, p) => s + p.length, 0);
    const end = new Uint8Array([
      ...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(entries.length), ...u16(entries.length),
      ...u32(centralSize), ...u32(offset), ...u16(0)
    ]);
    return new Blob([...fileParts, ...central, end], { type: 'application/zip' });
  }

  function base64ToBytes(dataUrl) {
    const b64 = String(dataUrl).split(',')[1] || '';
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i) & 255;
    return out;
  }
  function concatBytes(parts) {
    let n = 0;
    parts.forEach(p => n += p.length);
    const out = new Uint8Array(n);
    let o = 0;
    parts.forEach(p => { out.set(p, o); o += p.length; });
    return out;
  }
  function makeImagePdfBlob(pages) {
    const objs = [null, null];
    const pageNums = [];
    for (const page of pages) {
      const img = base64ToBytes(page.dataUrl);
      const w = Math.max(1, Math.round(page.width));
      const h = Math.max(1, Math.round(page.height));
      const imgObj = objs.length + 1;
      objs.push([textBytes(`<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.length} >>\nstream\n`), img, textBytes('\nendstream')]);
      const content = `q\n${w} 0 0 ${h} 0 0 cm\n/Im1 Do\nQ\n`;
      const contentObj = objs.length + 1;
      objs.push(textBytes(`<< /Length ${content.length} >>\nstream\n${content}endstream`));
      const pageObj = objs.length + 1;
      pageNums.push(pageObj);
      objs.push(textBytes(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Resources << /XObject << /Im1 ${imgObj} 0 R >> >> /Contents ${contentObj} 0 R >>`));
    }
    objs[0] = textBytes('<< /Type /Catalog /Pages 2 0 R >>');
    objs[1] = textBytes(`<< /Type /Pages /Count ${pageNums.length} /Kids [${pageNums.map(n => n + ' 0 R').join(' ')}] >>`);
    const parts = [textBytes('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')];
    const offsets = [0];
    let pos = parts[0].length;
    for (let i = 0; i < objs.length; i++) {
      offsets.push(pos);
      const head = textBytes(`${i + 1} 0 obj\n`);
      parts.push(head); pos += head.length;
      const obj = Array.isArray(objs[i]) ? concatBytes(objs[i]) : objs[i];
      parts.push(obj); pos += obj.length;
      const end = textBytes('\nendobj\n');
      parts.push(end); pos += end.length;
    }
    const xref = pos;
    let xr = `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i < offsets.length; i++) xr += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
    xr += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    parts.push(textBytes(xr));
    return new Blob(parts, { type: 'application/pdf' });
  }

  function rotateCanvas(source, angle) {
    const a = ((Number(angle) % 360) + 360) % 360;
    if (a === 0) return source;
    const out = document.createElement('canvas');
    const swap = a === 90 || a === 270;
    out.width = swap ? source.height : source.width;
    out.height = swap ? source.width : source.height;
    const ctx = out.getContext('2d', { alpha: false });
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.save();
    if (a === 90) { ctx.translate(out.width, 0); ctx.rotate(Math.PI / 2); }
    else if (a === 180) { ctx.translate(out.width, out.height); ctx.rotate(Math.PI); }
    else if (a === 270) { ctx.translate(0, out.height); ctx.rotate(3 * Math.PI / 2); }
    else { ctx.translate(out.width / 2, out.height / 2); ctx.rotate(a * Math.PI / 180); ctx.translate(-source.width / 2, -source.height / 2); }
    ctx.drawImage(source, 0, 0);
    ctx.restore();
    return out;
  }

  async function canvasToJpeg(canvas, quality) {
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
    return { blob, dataUrl: canvas.toDataURL('image/jpeg', quality), width: canvas.width, height: canvas.height };
  }

  async function renderPdfToImages(file, options = {}) {
    const pdfjsLib = await ensurePdfJs();
    const password = options.password || undefined;
    const scale = Number(options.scale || 2);
    const jpgQuality = Number(options.quality || 0.9);
    const data = await file.arrayBuffer();
    const doc = await pdfjsLib.getDocument({ data, password }).promise;
    const total = doc.numPages;
    const pageIndices = Array.isArray(options.pageIndices) && options.pageIndices.length ? options.pageIndices : Array.from({ length: total }, (_, i) => i);
    const rotateMap = options.rotateMap || new Map();
    const images = [];
    for (let j = 0; j < pageIndices.length; j++) {
      const index = pageIndices[j];
      const pageNo = index + 1;
      setProgress((j / pageIndices.length) * 85, `Rendering page ${pageNo} of ${total}...`);
      const page = await doc.getPage(pageNo);
      const viewport = page.getViewport({ scale });
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d', { alpha: false });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport }).promise;
      const rotateBy = rotateMap.get(index) || 0;
      if (rotateBy) canvas = rotateCanvas(canvas, rotateBy);
      if (typeof options.decorate === 'function') await options.decorate(canvas, pageNo, total, scale);
      const image = await canvasToJpeg(canvas, jpgQuality);
      images.push({ page: pageNo, ...image });
    }
    return images;
  }

  function drawImageToPageDataUrl(img, mode, quality) {
    const srcW = img.naturalWidth || img.width;
    const srcH = img.naturalHeight || img.height;
    const canvas = document.createElement('canvas');
    if (mode === 'fit-a4') {
      canvas.width = srcW >= srcH ? 1754 : 1240;
      canvas.height = srcW >= srcH ? 1240 : 1754;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const scale = Math.min(canvas.width / srcW, canvas.height / srcH) * 0.94;
      const w = srcW * scale;
      const h = srcH * scale;
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    } else {
      canvas.width = srcW;
      canvas.height = srcH;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    }
    return { dataUrl: canvas.toDataURL('image/jpeg', quality), width: canvas.width, height: canvas.height };
  }
  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(src); resolve(img); };
      img.onerror = () => reject(new Error('Could not load image.'));
      img.src = src;
    });
  }

  function renderFileList() {
    if (!el.fileList) return;
    if (!state.files.length) { el.fileList.innerHTML = ''; return; }
    el.fileList.innerHTML = state.files.map(file => `<div class="pdf-file-row"><span>${escapeHtml(file.name)}</span><strong>${niceBytes(file.size)}</strong></div>`).join('');
  }
  async function inspectPdf(file) {
    try {
      const doc = await loadPdfDoc(file, { ignoreEncryption: true });
      state.pageCount = getPdfPageCount(doc);
      setStatus(`${file.name}: ${state.pageCount || 'unknown'} page(s), ${niceBytes(file.size)}.`);
      $$('[data-total-pages]').forEach(node => node.textContent = pageRangeString(state.pageCount));
      $$('[data-page-placeholder]').forEach(node => node.placeholder = pageRangeString(state.pageCount));
    } catch (error) {
      state.pageCount = 0;
      setStatus(`Selected file: ${file.name}. Page count will be checked when processing.`);
    }
  }
  function handleFiles(files) {
    state.files = Array.from(files || []);
    renderFileList();
    renderEmptyOutput();
    if (state.files[0] && state.files[0].type === 'application/pdf') inspectPdf(state.files[0]);
    else if (state.files.length) setStatus(`${state.files.length} file(s) selected.`);
  }
  function wireInputs() {
    el.file?.addEventListener('change', e => handleFiles(e.target.files));
    const drop = $('#pdfDropZone');
    if (drop) {
      ['dragenter','dragover'].forEach(type => drop.addEventListener(type, e => { e.preventDefault(); drop.classList.add('is-dragging'); }));
      ['dragleave','drop'].forEach(type => drop.addEventListener(type, e => { e.preventDefault(); drop.classList.remove('is-dragging'); }));
      drop.addEventListener('drop', e => { if (e.dataTransfer?.files?.length) { if (el.file) el.file.files = e.dataTransfer.files; handleFiles(e.dataTransfer.files); } });
    }
    $('#pdfRunBtn')?.addEventListener('click', runTool);
    $('#pdfDownloadLastBtn')?.addEventListener('click', () => { if (state.lastBlob) downloadBlob(state.lastName, state.lastBlob); else toast('No completed file yet'); });
  }

  async function compressPdf() {
    const file = state.files[0];
    if (!file) throw new Error('Choose a PDF first.');
    const { PDFDocument } = requirePdfLib();
    const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: false });
    const out = await PDFDocument.create();
    const indices = getPdfPageIndices(src);
    if (!indices.length) throw new Error('Could not read pages from this PDF. Try another file.');
    const pages = await out.copyPages(src, indices);
    pages.forEach(p => out.addPage(p));
    if (typeof out.setProducer === 'function') out.setProducer('uti-mate PDF Compressor');
    if (typeof out.setCreator === 'function') out.setCreator('uti-mate.com');
    if (typeof out.setTitle === 'function') out.setTitle('Compressed PDF');
    const bytes = await out.save({ useObjectStreams: true, objectsPerTick: 60 });
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const diff = file.size - blob.size;
    const details = diff > 0 ? `Reduced by ${niceBytes(diff)}` : 'Rebuilt/optimized; this file was already compact';
    showDownload(`${sanitizeName(file.name)}-compressed.pdf`, blob, details);
  }

  async function splitPdf() {
    const file = state.files[0];
    if (!file) throw new Error('Choose a PDF first.');
    const { PDFDocument } = requirePdfLib();
    const src = await PDFDocument.load(await file.arrayBuffer());
    const total = getPdfPageCount(src);
    if (!total) throw new Error('Could not read page count from this PDF.');
    const mode = $('#splitMode')?.value || 'ranges';
    let groups = [];
    if (mode === 'each') groups = Array.from({ length: total }, (_, i) => [i]);
    else groups = parseRangeGroups($('#pageRanges')?.value || `1-${total}`, total);
    if (!groups.length) throw new Error('Enter valid page ranges. Example: 1-3,4-6,8');
    const zipEntries = [];
    for (let i = 0; i < groups.length; i++) {
      setProgress((i / groups.length) * 80, `Creating split file ${i + 1} of ${groups.length}...`);
      const doc = await PDFDocument.create();
      const pages = await doc.copyPages(src, groups[i]);
      pages.forEach(p => doc.addPage(p));
      const bytes = await doc.save({ useObjectStreams: true });
      const label = groups[i].length === 1 ? `page-${groups[i][0] + 1}` : `pages-${groups[i][0] + 1}-to-${groups[i][groups[i].length - 1] + 1}`;
      zipEntries.push({ name: `${sanitizeName(file.name)}-${label}.pdf`, data: new Uint8Array(bytes) });
    }
    const blob = groups.length === 1 ? new Blob([zipEntries[0].data], { type: 'application/pdf' }) : makeZip(zipEntries);
    const name = groups.length === 1 ? zipEntries[0].name : `${sanitizeName(file.name)}-split.zip`;
    showDownload(name, blob, `${groups.length} file(s) created`);
  }

  async function rotatePdf() {
    const file = state.files[0];
    if (!file) throw new Error('Choose a PDF first.');
    const doc = await loadPdfDoc(file, { ignoreEncryption: true });
    const total = getPdfPageCount(doc);
    if (!total) throw new Error('Could not read page count from this PDF.');
    const targets = parseNumbers($('#rotatePages')?.value || '', total);
    const angle = parseInt($('#rotateAngle')?.value || '90', 10);
    const rotateMap = new Map(targets.map(i => [i, angle]));
    const images = await renderPdfToImages(file, { scale: 1.8, quality: 0.92, rotateMap });
    const pages = images.map(img => ({ dataUrl: img.dataUrl, width: img.width, height: img.height }));
    showDownload(`${sanitizeName(file.name)}-rotated.pdf`, makeImagePdfBlob(pages), `${targets.length} page(s) rotated`);
  }

  async function jpgToPdf() {
    const files = state.files;
    if (!files.length) throw new Error('Choose JPG, PNG, or WebP images first.');
    const mode = $('#imagePageMode')?.value || 'fit-a4';
    const quality = Number($('#jpgQuality')?.value || 0.92);
    const pages = [];
    for (let i = 0; i < files.length; i++) {
      setProgress((i / files.length) * 85, `Adding image ${i + 1} of ${files.length}...`);
      const image = await loadImage(URL.createObjectURL(files[i]));
      pages.push(drawImageToPageDataUrl(image, mode, quality));
    }
    const blob = makeImagePdfBlob(pages);
    showDownload('uti-mate-images-to-pdf.pdf', blob, `${files.length} image(s) converted`);
  }

  async function pdfToJpg() {
    const file = state.files[0];
    if (!file) throw new Error('Choose a PDF first.');
    const scale = Number($('#renderScale')?.value || 2);
    const quality = Number($('#jpgRenderQuality')?.value || 0.9);
    const images = await renderPdfToImages(file, { scale, quality });
    const zipEntries = [];
    for (const img of images) zipEntries.push({ name: `${sanitizeName(file.name)}-page-${String(img.page).padStart(3,'0')}.jpg`, data: new Uint8Array(await img.blob.arrayBuffer()) });
    const blob = makeZip(zipEntries);
    showDownload(`${sanitizeName(file.name)}-jpg-pages.zip`, blob, `${images.length} JPG image(s)`);
    const previews = images.slice(0, 6).map(img => `<div class="pdf-preview-tile"><img src="${img.dataUrl}" alt="Page ${img.page} preview"><span>Page ${img.page}</span></div>`).join('');
    if (el.output) el.output.insertAdjacentHTML('beforeend', `<div class="pdf-output-grid">${previews}</div>`);
  }

  async function addWatermark() {
    const file = state.files[0];
    if (!file) throw new Error('Choose a PDF first.');
    const text = $('#watermarkText')?.value || 'CONFIDENTIAL';
    const size = Number($('#watermarkSize')?.value || 48);
    const opacity = Number($('#watermarkOpacity')?.value || 0.18);
    const angle = Number($('#watermarkAngle')?.value || -35);
    const color = readHexColor($('#watermarkColor')?.value || '#64748b');
    const scale = 1.8;
    const images = await renderPdfToImages(file, {
      scale,
      quality: 0.92,
      decorate(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.globalAlpha = Math.max(0.05, Math.min(1, opacity));
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `800 ${Math.max(10, size * scale)}px Inter, Arial, sans-serif`;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle * Math.PI / 180);
        ctx.fillText(text, 0, 0, canvas.width * 0.9);
        ctx.restore();
      }
    });
    const pages = images.map(img => ({ dataUrl: img.dataUrl, width: img.width, height: img.height }));
    showDownload(`${sanitizeName(file.name)}-watermarked.pdf`, makeImagePdfBlob(pages), 'Watermark applied');
  }

  async function addPageNumbers() {
    const file = state.files[0];
    if (!file) throw new Error('Choose a PDF first.');
    const start = Number($('#pageNumberStart')?.value || 1);
    const pos = $('#pageNumberPosition')?.value || 'bottom-center';
    const size = Number($('#pageNumberSize')?.value || 11);
    const format = $('#pageNumberFormat')?.value || 'Page {n} of {total}';
    const scale = 1.8;
    const images = await renderPdfToImages(file, {
      scale,
      quality: 0.93,
      decorate(canvas, pageNo, total) {
        const ctx = canvas.getContext('2d');
        const text = format.replaceAll('{n}', String(start + pageNo - 1)).replaceAll('{total}', String(total));
        const fontSize = Math.max(7, size * scale);
        const margin = 32 * scale;
        ctx.save();
        ctx.globalAlpha = 0.92;
        ctx.fillStyle = 'rgb(39, 48, 66)';
        ctx.font = `700 ${fontSize}px Inter, Arial, sans-serif`;
        ctx.textBaseline = 'middle';
        const metrics = ctx.measureText(text);
        let x = canvas.width / 2;
        let y = canvas.height - margin;
        if (pos.includes('top')) y = margin;
        if (pos.includes('left')) { x = margin; ctx.textAlign = 'left'; }
        else if (pos.includes('right')) { x = canvas.width - margin; ctx.textAlign = 'right'; }
        else { x = (canvas.width - metrics.width) / 2 + metrics.width / 2; ctx.textAlign = 'center'; }
        ctx.fillText(text, x, y);
        ctx.restore();
      }
    });
    const pages = images.map(img => ({ dataUrl: img.dataUrl, width: img.width, height: img.height }));
    showDownload(`${sanitizeName(file.name)}-page-numbers.pdf`, makeImagePdfBlob(pages), `${images.length} page number(s) added`);
  }

  async function protectPdf() {
    const file = state.files[0];
    if (!file) throw new Error('Choose a PDF first.');
    const userPassword = $('#userPassword')?.value || '';
    if (!userPassword) throw new Error('Enter a password for the protected PDF.');
    const ownerPassword = $('#ownerPassword')?.value || userPassword + '-owner';
    const scale = Number($('#protectRenderScale')?.value || 1.6);
    const images = await renderPdfToImages(file, { scale, quality: .88 });
    const jsPDF = requireFullJsPdf();
    let pdf = null;
    images.forEach((img) => {
      const orientation = img.width >= img.height ? 'landscape' : 'portrait';
      if (!pdf) {
        pdf = new jsPDF({ orientation, unit: 'px', format: [img.width, img.height], encryption: { userPassword, ownerPassword, userPermissions: ['print'] } });
      } else {
        pdf.addPage([img.width, img.height], orientation);
      }
      pdf.addImage(img.dataUrl, 'JPEG', 0, 0, img.width, img.height, undefined, 'FAST');
    });
    showDownload(`${sanitizeName(file.name)}-protected.pdf`, pdf.output('blob'), 'Password protection applied by rebuilding pages');
  }

  async function unlockPdf() {
    const file = state.files[0];
    if (!file) throw new Error('Choose a PDF first.');
    const password = $('#unlockPassword')?.value || '';
    const scale = Number($('#unlockRenderScale')?.value || 1.6);
    const images = await renderPdfToImages(file, { password, scale, quality: .9 });
    const pages = images.map(img => ({ dataUrl: img.dataUrl, width: img.width, height: img.height }));
    showDownload(`${sanitizeName(file.name)}-unlocked.pdf`, makeImagePdfBlob(pages), 'Unlocked copy rebuilt from rendered pages');
  }

  async function organizePdf() {
    const file = state.files[0];
    if (!file) throw new Error('Choose a PDF first.');
    const { PDFDocument } = requirePdfLib();
    const src = await PDFDocument.load(await file.arrayBuffer());
    const total = getPdfPageCount(src);
    if (!total) throw new Error('Could not read page count from this PDF.');
    const remove = new Set(parseNumbers($('#removePages')?.value || '', total));
    let order = parseNumbers($('#pageOrder')?.value || '', total);
    if (!($('#pageOrder')?.value || '').trim()) order = Array.from({ length: total }, (_, i) => i);
    order = order.filter(i => !remove.has(i));
    if (!order.length) throw new Error('No pages remain after your order/remove settings.');
    const out = await PDFDocument.create();
    const pages = await out.copyPages(src, order);
    pages.forEach(p => out.addPage(p));
    const bytes = await out.save({ useObjectStreams: true });
    showDownload(`${sanitizeName(file.name)}-organized.pdf`, new Blob([bytes], { type: 'application/pdf' }), `${order.length} page(s) exported`);
  }

  async function runTool() {
    try {
      setProgress(5, 'Starting...');
      const jobs = {
        'compress-pdf': compressPdf,
        'split-pdf': splitPdf,
        'rotate-pdf': rotatePdf,
        'pdf-to-jpg': pdfToJpg,
        'jpg-to-pdf': jpgToPdf,
        'add-watermark-to-pdf': addWatermark,
        'add-page-numbers-to-pdf': addPageNumbers,
        'protect-pdf': protectPdf,
        'unlock-pdf': unlockPdf,
        'organize-pdf': organizePdf
      };
      if (!jobs[tool]) throw new Error('Unknown PDF tool.');
      await jobs[tool]();
      setProgress(100, 'Done.');
      toast('Done');
      setTimeout(() => setProgress(0, 'Ready.'), 900);
    } catch (error) {
      console.error(error);
      setProgress(0, `Error: ${error.message}`);
      if (el.output) el.output.innerHTML = `<div class="pdf-warning"><strong>Could not complete this task.</strong><br>${escapeHtml(error.message)}</div>`;
    }
  }

  renderEmptyOutput();
  wireInputs();
})();
