(() => {
  const progressKey = 'belajar-algoritma-progress-v1';
  const themeKey = 'belajar-algoritma-theme-v1';
  const bookmarksKey = 'belajar-algoritma-bookmarks-v1';
  const quizKey = 'belajar-algoritma-quizzes-v1';
  const progressIds = [
    'b1-ipo', 'b1-kartu', 'b1-biaya',
    'b2-representasi', 'b2-geometri', 'b2-parkir', 'b2-tukar',
    'b3-tipe', 'b3-suhu', 'b3-durasi', 'b3-kecepatan',
    'b4-operator', 'b4-ekspresi', 'b4-aplikasi', 'b4-praktikum',
  ];
  const chapterProgressIds = {
    1: progressIds.filter((id) => id.startsWith('b1-')),
    2: progressIds.filter((id) => id.startsWith('b2-')),
    3: progressIds.filter((id) => id.startsWith('b3-')),
    4: progressIds.filter((id) => id.startsWith('b4-')),
  };
  const progressInputs = [...document.querySelectorAll('[data-progress]')];
  const chapterButtons = [...document.querySelectorAll('button[data-chapter]')];
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
  const focusToggle = document.getElementById('focus-toggle');
  const timerCard = document.querySelector('.focus-timer-card');

  function readProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(progressKey) || '{}');
      return saved && typeof saved === 'object' ? saved : {};
    } catch {
      return {};
    }
  }

  let progress = readProgress();
  function readQuizzes() {
    try {
      const saved = JSON.parse(localStorage.getItem(quizKey) || '{}');
      return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
    } catch {
      return {};
    }
  }
  let quizzes = readQuizzes();

  function saveProgress() {
    try {
      localStorage.setItem(progressKey, JSON.stringify(progress));
    } catch {
      searchStatus.textContent = 'Penyimpanan progres tidak tersedia di browser ini.';
    }
  }

  function updateProgress() {
    const completeCount = progressIds.filter((id) => progress[id]).length;
    const percent = Math.round((completeCount / progressIds.length) * 100);
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressLabel) progressLabel.textContent = `${percent}%`;
    if (progressDetail) progressDetail.textContent = `${completeCount} dari ${progressIds.length} topik selesai`;
    if (progressTrack) progressTrack.setAttribute('aria-valuenow', String(percent));
    chapterButtons.forEach((button) => {
      const chapterId = button.dataset.chapter;
      const done = chapterProgressIds[chapterId].every((id) => progress[id]);
      button.setAttribute('aria-pressed', String(done));
      button.innerHTML = done
        ? '<span>✓</span> Bab selesai'
        : '<span>✓</span> Tandai bab selesai';
    });
    Object.keys(chapterProgressIds).forEach((chapterId) => {
      const ids = chapterProgressIds[chapterId];
      const count = ids.filter((id) => progress[id]).length;
      const chapterPercent = Math.round((count / ids.length) * 100);
      const summary = document.getElementById(`chapter-progress-${chapterId}`);
      const badge = document.getElementById(`chapter-badge-${chapterId}`);
      const badgeEarned = count === ids.length || Boolean(quizzes[chapterId]);
      if (summary) summary.textContent = `${count} dari ${ids.length} topik · ${chapterPercent}%`;
      if (badge) {
        badge.hidden = !badgeEarned;
        badge.textContent = badgeEarned ? `Lencana Bab ${chapterId} terbuka ✓` : `Lencana Bab ${chapterId} terkunci`;
      }
    });
    const dashboardProgress = document.getElementById('dashboard-progress');
    const dashboardBadges = document.getElementById('dashboard-badges');
    if (dashboardProgress) dashboardProgress.textContent = `${percent}%`;
    const chapterIds = Object.keys(chapterProgressIds);
    if (dashboardBadges) dashboardBadges.textContent = `${chapterIds.filter((id) => chapterProgressIds[id].every((topic) => progress[topic]) || quizzes[id]).length} / ${chapterIds.length}`;
    const continueLink = document.getElementById('continue-learning');
    const continueCopy = document.getElementById('continue-learning-copy');
    if (continueLink) {
      const nextChapter = chapterIds.find((id) => !chapterProgressIds[id].every((topic) => progress[topic]));
      continueLink.href = nextChapter ? `bab-${nextChapter}/index.html` : 'lab/index.html#lab';
      continueLink.textContent = nextChapter ? `Lanjutkan Bab ${nextChapter} →` : 'Semua bab selesai · Buka lab →';
      if (continueCopy) continueCopy.textContent = nextChapter
        ? `${completeCount} dari ${progressIds.length} topik selesai. Progres tersimpan otomatis.`
        : 'Semua bab selesai. Uji pemahamanmu di laboratorium interaktif.';
    }
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

  if (focusToggle) {
    focusToggle.addEventListener('click', () => {
      const isFocused = document.body.classList.toggle('focus-mode');
      if (isFocused && sidebar.classList.contains('is-open')) closeSidebar();
      focusToggle.setAttribute('aria-pressed', String(isFocused));
      focusToggle.innerHTML = isFocused
        ? '<span aria-hidden="true">×</span> Keluar dari fokus'
        : '<span aria-hidden="true">◎</span> Mode fokus';
    });
  }

  if (timerCard) {
  const timerDial = document.getElementById('timer-dial');
  const timerProgress = document.getElementById('timer-progress');
  const timerRing = document.getElementById('timer-ring-progress');
  const timerDisplay = document.getElementById('timer-display');
  const timerPhase = document.getElementById('timer-phase');
  const timerStatus = document.getElementById('timer-status');
  const timerSessions = document.getElementById('timer-sessions');
  const timerStart = document.getElementById('timer-start');
  const timerPresets = [...document.querySelectorAll('.timer-preset')];
  const timerCircumference = 2 * Math.PI * 79;
  let focusDuration = 25 * 60_000;
  let breakDuration = 5 * 60_000;
  let timerPhaseValue = 'focus';
  let timerRemaining = focusDuration;
  let timerDeadline = null;
  let timerInterval = null;
  let completedFocusSessions = 0;
  let phaseAnimationTimeout = null;

  function formatTimer(milliseconds) {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function timerDuration() {
    return timerPhaseValue === 'focus' ? focusDuration : breakDuration;
  }

  function renderTimer() {
    const duration = timerDuration();
    const elapsedRatio = duration > 0 ? Math.min(1, Math.max(0, 1 - timerRemaining / duration)) : 0;
    const totalSeconds = Math.ceil(timerRemaining / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const remainingLabel = minutes
      ? `${minutes} menit${seconds ? ` ${seconds} detik` : ''} tersisa`
      : `${seconds} detik tersisa`;
    timerDisplay.textContent = formatTimer(timerRemaining);
    timerDisplay.setAttribute('aria-label', remainingLabel);
    timerPhase.textContent = timerPhaseValue === 'focus' ? 'WAKTU FOKUS' : 'WAKTU ISTIRAHAT';
    timerDial.setAttribute('aria-label', `Timer sesi ${timerPhaseValue === 'focus' ? 'fokus' : 'istirahat'}`);
    const percentComplete = Math.round(elapsedRatio * 100);
    timerProgress.setAttribute('aria-label', `Progres sesi ${timerPhaseValue === 'focus' ? 'fokus' : 'istirahat'}`);
    timerProgress.setAttribute('aria-valuenow', String(percentComplete));
    timerProgress.setAttribute('aria-valuetext', `${percentComplete}% selesai`);
    timerRing.style.strokeDashoffset = String(timerCircumference * (1 - elapsedRatio));
    timerSessions.textContent = String(completedFocusSessions);
    timerStart.textContent = timerDeadline === null
      ? (timerRemaining < timerDuration() ? 'Lanjutkan' : timerPhaseValue === 'focus' ? 'Mulai fokus' : 'Mulai istirahat')
      : 'Jeda';
    timerCard.dataset.running = String(timerDeadline !== null);
    timerCard.dataset.phase = timerPhaseValue;
  }

  function stopTimerInterval() {
    if (timerInterval !== null) {
      window.clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function finishTimerPhase() {
    stopTimerInterval();
    timerDeadline = null;
    timerRemaining = 0;
    if (timerPhaseValue === 'focus') {
      completedFocusSessions += 1;
      timerPhaseValue = 'break';
      timerRemaining = breakDuration;
      timerStatus.textContent = 'Sesi fokus selesai. Saatnya istirahat sejenak.';
    } else {
      timerPhaseValue = 'focus';
      timerRemaining = focusDuration;
      timerStatus.textContent = 'Waktu istirahat selesai. Siap untuk sesi fokus berikutnya?';
    }
    timerCard.classList.remove('is-phase-change');
    window.requestAnimationFrame(() => timerCard.classList.add('is-phase-change'));
    window.clearTimeout(phaseAnimationTimeout);
    phaseAnimationTimeout = window.setTimeout(() => timerCard.classList.remove('is-phase-change'), 650);
    renderTimer();
  }

  function tickTimer() {
    if (timerDeadline === null) return;
    timerRemaining = Math.max(0, timerDeadline - Date.now());
    if (timerRemaining === 0) {
      finishTimerPhase();
      return;
    }
    renderTimer();
  }

  timerStart.addEventListener('click', () => {
    if (timerDeadline !== null) {
      timerRemaining = Math.max(0, timerDeadline - Date.now());
      timerDeadline = null;
      stopTimerInterval();
      timerStatus.textContent = `${timerPhaseValue === 'focus' ? 'Sesi fokus' : 'Waktu istirahat'} dijeda.`;
      renderTimer();
      return;
    }
    if (timerRemaining <= 0) timerRemaining = timerDuration();
    timerDeadline = Date.now() + timerRemaining;
    timerInterval = window.setInterval(tickTimer, 250);
    timerStatus.textContent = `${timerPhaseValue === 'focus' ? 'Sesi fokus dimulai.' : 'Waktu istirahat dimulai.'}`;
    renderTimer();
  });

  document.getElementById('timer-reset').addEventListener('click', () => {
    stopTimerInterval();
    timerDeadline = null;
    timerPhaseValue = 'focus';
    timerRemaining = focusDuration;
    timerStatus.textContent = 'Timer diatur ulang. Siap memulai sesi fokus.';
    renderTimer();
  });

  document.getElementById('timer-skip').addEventListener('click', () => {
    stopTimerInterval();
    timerDeadline = null;
    timerPhaseValue = timerPhaseValue === 'focus' ? 'break' : 'focus';
    timerRemaining = timerDuration();
    timerStatus.textContent = `Fase dilewati. ${timerPhaseValue === 'focus' ? 'Waktu fokus' : 'Waktu istirahat'} siap dimulai.`;
    renderTimer();
  });

  timerPresets.forEach((preset) => {
    preset.addEventListener('click', () => {
      stopTimerInterval();
      timerDeadline = null;
      focusDuration = Number(preset.dataset.focusMinutes) * 60_000;
      breakDuration = Number(preset.dataset.breakMinutes) * 60_000;
      timerPhaseValue = 'focus';
      timerRemaining = focusDuration;
      timerPresets.forEach((option) => option.setAttribute('aria-pressed', String(option === preset)));
      timerStatus.textContent = `Durasi sesi diatur ke ${preset.dataset.focusMinutes} menit fokus dan ${preset.dataset.breakMinutes} menit istirahat.`;
      renderTimer();
    });
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && timerDeadline !== null) tickTimer();
  });
  renderTimer();
  }

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

  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem(themeKey);
  } catch {
    savedTheme = null;
  }
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  applyTheme(savedTheme || (systemPrefersDark.matches ? 'dark' : 'light'));
  systemPrefersDark.addEventListener('change', (event) => {
    if (savedTheme === null) applyTheme(event.matches ? 'dark' : 'light');
  });
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(nextTheme);
    savedTheme = nextTheme;
    try {
      localStorage.setItem(themeKey, nextTheme);
    } catch {
      searchStatus.textContent = 'Preferensi tampilan tidak dapat disimpan di browser ini.';
    }
  });

  const labForm = document.getElementById('lab-form');
  if (labForm) {
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
  }

  function normalize(value) {
    return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('id');
  }

  const searchResults = document.getElementById('search-results');
  let searchIndexPromise;
  function loadSearchIndex() {
    if (!searchIndexPromise) {
      searchIndexPromise = fetch(new URL('search-index.json', document.baseURI))
        .then((response) => {
          if (!response.ok) throw new Error(`Server mengembalikan status ${response.status}.`);
          return response.json();
        })
        .then((entries) => {
          if (!Array.isArray(entries)) throw new Error('Format indeks pencarian tidak valid.');
          return entries;
        });
    }
    return searchIndexPromise;
  }

  function renderSearchResults(query) {
    if (!query) {
      searchResults.replaceChildren();
      searchResults.hidden = true;
      return;
    }
    loadSearchIndex().then((entries) => {
      if (normalize(searchInput.value.trim()) !== query) return;
      const matches = entries
        .filter((entry) => normalize(`${entry.title} ${entry.text}`).includes(query))
        .slice(0, 6);
      searchResults.replaceChildren();
      matches.forEach((entry) => {
        const item = document.createElement('li');
        item.setAttribute('role', 'presentation');
        const link = document.createElement('a');
        link.setAttribute('role', 'option');
        link.href = entry.href;
        link.textContent = `Bab ${entry.chapter} · ${entry.title}`;
        item.append(link);
        searchResults.append(item);
      });
      searchResults.hidden = matches.length === 0;
      if (matches.length) searchStatus.textContent = `${matches.length} hasil pencarian di seluruh bab.`;
      else {
        const localMatches = document.querySelectorAll('[data-searchable]:not(.search-hidden)').length;
        searchStatus.textContent = localMatches
          ? `${localMatches} bagian materi di halaman ini ditemukan.`
          : 'Belum ada materi yang cocok.';
      }
    }).catch((error) => {
      if (normalize(searchInput.value.trim()) !== query) return;
      console.error('Indeks pencarian materi gagal dimuat.', error);
      searchResults.replaceChildren();
      searchResults.hidden = true;
      searchStatus.textContent = 'Pencarian semua bab gagal dimuat; hasil halaman ini tetap tersedia.';
    });
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
    sidebar.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.toggle('nav-search-hidden', Boolean(query) && !normalize(link.textContent).includes(query));
    });
    sidebar.querySelectorAll('[data-nav-group]').forEach((group) => {
      const chapterLink = group.querySelector('.nav-chapter');
      const topicLinks = [...group.querySelectorAll('.nav-topic')];
      let topicMatches = 0;
      topicLinks.forEach((link) => {
        const targetId = new URL(link.href).hash.slice(1);
        const target = document.getElementById(targetId);
        const matches = !query || normalize(`${link.textContent} ${target?.textContent || ''}`).includes(query);
        link.classList.toggle('nav-search-hidden', !matches);
        if (matches) topicMatches += 1;
      });
      const chapterMatches = !query || normalize(chapterLink.textContent).includes(query);
      group.classList.toggle('nav-search-hidden', Boolean(query) && !chapterMatches && topicMatches === 0);
      if (query && topicMatches > 0) group.open = true;
    });
    searchStatus.textContent = query ? `${matches} bagian materi di halaman ini ditemukan.` : '';
    if (query && matches === 0) searchStatus.textContent = 'Mencari di semua bab…';
    renderSearchResults(query);
  });

  const currentPath = location.pathname.endsWith('/')
    ? `${location.pathname}index.html`
    : location.pathname;
  sidebar.querySelectorAll('.brand, .nav-link').forEach((link) => {
    const linkPath = new URL(link.href).pathname;
    const normalizedPath = linkPath.endsWith('/') ? `${linkPath}index.html` : linkPath;
    if (normalizedPath === currentPath) {
      link.setAttribute('aria-current', 'page');
    }
  });
  const activeChapterGroup = document.body.dataset.chapter;
  if (activeChapterGroup) {
    sidebar.querySelector(`[data-chapter-group="${activeChapterGroup}"] summary`)
      ?.setAttribute('aria-current', 'page');
  }
  const navTargets = [...sidebar.querySelectorAll('.nav-topic')].filter((link) => {
    const linkPath = new URL(link.href).pathname;
    return (linkPath.endsWith('/') ? `${linkPath}index.html` : linkPath) === currentPath;
  });
  const navLinkById = new Map(navTargets.map((link) => [link.hash.slice(1), link]));
  const navSections = [...new Set(navTargets
    .map((link) => document.getElementById(link.hash.slice(1)))
    .filter(Boolean))];

  function setCurrentNavigation(section) {
    navTargets.forEach((link) => {
      if (link.hash === `#${section.id}`) {
        link.setAttribute('aria-current', 'location');
        const group = link.closest('[data-nav-group]');
        if (group && window.matchMedia('(max-width: 1700px)').matches) group.open = true;
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
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      searchInput.focus();
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'j') {
      event.preventDefault();
      themeToggle.click();
    }
    if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === 'f') {
      event.preventDefault();
      focusToggle?.click();
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
      if (window.matchMedia('(max-width: 1700px)').matches) closeSidebar();
      else {
        const group = link.closest('[data-nav-group]');
        if (group && window.matchMedia('(min-width: 1701px)').matches) group.open = false;
      }
    });
  });
  document.addEventListener('click', (event) => {
    if (!sidebar.classList.contains('is-open')) return;
    if (!sidebar.contains(event.target) && !mobileMenu.contains(event.target)) {
      closeSidebar();
    }
  });

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    try {
      textarea.select();
      if (!document.execCommand('copy')) throw new Error('Browser menolak akses papan klip.');
    } finally {
      textarea.remove();
    }
  }

  document.addEventListener('click', async (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest('.copy-code');
    if (!button) return;
    const code = button.closest('.code-card')?.querySelector('pre code')?.innerText;
    if (!code) {
      button.textContent = 'Kode tidak tersedia';
      return;
    }
    try {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(code);
        } catch {
          fallbackCopy(code);
        }
      } else {
        fallbackCopy(code);
      }
      button.textContent = 'Tersalin ✓';
    } catch (error) {
      console.error('Kode gagal disalin.', error);
      button.textContent = 'Gagal menyalin';
    }
    window.setTimeout(() => {
      button.textContent = button.dataset.defaultLabel || 'Salin kode';
    }, 1800);
  });

  document.querySelectorAll('.print-summary').forEach((button) => {
    button.addEventListener('click', () => window.print());
  });

  const discountCalculator = document.getElementById('discount-calculator');
  if (discountCalculator) {
    const result = document.getElementById('discount-result');
    discountCalculator.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(discountCalculator);
      const harga = Number(formData.get('harga'));
      const jumlah = Number(formData.get('jumlah'));
      if (!Number.isSafeInteger(harga) || harga <= 0 || !Number.isSafeInteger(jumlah) || jumlah <= 0) {
        result.textContent = 'Harga dan jumlah harus berupa bilangan bulat positif yang aman dihitung.';
        result.classList.add('has-error');
        return;
      }
      const subtotal = BigInt(harga) * BigInt(jumlah);
      if (subtotal > BigInt(Number.MAX_SAFE_INTEGER)) {
        result.textContent = 'Subtotal terlalu besar untuk dihitung secara aman di browser.';
        result.classList.add('has-error');
        return;
      }
      const diskon = subtotal >= 50_000n ? subtotal * 5n / 100n : 0n;
      const kemasan = 2_000n;
      const total = subtotal - diskon + kemasan;
      const rupiah = (nilai) => new Intl.NumberFormat('id-ID').format(nilai);
      result.textContent = `Subtotal Rp${rupiah(subtotal)} · diskon Rp${rupiah(diskon)} · kemasan Rp${rupiah(kemasan)} · total Rp${rupiah(total)}.`;
      result.classList.remove('has-error');
    });
  }

  const rupiah = (nilai) => `Rp${new Intl.NumberFormat('id-ID').format(nilai)}`;
  const participantCardForm = document.getElementById('participant-card-form');
  if (participantCardForm) {
    const result = document.getElementById('participant-card-result');
    participantCardForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(participantCardForm);
      const peserta = {
        Nama: String(data.get('nama') || '').trim(),
        NIM: String(data.get('nim') || '').trim(),
        Kelas: String(data.get('kelas') || '').trim().toUpperCase(),
        Kota: String(data.get('kota') || '').trim(),
      };
      const kosong = Object.entries(peserta).filter(([, value]) => !value).map(([label]) => label);
      if (kosong.length) {
        result.textContent = `Kartu belum dibuat. Lengkapi: ${kosong.join(', ')}.`;
        result.classList.add('has-error');
        return;
      }
      result.textContent = Object.entries(peserta).map(([label, value]) => `${label}: ${value}`).join('\n');
      result.classList.remove('has-error');
    });
  }

  const activityBudgetForm = document.getElementById('activity-budget-form');
  if (activityBudgetForm) {
    const result = document.getElementById('activity-budget-result');
    activityBudgetForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const peserta = Number(new FormData(activityBudgetForm).get('peserta'));
      if (!Number.isSafeInteger(peserta) || peserta < 1) {
        result.textContent = 'Jumlah peserta harus bilangan bulat positif.';
        result.classList.add('has-error');
        return;
      }
      const total = 50_000n + BigInt(peserta) * 12_000n;
      result.textContent = `Biaya tetap Rp50.000 + konsumsi ${peserta} × Rp12.000 = Rp${new Intl.NumberFormat('id-ID').format(total)}.`;
      result.classList.remove('has-error');
    });
  }

  const parkingCalculatorForm = document.getElementById('parking-calculator-form');
  if (parkingCalculatorForm) {
    const result = document.getElementById('parking-calculator-result');
    parkingCalculatorForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const jam = Number(new FormData(parkingCalculatorForm).get('jam'));
      if (!Number.isSafeInteger(jam) || jam < 1) {
        result.textContent = 'Durasi harus bilangan bulat minimal 1 jam.';
        result.classList.add('has-error');
        return;
      }
      const jamTambahan = BigInt(jam - 1);
      const biayaAwal = 3_000n + jamTambahan * 2_000n;
      const biayaAkhir = biayaAwal > 15_000n ? 15_000n : biayaAwal;
      result.textContent = `${jam} jam: Rp3.000 + (${jamTambahan} × Rp2.000) = ${rupiah(biayaAwal)}; setelah batas harian, bayar ${rupiah(biayaAkhir)}.`;
      result.classList.remove('has-error');
    });
  }

  const geometryCalculatorForm = document.getElementById('geometry-calculator-form');
  if (geometryCalculatorForm) {
    const result = document.getElementById('geometry-calculator-result');
    geometryCalculatorForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(geometryCalculatorForm);
      const panjang = Number(data.get('panjang'));
      const lebar = Number(data.get('lebar'));
      if (![panjang, lebar].every(Number.isFinite) || panjang <= 0 || lebar <= 0) {
        result.textContent = 'Panjang dan lebar harus angka terbatas yang lebih besar dari nol.';
        result.classList.add('has-error');
        return;
      }
      const luas = panjang * lebar;
      const keliling = 2 * (panjang + lebar);
      if (![luas, keliling].every(Number.isFinite)) {
        result.textContent = 'Hasil berada di luar rentang angka yang aman untuk ditampilkan.';
        result.classList.add('has-error');
        return;
      }
      result.textContent = `Luas = ${panjang} × ${lebar} = ${luas} m². Keliling = 2 × (${panjang} + ${lebar}) = ${keliling} m.`;
      result.classList.remove('has-error');
    });
  }

  const unitConverterForm = document.getElementById('unit-converter-form');
  if (unitConverterForm) {
    const kind = document.getElementById('unit-converter-kind');
    const labelA = document.getElementById('unit-converter-label-a');
    const labelB = document.getElementById('unit-converter-label-b');
    const inputA = unitConverterForm.elements.namedItem('nilaiA');
    const inputB = unitConverterForm.elements.namedItem('nilaiB');
    const result = document.getElementById('unit-converter-result');
    const unitSettings = {
      suhu: { a: 'Suhu (°C)', b: '', example: [25, ''] },
      durasi: { a: 'Durasi (menit bulat)', b: '', example: [135, ''] },
      jarak: { a: 'Jarak (meter bulat)', b: '', example: [2_345, ''] },
      kecepatan: { a: 'Jarak (km)', b: 'Waktu (menit)', example: [15, 30] },
    };
    function updateConverterInputs() {
      const settings = unitSettings[kind.value];
      labelA.querySelector('span').textContent = settings.a;
      labelB.querySelector('span').textContent = settings.b;
      labelB.hidden = !settings.b;
      inputB.required = Boolean(settings.b);
      inputA.step = kind.value === 'durasi' || kind.value === 'jarak' ? '1' : 'any';
      inputB.step = 'any';
      inputA.value = settings.example[0];
      inputB.value = settings.example[1];
      result.textContent = 'Hasil beserta langkah perhitungan akan muncul di sini.';
      result.classList.remove('has-error');
    }
    kind.addEventListener('change', updateConverterInputs);
    unitConverterForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const a = Number(inputA.value);
      const b = Number(inputB.value);
      if (!inputA.value.trim() || !Number.isFinite(a)) {
        result.textContent = 'Masukkan angka terbatas pada kolom pertama.';
        result.classList.add('has-error');
        return;
      }
      const format = (nilai) => new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(nilai);
      if (kind.value === 'suhu') {
        if (a < -273.15) {
          result.textContent = 'Suhu ditolak: tidak boleh di bawah nol mutlak (−273,15 °C).';
          result.classList.add('has-error');
          return;
        }
        result.textContent = `${format(a)} °C × 9 / 5 + 32 = ${format(a * 9 / 5 + 32)} °F; ${format(a)} + 273,15 = ${format(a + 273.15)} K.`;
      } else if (kind.value === 'durasi') {
        if (!Number.isSafeInteger(a) || a < 0) {
          result.textContent = 'Durasi harus bilangan bulat menit yang tidak negatif.';
          result.classList.add('has-error');
          return;
        }
        const menit = BigInt(a);
        result.textContent = `${menit} // 60 = ${menit / 60n} jam, sisa ${menit % 60n} menit; total ${menit * 60n} detik. Cek balik: ${menit / 60n} × 60 + ${menit % 60n} = ${menit}.`;
      } else if (kind.value === 'jarak') {
        if (!Number.isSafeInteger(a) || a < 0) {
          result.textContent = 'Jarak harus bilangan bulat meter yang tidak negatif.';
          result.classList.add('has-error');
          return;
        }
        const meter = BigInt(a);
        result.textContent = `${meter} // 1000 = ${meter / 1_000n} km; ${meter} % 1000 = ${meter % 1_000n} m.`;
      } else {
        if (!inputB.value.trim() || !Number.isFinite(b) || a < 0 || b <= 0) {
          result.textContent = 'Jarak harus nonnegatif dan waktu harus lebih besar dari nol.';
          result.classList.add('has-error');
          return;
        }
        const waktuJam = b / 60;
        const kecepatan = a / waktuJam;
        if (!Number.isFinite(kecepatan)) {
          result.textContent = 'Hasil berada di luar rentang angka yang dapat ditampilkan.';
          result.classList.add('has-error');
          return;
        }
        result.textContent = `${format(b)} / 60 = ${format(waktuJam)} jam; ${format(a)} km / ${format(waktuJam)} jam = ${format(kecepatan)} km/jam.`;
      }
      result.classList.remove('has-error');
    });
  }

  const logicExplorerForm = document.getElementById('logic-explorer-form');
  if (logicExplorerForm) {
    const result = document.getElementById('logic-explorer-result');
    logicExplorerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(logicExplorerForm);
      const subtotal = Number(data.get('subtotal'));
      if (!Number.isSafeInteger(subtotal) || subtotal < 0) {
        result.textContent = 'Subtotal harus bilangan bulat rupiah yang tidak negatif.';
        result.classList.add('has-error');
        return;
      }
      const anggota = data.get('anggota') === 'true';
      const ambang = subtotal >= 50_000;
      const operator = data.get('operator');
      const nilai = operator === 'and'
        ? anggota && ambang
        : operator === 'or' ? anggota || ambang : !anggota;
      const ekspresi = operator === 'not'
        ? `not ${anggota}`
        : `${anggota} ${operator} ${ambang}`;
      result.textContent = `Anggota = ${anggota}; subtotal ≥ Rp50.000 = ${ambang}; ${ekspresi} → ${nilai}. ${nilai ? 'Kondisi ekspresi terpenuhi.' : 'Kondisi ekspresi tidak terpenuhi.'}`;
      result.classList.remove('has-error');
    });
  }

  document.querySelectorAll('.quiz-form').forEach((quizForm) => {
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
      const result = quizForm.querySelector('.quiz-result') || document.getElementById('quiz-result');
      if (result) result.textContent = answeredCount === questions.length
        ? `Skor: ${correctCount} dari ${questions.length}.`
        : 'Lengkapi semua jawaban untuk melihat skor.';
      if (answeredCount === questions.length && correctCount === questions.length) {
        const chapter = quizForm.dataset.quiz;
        const badge = document.getElementById(`chapter-badge-${chapter}`);
        try {
          quizzes = readQuizzes();
          quizzes[chapter] = true;
          localStorage.setItem(quizKey, JSON.stringify(quizzes));
          updateProgress();
          if (badge) badge.textContent = `Lencana Bab ${chapter} terbuka · kuis sempurna ✓`;
        } catch {
          searchStatus.textContent = 'Hasil kuis tidak dapat disimpan di browser ini.';
        }
      }
    });
  });

  const bookmarkCards = [...document.querySelectorAll('.lesson-card[id]')];
  const bookmarkCount = document.getElementById('bookmark-count');
  const bookmarkList = document.getElementById('saved-lessons');
  const bookmarksEmpty = document.getElementById('bookmarks-empty');
  const bookmarkTitles = {
    'b1-ipo': ['Berpikir dengan input, proses, output', 1],
    'b1-kartu': ['Validasi sebelum menampilkan kartu', 1],
    'b1-biaya': ['Menghitung biaya kegiatan', 1],
    'b1-praktikum': ['Praktikum, tantangan, dan tugas Bab 1', 1],
    'b2-representasi': ['Tiga cara merepresentasikan algoritma', 2],
    'b2-geometri': ['Luas dan keliling persegi panjang', 2],
    'b2-parkir': ['Tarif parkir dengan batas harian', 2],
    'b2-tukar': ['Menukar dua nilai dengan variabel bantu', 2],
    'b2-praktikum': ['Praktikum, tantangan, dan tugas Bab 2', 2],
    'b3-tipe': ['Variabel menyimpan makna, bukan hanya nilai', 3],
    'b3-suhu': ['Konversi Celsius, Fahrenheit, dan Kelvin', 3],
    'b3-durasi': ['Pecah durasi dan jarak', 3],
    'b3-kecepatan': ['Kecepatan rata-rata: satuan harus cocok', 3],
    'b3-praktikum': ['Praktikum, tantangan, dan tugas Bab 3', 3],
    'b4-operator': ['Operator menghasilkan nilai atau keputusan', 4],
    'b4-ekspresi': ['Prioritas, nilai Boolean, dan uji ambang', 4],
    'b4-aplikasi': ['Kasir, nilai akhir, dan biaya kirim', 4],
    'b4-praktikum': ['Praktikum, tantangan, dan evaluasi Bab 4', 4],
  };
  let bookmarks = [];
  try {
    const savedBookmarks = JSON.parse(localStorage.getItem(bookmarksKey) || '[]');
    if (Array.isArray(savedBookmarks)) {
      const validIds = new Set(Object.keys(bookmarkTitles));
      bookmarks = savedBookmarks.filter((id) => typeof id === 'string' && validIds.has(id));
    }
  } catch {
    searchStatus.textContent = 'Daftar materi tersimpan tidak dapat dibaca di browser ini.';
  }

  function updateBookmarks() {
    if (bookmarkCount) bookmarkCount.textContent = String(bookmarks.length);
    if (bookmarksEmpty) bookmarksEmpty.hidden = bookmarks.length > 0;
    if (bookmarkList) {
      bookmarkList.replaceChildren();
      bookmarks.forEach((id) => {
        const [title, chapter] = bookmarkTitles[id];
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `bab-${chapter}/index.html#${id}`;
        link.textContent = title;
        item.append(link);
        bookmarkList.append(item);
      });
    }
    bookmarkCards.forEach((card) => {
      const button = card.querySelector('.bookmark-toggle');
      const isSaved = bookmarks.includes(card.id);
      button.setAttribute('aria-pressed', String(isSaved));
      button.textContent = isSaved ? 'Tersimpan ★' : 'Simpan ☆';
      button.setAttribute('aria-label', `${isSaved ? 'Hapus dari' : 'Simpan ke'} materi tersimpan: ${card.querySelector('.lesson-heading h2').textContent.trim()}`);
    });
  }

  bookmarkCards.forEach((card) => {
    const title = card.querySelector('.lesson-heading h2').textContent.trim();
    let button = card.querySelector('.bookmark-toggle');
    if (!button) button = document.createElement('button');
    button.className = 'bookmark-toggle';
    button.type = 'button';
    button.textContent = 'Simpan ☆';
    button.addEventListener('click', () => {
      bookmarks = bookmarks.includes(card.id)
        ? bookmarks.filter((id) => id !== card.id)
        : [...bookmarks, card.id];
      updateBookmarks();
      try {
        localStorage.setItem(bookmarksKey, JSON.stringify(bookmarks));
      } catch {
        searchStatus.textContent = 'Daftar materi tersimpan tidak dapat disimpan di browser ini.';
      }
    });
    if (!button.isConnected) card.querySelector('.lesson-heading').append(button);
    button.setAttribute('aria-label', `Simpan ke materi tersimpan: ${title}`);
  });
  updateBookmarks();
  window.addEventListener('storage', (event) => {
    if (event.key === progressKey) {
      progress = readProgress();
      progressInputs.forEach((input) => {
        input.checked = Boolean(progress[input.dataset.progress]);
        input.closest('.lesson-card').classList.toggle('is-complete', input.checked);
      });
      updateProgress();
    }
    if (event.key === quizKey) {
      quizzes = readQuizzes();
      updateProgress();
    }
    if (event.key === bookmarksKey) {
      try {
        const saved = JSON.parse(event.newValue || '[]');
        bookmarks = Array.isArray(saved)
          ? saved.filter((id) => Object.hasOwn(bookmarkTitles, id))
          : [];
        updateBookmarks();
      } catch {
        searchStatus.textContent = 'Daftar materi tersimpan dari tab lain tidak dapat dibaca.';
      }
    }
    if (event.key === themeKey) {
      savedTheme = event.newValue;
      applyTheme(savedTheme || (systemPrefersDark.matches ? 'dark' : 'light'));
    }
  });

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches
      && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
      '.hero, .path-card, .focus-timer-section, .practice-lab, .chapter-heading, .chapter-intro, .lesson-card, .solutions-section, .bookmarks-section, .quiz-section, .reference-section',
    );
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -48px 0px', threshold: 0.06 });
    document.body.classList.add('has-reveal-motion');
    revealTargets.forEach((element, index) => {
      element.classList.add('reveal-on-scroll');
      element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 55}ms`);
      revealObserver.observe(element);
    });
  }

  const solutionSelect = document.getElementById('solution-select');
  if (solutionSelect) {
  const solutionDescription = document.getElementById('solution-description');
  const solutionVariables = document.getElementById('solution-variables');
  const solutionCode = document.getElementById('solution-code');
  const solutionFilename = document.getElementById('solution-filename');
  const solutionDownload = document.getElementById('solution-download');
  const solutionStatus = document.getElementById('solution-status');
  const taskCoverage = document.getElementById('task-coverage');
  const solutions = {
    profil: {
      chapter: 'Bab 1',
      file: 'profil.py',
      description: 'Membaca nama dan program studi, menolak teks kosong, lalu menampilkan profil lengkap.',
      variables: [
        ['nama', 'Parameter dan variabel teks untuk nama; strip() membuang spasi tepi.'],
        ['prodi', 'Parameter dan variabel teks untuk program studi.'],
        ['pesan', 'Menampung teks profil saat input valid.'],
        ['kesalahan', 'Menampung pesan penolakan saat ada input wajib yang kosong.'],
        ['buat_profil()', 'Fungsi yang mengembalikan pasangan (pesan, kesalahan); None berarti tidak ada nilai untuk bagian itu.'],
      ],
    },
    kartu_praktikum: {
      chapter: 'Bab 1',
      file: 'kartu_praktikum.py',
      description: 'Membuat kartu praktikum setelah nama, NIM, dan kelas diisi. NIM tetap teks agar nol awal tidak hilang.',
      variables: [
        ['nama, nim, kelas', 'Parameter teks yang menjadi masukan kartu; kelas dinormalisasi ke huruf kapital.'],
        ['data', 'Dictionary yang memasangkan label kolom dengan nilai yang sudah dirapikan.'],
        ['kolom, nilai', 'Variabel perulangan untuk memeriksa setiap pasangan dalam dictionary.'],
        ['kesalahan', 'Daftar semua kolom yang masih kosong; kartu hanya dibuat jika daftar ini kosong.'],
        ['kartu', 'Teks kartu yang disusun dari nama, NIM, dan kelas yang valid.'],
      ],
    },
    kartu_peserta: {
      chapter: 'Bab 1',
      file: 'kartu_peserta.py',
      description: 'Memvalidasi seluruh data dan pilihan sapaan sebelum menerbitkan kartu peserta.',
      variables: [
        ['data', 'Mapping masukan berisi nama, NIM, kelas, kota, dan waktu sapaan.'],
        ['kolom, nilai', 'Dictionary kolom dan nilai hasil trim; kelas diubah ke huruf kapital.'],
        ['kesalahan', 'Daftar semua kolom kosong dan kesalahan pilihan sapaan.'],
        ['waktu', 'Teks pilihan pagi/sore yang sudah dirapikan dan dibuat huruf kecil.'],
        ['sapaan, kartu', 'Teks hasil yang baru disusun setelah seluruh validasi lolos.'],
      ],
    },
    pendaftaran_tiga_peserta: {
      chapter: 'Bab 1',
      file: 'pendaftaran_tiga_peserta.py',
      description: 'Mengulang alur input dan validasi tepat tiga kali; penolakan satu peserta tidak menghentikan peserta berikutnya.',
      variables: [
        ['nomor', 'Penghitung perulangan dari 1 sampai 3 untuk menandai peserta yang sedang didaftarkan.'],
        ['data', 'Dictionary jawaban satu peserta yang dibentuk pada setiap putaran.'],
        ['kartu', 'Kartu hasil fungsi buat_kartu() atau None jika data tidak valid.'],
        ['kesalahan', 'Daftar pesan validasi; setiap pesan ditampilkan sebelum lanjut ke peserta berikutnya.'],
      ],
    },
    biaya_kegiatan: {
      chapter: 'Bab 1',
      file: 'biaya_kegiatan.py',
      description: 'Menghitung biaya tetap dan konsumsi dengan validasi jumlah peserta positif.',
      variables: [
        ['BIAYA_TETAP', 'Konstanta biaya dasar Rp50.000 yang tidak berubah selama perhitungan.'],
        ['KONSUMSI_PER_ORANG', 'Konstanta tarif konsumsi Rp12.000 untuk setiap peserta.'],
        ['peserta', 'Masukan integer; harus lebih besar dari nol.'],
        ['konsumsi', 'Hasil peserta dikalikan tarif konsumsi per orang.'],
        ['total', 'Jumlah biaya tetap dan biaya konsumsi.'],
      ],
    },
    luas_dan_keliling: {
      chapter: 'Bab 2',
      file: 'luas_dan_keliling.py',
      description: 'Menghitung luas dan keliling persegi panjang serta menolak sisi atau hasil yang tidak dapat direpresentasikan dengan aman.',
      variables: [
        ['panjang, lebar', 'Parameter ukuran dalam satuan yang sama; harus berupa angka terbatas dan positif.'],
        ['luas', 'Hasil panjang dikali lebar.'],
        ['keliling', 'Hasil 2 dikali jumlah panjang dan lebar.'],
        ['panjang_cm, lebar_m', 'Masukan variasi satuan; panjang_cm dibagi 100 sebelum hitung.'],
        ['kesalahan', 'Exception ValueError yang menjelaskan input atau hasil di luar batas.'],
      ],
    },
    tarif_parkir: {
      chapter: 'Bab 2',
      file: 'tarif_parkir.py',
      description: 'Menghitung tarif satu jam pertama, jam tambahan, lalu menerapkan batas maksimum harian.',
      variables: [
        ['TARIF_JAM_PERTAMA', 'Konstanta tarif jam pertama, Rp3.000.'],
        ['TARIF_PER_JAM_TAMBAHAN', 'Konstanta tarif untuk setiap jam setelah jam pertama, Rp2.000.'],
        ['BATAS_HARIAN', 'Konstanta pembatas biaya akhir sebesar Rp15.000.'],
        ['jam', 'Masukan integer minimal 1; bool dan tipe selain integer ditolak.'],
        ['jam_tambahan, biaya_awal, biaya_akhir', 'Jumlah jam setelah jam pertama, tarif sebelum batas, dan tarif setelah batas.'],
      ],
    },
    tukar_nilai: {
      chapter: 'Bab 2',
      file: 'tukar_nilai.py',
      description: 'Menukar dua nilai teks menggunakan variabel bantu agar nilai pertama tidak hilang.',
      variables: [
        ['a, b', 'Dua parameter teks yang nilainya akan ditukar.'],
        ['sementara', 'Salinan nilai awal a yang disimpan sebelum a ditimpa.'],
        ['a, b hasil', 'Nilai baru yang dikembalikan berurutan setelah pertukaran.'],
      ],
    },
    konversi_suhu: {
      chapter: 'Bab 3',
      file: 'konversi_suhu.py',
      description: 'Mengonversi Celsius ke Fahrenheit dan Kelvin, dengan batas suhu nol mutlak.',
      variables: [
        ['CELSIUS_MINIMUM', 'Konstanta batas nol mutlak, −273,15 °C.'],
        ['celsius', 'Masukan float yang harus terbatas dan tidak kurang dari batas minimum.'],
        ['fahrenheit', 'Hasil rumus Celsius × 9 / 5 + 32.'],
        ['kelvin', 'Hasil rumus Celsius + 273,15.'],
      ],
    },
    konversi_durasi: {
      chapter: 'Bab 3',
      file: 'konversi_durasi.py',
      description: 'Memecah menit menjadi jam utuh dan sisa menit, menghitung detik, lalu memeriksa hasil dengan rekonstruksi.',
      variables: [
        ['MENIT_PER_JAM', 'Konstanta 60 menit untuk satu jam.'],
        ['DETIK_PER_MENIT', 'Konstanta 60 detik untuk satu menit.'],
        ['menit', 'Masukan integer tidak negatif.'],
        ['jam, sisa_menit', 'Hasil pembagian bulat (//) dan sisa pembagian (%).'],
        ['total_detik, rekonstruksi_menit', 'Total detik dan pemeriksaan balik jam × 60 + sisa.'],
      ],
    },
    konversi_jarak: {
      chapter: 'Bab 3',
      file: 'konversi_jarak.py',
      description: 'Memecah meter menjadi kilometer utuh dan sisa meter menggunakan pembagian bulat dan modulo.',
      variables: [
        ['METER_PER_KILOMETER', 'Konstanta 1.000 meter untuk satu kilometer.'],
        ['jarak_meter', 'Masukan integer tidak negatif.'],
        ['kilometer', 'Jumlah kilometer penuh dari jarak_meter // 1000.'],
        ['sisa_meter', 'Sisa meter dari jarak_meter % 1000.'],
      ],
    },
    konversi_kilometer_ke_meter: {
      chapter: 'Bab 3',
      file: 'konversi_kilometer_ke_meter.py',
      description: 'Mengonversi jarak kilometer ke meter, termasuk nilai pecahan, dengan pemeriksaan angka terbatas.',
      variables: [
        ['jarak_kilometer', 'Parameter input kilometer bertipe angka (int/float), tidak negatif.'],
        ['jarak_km', 'Nilai masukan setelah dikonversi menjadi float dan diperiksa batasnya.'],
        ['jarak_meter', 'Hasil jarak_km dikali 1.000 meter per kilometer.'],
        ['METER_PER_KILOMETER', 'Konstanta konversi satu kilometer menjadi 1.000 meter.'],
        ['isfinite()', 'Fungsi pemeriksa agar input dan hasil bukan NaN atau tak hingga.'],
      ],
    },
    kecepatan_perjalanan: {
      chapter: 'Bab 3',
      file: 'kecepatan_perjalanan.py',
      description: 'Mengubah waktu menit ke jam terlebih dahulu, lalu menghitung kecepatan dalam km/jam.',
      variables: [
        ['MENIT_PER_JAM', 'Konstanta 60 untuk mengubah menit menjadi jam.'],
        ['jarak_km', 'Masukan jarak angka terbatas; nilai nol boleh, nilai negatif ditolak.'],
        ['waktu_menit, waktu_jam', 'Waktu masukan positif dan hasil normalisasinya dalam jam.'],
        ['kecepatan_km_per_jam', 'Hasil jarak_km dibagi waktu_jam, dengan satuan km/jam.'],
      ],
    },
    konverter_kegiatan: {
      chapter: 'Bab 3',
      file: 'konverter_kegiatan.py',
      description: 'Menggabungkan identitas peserta dengan konversi durasi dan jarak; nama tetap terpisah dari besaran hitung.',
      variables: [
        ['nama', 'Identitas teks yang dirapikan dan divalidasi terpisah dari ukuran.'],
        ['menit, jarak_meter', 'Masukan integer tidak negatif untuk durasi dan jarak.'],
        ['jam, sisa_menit, total_detik', 'Hasil konversi durasi serta hitung detik.'],
        ['kilometer, sisa_meter', 'Hasil konversi jarak meter dengan // dan %.'],
        ['laporan', 'Teks hasil gabungan yang hanya dibuat setelah input valid.'],
      ],
    },
    kasir_belanja: {
      chapter: 'Bab 4',
      file: 'kasir_belanja.py',
      description: 'Menyelesaikan contoh diskon 10% mulai Rp100.000, kalkulator latihan 5% mulai Rp50.000, ongkir tetap, diskon anggota/bertingkat, dan perbandingan dasar diskon.',
      variables: [
        ['harga, jumlah', 'Input integer positif untuk menghitung subtotal.'],
        ['subtotal', 'Harga satuan dikalikan jumlah; menjadi dasar ambang diskon yang dinyatakan di kontrak.'],
        ['AMBANG_DISKON_CONTOH, PERSEN_DISKON_CONTOH', 'Aturan contoh awal: diskon 10% mulai subtotal Rp100.000 tanpa biaya kemasan.'],
        ['diskon', 'Persentase yang dipilih sesuai aturan; setiap rupiah pecahan dibulatkan ke bawah.'],
        ['setelah_diskon, kemasan, ongkir, total', 'Tahapan yang dirangkai untuk menampilkan rincian tagihan.'],
        ['layak', 'Kondisi Boolean gabungan anggota dan batas subtotal pada tantangan khusus anggota.'],
      ],
    },
    nilai_berbobot: {
      chapter: 'Bab 4',
      file: 'nilai_berbobot.py',
      description: 'Memvalidasi nilai 0–100; membandingkan bobot contoh 30/30/40 dengan perubahan 25/25/50 pada input yang sama.',
      variables: [
        ['BOBOT_TUGAS, BOBOT_UTS, BOBOT_UAS', 'Konstanta bobot 0.30, 0.30, dan 0.40; jumlahnya satu.'],
        ['tugas, uts, uas', 'Nilai masukan yang harus terbatas dan berada pada rentang 0–100.'],
        ['komponen_tugas, komponen_uts, komponen_uas', 'Setiap nilai dikalikan bobot masing-masing.'],
        ['nilai_akhir', 'Jumlah seluruh komponen; pembulatan hanya dilakukan ketika ditampilkan.'],
        ['hitung_nilai_akhir_pengembangan()', 'Pembanding perubahan bobot menjadi 25%/25%/50%; input 80/70/90 berubah dari 81 menjadi 82,50.'],
      ],
    },
    biaya_pengiriman: {
      chapter: 'Bab 4',
      file: 'biaya_pengiriman.py',
      description: 'Menghitung kilogram tagihan dengan pembulatan ke atas, ongkir Rp8.000 per kg, dan kemasan satu kali per paket.',
      variables: [
        ['berat_gram', 'Input gram integer positif.'],
        ['kilogram_tagihan', 'Hasil (berat_gram + 999) // 1000 untuk membulatkan pecahan kilogram ke atas.'],
        ['TARIF_PER_KG, BIAYA_KEMASAN', 'Konstanta ongkir per kilogram dan biaya kemasan per paket.'],
        ['ongkir, total', 'Biaya berbasis berat dan jumlah akhir setelah kemasan.'],
      ],
    },
  };
  let solutionRequest = 0;

  async function loadSolution() {
    const solution = solutions[solutionSelect.value];
    if (!solution) return;

    const request = ++solutionRequest;
    const filePath = `${solution.chapter}/${solution.file}`;
    const encodedPath = filePath.split('/').map(encodeURIComponent).join('/');
    solutionDescription.textContent = solution.description;
    solutionFilename.textContent = `Python · ${filePath}`;
    solutionDownload.href = encodedPath;
    solutionDownload.download = solution.file;
    solutionStatus.textContent = 'Memuat kode tugas…';
    solutionCode.textContent = 'Memuat kode lengkap…';
    const experiment = solutionSelect.value === 'tarif_parkir' || solutionSelect.value === 'biaya_kegiatan'
      ? 'parking'
      : solutionSelect.value === 'luas_dan_keliling' ? 'geometry' : 'duration';
    const labLink = solutionCode.closest('.code-card')?.querySelector('.lab-code-link');
    if (labLink) labLink.href = `lab/index.html?experiment=${experiment}#lab`;
    solutionVariables.replaceChildren();
    solution.variables.forEach(([name, explanation]) => {
      const item = document.createElement('li');
      const variableName = document.createElement('code');
      variableName.textContent = name;
      item.append(variableName, ` — ${explanation}`);
      solutionVariables.append(item);
    });

    try {
      const response = await fetch(new URL(encodedPath, document.baseURI));
      if (!response.ok) {
        throw new Error(`Server mengembalikan status ${response.status}.`);
      }
      const code = await response.text();
      if (request !== solutionRequest) return;
      solutionCode.textContent = code;
      solutionStatus.textContent = `Kode lengkap ${solution.file} berhasil dimuat.`;
    } catch (error) {
      if (request !== solutionRequest) return;
      solutionCode.textContent = 'Kode tidak dapat dimuat otomatis. Gunakan tautan unduh untuk membuka berkas sumber.';
      solutionStatus.textContent = `Gagal memuat ${solution.file}: ${error.message}`;
    }
  }

  solutionSelect.addEventListener('change', loadSolution);
  loadSolution();

  const assignmentCoverage = [
    {
      chapter: 'Bab 1 · Algoritma dan program pertama',
      tasks: [
        {
          title: 'Praktikum terbimbing · Profil dan kartu peserta',
          explanation: 'Mulai dari kontrak IPO, rapikan input, simpan NIM sebagai teks, dan hanya terbitkan kartu setelah data wajib valid.',
          programs: ['profil', 'kartu_praktikum', 'kartu_peserta'],
        },
        {
          title: 'Tantangan 1 · Kota asal dan perkenalan',
          explanation: 'Tambahkan kota tanpa menghilangkan spasi tengah pada nama atau nama kota.',
          programs: ['kartu_peserta'],
        },
        {
          title: 'Tantangan 2 · Pesan untuk kolom kosong',
          explanation: 'Sebut kolom yang salah secara spesifik dan tahan output sukses sampai seluruh validasi lolos.',
          programs: ['kartu_peserta'],
        },
        {
          title: 'Tantangan 3 · Pendaftaran tiga peserta',
          explanation: 'Gunakan perulangan untuk menjalankan alur yang sama tepat tiga kali; satu peserta invalid tidak menghentikan peserta berikutnya.',
          programs: ['pendaftaran_tiga_peserta'],
        },
        {
          title: 'Tantangan 4 · Sapaan pagi atau sore',
          explanation: 'Pilih sapaan dari waktu tanpa mengubah isi identitas peserta.',
          programs: ['kartu_peserta'],
        },
        {
          title: 'Tantangan 5 · Kartu nama, NIM, dan kelas',
          explanation: 'Wajibkan tiga kolom, pertahankan nol depan NIM, dan perlakukan input spasi saja sebagai kosong.',
          programs: ['kartu_praktikum', 'kartu_peserta'],
        },
        {
          title: 'Tantangan 6 · Biaya kegiatan',
          explanation: 'Hitung Rp50.000 + Rp12.000 per peserta; tolak jumlah bukan integer, nol, dan nilai negatif.',
          programs: ['biaya_kegiatan'],
        },
        {
          title: 'Studi kasus mandiri · Kartu kegiatan lengkap',
          explanation: 'Gabungkan nama, NIM, kelas, kota, validasi semua kolom, serta pilihan sapaan; NIM dan spasi tengah tetap utuh.',
          programs: ['kartu_peserta'],
        },
      ],
    },
    {
      chapter: 'Bab 2 · Narasi, flowchart, dan pseudocode',
      tasks: [
        {
          title: 'Praktikum terbimbing · Layanan parkir',
          explanation: 'Susun narasi, pseudocode, flowchart, dan kode untuk jam bulat; jam nol/negatif harus ditolak.',
          programs: ['tarif_parkir'],
        },
        {
          title: 'Tantangan 1 · Pseudocode keliling',
          explanation: 'Turunkan keliling persegi panjang dari dua sisi yang sudah dibaca dan divalidasi.',
          programs: ['luas_dan_keliling'],
        },
        {
          title: 'Tantangan 2 · Luas dan keliling sekaligus',
          explanation: 'Baca tiap sisi satu kali, lalu hitung serta tampilkan kedua hasil dari input yang sama.',
          programs: ['luas_dan_keliling'],
        },
        {
          title: 'Tantangan 3 · Sentimeter ke meter',
          explanation: 'Normalisasikan panjang dengan membagi 100 sebelum perhitungan geometri.',
          programs: ['luas_dan_keliling'],
        },
        {
          title: 'Tantangan 4 · Batas tarif harian',
          explanation: 'Hitung biaya awal terlebih dahulu, lalu batasi dengan maksimum Rp15.000.',
          programs: ['tarif_parkir'],
        },
        {
          title: 'Tantangan 5 · Tarif jam pertama dan tambahan',
          explanation: 'Jam pertama Rp3.000; jam berikutnya Rp2.000 per jam; durasi minimum satu jam.',
          programs: ['tarif_parkir'],
        },
        {
          title: 'Tantangan 6 · Tukar isi dua wadah',
          explanation: 'Simpan nilai awal A pada variabel bantu sebelum menimpa A agar kedua nilai tidak hilang.',
          programs: ['tukar_nilai'],
        },
        {
          title: 'Studi kasus mandiri · Tarif parkir dengan batas',
          explanation: 'Selaraskan representasi algoritma dan kode, uji batas satu/tujuh/delapan jam, serta tolak durasi invalid.',
          programs: ['tarif_parkir'],
        },
      ],
    },
    {
      chapter: 'Bab 3 · Variabel, tipe data, dan konversi',
      tasks: [
        {
          title: 'Praktikum terbimbing · Tipe dan konversi',
          explanation: 'Uji konversi suhu dan durasi, bandingkan format input, serta pisahkan program kilometer-ke-meter.',
          programs: ['konversi_suhu', 'konversi_durasi', 'konversi_kilometer_ke_meter'],
        },
        {
          title: 'Tantangan 1 · Menit ke detik',
          explanation: 'Kalikan integer menit dengan 60 setelah menerima hanya nilai nonnegatif.',
          programs: ['konversi_durasi'],
        },
        {
          title: 'Tantangan 2 · Jam dan menit sisa',
          explanation: 'Pecah 135 menit dengan pembagian bulat dan modulo menjadi 2 jam 15 menit.',
          programs: ['konversi_durasi'],
        },
        {
          title: 'Tantangan 3 · Batas nol mutlak',
          explanation: 'Terima −273,15 °C dan tolak nilai yang lebih rendah sebelum menghitung suhu.',
          programs: ['konversi_suhu'],
        },
        {
          title: 'Tantangan 4 · Meter ke kilometer dan sisa',
          explanation: 'Gunakan // dan % untuk memisahkan unit jarak, dan jangan campur identitas dengan nilai ukur.',
          programs: ['konversi_jarak', 'konverter_kegiatan'],
        },
        {
          title: 'Tantangan 5 · Pengembangan konverter durasi',
          explanation: 'Pertahankan hasil jam/sisa, tambahkan detik total serta pemeriksaan balik rekonstruksi menit.',
          programs: ['konversi_durasi'],
        },
        {
          title: 'Tantangan 6 · Kecepatan rata-rata',
          explanation: 'Ubah menit menjadi jam dahulu; jarak nol sah, tetapi waktu nol tidak boleh menjadi pembagi.',
          programs: ['kecepatan_perjalanan'],
        },
        {
          title: 'Studi kasus mandiri · Laporan kegiatan',
          explanation: 'Gabungkan identitas teks, durasi, detik, rekonstruksi, dan konversi jarak dalam satu laporan tervalidasi.',
          programs: ['konverter_kegiatan'],
        },
      ],
    },
    {
      chapter: 'Bab 4 · Operator, ekspresi, dan aplikasi mini',
      tasks: [
        {
          title: 'Praktikum terbimbing · Kalkulator belanja',
          explanation: 'Terapkan diskon 5% mulai Rp50.000, kemasan setelah diskon, ongkir tetap, dan tiga titik uji ambang.',
          programs: ['kasir_belanja'],
        },
        {
          title: 'Tantangan 1 · Biaya kemasan',
          explanation: 'Tambahkan Rp2.000 sekali per transaksi setelah diskon tanpa mengubah perhitungan diskon.',
          programs: ['kasir_belanja'],
        },
        {
          title: 'Tantangan 2 · Diskon khusus anggota',
          explanation: 'Gabungkan kondisi status anggota dan subtotal minimal Rp100.000 dengan and.',
          programs: ['kasir_belanja'],
        },
        {
          title: 'Tantangan 3 · Diskon bertingkat',
          explanation: 'Pilih satu tingkat diskon: 5% mulai Rp50.000 atau 10% mulai Rp100.000; jangan menumpuk.',
          programs: ['kasir_belanja'],
        },
        {
          title: 'Tantangan 4 · Bandingkan dasar diskon',
          explanation: 'Bandingkan diskon atas subtotal dengan diskon atas subtotal ditambah kemasan dan uji regresinya.',
          programs: ['kasir_belanja'],
        },
        {
          title: 'Tantangan 5 · Nilai akhir berbobot',
          explanation: 'Validasi nilai 0–100, hitung bobot 30/30/40, lalu bandingkan perubahan bobot 25/25/50 pada input yang sama.',
          programs: ['nilai_berbobot'],
        },
        {
          title: 'Tantangan 6 · Biaya kirim dan batas berat',
          explanation: 'Bulatkan berat gram ke atas per kilogram, tambahkan kemasan sekali, dan uji 1.000/1.001 gram.',
          programs: ['biaya_pengiriman'],
        },
        {
          title: 'Studi kasus mandiri · Kasir belanja',
          explanation: 'Lengkapi kontrak IPO, pseudocode, dry run, tiga titik ambang, penolakan, perubahan kebijakan, dan regresi.',
          programs: ['kasir_belanja'],
        },
      ],
    },
  ];

  const chapterFilter = document.querySelector('.solutions-section')?.dataset.chapterFilter;
  if (chapterFilter) {
    [...solutionSelect.querySelectorAll('optgroup')].forEach((group, index) => {
      group.hidden = String(index + 1) !== chapterFilter;
    });
    const firstOption = solutionSelect.querySelector(`optgroup:nth-of-type(${chapterFilter}) option`);
    if (firstOption) solutionSelect.value = firstOption.value;
  }

  function renderTaskCoverage() {
    taskCoverage.replaceChildren();
    assignmentCoverage
      .filter((_group, index) => !chapterFilter || String(index + 1) === chapterFilter)
      .forEach(({ chapter, tasks }) => {
      const group = document.createElement('section');
      group.className = 'task-coverage-group';
      const heading = document.createElement('h3');
      heading.textContent = chapter;
      const list = document.createElement('ol');
      list.className = 'task-coverage-list';

      tasks.forEach(({ title, explanation, programs }) => {
        const item = document.createElement('li');
        const copy = document.createElement('div');
        const taskTitle = document.createElement('strong');
        const taskExplanation = document.createElement('p');
        const actions = document.createElement('div');
        actions.className = 'task-coverage-actions';
        taskTitle.textContent = title;
        taskExplanation.textContent = explanation;
        copy.append(taskTitle, taskExplanation);

        programs.forEach((programId) => {
          const solution = solutions[programId];
          if (!solution) {
            throw new Error(`Program tugas tidak ditemukan: ${programId}`);
          }
          const button = document.createElement('button');
          button.className = 'task-code-link';
          button.type = 'button';
          button.textContent = `Lihat ${solution.file}`;
          button.addEventListener('click', () => {
            solutionSelect.value = programId;
            solutionSelect.dispatchEvent(new Event('change'));
            document.querySelector('.solution-code-card').scrollIntoView({
              behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
              block: 'center',
            });
          });
          actions.append(button);
        });

        item.append(copy, actions);
        list.append(item);
      });

      group.append(heading, list);
      taskCoverage.append(group);
      });
  }

  renderTaskCoverage();
  }

  document.querySelectorAll('.code-card').forEach((card) => {
    const code = card.querySelector('pre code');
    const header = card.querySelector('.code-card-header');
    if (!code || !header) return;
    if (!header.querySelector('.copy-code')) {
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-code';
      copyButton.type = 'button';
      copyButton.textContent = 'Salin kode';
      header.append(copyButton);
    }
    if (!header.querySelector('.lab-code-link')) {
      const sample = code.textContent.toLowerCase();
      const experiment = sample.includes('parkir') || sample.includes('biaya')
        ? 'parking'
        : sample.includes('luas') || sample.includes('keliling') ? 'geometry' : 'duration';
      const tryLink = document.createElement('a');
      tryLink.className = 'lab-code-link';
      tryLink.href = `lab/index.html?experiment=${experiment}#lab`;
      tryLink.textContent = 'Coba di Lab';
      header.append(tryLink);
    }
  });

  const visualizer = document.getElementById('visualizer-algorithm');
  if (visualizer) {
    const output = document.getElementById('visualizer-state');
    const next = document.getElementById('visualizer-next');
    const stepLabel = document.getElementById('visualizer-step');
    const examples = {
      swap: {
        title: 'Tukar nilai A dan B',
        steps: [
          'Awal: a = "merah", b = "biru", sementara belum terisi.',
          'sementara = a → sementara = "merah".',
          'a = b → a = "biru", b tetap "biru".',
          'b = sementara → a = "biru", b = "merah".',
        ],
      },
      duration: {
        title: '135 menit menjadi jam dan sisa',
        steps: [
          'Awal: menit = 135.',
          'jam = 135 // 60 → jam = 2.',
          'sisa = 135 % 60 → sisa = 15.',
          'Pemeriksaan balik: 2 × 60 + 15 = 135 menit.',
        ],
      },
      parking: {
        title: 'Tarif parkir selama 8 jam',
        steps: [
          'Awal: jam = 8; tarif pertama Rp3.000, tarif tambahan Rp2.000/jam.',
          'jam_tambahan = 8 − 1 → 7 jam.',
          'biaya_awal = 3.000 + 7 × 2.000 → Rp17.000.',
          'biaya_akhir = min(17.000, 15.000) → Rp15.000.',
        ],
      },
      geometry: {
        title: 'Persegi panjang 5 m × 3 m',
        steps: [
          'Awal: panjang = 5 m, lebar = 3 m.',
          'Validasi: kedua sisi lebih besar dari nol.',
          'luas = 5 × 3 → 15 m².',
          'keliling = 2 × (5 + 3) → 16 m.',
        ],
      },
    };
    let activeStep = 0;
    function renderVisualizer() {
      const example = examples[visualizer.value];
      output.querySelector('strong').textContent = example.title;
      output.querySelector('p').textContent = example.steps[activeStep];
      stepLabel.textContent = `Langkah ${activeStep + 1} dari ${example.steps.length}`;
      next.disabled = activeStep === example.steps.length - 1;
    }
    visualizer.addEventListener('change', () => {
      activeStep = 0;
      renderVisualizer();
    });
    next.addEventListener('click', () => {
      activeStep = Math.min(activeStep + 1, examples[visualizer.value].steps.length - 1);
      renderVisualizer();
    });
    document.getElementById('visualizer-reset').addEventListener('click', () => {
      activeStep = 0;
      renderVisualizer();
    });
    renderVisualizer();
  }

  const labExperiment = new URLSearchParams(location.search).get('experiment');
  const labOperation = document.getElementById('lab-operation');
  if (labOperation && ['duration', 'parking', 'geometry'].includes(labExperiment)) {
    labOperation.value = labExperiment;
    labOperation.dispatchEvent(new Event('change'));
  }

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

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(new URL('sw.js', document.baseURI)).catch((error) => {
        console.error('Pendaftaran mode offline gagal.', error);
      });
    }, { once: true });
  }
})();
