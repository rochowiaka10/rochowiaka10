const header = document.querySelector('[data-header]');
const galleryButtons = [...document.querySelectorAll('[data-full]')];
const extraImages = [...document.querySelectorAll('.gallery-item--extra')];
const galleryToggle = document.querySelector('[data-gallery-toggle]');
const lightbox = document.querySelector('[data-lightbox]');
const lightboxImage = document.querySelector('[data-lightbox-image]');
const lightboxCaption = document.querySelector('[data-lightbox-caption]');
const lightboxCount = document.querySelector('[data-lightbox-count]');
let activeImage = 0;
let touchStartX = 0;

const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 50);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

galleryToggle.addEventListener('click', () => {
  const expanded = galleryToggle.getAttribute('aria-expanded') === 'true';
  extraImages.forEach((item) => { item.hidden = expanded; });
  galleryToggle.setAttribute('aria-expanded', String(!expanded));
  galleryToggle.querySelector('span').textContent = expanded ? 'Pokaż wszystkie 30 zdjęć' : 'Pokaż mniej zdjęć';

  if (expanded) {
    document.querySelector('#galeria').scrollIntoView({ behavior: 'smooth' });
  }
});

const showImage = (index) => {
  activeImage = (index + galleryButtons.length) % galleryButtons.length;
  const button = galleryButtons[activeImage];
  const preview = button.querySelector('img');
  lightboxImage.src = button.dataset.full;
  lightboxImage.alt = preview.alt;
  lightboxCaption.textContent = preview.alt;
  lightboxCount.textContent = `${activeImage + 1} / ${galleryButtons.length}`;

  const nextIndex = (activeImage + 1) % galleryButtons.length;
  const preload = new Image();
  preload.src = galleryButtons[nextIndex].dataset.full;
};

const openLightbox = (index) => {
  showImage(index);
  lightbox.showModal();
  document.body.classList.add('lightbox-open');
};

const closeLightbox = () => {
  lightbox.close();
  document.body.classList.remove('lightbox-open');
};

galleryButtons.forEach((button, index) => button.addEventListener('click', () => openLightbox(index)));
document.querySelector('[data-lightbox-close]').addEventListener('click', closeLightbox);
document.querySelector('[data-lightbox-prev]').addEventListener('click', () => showImage(activeImage - 1));
document.querySelector('[data-lightbox-next]').addEventListener('click', () => showImage(activeImage + 1));

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

lightbox.addEventListener('close', () => document.body.classList.remove('lightbox-open'));
lightbox.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) > 55) showImage(activeImage + (distance < 0 ? 1 : -1));
}, { passive: true });

document.addEventListener('keydown', (event) => {
  if (!lightbox.open) return;
  if (event.key === 'ArrowLeft') showImage(activeImage - 1);
  if (event.key === 'ArrowRight') showImage(activeImage + 1);
});
