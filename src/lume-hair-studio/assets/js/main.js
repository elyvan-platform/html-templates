/**
 * main.js — Lume Hair Studio
 * Vanilla JS — no dependencies
 */

'use strict';

/* ─── Inicialização ─────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initHeaderScroll();
  initServiceFilters();
  initTeamFilters();
  initGallery();
  initBeforeAfter();
  initBookingFlow();
  initJournalSearch();
  initAccordions();
  initForms();
  initRevealAnimations();
  initNewsletter();
  initCalendar();
  initStatsCounter();
  markCurrentPage();
});

/* ─── Navegação mobile ──────────────────────────────────────────────────── */

function initMobileNavigation() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.mobile-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('is-active');
    nav.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Fechar ao clicar em link
  nav.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('is-active');
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Fechar com Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      toggle.classList.remove('is-active');
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      toggle.focus();
    }
  });
}

/* ─── Header scroll ─────────────────────────────────────────────────────── */

function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let lastScroll = 0;

  function onScroll() {
    const current = window.scrollY;
    header.classList.toggle('is-scrolled', current > 60);
    lastScroll = current;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─── Marcar página ativa ───────────────────────────────────────────────── */

function markCurrentPage() {
  const current = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('[data-nav-link]').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    if (href === current) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

/* ─── Filtros de serviços ───────────────────────────────────────────────── */

function initServiceFilters() {
  const bars = document.querySelectorAll('[data-filter-group="services"]');
  if (!bars.length) return;

  bars.forEach(bar => {
    const btns = bar.querySelectorAll('.filter-btn');
    const targetId = bar.dataset.target;
    const items = targetId
      ? document.querySelectorAll(`#${targetId} [data-category]`)
      : document.querySelectorAll('[data-service-category]');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const cat = btn.dataset.filter;

        items.forEach(item => {
          const itemCat = item.dataset.category || item.dataset.serviceCategory;
          const show = cat === 'all' || itemCat === cat;
          item.style.display = show ? '' : 'none';
          item.setAttribute('aria-hidden', String(!show));
        });
      });
    });
  });
}

/* ─── Filtros da equipa ─────────────────────────────────────────────────── */

function initTeamFilters() {
  const bar = document.querySelector('[data-filter-group="team"]');
  if (!bar) return;

  const btns = bar.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('[data-team-specialty]');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;

      items.forEach(item => {
        const specs = item.dataset.teamSpecialty.split(',').map(s => s.trim());
        const show = filter === 'all' || specs.includes(filter);
        item.style.display = show ? '' : 'none';
      });
    });
  });
}

/* ─── Galeria e lightbox ────────────────────────────────────────────────── */

function initGallery() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  const closeBtn = lightbox.querySelector('.lightbox__close');
  const prevBtn = lightbox.querySelector('.lightbox__prev');
  const nextBtn = lightbox.querySelector('.lightbox__next');
  const img = lightbox.querySelector('.lightbox__content img');
  const caption = lightbox.querySelector('.lightbox__caption');

  let items = [];
  let current = 0;
  let lastFocus = null;

  // Filtros da galeria
  const filterBar = document.querySelector('[data-filter-group="gallery"]');
  if (filterBar) {
    const btns = filterBar.querySelectorAll('.filter-btn');
    const allItems = document.querySelectorAll('.gallery-item');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const cat = btn.dataset.filter;

        allItems.forEach(item => {
          const show = cat === 'all' || item.dataset.category === cat;
          item.style.display = show ? '' : 'none';
        });

        buildItemsArray();
      });
    });
  }

  function buildItemsArray() {
    items = Array.from(document.querySelectorAll('.gallery-item:not([style*="display: none"])'));
  }

  buildItemsArray();

  function openLightbox(index) {
    lastFocus = document.activeElement;
    current = index;
    updateLightbox();
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lightbox.querySelector('img')) {
      lightbox.querySelector('img').src = '';
    }
    if (lastFocus) lastFocus.focus();
  }

  function updateLightbox() {
    const item = items[current];
    if (!item) return;
    const src = item.querySelector('img')?.src || '';
    const alt = item.querySelector('img')?.alt || '';
    const cap = item.querySelector('.gallery-item__title')?.textContent || alt;

    if (img) {
      img.src = src;
      img.alt = alt;
    }
    if (caption) caption.textContent = cap;
  }

  // Abrir ao clicar
  document.querySelectorAll('.gallery-item').forEach((item, idx) => {
    item.addEventListener('click', () => {
      buildItemsArray();
      const realIdx = items.indexOf(item);
      openLightbox(realIdx >= 0 ? realIdx : 0);
    });

    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  if (prevBtn) prevBtn.addEventListener('click', () => {
    current = (current - 1 + items.length) % items.length;
    updateLightbox();
  });

  if (nextBtn) nextBtn.addEventListener('click', () => {
    current = (current + 1) % items.length;
    updateLightbox();
  });

  // Clicar fora para fechar
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Teclas
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
  });
}

/* ─── Before/After Slider ───────────────────────────────────────────────── */

function initBeforeAfter() {
  document.querySelectorAll('.before-after').forEach(widget => {
    const after = widget.querySelector('.before-after__after');
    const divider = widget.querySelector('.before-after__divider');
    const handle = widget.querySelector('.before-after__handle');
    if (!after) return;

    let dragging = false;

    function setPosition(pct) {
      const clamped = Math.max(5, Math.min(95, pct));
      after.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
      if (divider) divider.style.left = `${clamped}%`;
      if (handle) handle.style.left = `${clamped}%`;
    }

    function getPercent(clientX) {
      const rect = widget.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    setPosition(50);

    widget.addEventListener('mousedown', e => {
      dragging = true;
      e.preventDefault();
    });

    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      setPosition(getPercent(e.clientX));
    });

    window.addEventListener('mouseup', () => { dragging = false; });

    widget.addEventListener('touchstart', e => {
      dragging = true;
    }, { passive: true });

    window.addEventListener('touchmove', e => {
      if (!dragging) return;
      setPosition(getPercent(e.touches[0].clientX));
    }, { passive: true });

    window.addEventListener('touchend', () => { dragging = false; });

    // Teclado
    if (handle) {
      handle.setAttribute('tabindex', '0');
      handle.setAttribute('role', 'slider');
      handle.setAttribute('aria-valuemin', '0');
      handle.setAttribute('aria-valuemax', '100');
      handle.setAttribute('aria-valuenow', '50');

      handle.addEventListener('keydown', e => {
        const current = parseFloat(handle.style.left) || 50;
        if (e.key === 'ArrowLeft') setPosition(current - 5);
        if (e.key === 'ArrowRight') setPosition(current + 5);
      });
    }
  });
}

/* ─── Fluxo de marcação ─────────────────────────────────────────────────── */

const BOOKING_KEY = 'lume_booking_draft';

function initBookingFlow() {
  const flow = document.querySelector('.booking-flow');
  if (!flow) return;

  const steps = flow.querySelectorAll('.booking-step-indicator');
  const panels = flow.querySelectorAll('.booking-panel');
  const successEl = document.querySelector('.booking-success');

  let state = loadBookingState();

  function loadBookingState() {
    try {
      const raw = sessionStorage.getItem(BOOKING_KEY);
      return raw ? JSON.parse(raw) : { step: 1 };
    } catch {
      return { step: 1 };
    }
  }

  function saveBookingState() {
    try {
      sessionStorage.setItem(BOOKING_KEY, JSON.stringify(state));
    } catch {}
  }

  function goToStep(n) {
    state.step = n;
    saveBookingState();

    steps.forEach((s, i) => {
      s.classList.remove('is-active', 'is-done');
      if (i + 1 === n) s.classList.add('is-active');
      if (i + 1 < n) s.classList.add('is-done');
    });

    panels.forEach((p, i) => {
      p.classList.toggle('is-active', i + 1 === n);
    });

    updateSummary();
  }

  // Selecionar serviço
  flow.querySelectorAll('.booking-option[data-type="service"]').forEach(opt => {
    if (state.service === opt.dataset.value) opt.classList.add('is-selected');

    opt.addEventListener('click', () => {
      flow.querySelectorAll('.booking-option[data-type="service"]').forEach(o => o.classList.remove('is-selected'));
      opt.classList.add('is-selected');
      state.service = opt.dataset.value;
      state.serviceLabel = opt.querySelector('.booking-option__name')?.textContent;
      state.price = opt.querySelector('.booking-option__price')?.textContent;
      state.duration = opt.querySelector('.booking-option__detail')?.textContent;
      saveBookingState();
    });
  });

  // Selecionar profissional
  flow.querySelectorAll('.booking-option[data-type="stylist"]').forEach(opt => {
    if (state.stylist === opt.dataset.value) opt.classList.add('is-selected');

    opt.addEventListener('click', () => {
      flow.querySelectorAll('.booking-option[data-type="stylist"]').forEach(o => o.classList.remove('is-selected'));
      opt.classList.add('is-selected');
      state.stylist = opt.dataset.value;
      state.stylistLabel = opt.querySelector('.booking-option__name')?.textContent;
      saveBookingState();
    });
  });

  // Selecionar hora
  flow.querySelectorAll('.time-slot:not(.is-unavailable)').forEach(slot => {
    if (state.time === slot.dataset.time) slot.classList.add('is-selected');

    slot.addEventListener('click', () => {
      flow.querySelectorAll('.time-slot').forEach(s => s.classList.remove('is-selected'));
      slot.classList.add('is-selected');
      state.time = slot.dataset.time;
      saveBookingState();
    });
  });

  // Botões avançar
  flow.querySelectorAll('[data-booking-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      const fromStep = parseInt(btn.dataset.bookingNext);
      if (!validateStep(fromStep)) return;
      goToStep(fromStep + 1);
    });
  });

  // Botões recuar
  flow.querySelectorAll('[data-booking-back]').forEach(btn => {
    btn.addEventListener('click', () => {
      const toStep = parseInt(btn.dataset.bookingBack);
      goToStep(toStep);
    });
  });

  // Submeter
  const submitBtn = flow.querySelector('[data-booking-submit]');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      if (!validateStep(5)) return;
      collectPersonalData();

      // Simular submissão
      submitBtn.disabled = true;
      submitBtn.textContent = 'A processar…';

      setTimeout(() => {
        flow.style.display = 'none';
        if (successEl) {
          successEl.classList.add('is-visible');
          fillSuccessMessage();
        }
        sessionStorage.removeItem(BOOKING_KEY);
      }, 1200);
    });
  }

  function collectPersonalData() {
    const panel = flow.querySelector('[data-panel="5"]');
    if (!panel) return;
    state.name = panel.querySelector('[name="name"]')?.value || '';
    state.email = panel.querySelector('[name="email"]')?.value || '';
    state.phone = panel.querySelector('[name="phone"]')?.value || '';
    state.notes = panel.querySelector('[name="notes"]')?.value || '';
  }

  function fillSuccessMessage() {
    const detail = successEl?.querySelector('.booking-success__detail');
    if (!detail) return;
    detail.innerHTML = `
      <strong>${state.serviceLabel || 'Serviço'}</strong> com <strong>${state.stylistLabel || 'profissional'}</strong><br>
      ${state.selectedDate || ''} às <strong>${state.time || ''}</strong>
    `;
  }

  function validateStep(step) {
    if (step === 1) {
      if (!state.service) {
        showStepError(1, 'Por favor escolha um serviço.');
        return false;
      }
    }
    if (step === 2) {
      if (!state.stylist) {
        showStepError(2, 'Por favor escolha um profissional.');
        return false;
      }
    }
    if (step === 3) {
      if (!state.selectedDate) {
        showStepError(3, 'Por favor escolha uma data.');
        return false;
      }
    }
    if (step === 4) {
      if (!state.time) {
        showStepError(4, 'Por favor escolha uma hora.');
        return false;
      }
    }
    if (step === 5) {
      return validatePersonalForm();
    }
    return true;
  }

  function validatePersonalForm() {
    const panel = flow.querySelector('[data-panel="5"]');
    if (!panel) return true;
    let valid = true;

    const name = panel.querySelector('[name="name"]');
    const email = panel.querySelector('[name="email"]');
    const phone = panel.querySelector('[name="phone"]');
    const consent = panel.querySelector('[name="consent"]');

    if (name && !name.value.trim()) {
      showFieldError(name, 'O nome é obrigatório.');
      valid = false;
    }
    if (email && !isValidEmail(email.value)) {
      showFieldError(email, 'Insira um email válido.');
      valid = false;
    }
    if (phone && !isValidPhone(phone.value)) {
      showFieldError(phone, 'Insira um número de telefone válido.');
      valid = false;
    }
    if (consent && !consent.checked) {
      showFieldError(consent, 'Deve aceitar a política de cancelamento.');
      valid = false;
    }

    return valid;
  }

  function showStepError(step, msg) {
    const panel = flow.querySelector(`[data-panel="${step}"]`);
    if (!panel) return;
    let err = panel.querySelector('.step-error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'step-error';
      err.style.cssText = 'color:#C0392B;font-size:0.875rem;margin-bottom:1rem;';
      panel.querySelector('.booking-panel-title')?.after(err);
    }
    err.textContent = msg;
    err.setAttribute('role', 'alert');
    setTimeout(() => { err.textContent = ''; }, 4000);
  }

  function showFieldError(field, msg) {
    field.classList.add('is-error');
    const group = field.closest('.form-group');
    if (!group) return;
    let err = group.querySelector('.form-error');
    if (err) {
      err.textContent = msg;
      err.classList.add('is-visible');
    }
    field.addEventListener('input', () => {
      field.classList.remove('is-error');
      if (err) err.classList.remove('is-visible');
    }, { once: true });
  }

  function updateSummary() {
    const summary = document.querySelector('.booking-summary');
    if (!summary) return;

    const set = (sel, val) => {
      const el = summary.querySelector(sel);
      if (el) el.textContent = val || '—';
    };

    set('[data-summary="service"]', state.serviceLabel);
    set('[data-summary="stylist"]', state.stylistLabel);
    set('[data-summary="date"]', state.selectedDate);
    set('[data-summary="time"]', state.time);
    set('[data-summary="price"]', state.price);
    set('[data-summary="duration"]', state.duration);
  }

  // Iniciar no passo guardado
  goToStep(state.step || 1);
}

/* ─── Calendário de marcação ────────────────────────────────────────────── */

function initCalendar() {
  const cal = document.querySelector('.booking-calendar');
  if (!cal) return;

  const titleEl = cal.querySelector('.cal-title');
  const grid = cal.querySelector('.cal-grid');
  const prevBtn = cal.querySelector('.cal-prev');
  const nextBtn = cal.querySelector('.cal-next');

  let state;
  try {
    const raw = sessionStorage.getItem(BOOKING_KEY);
    state = raw ? JSON.parse(raw) : {};
  } catch { state = {}; }

  const today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();

  const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

  function render() {
    if (titleEl) titleEl.textContent = `${months[viewMonth]} ${viewYear}`;
    if (!grid) return;

    const dayNames = grid.querySelectorAll('.cal-day-name');
    if (!dayNames.length) {
      ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].forEach(d => {
        const el = document.createElement('div');
        el.className = 'cal-day-name';
        el.textContent = d;
        grid.appendChild(el);
      });
    }

    // Remover dias anteriores
    grid.querySelectorAll('.cal-day').forEach(d => d.remove());

    const first = new Date(viewYear, viewMonth, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    // Células vazias
    for (let i = 0; i < startDay; i++) {
      const el = document.createElement('button');
      el.className = 'cal-day is-empty';
      el.disabled = true;
      el.setAttribute('aria-hidden', 'true');
      grid.appendChild(el);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewYear, viewMonth, d);
      const el = document.createElement('button');
      el.className = 'cal-day';
      el.textContent = d;

      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isSunday = date.getDay() === 0;
      const isToday = date.toDateString() === today.toDateString();
      const dateStr = `${d} de ${months[viewMonth]} de ${viewYear}`;
      const isSelected = state.selectedDate === dateStr;

      if (isPast || isSunday) {
        el.classList.add('is-past');
        el.disabled = true;
      }
      if (isToday) el.classList.add('is-today');
      if (isSelected) el.classList.add('is-selected');

      el.setAttribute('aria-label', `${d} de ${months[viewMonth]}`);

      el.addEventListener('click', () => {
        grid.querySelectorAll('.cal-day').forEach(c => c.classList.remove('is-selected'));
        el.classList.add('is-selected');

        try {
          const raw = sessionStorage.getItem(BOOKING_KEY);
          const s = raw ? JSON.parse(raw) : {};
          s.selectedDate = dateStr;
          sessionStorage.setItem(BOOKING_KEY, JSON.stringify(s));
          // Update summary
          const sumDate = document.querySelector('[data-summary="date"]');
          if (sumDate) sumDate.textContent = dateStr;
        } catch {}
      });

      grid.appendChild(el);
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      viewMonth--;
      if (viewMonth < 0) { viewMonth = 11; viewYear--; }
      render();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      viewMonth++;
      if (viewMonth > 11) { viewMonth = 0; viewYear++; }
      render();
    });
  }

  render();
}

/* ─── Pesquisa do journal ────────────────────────────────────────────────── */

function initJournalSearch() {
  const form = document.querySelector('.journal-search-form');
  const input = document.querySelector('.journal-search-input');
  if (!input) return;

  const cards = document.querySelectorAll('.journal-card[data-title]');
  const noResults = document.querySelector('.journal-no-results');

  function doSearch(query) {
    const q = query.toLowerCase().trim();
    let visible = 0;

    cards.forEach(card => {
      const title = (card.dataset.title || '').toLowerCase();
      const excerpt = (card.dataset.excerpt || '').toLowerCase();
      const cat = (card.dataset.category || '').toLowerCase();
      const show = !q || title.includes(q) || excerpt.includes(q) || cat.includes(q);
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
  }

  input.addEventListener('input', () => doSearch(input.value));

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      doSearch(input.value);
    });
  }

  // Filtros de categoria do journal
  document.querySelectorAll('.journal-category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.journal-category-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const cat = btn.dataset.category;

      cards.forEach(card => {
        const show = cat === 'all' || card.dataset.category === cat;
        card.style.display = show ? '' : 'none';
      });

      if (noResults) {
        const visible = Array.from(cards).filter(c => c.style.display !== 'none').length;
        noResults.style.display = visible === 0 ? 'block' : 'none';
      }
    });
  });
}

/* ─── Accordions / FAQ ───────────────────────────────────────────────────── */

function initAccordions() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item?.querySelector('.faq-answer');
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Fechar todos (comportamento accordion)
      document.querySelectorAll('.faq-question').forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const otherAnswer = other.closest('.faq-item')?.querySelector('.faq-answer');
          if (otherAnswer) {
            otherAnswer.setAttribute('aria-hidden', 'true');
            otherAnswer.style.gridTemplateRows = '0fr';
          }
        }
      });

      btn.setAttribute('aria-expanded', String(!isOpen));
      if (answer) {
        answer.setAttribute('aria-hidden', String(isOpen));
        answer.style.gridTemplateRows = isOpen ? '0fr' : '1fr';
      }
    });
  });
}

/* ─── Formulários ────────────────────────────────────────────────────────── */

function initForms() {
  document.querySelectorAll('form[data-validate]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (validateForm(form)) {
        simulateSubmit(form);
      }
    });
  });

  // Limpar erros ao digitar
  document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('is-error');
      const group = field.closest('.form-group');
      if (group) {
        const err = group.querySelector('.form-error');
        if (err) err.classList.remove('is-visible');
      }
    });
  });
}

function validateForm(form) {
  let valid = true;

  form.querySelectorAll('[required]').forEach(field => {
    const group = field.closest('.form-group');
    const err = group?.querySelector('.form-error');

    if (field.type === 'checkbox' && !field.checked) {
      field.classList.add('is-error');
      if (err) { err.textContent = 'Este campo é obrigatório.'; err.classList.add('is-visible'); }
      valid = false;
    } else if (field.type !== 'checkbox' && !field.value.trim()) {
      field.classList.add('is-error');
      if (err) { err.textContent = 'Este campo é obrigatório.'; err.classList.add('is-visible'); }
      valid = false;
    } else if (field.type === 'email' && !isValidEmail(field.value)) {
      field.classList.add('is-error');
      if (err) { err.textContent = 'Insira um email válido.'; err.classList.add('is-visible'); }
      valid = false;
    } else if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
      field.classList.add('is-error');
      if (err) { err.textContent = 'Insira um número válido.'; err.classList.add('is-visible'); }
      valid = false;
    }
  });

  return valid;
}

function simulateSubmit(form) {
  const btn = form.querySelector('[type="submit"]');
  const original = btn?.textContent;
  if (btn) { btn.disabled = true; btn.textContent = 'A enviar…'; }

  setTimeout(() => {
    const success = form.querySelector('.form-success');
    if (success) success.classList.add('is-visible');
    form.querySelectorAll('input, select, textarea').forEach(f => {
      if (f.type !== 'submit') f.value = '';
    });
    if (btn) { btn.disabled = false; btn.textContent = original; }

    // Anunciar via aria-live
    success?.setAttribute('role', 'alert');
  }, 900);
}

/* ─── Newsletter ─────────────────────────────────────────────────────────── */

function initNewsletter() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (!input || !isValidEmail(input.value)) {
        input?.classList.add('is-error');
        return;
      }
      input.classList.remove('is-error');

      const btn = form.querySelector('button');
      const originalText = btn?.textContent;
      if (btn) { btn.disabled = true; btn.textContent = '✓ Subscrito'; }

      input.value = '';

      const msg = form.nextElementSibling;
      if (msg?.classList.contains('newsletter-success')) {
        msg.classList.add('is-visible');
        msg.setAttribute('role', 'status');
      }

      setTimeout(() => {
        if (btn) { btn.disabled = false; btn.textContent = originalText; }
      }, 4000);
    });
  });
}

/* ─── Animações de entrada ──────────────────────────────────────────────── */

function initRevealAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -3% 0px' });

  els.forEach(el => observer.observe(el));
}

/* ─── Contador de estatísticas ──────────────────────────────────────────── */

function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-block__number[data-count]');
  if (!stats.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1500;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * end) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
}

/* ─── Utilitários ────────────────────────────────────────────────────────── */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone) {
  return /^[\d\s\+\-\(\)]{9,}$/.test(phone.trim());
}
