/* main.js - Vanilla JavaScript Interactivity */

document.addEventListener('DOMContentLoaded', () => {
  // Global Variables & Configuration
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize all features
  initHeaderScroll();
  initMobileMenu();
  initScrollReveal(isReducedMotion);
  initTestimonials();
  initFaqAccordion();
  initRoomFilters();
  initGalleryFilterAndLightbox();
  initContactForm();
  initBookingForm();
});

/* ==========================================================================
   1. HEADER SCROLL EFFECT
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Run on load in case page is refreshed halfway down
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* ==========================================================================
   2. MOBILE MENU (Accessible Off-Canvas)
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const closeBtn = document.querySelector('.mobile-menu-close');
  const menu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.mobile-menu-overlay');

  if (!menuBtn || !menu || !closeBtn || !overlay) return;

  const openMenu = () => {
    menu.classList.add('open');
    overlay.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    closeBtn.focus();
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const closeMenu = () => {
    menu.classList.remove('open');
    overlay.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.focus();
    document.body.style.overflow = ''; // Restore background scroll
  };

  menuBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  // Close menu on pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Focus trap inside mobile menu
  const focusableElements = menu.querySelectorAll('a, button');
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  menu.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  });
}

/* ==========================================================================
   3. SCROLL REVEAL (Intersection Observer)
   ========================================================================== */
function initScrollReveal(isReducedMotion) {
  if (isReducedMotion) return; // Skip if user prefers reduced motion

  const revealElements = document.querySelectorAll('.reveal, .reveal-fade');
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Animates only once
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    observer.observe(element);
  });
}

/* ==========================================================================
   4. TESTIMONIALS SLIDER (Manual & Accessible)
   ========================================================================== */
function initTestimonials() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');

  if (slides.length === 0 || !prevBtn || !nextBtn) return;

  let currentIndex = 0;

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      if (i === index) {
        slide.setAttribute('aria-hidden', 'false');
      } else {
        slide.setAttribute('aria-hidden', 'true');
      }
    });
  };

  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  };

  const prevSlide = () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  };

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  // Initialize first slide states
  showSlide(currentIndex);
}

/* ==========================================================================
   5. FAQ ACCORDION (Details-like behaviour)
   ========================================================================== */
function initFaqAccordion() {
  const triggers = document.querySelectorAll('.faq-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const content = item.querySelector('.faq-content');

      // Close other items
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq-content').style.maxHeight = null;
        }
      });

      // Toggle current item
      item.classList.toggle('open');
      trigger.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');

      if (item.classList.contains('open')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = null;
      }
    });
  });
}

/* ==========================================================================
   6. ROOMS LIST FILTERING (rooms.html)
   ========================================================================== */
function initRoomFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const roomCards = document.querySelectorAll('.room-list-card');

  if (filterButtons.length === 0 || roomCards.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active states
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      roomCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');

        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = '';
          // Simple visual fade in
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.4s ease';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. GALLERY FILTERS & ACCESSIBLE LIGHTBOX (gallery.html)
   ========================================================================== */
function initGalleryFilterAndLightbox() {
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-grid-item');

  // 7A. Filtering
  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            item.classList.remove('hide');
          } else {
            item.classList.add('hide');
          }
        });
      });
    });
  }

  // 7B. Lightbox
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  
  let currentGalleryIndex = 0;
  let activeGalleryItems = [];

  // Function to gather visible elements (handles filters correctly)
  const updateActiveGalleryItems = () => {
    const selector = galleryItems.length > 0 ? '.gallery-grid-item:not(.hide)' : '.detail-gallery-item';
    activeGalleryItems = Array.from(document.querySelectorAll(selector));
  };

  const showImage = (index) => {
    if (index < 0 || index >= activeGalleryItems.length) return;
    currentGalleryIndex = index;

    const item = activeGalleryItems[currentGalleryIndex];
    const img = item.querySelector('img');
    const title = img.getAttribute('alt') || 'Auréa Stay';

    lightboxImg.setAttribute('src', img.getAttribute('src'));
    lightboxImg.setAttribute('alt', title);
    lightboxCaption.textContent = title;
  };

  const openLightbox = (index) => {
    updateActiveGalleryItems();
    showImage(index);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    // Restore focus to original trigger item if available
    if (activeGalleryItems[currentGalleryIndex]) {
      activeGalleryItems[currentGalleryIndex].focus();
    }
  };

  const showNext = () => {
    updateActiveGalleryItems();
    let nextIndex = (currentGalleryIndex + 1) % activeGalleryItems.length;
    showImage(nextIndex);
  };

  const showPrev = () => {
    updateActiveGalleryItems();
    let prevIndex = (currentGalleryIndex - 1 + activeGalleryItems.length) % activeGalleryItems.length;
    showImage(prevIndex);
  };

  // Add click events to gallery items
  const bindGalleryClicks = () => {
    updateActiveGalleryItems();
    
    // Bind click events directly
    const triggerSelector = galleryItems.length > 0 ? '.gallery-grid-item' : '.detail-gallery-item';
    const triggers = document.querySelectorAll(triggerSelector);

    triggers.forEach((trigger, idx) => {
      // Set tabIndex to make it keyboard focusable
      trigger.setAttribute('tabindex', '0');
      
      const handleClick = (e) => {
        e.preventDefault();
        updateActiveGalleryItems();
        const currentVisibleIndex = activeGalleryItems.indexOf(trigger);
        if (currentVisibleIndex !== -1) {
          openLightbox(currentVisibleIndex);
        }
      };

      trigger.addEventListener('click', handleClick);
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      });
    });
  };

  bindGalleryClicks();

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showNext); // Next image
  nextBtn.addEventListener('click', showPrev); // Prev image

  // Lightbox click-out to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Lightbox Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNext();
    } else if (e.key === 'ArrowLeft') {
      showPrev();
    } else if (e.key === 'Tab') {
      // Simple focus trap inside lightbox
      const focusable = lightbox.querySelectorAll('button');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  });
}

/* ==========================================================================
   8. CONTACT FORM VALIDATION & SUBMISSION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successMsg = form.querySelector('.form-success-message');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // 1. Name validation
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('nameError');
    if (!nameInput.value.trim()) {
      showError(nameInput, nameError, 'Por favor, introduza o seu nome.');
      isValid = false;
    } else {
      hideError(nameInput, nameError);
    }

    // 2. Email validation
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      showError(emailInput, emailError, 'Por favor, introduza o seu email.');
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, emailError, 'Por favor, insira um email válido.');
      isValid = false;
    } else {
      hideError(emailInput, emailError);
    }

    // 3. Message validation
    const messageInput = document.getElementById('message');
    const messageError = document.getElementById('messageError');
    if (!messageInput.value.trim()) {
      showError(messageInput, messageError, 'Por favor, escreva a sua mensagem.');
      isValid = false;
    } else {
      hideError(messageInput, messageError);
    }

    if (isValid) {
      // Simulate successful submission
      form.style.opacity = '0.5';
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'A enviar...';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.reset();
        form.style.opacity = '1';
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        
        if (successMsg) {
          successMsg.style.display = 'block';
          successMsg.textContent = 'Mensagem enviada com sucesso! Entraremos em contacto brevemente.';
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          
          // Auto hide success message after 7 seconds
          setTimeout(() => {
            successMsg.style.display = 'none';
          }, 7000);
        }
      }, 1500);
    }
  });
}

/* ==========================================================================
   9. AVAILABILITY / BOOKING FORM (room-detail.html)
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const successMsg = form.querySelector('.form-success-message');
  
  // Set default check-in and check-out dates (today & tomorrow)
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');

  if (checkinInput && checkoutInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Format dates to YYYY-MM-DD
    const formatDate = (date) => {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    };

    checkinInput.setAttribute('min', formatDate(today));
    checkinInput.value = formatDate(today);
    
    checkoutInput.setAttribute('min', formatDate(tomorrow));
    checkoutInput.value = formatDate(tomorrow);

    // Dynamic adjustment of checkout minimum limit based on checkin value selection
    checkinInput.addEventListener('change', () => {
      const selectedCheckin = new Date(checkinInput.value);
      const minCheckout = new Date(selectedCheckin);
      minCheckout.setDate(minCheckout.getDate() + 1);
      checkoutInput.setAttribute('min', formatDate(minCheckout));
      
      if (new Date(checkoutInput.value) <= selectedCheckin) {
        checkoutInput.value = formatDate(minCheckout);
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    const guestsSelect = document.getElementById('guests');
    const checkinVal = new Date(checkinInput.value);
    const checkoutVal = new Date(checkoutInput.value);
    const dateError = document.getElementById('dateError');

    // Dates check logic
    if (isNaN(checkinVal.getTime()) || isNaN(checkoutVal.getTime())) {
      showError(checkoutInput, dateError, 'Por favor, selecione datas de entrada e saída válidas.');
      isValid = false;
    } else if (checkoutVal <= checkinVal) {
      showError(checkoutInput, dateError, 'A data de saída tem de ser posterior à data de entrada.');
      isValid = false;
    } else {
      hideError(checkoutInput, dateError);
    }

    if (isValid) {
      form.style.opacity = '0.5';
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'A verificar...';
      submitBtn.disabled = true;

      // Calculate simulated price
      const daysDiff = Math.ceil((checkoutVal - checkinVal) / (1000 * 60 * 60 * 24));
      // Base rate depending on room type (mock value based on page detail)
      const basePrice = parseInt(form.getAttribute('data-base-price')) || 320;
      const guests = parseInt(guestsSelect.value) || 2;
      const totalAmount = daysDiff * basePrice;

      setTimeout(() => {
        form.style.opacity = '1';
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        if (successMsg) {
          successMsg.style.display = 'block';
          successMsg.innerHTML = `
            <strong>Estadia Disponível!</strong><br>
            Período: ${daysDiff} noite${daysDiff > 1 ? 's' : ''}<br>
            Preço Estimado: €${totalAmount} (€${basePrice}/noite para ${guests} hóspede${guests > 1 ? 's' : ''})<br><br>
            <em>Foi enviado um pré-registo para o nosso sistema. Entraremos em contacto no seu email para confirmar a reserva.</em>
          `;
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 1500);
    }
  });
}

/* ==========================================================================
   FORM HELPERS
   ========================================================================== */
function showError(inputElement, errorElement, message) {
  if (inputElement) inputElement.style.borderColor = '#c0392b';
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
}

function hideError(inputElement, errorElement) {
  if (inputElement) inputElement.style.borderColor = '';
  if (errorElement) {
    errorElement.style.display = 'none';
  }
}
