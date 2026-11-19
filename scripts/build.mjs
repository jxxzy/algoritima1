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
    readContent('chapters/chapter-4.html'),
    readContent('chapters/chapter-5.html'),
    readContent('chapters/chapter-6.html'),
    readContent('chapters/chapter-7.html'),
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
    chapters: entries.slice(4, 11),
    solutions: entries[11],
    reference: entries[12],
    bookmarks: entries[13],
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
  4: [
    { prompt: 'Apa hasil 2 + 3 * 4 dan (2 + 3) * 4?', answer: 'priority', options: [['priority', '14 dan 20 karena tanda kurung mengubah urutan'], ['same', 'Keduanya 20'], ['reverse', '20 dan 14']] },
    { prompt: 'Syarat diskon berbunyi subtotal minimal Rp50.000. Operator mana tepat?', answer: 'inclusive', options: [['inclusive', '>= agar nilai tepat di ambang termasuk'], ['strict', '> karena sama dengan tidak termasuk'], ['assign', '= untuk menguji']] },
    { prompt: 'Berat paket 1.001 gram ditagih per kilogram atau bagiannya. Berapa total termasuk kemasan Rp2.000?', answer: 'shipping', options: [['shipping', '2 kg; total Rp18.000'], ['one', '1 kg; total Rp10.000'], ['three', '3 kg; total Rp26.000']] },
  ],
  5: [
    { prompt: 'Kondisi nilai >= 60 diuji sebelum nilai >= 80. Nilai 85 masuk kategori mana?', answer: 'wrong', options: [['a', 'A'], ['wrong', 'C karena cabang rendah menang lebih dahulu'], ['d', 'D']] },
    { prompt: 'Apa bedanya validasi dan keputusan?', answer: 'separate', options: [['separate', 'Validasi memeriksa bentuk/domain; keputusan menerapkan aturan layanan'], ['same', 'Keduanya hanya mencetak teks'], ['never', 'Validasi selalu sesudah keputusan']] },
    { prompt: 'Apa hasil normalisasi "  YA " dan apa syarat jawaban yang sah?', answer: 'normalize', options: [['normalize', 'Menjadi "ya"; jawaban tetap harus ya atau tidak'], ['yes', 'Menjadi True secara otomatis'], ['invalid', 'Harus ditolak meski tanpa salah ketik']] },
  ],
  6: [
    { prompt: 'Berapa kali range(5) berjalan?', answer: 'five', options: [['five', '5 kali untuk nilai 0–4'], ['six', '6 kali'], ['four', '4 kali']] },
    { prompt: 'Apakah sentinel -1 dihitung sebagai skor?', answer: 'no', options: [['no', 'Tidak; diperiksa sebelum akumulasi'], ['yes', 'Ya sebagai skor valid'], ['zero', 'Menjadi skor nol tetapi menambah jumlah']] },
    { prompt: 'Segitiga setinggi 4 dicetak dengan loop bersarang. Berapa angka tercetak?', answer: 'ten', options: [['ten', '10'], ['four', '4'], ['16', '16']] },
  ],
  7: [
    { prompt: 'Apa beda parameter dan argumen?', answer: 'paramarg', options: [['paramarg', 'Parameter adalah nama pada definisi; argumen adalah nilai saat pemanggilan'], ['same', 'Keduanya hanya variabel global'], ['print', 'Parameter selalu dicetak']] },
    { prompt: 'Apa keuntungan fungsi murni?', answer: 'pure', options: [['pure', 'Argumen sama menghasilkan hasil sama dan mudah diuji'], ['side', 'Selalu membaca input pengguna'], ['none', 'Tidak boleh dipanggil berkali-kali']] },
    { prompt: 'Fungsi hanya memakai print, tanpa return. Apa hasilnya saat disimpan ke variabel?', answer: 'none', options: [['none', 'None'], ['text', 'Teks hasil print'], ['number', 'Angka terakhir otomatis']] },
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
    next: 4,
    glossary: [['int', 'Bilangan bulat untuk jumlah atau satuan utuh.'], ['float', 'Bilangan pecahan untuk ukuran dan hasil perhitungan.'], ['str', 'Teks untuk nama, NIM, dan identitas lain.'], ['Modulo (%)', 'Sisa pembagian untuk memecah unit, misalnya menit.']],
  },
  4: {
    title: 'Bab 4 · Operator, ekspresi, dan aplikasi mini',
    description: 'Gunakan operator aritmetika dan logika untuk menghitung diskon, nilai berbobot, dan ongkos kirim dengan uji batas yang jelas.',
    previous: 3,
    next: 5,
    glossary: [['Ekspresi', 'Kombinasi nilai, variabel, dan operator yang menghasilkan sebuah nilai.'], ['Prioritas operator', 'Urutan operasi yang menentukan bagaimana ekspresi dievaluasi.'], ['Boolean', 'Nilai True atau False yang dihasilkan perbandingan dan dipakai dalam logika.'], ['Short-circuit', 'Evaluasi logika berhenti saat hasil and/or sudah dapat ditentukan.'], ['Uji batas', 'Pengujian nilai tepat di bawah, pada, dan di atas ambang aturan.']],
  },
  5: {
    title: 'Bab 5 · Percabangan dan game pilihan',
    description: 'Rancang if, elif, else, normalisasi teks, percabangan bersarang, dan pengujian setiap jalur.',
    previous: 4,
    next: 6,
    glossary: [['if', 'Memilih satu tindakan jika kondisinya benar.'], ['elif', 'Memeriksa kondisi alternatif setelah if atau elif sebelumnya salah.'], ['else', 'Jalur akhir ketika tidak ada kondisi sebelumnya yang benar.'], ['Normalisasi', 'Pembersihan huruf besar dan spasi tepi agar pilihan dapat dibandingkan.'], ['Validasi', 'Pemeriksaan bahwa masukan berada pada bentuk atau domain yang ditentukan.']],
  },
  6: {
    title: 'Bab 6 · Perulangan dan game tebak angka',
    description: 'Gunakan for dan while, jaga akumulator, sentinel, break, continue, serta loop bersarang.',
    previous: 5,
    next: 7,
    glossary: [['for', 'Perulangan untuk rentang atau kumpulan yang diketahui.'], ['while', 'Perulangan selama kondisi masih benar.'], ['Sentinel', 'Nilai khusus yang menandai akhir input, bukan data biasa.'], ['Invariant', 'Hubungan nilai yang tetap benar pada akumulasi.'], ['break', 'Menghentikan loop terdekat; continue melewati sisa iterasi saat itu.']],
  },
  7: {
    title: 'Bab 7 · Fungsi, parameter, dan modularisasi',
    description: 'Buat kontrak fungsi, bedakan parameter dan argumen, gunakan return, serta lakukan refactoring dengan uji regresi.',
    previous: 6,
    next: null,
    glossary: [['Parameter', 'Nama formal pada definisi fungsi.'], ['Argumen', 'Nilai nyata yang diberikan saat fungsi dipanggil.'], ['return', 'Mengirim hasil fungsi kembali ke pemanggil.'], ['Fungsi murni', 'Fungsi tanpa perubahan keadaan luar dan hasilnya ditentukan argumennya.'], ['Refactoring', 'Mengubah susunan kode tanpa mengubah perilaku yang disepakati.']],
  },
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function routeFor(id, pageKind, currentChapter) {
  const chapterId = id.match(/^bab-([1-7])$/)?.[1] || id.match(/^b([1-7])-/)?.[1];
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
            <fieldset class="quiz-question" data-answer="${escapeHtml(question.answer)}" data-explanation="${escapeHtml(question.options.find(option=>option[0]===question.answer)[1])}">
              <legend><span>0${index + 1}</span> ${escapeHtml(question.prompt)}</legend>${options}
              <p class="quiz-feedback" aria-live="polite"></p>
            </fieldset>`;
  }).join('');
  return `
        <section class="quiz-section chapter-quiz" id="latihan" aria-labelledby="quiz-title">
          <div class="quiz-top"><div><span class="section-kicker">EVALUASI BAB ${number}</span><h2 id="quiz-title">Cek pemahamanmu</h2><p>Jawab tiga soal. Selesaikan seluruh topik dan raih skor sempurna untuk membuka lencana.</p></div><div class="quiz-art" aria-hidden="true">?</div></div>
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
        const text = plainText(article);
        return { chapter, id, title, text, href: `bab-${chapter}/index.html#${id}` };
      });
  });
}

const curriculum = [1,2,3,4,5,6,7].map(number=>({number,...chapterDetails[number],topics:createSearchIndex().filter(t=>t.chapter===number).map(({id,title,href})=>({id,title,href}))}));
const allIds=curriculum.flatMap(c=>c.topics.map(t=>t.id));
if(allIds.length!==27 || new Set(allIds).size!==allIds.length) throw new Error('Invalid curriculum topic IDs');
for(const c of curriculum){const checks=[...fragments.chapters[c.number-1].matchAll(/data-progress="([^"]+)"/g)].map(m=>m[1]);if(checks.length!==c.topics.length || checks.some(id=>!c.topics.some(t=>t.id===id))) throw new Error('Progress schema mismatch in chapter '+c.number);if(c.previous!==(c.number===1?null:c.number-1)||c.next!==(c.number===7?null:c.number+1))throw new Error('Invalid chapter navigation');for(const q of quizzes[c.number])if(!q.options.some(o=>o[0]===q.answer))throw new Error('Invalid quiz answer');}
const chapterCards = curriculum.map(({number}) => {
  const details = chapterDetails[number];
  const topicCounts = curriculum.map(c=>c.topics.length);
  return `<a class="dashboard-chapter path-card" href="bab-${number}/index.html"><span class="path-index index-${['blue', 'violet', 'amber', 'green', 'blue', 'violet', 'green'][number - 1]}">0${number}</span><span class="path-card-copy"><strong>${escapeHtml(details.title.split(' · ')[1])}</strong><small>${escapeHtml(details.description)}</small><span class="dashboard-chapter-progress" id="chapter-progress-${number}">0 dari ${topicCounts[number - 1]} topik · 0%</span><span class="course-badge" id="chapter-badge-${number}" hidden>Lencana Bab ${number} terkunci</span></span><span class="path-arrow">↗</span></a>`;
}).join('');

const studyTools = await readContent('home/study-tools.html');
const studio = await readContent('lab/studio.html');
const assessment = await readContent('home/assessment.html');
const dashboard = `
        <header class="topbar"><button class="mobile-menu" id="mobile-menu" type="button" aria-expanded="false" aria-controls="sidebar" aria-label="Buka navigasi">☰</button><div class="breadcrumb"><span>Kursus</span><span aria-hidden="true">/</span><strong>Beranda</strong></div><button class="focus-toggle" id="focus-toggle" type="button" aria-pressed="false"><span aria-hidden="true">◎</span> Mode fokus</button><a class="topbar-link" href="bab-1/index.html">Mulai belajar <span aria-hidden="true">↗</span></a></header>
        ${rewriteLinks(fragments.hero, 'home')}
        ${rewriteLinks(fragments.path, 'home')}
        <section class="dashboard-overview" aria-labelledby="dashboard-title">
          <div class="chapter-heading"><div><span class="section-kicker">DASHBOARD BELAJAR</span><h2 id="dashboard-title">Lanjutkan perjalananmu</h2><p id="continue-learning-copy">Progres tersimpan otomatis di browser ini.</p></div><a class="button button-primary" id="continue-learning" href="bab-1/index.html">Mulai Bab 1 →</a></div>
          <div class="path-cards dashboard-chapters">${chapterCards}</div>
          <div class="dashboard-summary"><span><strong id="dashboard-progress">0%</strong> materi selesai</span><span><strong id="dashboard-badges">0 / 7</strong> lencana bab</span><a class="button button-quiet" href="lab/index.html#lab">Buka laboratorium interaktif</a><a class="button button-quiet" href="referensi/index.html#referensi">Buka referensi cepat</a></div>
        </section>
        ${fragments.timer}
        ${fragments.bookmarks}
        ${studyTools}
        ${assessment}
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
              <option value="swap">Menukar dua nilai</option><option value="duration">Memecah durasi</option><option value="parking">Menghitung tarif parkir</option><option value="geometry">Menghitung luas dan keliling</option><option value="branch">Predikat percabangan</option><option value="loop">Akumulasi dengan sentinel</option><option value="function">Pemanggilan fungsi</option>
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
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="theme-color" content="#f5f7fb"><meta name="description" content="${escapeHtml(description)}">
    <meta name="author" content="Mr.4Nony Alias Josua"><meta name="color-scheme" content="light dark">
    <title>${escapeHtml(title)}</title><link rel="canonical" href="${canonical}">
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='18' fill='%234b65e8'/%3E%3Cpath d='M22 18 10 32l12 14M42 18l12 14-12 14M37 14 27 50' fill='none' stroke='white' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E">
    <base href="${base}"><link rel="manifest" href="manifest.webmanifest">
    <style>${renderPage.criticalCss}</style>
    <link rel="stylesheet" href="${hashedAssets.css}">
    <meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${canonical}"><meta property="og:type" content="website">
    <script type="application/json" id="curriculum-registry">${JSON.stringify(curriculum).replace(/</g, "\\u003c")}</script>
    <script src="${hashedAssets.math}" defer></script>
    <script src="${hashedAssets.js}" defer></script>
    <script src="${hashedAssets.storage}" defer></script>
    <script src="${hashedAssets.academy}" defer></script>
    <script src="${hashedAssets.assessment}" defer></script>
    <script src="${hashedAssets.tools}" defer></script>
    <script src="${hashedAssets.experiments}" defer></script>
    <script src="${hashedAssets.extras}" defer></script>
    <link rel="stylesheet" href="${hashedAssets.workspace}">
  </head>
  <body ${pageKind}>
    <a class="skip-link" href="${skipTarget}">Lewati ke materi</a>
    <div class="reading-progress" aria-hidden="true"><span id="reading-progress-bar"></span></div>
    <div class="site-shell">
      <button class="sidebar-backdrop" id="sidebar-backdrop" type="button" aria-label="Tutup navigasi" tabindex="-1" hidden></button>
      ${navHtml}
      <main class="main-content" id="konten">${main.replace(/<pre\b([^>]*)>/gi, (_tag, attrs)=>`<pre${attrs}${/\btabindex\s*=/.test(attrs)?'':' tabindex="0"'}${/\brole\s*=/.test(attrs)?'':' role="region"'}${/\baria-label\s*=/.test(attrs)?'':' aria-label="Kode atau hasil program"'}>`).replace(/<div\b([^>]*class="[^"]*\b(?:table-scroll|academy-table|flow-preview)\b[^"]*"[^>]*)>/gi,(_tag,attrs)=>`<div${attrs}${/\btabindex\s*=/.test(attrs)?'':' tabindex="0"'}${/\brole\s*=/.test(attrs)?'':' role="region"'}${/\baria-label\s*=/.test(attrs)?'':' aria-label="Area diagram atau tabel yang dapat digulir"'}>`)}</main>
    </div>
  </body>
</html>`;
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(path.join(outputDirectory, 'assets'), { recursive: true });
const assets = await build({
  entryPoints: [path.join(root, 'app.js'), path.join(root, 'styles.css'), path.join(root, 'academy.js'), path.join(root, 'assessment.js'), path.join(root, 'math.js'), path.join(root, 'tools.js'), path.join(root, 'workspace.css'), path.join(root, 'experiments.js'), path.join(root, 'storage.js'), path.join(root, 'extras.js')],
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
renderPage.assets = { css: assetNames['styles'], js: assetNames['app'], academy: assetNames['academy'], assessment: assetNames['assessment'], math: assetNames['math'], tools: assetNames['tools'], workspace: assetNames['workspace'], experiments: assetNames['experiments'], storage: assetNames['storage'], extras: assetNames['extras'] };
renderPage.criticalCss = `
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:92px}body{margin:0;background:#f5f7fb;color:#17213a;font:14px/1.7 "Segoe UI",Arial,sans-serif}
.site-shell{min-height:100vh}.sidebar{position:fixed;z-index:16;inset:0 auto 0 0;display:flex;width:min(320px,calc(100vw - 42px));height:100vh;flex-direction:column;padding:18px 15px 14px;overflow-y:auto;background:#fff;transform:translateX(-105%)}
.brand{display:flex;align-items:center;gap:11px}.brand-mark{display:grid;width:42px;height:42px;place-items:center;border-radius:14px;background:#3f56d2;color:white}
.main-content{margin:0;padding:0 28px}.topbar{position:sticky;z-index:10;top:0;display:flex;height:65px;align-items:center;gap:9px;border-bottom:1px solid #e8ebf2;background:#f5f7fb}
.mobile-menu{display:inline-grid;width:32px;height:32px;place-items:center;border:0;background:transparent}.topbar-link{margin-left:auto}.hero{display:grid;min-height:360px;grid-template-columns:1fr .9fr;align-items:center;gap:25px;padding:43px 0 37px}
h1{font-size:clamp(36px,4vw,52px);line-height:1.13}.skip-link{position:fixed;z-index:20;top:10px;left:10px;transform:translateY(-160%)}.skip-link:focus{transform:translateY(0)}
@media(min-width:1100px){.main-content{margin-left:270px;padding:0 32px}.sidebar{inset:0 auto 0 0;width:270px;height:100vh;flex-direction:column;align-items:stretch;transform:none}.mobile-menu{display:none}}
`;

const homePage = renderPage({
  kind: 'home',
  title: 'Belajar Algoritma — Algoritma dan Struktur Data I',
  description: 'Dashboard pembelajaran interaktif Algoritma dan Struktur Data I dengan materi Bab 1–7, progres, lab, visualizer, dan kode Python.',
  canonical: 'https://jxxzy.github.io/algoritima1/',
  main: dashboard,
});
await writeFile(path.join(outputDirectory, 'index.html'), homePage);

for (let number = 1; number <= 7; number += 1) {
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
  main: `<header class="topbar"><button class="mobile-menu" id="mobile-menu" type="button" aria-expanded="false" aria-controls="sidebar" aria-label="Buka navigasi">☰</button><div class="breadcrumb"><a href="index.html">Beranda</a><span aria-hidden="true">/</span><strong>Laboratorium</strong></div><button class="focus-toggle" id="focus-toggle" type="button" aria-pressed="false"><span aria-hidden="true">◎</span> Mode fokus</button></header>${studio}${fragments.lab}${visualizer()}${rewriteLinks(footer, 'chapter', 1)}`,
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
await writeFile(path.join(outputDirectory, 'curriculum.json'), JSON.stringify(curriculum));

const pythonDirectories = ['Bab 1', 'Bab 2', 'Bab 3', 'Bab 4', 'Bab 5', 'Bab 6', 'Bab 7'];
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
  description: 'Materi algoritma interaktif Bab 1–7.',
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
const pages = ['index.html', 'bab-1/index.html', 'bab-2/index.html', 'bab-3/index.html', 'bab-4/index.html', 'bab-5/index.html', 'bab-6/index.html', 'bab-7/index.html', 'lab/index.html', 'referensi/index.html'];
await writeFile(path.join(outputDirectory,'python-worker.js'), await readFile(path.join(root,'python-worker.js')));
await writeFile(path.join(outputDirectory,'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://jxxzy.github.io/algoritima1/sitemap.xml\n');
await writeFile(path.join(outputDirectory,'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+pages.map(p=>'<url><loc>https://jxxzy.github.io/algoritima1/'+p.replace('index.html','')+'</loc></url>').join('')+'</urlset>');
const offlineFiles = [...pages, 'manifest.webmanifest', 'search-index.json', 'curriculum.json', 'python-worker.js', ...pythonFiles, ...assetFiles.map((name) => `assets/${name}`)];
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
    const canonical = new URL(url); canonical.search = ''; if(canonical.pathname.endsWith('/')) canonical.pathname += 'index.html';
    event.respondWith(fetch(request).then(response => { if(response.ok) { const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(canonical.href, copy)); } return response; }).catch(async () => (await caches.match(canonical.href)) || new Response('Halaman ini tidak tersedia secara offline.', {status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})));
    return;
  }
  if (url.pathname.includes('/assets/')) {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => { if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone())); return response; })));
    return;
  }
  if (url.pathname.endsWith('.py') || url.pathname.endsWith('/search-index.json') || url.pathname.endsWith('/curriculum.json') || url.pathname.endsWith('/python-worker.js')) {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => { if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone())); return response; })));
  }
});`;
await writeFile(path.join(outputDirectory, 'sw.js'), swSource);
await writeFile(path.join(outputDirectory, '.nojekyll'), '');
console.log(`Built ${pages.length} pages with ${assetFiles.length} assets and ${pythonFiles.length} offline code files in dist/.`);
