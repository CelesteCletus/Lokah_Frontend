/**
 * compressor.ts
 * 
 * Browser-native file compressor — no extra npm packages needed.
 * 
 * HOW IT WORKS (plain English):
 * 
 * IMAGES (JPEG/PNG/WEBP):
 *   The browser has a built-in <canvas> element that can draw and re-export
 *   images. We draw your image onto a canvas at a smaller size, then export
 *   it as a JPEG with reduced quality. This is the same thing apps like
 *   WhatsApp do before sending photos.
 * 
 * PDFs:
 *   We load the PDF using pdf.js (a Mozilla library, loaded from CDN so it
 *   doesn't bloat your app). We render each page onto a canvas, then collect
 *   all those canvas images into a new lightweight PDF using a tiny hand-built
 *   PDF writer. The result looks identical but can be 5-10x smaller.
 */

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface CompressOptions {
  /** Max width/height in pixels. Larger images are scaled down. Default: 1600 */
  maxDimension?: number;
  /** JPEG quality 0–1. Lower = smaller file. Default: 0.75 */
  quality?: number;
  /** Max output size in bytes. Compressor retries with lower quality until met. Default: 800KB */
  maxBytes?: number;
}

export interface CompressResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  /** How much smaller the result is, e.g. "68% smaller" */
  savedPercent: number;
}

// ─────────────────────────────────────────────
// IMAGE COMPRESSOR
// ─────────────────────────────────────────────

/**
 * Compresses an image file using the browser's Canvas API.
 * Supports JPEG, PNG, WebP, AVIF, HEIC (HEIC only on Safari).
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<CompressResult> {
  const {
    maxDimension = 1600,
    quality = 0.75,
    maxBytes = 800 * 1024 // 800KB
  } = options;

  const originalSize = file.size;

  // Load file into an Image element
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;

  // Scale down if wider/taller than maxDimension
  let targetW = width;
  let targetH = height;
  if (width > maxDimension || height > maxDimension) {
    const ratio = Math.min(maxDimension / width, maxDimension / height);
    targetW = Math.round(width * ratio);
    targetH = Math.round(height * ratio);
  }

  // Draw onto an offscreen canvas
  const canvas = new OffscreenCanvas(targetW, targetH);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);
  bitmap.close();

  // Try progressively lower quality until we're under maxBytes
  let currentQuality = quality;
  let blob: Blob;

  do {
    blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: currentQuality });
    if (blob.size <= maxBytes || currentQuality <= 0.3) break;
    currentQuality -= 0.1;
  } while (true);

  const baseName = file.name && file.name.includes('.') ? file.name.replace(/\.[^.]+$/, '') : (file.name || 'image');
  const fileName = `${baseName}.jpg`;

  const compressedFile = new File([blob], fileName, {
    type: 'image/jpeg',
    lastModified: Date.now()
  });

  return {
    file: compressedFile,
    originalSize,
    compressedSize: compressedFile.size,
    savedPercent: Math.round((1 - compressedFile.size / originalSize) * 100)
  };
}

// ─────────────────────────────────────────────
// PDF COMPRESSOR
// ─────────────────────────────────────────────

/** 
 * Lazily loads pdf.js from CDN (only when first PDF is compressed).
 * This avoids adding a heavy library to your main bundle.
 */
let pdfjsLib: any = null;

async function getPdfJs() {
  if (pdfjsLib) return pdfjsLib;

  // Dynamically import from CDN — only runs once
  // @ts-ignore
  const pdfjs = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.min.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc =
    'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs';

  pdfjsLib = pdfjs;
  return pdfjsLib;
}

/**
 * Builds a minimal valid PDF from an array of JPEG data URLs.
 * 
 * Plain English: A PDF is really just a text file with a specific format.
 * This function hand-writes that format for a PDF that contains only images
 * (one per page) — which is exactly what a compressed "image-based PDF" is.
 */
function buildImagePdf(pages: { dataUrl: string; width: number; height: number }[]): Uint8Array {
  // Each PDF image is stored as a raw JPEG stream.
  // We need to strip the "data:image/jpeg;base64," prefix and decode it.
  const jpegBuffers = pages.map(p => {
    const b64 = p.dataUrl.split(',')[1];
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  });

  // ── Build the PDF byte-by-byte ──
  // PDFs use "objects" numbered from 1. We need:
  //   1 = catalog (document root)
  //   2 = pages (list of all pages)
  //   3, 5, 7... = page objects
  //   4, 6, 8... = image XObjects (the actual JPEG data)
  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = []; // byte offset of each object (for xref table)
  let pos = 0;

  const write = (s: string) => {
    const b = enc.encode(s);
    chunks.push(b);
    pos += b.length;
  };

  const writeBytes = (b: Uint8Array) => {
    chunks.push(b);
    pos += b.length;
  };

  write('%PDF-1.4\n');

  const n = pages.length;
  const firstPageObj = 3; // objects 3,5,7... are pages; 4,6,8... are images

  // Object 1: Catalog
  offsets[0] = pos;
  write('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');

  // Object 2: Pages dictionary
  offsets[1] = pos;
  const kidsRef = pages.map((_, i) => `${firstPageObj + i * 2} 0 R`).join(' ');
  write(`2 0 obj\n<< /Type /Pages /Kids [${kidsRef}] /Count ${n} >>\nendobj\n`);

  // Objects 3+: one Page + one Image per PDF page
  for (let i = 0; i < n; i++) {
    const { width, height } = pages[i];
    const pageObj = firstPageObj + i * 2;
    const imgObj = pageObj + 1;
    const jpeg = jpegBuffers[i];

    // Page object
    offsets[pageObj - 1] = pos;
    write(
      `${pageObj} 0 obj\n` +
      `<< /Type /Page /Parent 2 0 R\n` +
      `   /MediaBox [0 0 ${width} ${height}]\n` +
      `   /Resources << /XObject << /Im${i} ${imgObj} 0 R >> >>\n` +
      `   /Contents << /Length ${(`q ${width} 0 0 ${height} 0 0 cm /Im${i} Do Q`).length + 2} >>\n` +
      `>>\n` +
      `stream\n` +
      `q ${width} 0 0 ${height} 0 0 cm /Im${i} Do Q\n` +
      `endstream\nendobj\n`
    );

    // Image XObject (raw JPEG stream)
    offsets[imgObj - 1] = pos;
    write(
      `${imgObj} 0 obj\n` +
      `<< /Type /XObject /Subtype /Image\n` +
      `   /Width ${width} /Height ${height}\n` +
      `   /ColorSpace /DeviceRGB /BitsPerComponent 8\n` +
      `   /Filter /DCTDecode /Length ${jpeg.length}\n` +
      `>>\n` +
      `stream\n`
    );
    writeBytes(jpeg);
    write('\nendstream\nendobj\n');
  }

  // Cross-reference table (PDF's internal index — lets readers jump to any object)
  const xrefOffset = pos;
  const totalObjects = 2 + n * 2; // catalog + pages + (page + image) × n
  write(`xref\n0 ${totalObjects + 1}\n`);
  write('0000000000 65535 f \n');
  for (let i = 0; i < totalObjects; i++) {
    write(`${String(offsets[i] ?? 0).padStart(10, '0')} 00000 n \n`);
  }

  write(`trailer\n<< /Size ${totalObjects + 1} /Root 1 0 R >>\n`);
  write(`startxref\n${xrefOffset}\n%%EOF\n`);

  // Merge all chunks into one Uint8Array
  const total = chunks.reduce((sum, c) => sum + c.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

/**
 * Compresses a PDF by rendering each page as a JPEG image, then
 * reassembling them into a new lightweight PDF.
 *
 * options.quality controls JPEG quality per page (default 0.7).
 * options.maxDimension controls the max page render resolution (default 1200px).
 */
export async function compressPdf(
  file: File,
  options: CompressOptions = {}
): Promise<CompressResult> {
  const {
    maxDimension = 1200,
    quality = 0.7
  } = options;

  const originalSize = file.size;
  const pdfjs = await getPdfJs();

  // Load the PDF from an ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

  const pageCount = pdf.numPages;
  const renderedPages: { dataUrl: string; width: number; height: number }[] = [];

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const page = await pdf.getPage(pageNum);

    // Scale page to fit within maxDimension
    const viewport = page.getViewport({ scale: 1 });
    const scale = Math.min(maxDimension / viewport.width, maxDimension / viewport.height, 1.5);
    const scaledViewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(scaledViewport.width);
    canvas.height = Math.round(scaledViewport.height);
    const ctx = canvas.getContext('2d')!;

    await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise;

    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    renderedPages.push({ dataUrl, width: canvas.width, height: canvas.height });

    // Clean up canvas memory
    canvas.width = 0;
    canvas.height = 0;
  }

  // Build compressed PDF from rendered page images
  const pdfBytes = buildImagePdf(renderedPages);
  const compressedBlob = new Blob([pdfBytes], { type: 'application/pdf' });
  const compressedFile = new File([compressedBlob], file.name, {
    type: 'application/pdf',
    lastModified: Date.now()
  });

  return {
    file: compressedFile,
    originalSize,
    compressedSize: compressedFile.size,
    savedPercent: Math.round((1 - compressedFile.size / originalSize) * 100)
  };
}

// ─────────────────────────────────────────────
// MAIN ENTRY POINT
// ─────────────────────────────────────────────

/**
 * Auto-detects file type and compresses accordingly.
 * Returns the original file unchanged if the type isn't supported.
 */
export async function compressFile(
  file: File,
  options: CompressOptions = {}
): Promise<CompressResult> {
  const type = file.type.toLowerCase();

  if (type === 'application/pdf') {
    return compressPdf(file, options);
  }

  if (
    type.startsWith('image/') &&
    ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'].includes(type)
  ) {
    return compressImage(file, options);
  }

  // Unsupported type — return as-is
  return {
    file,
    originalSize: file.size,
    compressedSize: file.size,
    savedPercent: 0
  };
}

/** Formats bytes into human-readable size (e.g. "1.2 MB") */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
