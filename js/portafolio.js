
  // ── Animated counter ──
  function animateCounter(el, target, suffix, duration = 1800) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { start = target; clearInterval(timer); }
      el.textContent = Math.floor(start) + suffix;
    }, 16);
  }

  // ── Intersection observer for stats ──
  let statsTriggered = false;
  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !statsTriggered) {
        statsTriggered = true;
        document.querySelectorAll('.stat-num[data-target]').forEach(el => {
          const target = parseInt(el.dataset.target);
          const suffix = el.dataset.suffix || '';
          animateCounter(el, target, suffix);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsEl = document.getElementById('stats');
  if (statsEl) statsObs.observe(statsEl);

  // ── Intersection observer for project cards ──
  const cardObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });

  document.querySelectorAll('.pcard').forEach(p => cardObs.observe(p));
