/* main.js - Interactive Controls & Progressive Enhancement */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar componentes
  initMobileMenu();
  initHeaderScroll();
  initScrollReveal();
  initProjectFilter();
  initFaqAccordion();
  initContactForm();
  initLazyLoading();
});

/* ==========================================================================
   1. MOBILE MENU
   ========================================================================== */
function initMobileMenu() {
  const btnMenuMobile = document.getElementById('btn-menu-mobile');
  const navMobileOverlay = document.getElementById('nav-mobile-overlay');
  
  if (!btnMenuMobile || !navMobileOverlay) return;
  
  const menuLinks = navMobileOverlay.querySelectorAll('a');
  
  function toggleMenu() {
    const isOpen = btnMenuMobile.classList.toggle('active');
    navMobileOverlay.classList.toggle('active');
    
    // Bloquear scroll no body quando o menu estiver aberto
    document.body.style.overflow = isOpen ? 'hidden' : '';
    
    // Atualizar acessibilidade
    btnMenuMobile.setAttribute('aria-expanded', isOpen);
  }
  
  btnMenuMobile.addEventListener('click', toggleMenu);
  
  // Fechar o menu ao clicar num link
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMobileOverlay.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
  
  // Fechar menu com a tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMobileOverlay.classList.contains('active')) {
      toggleMenu();
    }
  });
}

/* ==========================================================================
   2. HEADER SCROLL EFFECT
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;
  
  const scrollThreshold = 50;
  
  function checkScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  // Verificação inicial e no evento de scroll
  checkScroll();
  window.addEventListener('scroll', checkScroll, { passive: true });
}

/* ==========================================================================
   3. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const revealItems = document.querySelectorAll('.reveal-item');
  if (revealItems.length === 0) return;
  
  // Verificar preferência de movimento reduzido no SO do utilizador
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Revelar todos os elementos imediatamente se o utilizador preferir sem animação
    revealItems.forEach(item => item.classList.add('reveal-visible'));
    return;
  }
  
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px', // Aciona um pouco antes de entrar completamente
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target); // Deixar de observar após revelar
      }
    });
  }, observerOptions);
  
  revealItems.forEach(item => observer.observe(item));
}

/* ==========================================================================
   4. PORTFOLIO FILTER (PROJECTS)
   ========================================================================== */
function initProjectFilter() {
  const filterContainer = document.getElementById('portfolio-filters');
  const projectGrid = document.getElementById('portfolio-grid');
  
  if (!filterContainer || !projectGrid) return;
  
  const filterBtns = filterContainer.querySelectorAll('.filter-btn');
  const projectCards = projectGrid.querySelectorAll('.project-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remover classe ativa de todos os botões e adicionar no clicado
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        // Efeito de transição suave
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.classList.remove('filtered-out');
            
            // Reativar opacidade no próximo frame
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            });
          } else {
            card.classList.add('filtered-out');
          }
        }, 300); // Sincronizado com a velocidade do fade out
      });
    });
  });
}

/* ==========================================================================
   5. FAQ ACCORDION (SERVICE DETAILS)
   ========================================================================== */
function initFaqAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  if (accordionItems.length === 0) return;
  
  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');
    
    if (!trigger || !content) return;
    
    trigger.addEventListener('click', () => {
      const isAlreadyActive = item.classList.contains('active');
      
      // Fechar outros acordeões abertos
      accordionItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.accordion-trigger');
          const otherContent = otherItem.querySelector('.accordion-content');
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherContent.style.maxHeight = '0px';
          otherContent.style.paddingBottom = '0px';
        }
      });
      
      // Alternar o acordeão atual
      if (isAlreadyActive) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0px';
        content.style.paddingBottom = '0px';
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        // Definir max-height dinamicamente baseado na altura interna do conteúdo
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.paddingBottom = 'var(--space-s)';
      }
    });
  });
}

/* ==========================================================================
   6. CONTACT FORM VALIDATION & SUCCESS FEEDBACK
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successFeedback = document.getElementById('contact-success-feedback');
  
  if (!form || !successFeedback) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevenir envio padrão
    
    let isFormValid = true;
    
    // Obter campos
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const phoneInput = document.getElementById('contact-phone');
    const projectType = document.getElementById('contact-service');
    const budgetInput = document.getElementById('contact-budget');
    const messageInput = document.getElementById('contact-message');
    
    // Validar Nome
    if (!validateField(nameInput, nameInput.value.trim().length >= 3)) {
      isFormValid = false;
    }
    
    // Validar Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validateField(emailInput, emailRegex.test(emailInput.value.trim()))) {
      isFormValid = false;
    }
    
    // Validar Telemóvel (Regras de Portugal: 9 dígitos, começa com 9)
    const phoneRegex = /^(9[1236][0-9]{7})$/;
    const phoneValue = phoneInput.value.replace(/\s+/g, ''); // Remover espaços
    if (phoneValue.length > 0 && !validateField(phoneInput, phoneRegex.test(phoneValue))) {
      isFormValid = false;
    } else if (phoneValue.length === 0) {
      // O telemóvel é opcional, mas se preenchido tem de ser válido
      clearError(phoneInput);
    }
    
    // Validar Mensagem
    if (!validateField(messageInput, messageInput.value.trim().length >= 10)) {
      isFormValid = false;
    }
    
    if (isFormValid) {
      // Simular submissão bem-sucedida
      form.style.display = 'none';
      successFeedback.style.display = 'block';
      successFeedback.focus(); // Foco no sucesso para acessibilidade
      
      // Rolar a tela até o feedback de sucesso de forma suave
      successFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Resetar form
      form.reset();
    }
  });
  
  // Adicionar ouvintes para limpar erros ao digitar
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      if (input.classList.contains('has-error')) {
        clearError(input);
      }
    });
  });
  
  function validateField(inputElement, validationCondition) {
    if (!inputElement) return true;
    if (!validationCondition) {
      inputElement.classList.add('has-error');
      return false;
    } else {
      clearError(inputElement);
      return true;
    }
  }
  
  function clearError(inputElement) {
    inputElement.classList.remove('has-error');
  }
}

/* ==========================================================================
   7. PROGRESSIVE LAZY LOADING IMAGES
   ========================================================================== */
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          
          // Adiciona uma classe ao carregar a imagem para efeito de fade-in
          image.addEventListener('load', () => {
            image.classList.add('lazy-loaded');
          });
          
          // Se já carregou (pode estar na cache)
          if (image.complete) {
            image.classList.add('lazy-loaded');
          }
          
          imageObserver.unobserve(image);
        }
      });
    });
    
    lazyImages.forEach(image => imageObserver.observe(image));
  } else {
    // Fallback para browsers sem IntersectionObserver
    lazyImages.forEach(image => image.classList.add('lazy-loaded'));
  }
}
