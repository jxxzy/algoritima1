(() => {
  const progressKey = 'belajar-algoritma-progress-v1';
  const themeKey = 'belajar-algoritma-theme-v1';
  const progressInputs = [...document.querySelectorAll('[data-progress]')];
  const chapterButtons = [...document.querySelectorAll('[data-chapter]')];
  const progressFill = document.getElementById('progress-fill');
  const progressLabel = document.getElementById('progress-label');
  const progressDetail = document.getElementById('progress-detail');
  const progressTrack = document.getElementById('progress-track');
  const searchInput = document.getElementById('search-input');
  const searchStatus = document.getElementById('search-status');
  const sidebar = document.getElementById('sidebar');
  const mobileMenu = document.getElementById('mobile-menu');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const themeToggle = document.getElementById('theme-toggle');
  const quizForm = document.getElementById('quiz-form');

  function readProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(progressKey) || '{}');
      return saved && typeof saved === 'object' ? saved : {};
    } catch {
      return {};
    }
  }

  let progress = readProgress();

  function saveProgress() {
    try {
      localStorage.setItem(progressKey, JSON.stringify(progress));
    } catch {
      searchStatus.textContent = 'Penyimpanan progres tidak tersedia di browser ini.';
    }
  }

  function updateProgress() {
    const completeCount = progressInputs.filter((input) => progress[input.dataset.progress]).length;
    const percent = Math.round((completeCount / progressInputs.length) * 100);
    progressFill.style.width = `${percent}%`;
    progressLabel.textContent = `${percent}%`;
    progressDetail.textContent = `${completeCount} dari ${progressInputs.length} topik selesai`;
    progressTrack.setAttribute('aria-valuenow', String(percent));
    chapterButtons.forEach((button) => {
      const chapterId = button.dataset.chapter;
      const chapterInputs = progressInputs.filter((input) => input.dataset.progress.startsWith(`b${chapterId}-`));
      const done = chapterInputs.length > 0 && chapterInputs.every((input) => progress[input.dataset.progress]);
      button.setAttribute('aria-pressed', String(done));
      button.innerHTML = done
        ? '<span>✓</span> Bab selesai'
        : '<span>✓</span> Tandai bab selesai';
    });
  }

  progressInputs.forEach((input) => {
    input.checked = Boolean(progress[input.dataset.progress]);
    input.closest('.lesson-card').classList.toggle('is-complete', input.checked);
    input.addEventListener('change', () => {
      progress[input.dataset.progress] = input.checked;
      input.closest('.lesson-card').classList.toggle('is-complete', input.checked);
      saveProgress();
      updateProgress();
    });
  });

  chapterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const chapterId = button.dataset.chapter;
      const chapterInputs = progressInputs.filter((input) => input.dataset.progress.startsWith(`b${chapterId}-`));
      const shouldComplete = !chapterInputs.every((input) => progress[input.dataset.progress]);
      chapterInputs.forEach((input) => {
        input.checked = shouldComplete;
        progress[input.dataset.progress] = shouldComplete;
        input.closest('.lesson-card').classList.toggle('is-complete', shouldComplete);
      });
      saveProgress();
      updateProgress();
    });
  });
  updateProgress();

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark', isDark);
    themeToggle.setAttribute('aria-label', isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');
    themeToggle.querySelector('span:first-child').textContent = isDark ? '☀' : '☾';
    document.querySelector('meta[name="theme-color"]').content = isDark ? '#111522' : '#f5f7fb';
  }

  let savedTheme = 'light';
  try {
    savedTheme = localStorage.getItem(themeKey) || 'light';
  } catch {
    savedTheme = 'light';
  }
  applyTheme(savedTheme);
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(nextTheme);
    try {
      localStorage.setItem(themeKey, nextTheme);
    } catch {
      searchStatus.textContent = 'Preferensi tampilan tidak dapat disimpan di browser ini.';
    }
  });

  const labForm = document.getElementById('lab-form');
  const labOperation = document.getElementById('lab-operation');
  const labInputA = document.getElementById('lab-value-a');
  const labInputB = document.getElementById('lab-value-b');
  const labLabelA = document.getElementById('lab-label-a');
  const labLabelB = document.getElementById('lab-label-b');
  const labFieldB = document.getElementById('lab-field-b');
  const labOutput = document.getElementById('lab-output');

  const labSettings = {
    duration: { labelA: 'Durasi (menit)', labelB: '', example: [135, 0] },
    parking: { labelA: 'Durasi parkir (jam)', labelB: '', example: [8, 0] },
    geometry: { labelA: 'Panjang (meter)', labelB: 'Lebar (meter)', example: [5, 3] },
  };

  function updateLabInputs() {
    const settings = labSettings[labOperation.value];
    labLabelA.textContent = settings.labelA;
    labLabelB.textContent = settings.labelB;
    labFieldB.hidden = !settings.labelB;
    labInputB.required = Boolean(settings.labelB);
    labInputA.step = labOperation.value === 'duration' || labOperation.value === 'parking' ? '1' : 'any';
    labInputA.value = settings.example[0];
    labInputB.value = settings.example[1];
    labOutput.classList.remove('has-result', 'has-error');
    labOutput.querySelector('strong').textContent = 'Siap untuk dicoba';
    labOutput.querySelector('p').textContent = 'Pilih eksperimen, lalu tekan “Jalankan algoritma”.';
  }

  function showLabResult(title, explanation, isError = false) {
    labOutput.classList.toggle('has-error', isError);
    labOutput.classList.toggle('has-result', !isError);
    labOutput.querySelector('strong').textContent = title;
    labOutput.querySelector('p').textContent = explanation;
  }

  labOperation.addEventListener('change', updateLabInputs);
  document.getElementById('lab-example').addEventListener('click', () => {
    const settings = labSettings[labOperation.value];
    labInputA.value = settings.example[0];
    labInputB.value = settings.example[1];
    labInputA.focus();
  });

  labForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const nilaiA = Number(labInputA.value);
    const nilaiB = Number(labInputB.value);
    if (!Number.isFinite(nilaiA) || !labInputA.value.trim()) {
      showLabResult('Input belum valid', 'Masukkan angka yang terbatas pada kolom pertama.', true);
      return;
    }

    if (labOperation.value === 'duration') {
      if (!Number.isSafeInteger(nilaiA) || nilaiA < 0) {
        showLabResult('Durasi ditolak', 'Masukkan jumlah menit bulat yang tidak negatif.', true);
        return;
      }
      const menit = BigInt(nilaiA);
      const jam = menit / 60n;
      const sisa = menit % 60n;
      const totalDetik = menit * 60n;
      showLabResult(
        `${jam} jam ${sisa} menit`,
        `${menit} // 60 = ${jam} jam · ${menit} % 60 = ${sisa} menit\nPemeriksaan balik: ${jam} × 60 + ${sisa} = ${menit} menit · Total: ${totalDetik} detik`,
      );
      return;
    }

    if (labOperation.value === 'parking') {
      if (!Number.isSafeInteger(nilaiA) || nilaiA < 1) {
        showLabResult('Durasi ditolak', 'Durasi parkir harus berupa jam bulat minimal 1.', true);
        return;
      }
      const jamTambahan = BigInt(nilaiA - 1);
      const biayaAwal = 3_000n + jamTambahan * 2_000n;
      const biayaAkhir = biayaAwal > 15_000n ? 15_000n : biayaAwal;
      const rupiah = (nilai) => `Rp${new Intl.NumberFormat('id-ID').format(nilai)}`;
      showLabResult(
        rupiah(biayaAkhir),
        `${nilaiA} − 1 = ${jamTambahan} jam tambahan\n${rupiah(3_000)} + (${jamTambahan} × ${rupiah(2_000)}) = ${rupiah(biayaAwal)} sebelum batas\nTarif akhir: min(${rupiah(biayaAwal)}, Rp15.000) = ${rupiah(biayaAkhir)}`,
      );
      return;
    }

    if (!labInputB.value.trim() || !Number.isFinite(nilaiB) || nilaiA <= 0 || nilaiB <= 0) {
      showLabResult('Ukuran ditolak', 'Panjang dan lebar harus berupa angka terbatas yang lebih besar dari nol.', true);
      return;
    }
    const luas = nilaiA * nilaiB;
    const keliling = 2 * (nilaiA + nilaiB);
    if (!Number.isFinite(luas) || !Number.isFinite(keliling)) {
      showLabResult('Angka terlalu besar', 'Hasil luas atau keliling berada di luar rentang angka yang dapat ditampilkan.', true);
      return;
    }
    showLabResult(
      `Luas ${luas} m² · Keliling ${keliling} m`,
      `Luas = ${nilaiA} × ${nilaiB} = ${luas} m²\nKeliling = 2 × (${nilaiA} + ${nilaiB}) = ${keliling} m`,
    );
  });

  function normalize(value) {
    return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('id');
  }

  searchInput.addEventListener('input', () => {
    const query = normalize(searchInput.value.trim());
    const sections = [...document.querySelectorAll('[data-searchable]')];
    let matches = 0;
    sections.forEach((section) => {
      const visible = !query || normalize(section.textContent).includes(query);
      section.classList.toggle('search-hidden', !visible);
      section.classList.toggle('search-match', Boolean(query && visible));
      if (visible && query) matches += 1;
    });
    document.querySelectorAll('.chapter-section').forEach((chapter) => {
      const visibleTopics = chapter.querySelectorAll('[data-searchable]:not(.search-hidden)').length;
      chapter.classList.toggle('search-hidden', Boolean(query && visibleTopics === 0));
    });
    document.querySelector('.hero').classList.toggle('search-hidden', Boolean(query) && !normalize(document.querySelector('.hero').innerText).includes(query));
    document.querySelector('.learning-path').classList.toggle('search-hidden', Boolean(query));
    document.getElementById('latihan').classList.toggle('search-hidden', Boolean(query));
    document.getElementById('referensi').classList.toggle('search-hidden', Boolean(query));
    sidebar.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.toggle('nav-search-hidden', Boolean(query) && !normalize(link.textContent).includes(query));
    });
    sidebar.querySelectorAll('[data-nav-group]').forEach((group) => {
      const chapterLink = group.querySelector('.nav-chapter');
      const topicLinks = [...group.querySelectorAll('.nav-topic')];
      let topicMatches = 0;
      topicLinks.forEach((link) => {
        const target = document.querySelector(link.getAttribute('href'));
        const matches = !query || normalize(`${link.textContent} ${target?.textContent || ''}`).includes(query);
        link.classList.toggle('nav-search-hidden', !matches);
        if (matches) topicMatches += 1;
      });
      const chapterMatches = !query || normalize(chapterLink.textContent).includes(query);
      group.classList.toggle('nav-search-hidden', Boolean(query) && !chapterMatches && topicMatches === 0);
      if (query && topicMatches > 0) group.open = true;
    });
    searchStatus.textContent = query ? `${matches} bagian materi ditemukan.` : '';
    if (query && matches === 0) searchStatus.textContent = 'Belum ada materi yang cocok.';
  });

  const navTargets = [...sidebar.querySelectorAll('a[href^="#"]')];
  const navLinkById = new Map(navTargets.map((link) => [link.hash.slice(1), link]));
  const navSections = [...new Set(navTargets
    .map((link) => document.getElementById(link.hash.slice(1)))
    .filter(Boolean))];

  function setCurrentNavigation(section) {
    navTargets.forEach((link) => {
      if (link.hash === `#${section.id}`) {
        link.setAttribute('aria-current', 'location');
        const group = link.closest('[data-nav-group]');
        if (group) group.open = true;
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  if ('IntersectionObserver' in window) {
    const navigationObserver = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)[0];
      if (current) setCurrentNavigation(current.target);
    }, { rootMargin: '-18% 0px -70% 0px', threshold: 0 });
    navSections.forEach((section) => navigationObserver.observe(section));
  }
  const initialSection = navLinkById.get(location.hash.slice(1));
  if (initialSection) {
    const section = document.getElementById(initialSection.hash.slice(1));
    if (section) setCurrentNavigation(section);
  }

  document.addEventListener('keydown', (event) => {
    const target = event.target;
    const typing = target instanceof HTMLElement
      && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
    if (event.key === '/' && !typing) {
      event.preventDefault();
      searchInput.focus();
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'j') {
      event.preventDefault();
      themeToggle.click();
    }
    if (event.key === 'Escape' && document.activeElement === searchInput) {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      searchInput.blur();
    }
  });

  function closeSidebar() {
    sidebar.classList.remove('is-open');
    document.body.classList.remove('sidebar-open');
    sidebarBackdrop.hidden = true;
    mobileMenu.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-label', 'Buka navigasi');
  }

  mobileMenu.addEventListener('click', () => {
    const isOpen = !sidebar.classList.contains('is-open');
    sidebar.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('sidebar-open', isOpen);
    sidebarBackdrop.hidden = !isOpen;
    mobileMenu.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-label', isOpen ? 'Tutup navigasi' : 'Buka navigasi');
    if (isOpen) sidebar.querySelector('.nav-link:not(.nav-search-hidden)')?.focus();
    else mobileMenu.focus();
  });
  sidebarBackdrop.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && sidebar.classList.contains('is-open')) {
      closeSidebar();
      mobileMenu.focus();
    }
  });
  sidebar.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 820px)').matches) closeSidebar();
    });
  });
  document.addEventListener('click', (event) => {
    if (!sidebar.classList.contains('is-open')) return;
    if (!sidebar.contains(event.target) && !mobileMenu.contains(event.target)) {
      closeSidebar();
    }
  });

  document.querySelectorAll('.copy-code').forEach((button) => {
    button.addEventListener('click', async () => {
      const code = button.closest('.code-card').querySelector('pre code').innerText;
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = 'Tersalin ✓';
      } catch {
        button.textContent = 'Gagal menyalin';
      }
      window.setTimeout(() => {
        button.textContent = 'Salin kode';
      }, 1800);
    });
  });

  quizForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let correctCount = 0;
    const questions = [...quizForm.querySelectorAll('.quiz-question')];
    questions.forEach((question) => {
      const selected = question.querySelector('input:checked');
      const feedback = question.querySelector('.quiz-feedback');
      if (!selected) {
        feedback.textContent = 'Pilih satu jawaban dahulu.';
        feedback.className = 'quiz-feedback incorrect';
        return;
      }
      const correct = selected.value === question.dataset.answer;
      if (correct) correctCount += 1;
      feedback.textContent = correct
        ? `Benar! ${question.dataset.explanation}`
        : `Belum tepat. ${question.dataset.explanation}`;
      feedback.className = `quiz-feedback ${correct ? 'correct' : 'incorrect'}`;
    });
    const answeredCount = questions.filter((question) => question.querySelector('input:checked')).length;
    document.getElementById('quiz-result').textContent = answeredCount === questions.length
      ? `Skor: ${correctCount} dari ${questions.length}.`
      : 'Lengkapi semua jawaban untuk melihat skor.';
  });

  const readingBar = document.getElementById('reading-progress-bar');
  let scheduled = false;
  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const percent = scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0;
      readingBar.style.width = `${percent}%`;
      scheduled = false;
    });
  }, { passive: true });
})();
