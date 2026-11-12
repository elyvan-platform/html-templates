'use strict';
(() => {
  const O = window.Oportuna;
  const eur = new Intl.NumberFormat('pt-PT', {style:'currency', currency:'EUR', maximumFractionDigits:0});
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE = /^(\+351)?9[1236]\d{7}$/;
  const MAX_CV_BYTES = 5 * 1024 * 1024;
  const limits = {nameMin:3, motivationMin:80, motivationMax:800};

  const normalize = value => String(value || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

  function formatSalary(salary) {
    if (!salary) return 'Salário não indicado';
    if (salary.min === salary.max) return `${eur.format(salary.min)} / mês`;
    return `${eur.format(salary.min)} – ${eur.format(salary.max)} / mês`;
  }

  function formatDate(iso) {
    return new Date(`${iso}T12:00:00`).toLocaleDateString('pt-PT', {day:'numeric', month:'long', year:'numeric'});
  }

  // remote: 'all' | 'remote' (só remoto) | 'onsite' (presencial ou híbrido)
  // sort: 'recent' | 'salary'. Returns a new array; the source list is never mutated.
  function filterJobs({jobs = O.jobs, query = '', area = '', location = '', remote = 'all', saved = null, sort = 'recent'} = {}) {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    const list = jobs.filter(job => {
      const haystack = normalize([job.title, job.company, job.area, job.summary, ...job.skills].join(' '));
      if (!terms.every(term => haystack.includes(term))) return false;
      if (area && job.area !== area) return false;
      if (location && job.location !== location) return false;
      if (remote === 'remote' && job.modality !== 'Remoto') return false;
      if (remote === 'onsite' && job.modality === 'Remoto') return false;
      if (saved && !saved.includes(job.id)) return false;
      return true;
    });
    if (sort === 'salary') return list.sort((a, b) => (b.salary?.max ?? -1) - (a.salary?.max ?? -1));
    return list.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }

  // Returns {field: message}. An empty object means the simulated application is valid.
  function validateApplication(values) {
    const errors = {};
    const name = values.name.trim();
    const email = values.email.trim();
    const phone = values.phone.replace(/[\s-]/g, '');
    const motivation = values.motivation.trim();

    if (name.length < limits.nameMin) errors.name = 'Indique o seu nome completo, com pelo menos 3 caracteres.';
    if (!EMAIL.test(email)) errors.email = 'Indique um email válido, por exemplo nome@exemplo.pt.';
    if (phone && !PHONE.test(phone)) errors.phone = 'Indique um telemóvel português válido ou deixe o campo vazio.';
    if (!values.cv) errors.cv = 'Anexe o seu CV em formato PDF.';
    else if (!/\.pdf$/i.test(values.cv.name)) errors.cv = 'O CV tem de estar em formato PDF.';
    else if (values.cv.size > MAX_CV_BYTES) errors.cv = 'O ficheiro tem de ter até 5 MB.';
    if (motivation.length < limits.motivationMin) errors.motivation = `Escreva pelo menos ${limits.motivationMin} caracteres sobre a sua motivação.`;
    else if (motivation.length > limits.motivationMax) errors.motivation = `Reduza o texto para ${limits.motivationMax} caracteres.`;
    if (!values.consent) errors.consent = 'Confirme que compreende que esta candidatura é simulada e não é enviada.';
    return errors;
  }

  Object.assign(O, {filterJobs, validateApplication, formatSalary, formatDate, limits});
})();
