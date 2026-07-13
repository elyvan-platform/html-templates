/**
 * Atlântico FC — main.js
 * Vanilla JavaScript — no dependencies
 * Organizado em funções independentes e inicializadas no DOMContentLoaded
 */

(function () {
    'use strict';

    /* ─── INIT ─────────────────────────────────────────────── */

    document.addEventListener('DOMContentLoaded', function () {
        initMobileNavigation();
        initHeaderScroll();
        initMatchFilters();
        initSquadFilters();
        initNewsSearch();
        initNewsFilters();
        initTicketSelector();
        initAccordions();
        initForms();
        initNewsletter();
        initRevealAnimations();
        initLangSelector();
        markActivePage();
    });

    /* ─── MOBILE NAVIGATION ───────────────────────────────── */

    function initMobileNavigation() {
        var toggle = document.querySelector('.mobile-menu-toggle');
        var menu = document.querySelector('.mobile-menu');

        if (!toggle || !menu) return;

        toggle.addEventListener('click', function () {
            var isOpen = menu.classList.contains('is-open');

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close on overlay click
        menu.addEventListener('click', function (e) {
            if (e.target === menu) closeMenu();
        });

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('is-open')) {
                closeMenu();
                toggle.focus();
            }
        });

        function openMenu() {
            menu.classList.add('is-open');
            menu.removeAttribute('aria-hidden');
            toggle.setAttribute('aria-expanded', 'true');
            toggle.setAttribute('aria-label', 'Fechar menu');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            menu.classList.remove('is-open');
            menu.setAttribute('aria-hidden', 'true');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Abrir menu');
            document.body.style.overflow = '';
        }
    }

    /* ─── HEADER SCROLL ───────────────────────────────────── */

    function initHeaderScroll() {
        var header = document.getElementById('site-header');
        if (!header) return;

        var scrolled = false;
        var threshold = 60;

        function onScroll() {
            var shouldBeScrolled = window.scrollY > threshold;
            if (shouldBeScrolled !== scrolled) {
                scrolled = shouldBeScrolled;
                header.classList.toggle('is-scrolled', scrolled);
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // run once on load
    }

    /* ─── MARK ACTIVE PAGE ────────────────────────────────── */

    function markActivePage() {
        var currentPath = window.location.pathname.split('/').pop() || 'index.html';
        var navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

        navLinks.forEach(function (link) {
            var href = link.getAttribute('href') || '';
            var page = href.split('/').pop();
            if (page === currentPath) {
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    /* ─── MATCH FILTERS ───────────────────────────────────── */

    function initMatchFilters() {
        var tabsContainer = document.querySelector('[data-match-filters]');
        if (!tabsContainer) return;

        var tabs = tabsContainer.querySelectorAll('.filter-tab');
        var items = document.querySelectorAll('[data-match-filter]');

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                var filter = tab.dataset.filter || 'all';

                // Update active tab
                tabs.forEach(function (t) {
                    t.classList.remove('is-active');
                    t.setAttribute('aria-selected', 'false');
                });
                tab.classList.add('is-active');
                tab.setAttribute('aria-selected', 'true');

                // Show/hide items
                items.forEach(function (item) {
                    var itemFilter = item.dataset.matchFilter || '';
                    if (filter === 'all' || itemFilter === filter || itemFilter.indexOf(filter) !== -1) {
                        item.style.display = '';
                        item.removeAttribute('hidden');
                    } else {
                        item.setAttribute('hidden', '');
                        item.style.display = 'none';
                    }
                });

                announceResults(items, filter);
            });
        });
    }

    /* ─── SQUAD FILTERS ───────────────────────────────────── */

    function initSquadFilters() {
        var tabsContainer = document.querySelector('[data-squad-filters]');
        if (!tabsContainer) return;

        var tabs = tabsContainer.querySelectorAll('.filter-tab');
        var cards = document.querySelectorAll('[data-position]');

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                var filter = tab.dataset.filter || 'all';

                tabs.forEach(function (t) {
                    t.classList.remove('is-active');
                });
                tab.classList.add('is-active');

                cards.forEach(function (card) {
                    var pos = card.dataset.position || '';
                    if (filter === 'all' || pos === filter) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Show/hide section headings based on visible cards
                var sections = document.querySelectorAll('.squad-section');
                sections.forEach(function (section) {
                    var visible = section.querySelectorAll('[data-position]:not([style*="display: none"])');
                    section.style.display = visible.length > 0 ? '' : 'none';
                });
            });
        });
    }

    /* ─── NEWS SEARCH ─────────────────────────────────────── */

    function initNewsSearch() {
        var searchInput = document.querySelector('[data-news-search]');
        if (!searchInput) return;

        var cards = document.querySelectorAll('[data-news-item]');
        var noResults = document.querySelector('[data-news-no-results]');

        searchInput.addEventListener('input', debounce(function () {
            var query = searchInput.value.trim().toLowerCase();
            var visibleCount = 0;

            cards.forEach(function (card) {
                var title = (card.dataset.newsTitle || '').toLowerCase();
                var excerpt = (card.dataset.newsExcerpt || '').toLowerCase();
                var category = (card.dataset.newsCategory || '').toLowerCase();

                var matches = !query || title.indexOf(query) !== -1 ||
                    excerpt.indexOf(query) !== -1 || category.indexOf(query) !== -1;

                if (matches) {
                    card.style.display = '';
                    card.removeAttribute('hidden');
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                    card.setAttribute('hidden', '');
                }
            });

            if (noResults) {
                noResults.style.display = visibleCount === 0 ? '' : 'none';
            }
        }, 300));
    }

    /* ─── NEWS FILTERS ────────────────────────────────────── */

    function initNewsFilters() {
        var tabsContainer = document.querySelector('[data-news-filters]');
        if (!tabsContainer) return;

        var tabs = tabsContainer.querySelectorAll('.filter-tab');
        var cards = document.querySelectorAll('[data-news-item]');

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                var filter = tab.dataset.filter || 'all';

                tabs.forEach(function (t) { t.classList.remove('is-active'); });
                tab.classList.add('is-active');

                // Clear search
                var search = document.querySelector('[data-news-search]');
                if (search) search.value = '';

                cards.forEach(function (card) {
                    var category = (card.dataset.newsCategory || '').toLowerCase();
                    if (filter === 'all' || category === filter) {
                        card.style.display = '';
                        card.removeAttribute('hidden');
                    } else {
                        card.style.display = 'none';
                        card.setAttribute('hidden', '');
                    }
                });
            });
        });
    }

    /* ─── TICKET SECTOR SELECTOR ──────────────────────────── */

    function initTicketSelector() {
        var sectors = document.querySelectorAll('.stadium-sector');
        if (sectors.length === 0) return;

        var sectorData = {
            'bancada-mar': { name: 'Bancada Mar', price: '20', available: 1840, desc: 'Vista lateral sul, vista excelente para todo o campo.' },
            'bancada-cidade': { name: 'Bancada Cidade', price: '20', available: 1620, desc: 'Vista lateral norte, boa cobertura e acesso facilitado.' },
            'topo-norte': { name: 'Topo Norte', price: '14', available: 720, desc: 'Setor de ambiente, perto dos grupos de adeptos mais fervorosos.' },
            'topo-sul': { name: 'Topo Sul', price: '14', available: 480, desc: 'Setor de visita. Capacidade limitada.' },
            'zona-familia': { name: 'Zona Família', price: '12', available: 300, desc: 'Zona dedicada a famílias. Crianças até 10 anos: entrada gratuita.' },
            'area-premium': { name: 'Área Premium', price: '55', available: 85, desc: 'Lugares premium com catering, vista privilegiada e serviço VIP.' }
        };

        var soldOut = { 'topo-sul': true };

        // UI elements
        var sectorNameEl = document.getElementById('ticket-sector-name');
        var priceEl = document.getElementById('ticket-price');
        var availEl = document.getElementById('ticket-avail');
        var descEl = document.getElementById('ticket-desc');
        var buyBtn = document.getElementById('ticket-buy-btn');

        sectors.forEach(function (sector) {
            var key = sector.dataset.sector;

            if (soldOut[key]) {
                sector.classList.add('is-sold-out');
                sector.setAttribute('title', 'Esgotado');
            }

            sector.addEventListener('click', function () {
                if (soldOut[key]) return;

                // Update selected state
                sectors.forEach(function (s) { s.classList.remove('is-selected'); });
                sector.classList.add('is-selected');

                var data = sectorData[key];
                if (!data) return;

                if (sectorNameEl) sectorNameEl.textContent = data.name;
                if (priceEl) {
                    priceEl.innerHTML = data.price + '€ <span>/ lugar</span>';
                }
                if (availEl) {
                    availEl.textContent = data.available + ' lugares disponíveis';
                    availEl.className = 'ticket-info-box__avail ' + (data.available < 200 ? 'text-accent' : '');
                }
                if (descEl) descEl.textContent = data.desc;
                if (buyBtn) {
                    buyBtn.textContent = 'Comprar — ' + data.name;
                    buyBtn.disabled = false;
                }

                // Update prices in table
                updatePriceTable(key, data.price);
            });
        });

        // Simulate ticket purchase
        if (buyBtn) {
            buyBtn.addEventListener('click', function () {
                var original = buyBtn.textContent;
                buyBtn.textContent = 'A processar…';
                buyBtn.disabled = true;
                setTimeout(function () {
                    buyBtn.textContent = '✓ Adicionado ao carrinho';
                    setTimeout(function () {
                        buyBtn.textContent = original;
                        buyBtn.disabled = false;
                    }, 3000);
                }, 1200);
            });
        }
    }

    function updatePriceTable(sectorKey, basePrice) {
        var base = parseInt(basePrice, 10);
        var rows = {
            'adult': base,
            'youth': Math.round(base * 0.5),
            'senior': Math.round(base * 0.6),
            'member': Math.round(base * 0.7),
            'child': 0
        };

        Object.keys(rows).forEach(function (cat) {
            var el = document.querySelector('[data-price-cat="' + cat + '"]');
            if (el) el.textContent = rows[cat] === 0 ? 'Grátis' : rows[cat] + '€';
        });
    }

    /* ─── ACCORDIONS ──────────────────────────────────────── */

    function initAccordions() {
        var triggers = document.querySelectorAll('.accordion-trigger');

        triggers.forEach(function (trigger) {
            trigger.addEventListener('click', function () {
                var isOpen = trigger.getAttribute('aria-expanded') === 'true';
                var item = trigger.closest('.accordion-item');
                var panel = item ? item.querySelector('.accordion-panel') : null;

                // Optionally close others
                var accordion = trigger.closest('.accordion');
                if (accordion) {
                    accordion.querySelectorAll('.accordion-trigger').forEach(function (t) {
                        if (t !== trigger) {
                            t.setAttribute('aria-expanded', 'false');
                        }
                    });
                }

                trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
            });
        });
    }

    /* ─── FORMS ───────────────────────────────────────────── */

    function initForms() {
        var forms = document.querySelectorAll('[data-validate-form]');

        forms.forEach(function (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                var valid = validateForm(form);
                if (!valid) return;

                var successMsg = form.querySelector('.form-message--success');
                var errorMsg = form.querySelector('.form-message--error');
                var submitBtn = form.querySelector('[type="submit"]');

                if (submitBtn) {
                    var originalText = submitBtn.textContent;
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'A enviar…';

                    setTimeout(function () {
                        if (successMsg) {
                            successMsg.classList.add('is-visible');
                            successMsg.focus();
                        }
                        if (errorMsg) errorMsg.classList.remove('is-visible');
                        form.reset();
                        clearFieldErrors(form);

                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;

                        setTimeout(function () {
                            if (successMsg) successMsg.classList.remove('is-visible');
                        }, 6000);
                    }, 1200);
                }
            });

            // Real-time validation on blur
            var fields = form.querySelectorAll('input, textarea, select');
            fields.forEach(function (field) {
                field.addEventListener('blur', function () {
                    validateField(field);
                });
            });
        });
    }

    function validateForm(form) {
        var fields = form.querySelectorAll('[required]');
        var valid = true;

        fields.forEach(function (field) {
            if (!validateField(field)) valid = false;
        });

        return valid;
    }

    function validateField(field) {
        var errorEl = field.parentElement.querySelector('.form-error');
        var value = field.value.trim();
        var valid = true;
        var message = '';

        if (field.hasAttribute('required') && !value) {
            valid = false;
            message = 'Este campo é obrigatório.';
        } else if (field.type === 'email' && value && !isValidEmail(value)) {
            valid = false;
            message = 'Introduza um endereço de email válido.';
        } else if (field.type === 'tel' && value && !isValidPhone(value)) {
            valid = false;
            message = 'Introduza um número de telefone válido.';
        }

        field.classList.toggle('is-error', !valid);

        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = message ? '' : 'none';
        }

        return valid;
    }

    function clearFieldErrors(form) {
        form.querySelectorAll('.is-error').forEach(function (el) {
            el.classList.remove('is-error');
        });
        form.querySelectorAll('.form-error').forEach(function (el) {
            el.textContent = '';
            el.style.display = 'none';
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        return /^[\d\s\+\-\(\)]{9,}$/.test(phone);
    }

    /* ─── NEWSLETTER ──────────────────────────────────────── */

    function initNewsletter() {
        var forms = document.querySelectorAll('[data-newsletter-form]');

        forms.forEach(function (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                var emailInput = form.querySelector('[type="email"]');
                var consentInput = form.querySelector('[data-consent]');
                var btn = form.querySelector('[type="submit"]');
                var msg = form.querySelector('[data-newsletter-msg]');

                if (!emailInput) return;

                var emailVal = emailInput.value.trim();

                if (!isValidEmail(emailVal)) {
                    emailInput.classList.add('is-error');
                    emailInput.focus();
                    return;
                }

                if (consentInput && !consentInput.checked) {
                    var consentErr = form.querySelector('[data-consent-error]');
                    if (consentErr) {
                        consentErr.style.display = '';
                        consentErr.textContent = 'É necessário aceitar a política de privacidade.';
                    }
                    return;
                }

                if (btn) {
                    btn.disabled = true;
                    btn.textContent = 'A subscrever…';
                }

                setTimeout(function () {
                    if (msg) {
                        msg.style.display = '';
                        msg.textContent = 'Obrigado! A sua subscrição foi confirmada.';
                    }
                    form.reset();
                    if (btn) {
                        btn.disabled = false;
                        btn.textContent = 'Subscrever';
                    }
                }, 1000);
            });
        });
    }

    /* ─── REVEAL ANIMATIONS ───────────────────────────────── */

    function initRevealAnimations() {
        // Respect prefers-reduced-motion
        var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(function (el) {
                el.classList.add('is-visible');
            });
            return;
        }

        var elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
        if (elements.length === 0) return;

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

            elements.forEach(function (el) { observer.observe(el); });
        } else {
            // Fallback: show all immediately
            elements.forEach(function (el) { el.classList.add('is-visible'); });
        }
    }

    /* ─── LANGUAGE SELECTOR ───────────────────────────────── */

    function initLangSelector() {
        var langBtns = document.querySelectorAll('.lang-btn');

        langBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                langBtns.forEach(function (b) {
                    b.classList.remove('is-active');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('is-active');
                btn.setAttribute('aria-pressed', 'true');
                // Language switching would be handled by server/CMS in production
            });
        });
    }

    /* ─── UTILITIES ───────────────────────────────────────── */

    function debounce(fn, wait) {
        var timer;
        return function () {
            clearTimeout(timer);
            var args = arguments;
            var ctx = this;
            timer = setTimeout(function () { fn.apply(ctx, args); }, wait);
        };
    }

    function announceResults(items, filter) {
        var count = 0;
        items.forEach(function (item) {
            if (!item.hasAttribute('hidden')) count++;
        });

        var live = document.getElementById('a11y-announcer');
        if (!live) {
            live = document.createElement('div');
            live.id = 'a11y-announcer';
            live.setAttribute('role', 'status');
            live.setAttribute('aria-live', 'polite');
            live.className = 'visually-hidden';
            document.body.appendChild(live);
        }
        live.textContent = count + ' jogo' + (count !== 1 ? 's' : '') + ' encontrado' + (count !== 1 ? 's' : '');
    }

})();
