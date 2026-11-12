const names = { silver: 'Prata crepúsculo', blue: 'Azul noite', warm: 'Bronze horizonte' };
const variantImage = document.querySelector('#variant-image');
document.querySelectorAll('[data-variant]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-variant]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  variantImage.dataset.variant = button.dataset.variant;
  document.querySelector('#variant-name').textContent = names[button.dataset.variant];
}));
const gallery = [
  { src: 'assets/coupe.jpg', alt: 'Vértice GT numa estrada costeira ao entardecer', title: 'VÉRTICE GT' },
  { src: 'assets/moto.jpg', alt: 'Ímpeto R em ambiente de estúdio escuro', title: 'ÍMPETO R' },
];
const dialog = document.querySelector('#gallery-dialog');
let current = 0;
function showImage(index) {
  current = (index + gallery.length) % gallery.length;
  const item = gallery[current];
  document.querySelector('#gallery-image').src = item.src;
  document.querySelector('#gallery-image').alt = item.alt;
  document.querySelector('#gallery-title').textContent = `GALERIA / ${item.title}`;
  document.querySelector('#gallery-count').textContent = `${String(current + 1).padStart(2, '0')} / ${String(gallery.length).padStart(2, '0')}`;
}
document.querySelectorAll('[data-gallery]').forEach(button => button.addEventListener('click', () => { showImage(Number(button.dataset.gallery)); dialog.showModal(); }));
document.querySelector('#gallery-close').addEventListener('click', () => dialog.close());
document.querySelector('#gallery-prev').addEventListener('click', () => showImage(current - 1));
document.querySelector('#gallery-next').addEventListener('click', () => showImage(current + 1));
dialog.addEventListener('keydown', event => { if (event.key === 'ArrowLeft') showImage(current - 1); if (event.key === 'ArrowRight') showImage(current + 1); });
document.querySelector('#contact-button').addEventListener('click', () => { document.querySelector('#contact-message').textContent = 'Obrigado pelo interesse. Este contacto é apenas demonstrativo; não foi enviada nenhuma mensagem.'; });
