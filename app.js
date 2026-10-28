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
    searchStatus.textContent = query ? `${matches} bagian materi ditemukan.` : '';
    if (query && matches === 0) searchStatus.textContent = 'Belum ada materi yang cocok.';
  });

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

  mobileMenu.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('is-open');
    mobileMenu.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-label', isOpen ? 'Tutup navigasi' : 'Buka navigasi');
  });
  sidebar.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      sidebar.classList.remove('is-open');
      mobileMenu.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', (event) => {
    if (!sidebar.classList.contains('is-open')) return;
    if (!sidebar.contains(event.target) && !mobileMenu.contains(event.target)) {
      sidebar.classList.remove('is-open');
      mobileMenu.setAttribute('aria-expanded', 'false');
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
