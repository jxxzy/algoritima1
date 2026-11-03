import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = path.join(root, 'dist');
const contentDirectory = path.join(root, 'content');
async function readContent(relativePath) {
  const file = path.join(contentDirectory, relativePath);
  const content = await readFile(file, 'utf8');
  if (!content.trim()) throw new Error(`Konten tidak boleh kosong: ${relativePath}`);
  return content.trim();
}

const [nav, footer, fragments] = await Promise.all([
  readContent('shared/sidebar.html'),
  readContent('shared/footer.html'),
  Promise.all([
    readContent('home/hero.html'),
    readContent('home/learning-path.html'),
    readContent('home/focus-timer.html'),
    readContent('lab/lab.html'),
    readContent('chapters/chapter-1.html'),
    readContent('chapters/chapter-2.html'),
    readContent('chapters/chapter-3.html'),
    readContent('shared/solutions.html'),
    readContent('reference/references.html'),
    readContent('home/bookmarks.html'),
  ]),
]).then(([sidebar, siteFooter, entries]) => [
  sidebar,
  siteFooter,
  {
    hero: entries[0],
    path: entries[1],
    timer: entries[2],
    lab: entries[3],
    chapters: entries.slice(4, 7),
    solutions: entries[7],
    reference: entries[8],
    bookmarks: entries[9],
  },
]);

const quizzes = {
  1: [
    { prompt: 'Input nama berisi spasi saja. Apa yang sebaiknya dilakukan sebelum membuat kartu?', answer: 'validate', options: [['accept', 'Terima sebagai nama valid'], ['validate', 'Rapikan spasi lalu tolak jika kosong'], ['number', 'Konversi nama menjadi angka']] },
    { prompt: 'Mengapa NIM seperti 00125 sebaiknya disimpan sebagai str?', answer: 'identity', options: [['identity', 'NIM adalah identitas dan nol depannya bermakna'], ['math', 'Agar bisa dijumlahkan'], ['round', 'Agar dibulatkan otomatis']] },
    { prompt: 'Biaya tetap Rp50.000 dan konsumsi Rp12.000 untuk 5 peserta. Berapa totalnya?', answer: '110', options: [['62000', 'Rp62.000'], ['110', 'Rp110.000'], ['60000', 'Rp60.000']] },
  ],
  2: [
    { prompt: 'Apa simbol flowchart yang mewakili keputusan Ya/Tidak?', answer: 'decision', options: [['terminal', 'Oval'], ['decision', 'Belah ketupat'], ['process', 'Persegi panjang']] },
    { prompt: 'Berapa luas dan keliling persegi panjang berukuran 5 m × 3 m?', answer: 'results', options: [['results', 'Luas 15 m² dan keliling 16 m'], ['wrong', 'Luas 8 m² dan keliling 15 m'], ['other', 'Luas 15 m² dan keliling 30 m']] },
    { prompt: 'Parkir 8 jam: tarif pertama Rp3.000, berikutnya Rp2.000/jam, maksimum Rp15.000. Tarif akhirnya?', answer: 'cap', options: [['cap', 'Rp15.000 setelah batas harian diterapkan'], ['wrong', 'Rp19.000 tanpa batas'], ['base', 'Rp3.000 karena tarif pertama saja']] },
  ],
  3: [
    { prompt: 'Apa tipe nilai yang dikembalikan input() sebelum dikonversi?', answer: 'str', options: [['int', 'int'], ['str', 'str'], ['bool', 'bool']] },
    { prompt: '135 menit menjadi berapa jam utuh dan menit sisa?', answer: 'duration', options: [['duration', '2 jam 15 menit menggunakan // dan %'], ['wrong', '1 jam 75 menit'], ['decimal', '2,25 jam tanpa sisa']] },
    { prompt: 'Mengapa waktu nol ditolak saat menghitung kecepatan?', answer: 'zero', options: [['zero', 'Waktu adalah pembagi sehingga harus positif'], ['float', 'float tidak dapat menyimpan nol'], ['distance', 'Jarak harus selalu negatif']] },
  ],
};

const chapterDetails = {
  1: {
    title: 'Bab 1 · Algoritma dan program pertama',
    description: 'Pelajari algoritma, input–proses–output, validasi data, serta program Python pertama.',
    previous: null,
    next: 2,
    glossary: [['Algoritma', 'Langkah terurut untuk menyelesaikan masalah.'], ['IPO', 'Input, proses, dan output; kerangka dasar sebuah program.'], ['Validasi', 'Pemeriksaan data sebelum program menerbitkan hasil.'], ['Variabel', 'Nama yang merujuk nilai yang digunakan program.']],
  },
  2: {
    title: 'Bab 2 · Narasi, flowchart, dan pseudocode',
    description: 'Rancang narasi, pseudocode, flowchart, dan cabang keputusan sebelum membuat program.',
    previous: 1,
    next: 3,
    glossary: [['Pseudocode', 'Uraian algoritma terstruktur yang tidak terikat sintaks bahasa.'], ['Flowchart', 'Diagram simbolis untuk memperlihatkan urutan dan keputusan.'], ['Cabang', 'Jalur berbeda yang dipilih berdasarkan kondisi.'], ['Dry run', 'Penelusuran nilai variabel langkah demi langkah.']],
  },
  3: {
    title: 'Bab 3 · Variabel, tipe data, dan konversi',
    description: 'Pilih tipe data yang tepat, konversi input, serta olah waktu dan satuan dengan benar.',
    previous: 2,
    next: null,
    glossary: [['int', 'Bilangan bulat untuk jumlah atau satuan utuh.'], ['float', 'Bilangan pecahan untuk ukuran dan hasil perhitungan.'], ['str', 'Teks untuk nama, NIM, dan identitas lain.'], ['Modulo (%)', 'Sisa pembagian untuk memecah unit, misalnya menit.']],
  },
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function routeFor(id, pageKind, currentChapter) {
  const chapterId = id.match(/^bab-([123])$/)?.[1] || id.match(/^b([123])-/)?.[1];
  if (chapterId) return `bab-${chapterId}/index.html#${id}`;
  if (id === 'kode-tugas') return pageKind === 'chapter' ? `bab-${currentChapter}/index.html#kode-tugas` : 'bab-1/index.html#kode-tugas';
  if (id === 'latihan') return pageKind === 'chapter' ? `bab-${currentChapter}/index.html#latihan` : 'bab-1/index.html#latihan';
  if (id === 'lab') return 'lab/index.html#lab';
  if (id === 'referensi') return 'referensi/index.html#referensi';
  if (id === 'tersimpan') return 'index.html#tersimpan';
  if (id === 'beranda') return 'index.html#beranda';
  if (id === 'timer') return pageKind === 'home' ? '#timer' : 'index.html#timer';
  return pageKind === 'home' ? `#${id}` : `index.html#${id}`;
}

function rewriteLinks(html, pageKind, chapter = 0) {
  return html.replace(/href="#([^"]+)"/g, (_match, id) => `href="${routeFor(id, pageKind, chapter)}"`);
}

function chapterQuizzes(number) {
  const questions = quizzes[number].map((question, index) => {
    const options = question.options.map(([value, label]) => `
              <label><input type="radio" name="q${number}-${index + 1}" value="${escapeHtml(value)}"><span class="radio-ui"></span><span>${escapeHtml(label)}</span></label>`).join('');
    return `
            <fieldset class="quiz-question" data-answer="${escapeHtml(question.answer)}" data-explanation="Tinjau kembali contoh dan validasi pada Bab ${number}, lalu bandingkan setiap pilihan dengan aturan program.">
              <legend><span>0${index + 1}</span> ${escapeHtml(question.prompt)}</legend>${options}
              <p class="quiz-feedback" aria-live="polite"></p>
            </fieldset>`;
  }).join('');
  return `
        <section class="quiz-section chapter-quiz" id="latihan" aria-labelledby="quiz-title">
          <div class="quiz-top"><div><span class="section-kicker">EVALUASI BAB ${number}</span><h2 id="quiz-title">Cek pemahamanmu</h2><p>Jawab tiga soal. Skor sempurna akan membuka lencana bab ini.</p></div><div class="quiz-art" aria-hidden="true">?</div></div>
          <form id="quiz-form-${number}" class="quiz-form" data-quiz="${number}">${questions}
            <div class="quiz-actions"><button class="button button-primary" type="submit">Periksa jawaban <span aria-hidden="true">→</span></button><span class="quiz-result" id="quiz-result-${number}" aria-live="polite"></span></div>
          </form>
        </section>`;
}

function chapterToc(html, number) {
  const entries = [];
  for (const match of html.matchAll(/<article\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/article>/gi)) {
    const title = match[2].match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i)?.[1]?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (title) entries.push({ id: match[1], title });
  }
  const topics = entries.map(({ id, title }) => `<li><a href="bab-${number}/index.html#${id}">${escapeHtml(title)}</a></li>`).join('');
  const glossary = chapterDetails[number].glossary.map(([term, definition]) => `<li><strong>${escapeHtml(term)}</strong><span>${escapeHtml(definition)}</span></li>`).join('');
  return `
        <aside class="on-this-page" aria-label="Daftar isi dan referensi bab">
          <nav aria-label="Daftar isi bab"><h2>Di halaman ini</h2><ol>${topics}<li><a href="bab-${number}/index.html#kode-tugas">Kode dan tugas</a></li><li><a href="bab-${number}/index.html#latihan">Evaluasi bab</a></li></ol></nav>
          <section aria-labelledby="glossary-title"><h2 id="glossary-title">Referensi cepat</h2><ul>${glossary}</ul></section>
          <button class="button button-quiet print-summary" type="button">Cetak / simpan PDF</button>
        </aside>`;
}

function plainText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function createSearchIndex() {
  return fragments.chapters.flatMap((html, index) => {
    const chapter = index + 1;
    return [...html.matchAll(/<article\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/article>/gi)]
      .map(([, id, article]) => {
        const title = plainText(article.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/i)?.[1] || id);
        const text = plainText(article).slice(0, 1000);
        return { chapter, id, title, text, href: `bab-${chapter}/index.html#${id}` };
      });
  });
}

const chapterCards = [1, 2, 3].map((number) => {
  const details = chapterDetails[number];
  return `<a class="dashboard-chapter path-card" href="bab-${number}/index.html"><span class="path-index index-${['blue', 'violet', 'amber'][number - 1]}">0${number}</span><span class="path-card-copy"><strong>${escapeHtml(details.title.split(' · ')[1])}</strong><small>${escapeHtml(details.description)}</small><span class="dashboard-chapter-progress" id="chapter-progress-${number}">0 dari ${[3, 4, 4][number - 1]} topik · 0%</span><span class="course-badge" id="chapter-badge-${number}" hidden>Lencana Bab ${number} terkunci</span></span><span class="path-arrow">↗</span></a>`;
}).join('');

const dashboard = `
        <header class="topbar"><button class="mobile-menu" id="mobile-menu" type="button" aria-expanded="false" aria-controls="sidebar" aria-label="Buka navigasi">☰</button><div class="breadcrumb"><span>Kursus</span><span aria-hidden="true">/</span><strong>Beranda</strong></div><button class="focus-toggle" id="focus-toggle" type="button" aria-pressed="false"><span aria-hidden="true">◎</span> Mode fokus</button><a class="topbar-link" href="bab-1/index.html">Mulai belajar <span aria-hidden="true">↗</span></a></header>
        ${rewriteLinks(fragments.hero, 'home')}
        ${rewriteLinks(fragments.path, 'home')}
        <section class="dashboard-overview" aria-labelledby="dashboard-title">
          <div class="chapter-heading"><div><span class="section-kicker">DASHBOARD BELAJAR</span><h2 id="dashboard-title">Lanjutkan perjalananmu</h2><p id="continue-learning-copy">Progres tersimpan otomatis di browser ini.</p></div><a class="button button-primary" id="continue-learning" href="bab-1/index.html">Mulai Bab 1 →</a></div>
          <div class="path-cards dashboard-chapters">${chapterCards}</div>
          <div class="dashboard-summary"><span><strong id="dashboard-progress">0%</strong> materi selesai</span><span><strong id="dashboard-badges">0 / 3</strong> lencana bab</span><a class="button button-quiet" href="lab/index.html#lab">Buka laboratorium interaktif</a><a class="button button-quiet" href="referensi/index.html#referensi">Buka referensi cepat</a></div>
        </section>
        ${fragments.timer}
        ${fragments.bookmarks}
        <section class="dashboard-tools" aria-label="Fitur belajar">
          <a class="path-card" href="bab-1/index.html#kode-tugas"><strong>Kode lengkap dan penjelasan tugas</strong><span class="path-arrow">↗</span></a>
          <a class="path-card" href="lab/index.html#visualizer"><strong>Visualizer algoritma</strong><span class="path-arrow">↗</span></a>
          <a class="path-card" href="referensi/index.html#referensi"><strong>Rumus dan referensi cepat</strong><span class="path-arrow">↗</span></a>
        </section>
        ${rewriteLinks(footer, 'chapter', 1)}`;

function visualizer() {
  return `
        <section class="algorithm-visualizer" id="visualizer" aria-labelledby="visualizer-title">
          <div><span class="section-kicker">LIHAT NILAI BERGERAK</span><h2 id="visualizer-title">Visualizer algoritma</h2><p>Pilih contoh dan jalankan setiap langkah untuk mengamati perubahan nilai variabel.</p></div>
          <label for="visualizer-algorithm">Pilih algoritma
            <select id="visualizer-algorithm">
              <option value="swap">Menukar dua nilai</option><option value="duration">Memecah durasi</option><option value="parking">Menghitung tarif parkir</option><option value="geometry">Menghitung luas dan keliling</option>
            </select>
          </label>
          <div class="visualizer-state" id="visualizer-state" aria-live="polite"><strong>Keadaan awal</strong><p>Pilih “Langkah berikutnya” untuk memulai.</p></div>
          <div class="visualizer-controls"><button class="button button-quiet" id="visualizer-reset" type="button">Mulai ulang</button><button class="button button-primary" id="visualizer-next" type="button">Langkah berikutnya →</button><span id="visualizer-step" aria-live="polite"></span></div>
        </section>`;
}

function chapterPage(number) {
  const details = chapterDetails[number];
  const chapter = rewriteLinks(fragments.chapters[number - 1], 'chapter', number)
    .replace(new RegExp(`<h2 id="bab-${number}-title">([\\s\\S]*?)<\\/h2>`), `<h1 id="bab-${number}-title">$1</h1>`)
    .replace(/<h3(?=[\s>])/gi, '<h2')
    .replace(/<\/h3>/gi, '</h2>')
    .replace(/<h4(?=[\s>])/gi, '<h3')
    .replace(/<\/h4>/gi, '</h3>');
  const navHtml = rewriteLinks(nav, 'chapter', number);
  const toc = chapterToc(chapter, number);
  const solutions = rewriteLinks(fragments.solutions, 'chapter', number)
    .replace('<section class="solutions-section"', `<section data-chapter-filter="${number}" class="solutions-section"`);
  const content = `${chapter}${solutions}${chapterQuizzes(number)}`;
  const previous = details.previous ? `<a class="button button-quiet" href="bab-${details.previous}/index.html">← Bab ${details.previous}</a>` : `<a class="button button-quiet" href="index.html">← Beranda</a>`;
  const next = details.next ? `<a class="button button-primary" href="bab-${details.next}/index.html">Lanjut Bab ${details.next} →</a>` : `<a class="button button-primary" href="lab/index.html#lab">Coba di laboratorium →</a>`;
  return renderPage({
    kind: 'chapter',
    chapter: number,
    title: `${details.title} | Belajar Algoritma`,
    description: details.description,
    canonical: `https://jxxzy.github.io/algoritima1/bab-${number}/`,
    navHtml,
    main: `<header class="topbar"><button class="mobile-menu" id="mobile-menu" type="button" aria-expanded="false" aria-controls="sidebar" aria-label="Buka navigasi">☰</button><div class="breadcrumb"><a href="index.html">Beranda</a><span aria-hidden="true">/</span><strong>Bab ${number}</strong></div><button class="focus-toggle" id="focus-toggle" type="button" aria-pressed="false"><span aria-hidden="true">◎</span> Mode fokus</button><a class="topbar-link" href="lab/index.html#lab">Coba di Lab <span aria-hidden="true">↗</span></a></header><div class="chapter-reading-layout"><div class="chapter-reading">${content}<nav class="chapter-pagination" aria-label="Navigasi antar bab">${previous}${next}</nav></div>${toc}</div>${rewriteLinks(footer, 'chapter', number)}`,
  });
}

function renderPage({ kind, title, description, canonical, navHtml = rewriteLinks(nav, 'home'), main, chapter = 0 }) {
  const pageKind = `data-page="${kind}"${chapter ? ` data-chapter="${chapter}"` : ''}`;
  const base = kind === 'home' ? './' : '../';
  const skipTarget = kind === 'home'
    ? '#konten'
    : `${kind === 'chapter' ? `bab-${chapter}` : kind === 'reference' ? 'referensi' : 'lab'}/index.html#konten`;
  const hashedAssets = renderPage.assets;
  return `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#f5f7fb"><meta name="description" content="${escapeHtml(description)}">
    <meta name="author" content="Mr.4Nony Alias Josua"><meta name="color-scheme" content="light dark">
    <title>${escapeHtml(title)}</title><link rel="canonical" href="${canonical}">
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='18' fill='%234b65e8'/%3E%3Cpath d='M22 18 10 32l12 14M42 18l12 14-12 14M37 14 27 50' fill='none' stroke='white' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E">
    <base href="${base}"><link rel="manifest" href="manifest.webmanifest">
    <style>${renderPage.criticalCss}</style>
    <link rel="preload" href="${hashedAssets.css}" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="${hashedAssets.css}"></noscript>
    <script src="${hashedAssets.js}" defer></script>
  </head>
  <body ${pageKind}>
    <a class="skip-link" href="${skipTarget}">Lewati ke materi</a>
    <div class="reading-progress" aria-hidden="true"><span id="reading-progress-bar"></span></div>
    <div class="site-shell">
      <button class="sidebar-backdrop" id="sidebar-backdrop" type="button" aria-label="Tutup navigasi" tabindex="-1" hidden></button>
      ${navHtml}
      <main class="main-content" id="konten">${main}</main>
    </div>
  </body>
</html>`;
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(path.join(outputDirectory, 'assets'), { recursive: true });
const assets = await build({
  entryPoints: [path.join(root, 'app.js'), path.join(root, 'styles.css')],
  outdir: path.join(outputDirectory, 'assets'),
  entryNames: '[name]-[hash]',
  minify: true,
  bundle: false,
  write: false,
});
const assetNames = {};
for (const file of assets.outputFiles) {
  const relative = path.relative(outputDirectory, file.path).split(path.sep).join('/');
  await writeFile(file.path, file.contents);
  assetNames[relative.startsWith('assets/') ? relative.slice('assets/'.length).split('-')[0] : relative] = relative;
}
renderPage.assets = { css: assetNames['styles'], js: assetNames['app'] };
renderPage.criticalCss = `
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:92px}body{margin:0;background:#f5f7fb;color:#17213a;font:14px/1.7 "Segoe UI",Arial,sans-serif}
.site-shell{min-height:100vh}.sidebar{position:fixed;z-index:16;inset:0 auto 0 0;display:flex;width:min(320px,calc(100vw - 42px));height:100vh;flex-direction:column;padding:18px 15px 14px;overflow-y:auto;background:#fff;transform:translateX(-105%)}
.brand{display:flex;align-items:center;gap:11px}.brand-mark{display:grid;width:42px;height:42px;place-items:center;border-radius:14px;background:#3f56d2;color:white}
.main-content{margin:0;padding:0 28px}.topbar{position:sticky;z-index:10;top:0;display:flex;height:65px;align-items:center;gap:9px;border-bottom:1px solid #e8ebf2;background:#f5f7fb}
.mobile-menu{display:inline-grid;width:32px;height:32px;place-items:center;border:0;background:transparent}.topbar-link{margin-left:auto}.hero{display:grid;min-height:360px;grid-template-columns:1fr .9fr;align-items:center;gap:25px;padding:43px 0 37px}
h1{font-size:clamp(36px,4vw,52px);line-height:1.13}.skip-link{position:fixed;z-index:20;top:10px;left:10px;transform:translateY(-160%)}.skip-link:focus{transform:translateY(0)}
@media(min-width:1701px){.main-content{margin:0 auto;max-width:1480px;padding:76px 5vw 0}.sidebar{inset:0 0 auto;width:100%;height:76px;flex-direction:row;align-items:center;transform:none}.mobile-menu{display:none}}
`;

const homePage = renderPage({
  kind: 'home',
  title: 'Belajar Algoritma — Algoritma dan Struktur Data I',
  description: 'Dashboard pembelajaran interaktif Algoritma dan Struktur Data I dengan materi Bab 1–3, progres, lab, visualizer, dan kode Python.',
  canonical: 'https://jxxzy.github.io/algoritima1/',
  main: dashboard,
});
await writeFile(path.join(outputDirectory, 'index.html'), homePage);

for (let number = 1; number <= 3; number += 1) {
  const directory = path.join(outputDirectory, `bab-${number}`);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), chapterPage(number));
}

const labDirectory = path.join(outputDirectory, 'lab');
await mkdir(labDirectory, { recursive: true });
const labPage = renderPage({
  kind: 'lab',
  title: 'Laboratorium Interaktif | Belajar Algoritma',
  description: 'Coba algoritma durasi, parkir, dan geometri, lalu jalankan visualizer langkah demi langkah.',
  canonical: 'https://jxxzy.github.io/algoritima1/lab/',
  navHtml: rewriteLinks(nav, 'chapter', 1),
  main: `<header class="topbar"><button class="mobile-menu" id="mobile-menu" type="button" aria-expanded="false" aria-controls="sidebar" aria-label="Buka navigasi">☰</button><div class="breadcrumb"><a href="index.html">Beranda</a><span aria-hidden="true">/</span><strong>Laboratorium</strong></div><button class="focus-toggle" id="focus-toggle" type="button" aria-pressed="false"><span aria-hidden="true">◎</span> Mode fokus</button></header>${fragments.lab}${visualizer()}${rewriteLinks(footer, 'chapter', 1)}`,
});
await writeFile(path.join(labDirectory, 'index.html'), labPage);

const referenceDirectory = path.join(outputDirectory, 'referensi');
await mkdir(referenceDirectory, { recursive: true });
const referencePage = renderPage({
  kind: 'reference',
  title: 'Referensi Cepat | Belajar Algoritma',
  description: 'Referensi ringkas tipe data Python, operator, serta rumus konversi algoritma.',
  canonical: 'https://jxxzy.github.io/algoritima1/referensi/',
  navHtml: rewriteLinks(nav, 'chapter', 1),
  main: `<header class="topbar"><button class="mobile-menu" id="mobile-menu" type="button" aria-expanded="false" aria-controls="sidebar" aria-label="Buka navigasi">☰</button><div class="breadcrumb"><a href="index.html">Beranda</a><span aria-hidden="true">/</span><strong>Referensi cepat</strong></div><button class="focus-toggle" id="focus-toggle" type="button" aria-pressed="false"><span aria-hidden="true">◎</span> Mode fokus</button></header>${fragments.reference}${rewriteLinks(footer, 'chapter', 1)}`,
});
await writeFile(path.join(referenceDirectory, 'index.html'), referencePage);
await writeFile(path.join(outputDirectory, 'search-index.json'), JSON.stringify(createSearchIndex()));

const pythonDirectories = ['Bab 1', 'Bab 2', 'Bab 3'];
const pythonFiles = [];
async function copyPythonFiles(directory) {
  const destination = path.join(outputDirectory, directory);
  await mkdir(destination, { recursive: true });
  for (const entry of await readdir(path.join(root, directory), { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.py')) {
      const contents = await readFile(path.join(root, directory, entry.name));
      await writeFile(path.join(destination, entry.name), contents);
      pythonFiles.push(`${directory}/${entry.name}`);
    }
  }
}
await Promise.all(pythonDirectories.map(copyPythonFiles));

const manifest = {
  name: 'Belajar Algoritma — Algoritma dan Struktur Data I',
  short_name: 'Belajar Algoritma',
  description: 'Materi algoritma interaktif Bab 1–3.',
  lang: 'id',
  start_url: './',
  scope: './',
  display: 'standalone',
  background_color: '#f5f7fb',
  theme_color: '#3f56d2',
  icons: [{ src: 'assets/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
};
await writeFile(path.join(outputDirectory, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));
await mkdir(path.join(outputDirectory, 'assets'), { recursive: true });
await writeFile(path.join(outputDirectory, 'assets', 'icon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="#3f56d2"/><path d="M22 18 10 32l12 14M42 18l12 14-12 14M37 14 27 50" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`);

const assetFiles = await readdir(path.join(outputDirectory, 'assets'));
const pages = ['index.html', 'bab-1/index.html', 'bab-2/index.html', 'bab-3/index.html', 'lab/index.html', 'referensi/index.html'];
const offlineFiles = [...pages, 'manifest.webmanifest', 'search-index.json', ...pythonFiles, ...assetFiles.map((name) => `assets/${name}`)];
const cacheFingerprint = createHash('sha256');
for (const file of [...offlineFiles].sort()) {
  cacheFingerprint.update(file);
  cacheFingerprint.update(await readFile(path.join(outputDirectory, file)));
}
const swSource = `
const CACHE_NAME = 'belajar-algoritma-${cacheFingerprint.digest('hex').slice(0, 12)}';
const CORE = ${JSON.stringify(offlineFiles)}.map(path => new URL(path, self.registration.scope).href);
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('belajar-algoritma-') && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => { if (!response.ok) throw new Error('Halaman tidak tersedia.'); const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(request, copy)); return response; }).catch(async () => (await caches.match(request, { ignoreSearch: true })) || caches.match(new URL('index.html', self.registration.scope).href)));
    return;
  }
  if (url.pathname.includes('/assets/')) {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => { if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone())); return response; })));
    return;
  }
  if (url.pathname.endsWith('.py')) {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => { if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone())); return response; })));
  }
});`;
await writeFile(path.join(outputDirectory, 'sw.js'), swSource);
await writeFile(path.join(outputDirectory, '.nojekyll'), '');
console.log(`Built ${pages.length} pages with ${assetFiles.length} assets and ${pythonFiles.length} offline code files in dist/.`);
