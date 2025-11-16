(function() {
  const deck = document.getElementById('deck');
  const slides = Array.from(deck.querySelectorAll('.slide'));
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  const counter = document.getElementById('counter');
  const progressBar = document.getElementById('progressBar');
  const printBtn = document.getElementById('printBtn');
  const helpModal = document.getElementById('helpModal');
  const closeHelp = document.getElementById('closeHelp');

  let index = 0;

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function readIndexFromHash() {
    const hash = window.location.hash.replace('#', '').trim();
    const n = parseInt(hash, 10);
    if (!isNaN(n) && n >= 1 && n <= slides.length) {
      return n - 1;
    }
    return 0;
  }

  function updateHash(i) {
    const n = i + 1;
    history.replaceState(null, '', '#' + String(n));
  }

  function updateView() {
    slides.forEach((s, i) => {
      s.style.display = (i === index) ? 'block' : 'none';
    });
    counter.textContent = `${index + 1} / ${slides.length}`;
    const pct = ((index + 1) / slides.length) * 100;
    progressBar.style.width = pct + '%';
    updateHash(index);
    deck.focus();
  }

  function next() {
    index = clamp(index + 1, 0, slides.length - 1);
    updateView();
  }

  function prev() {
    index = clamp(index - 1, 0, slides.length - 1);
    updateView();
  }

  function first() { index = 0; updateView(); }
  function last() { index = slides.length - 1; updateView(); }

  function onKey(e) {
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
        next();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        prev();
        break;
      case 'Home':
        first();
        break;
      case 'End':
        last();
        break;
      case 'p':
      case 'P':
        window.print();
        break;
      case '?':
        toggleHelp(true);
        break;
      case 'Escape':
        toggleHelp(false);
        break;
    }
  }

  function toggleHelp(show) {
    helpModal.setAttribute('aria-hidden', show ? 'false' : 'true');
  }

  function init() {
    index = readIndexFromHash();
    updateView();
    window.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', () => { index = readIndexFromHash(); updateView(); });
    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);
    printBtn.addEventListener('click', () => window.print());
    closeHelp.addEventListener('click', () => toggleHelp(false));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
