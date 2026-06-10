/* ============================================================
   SHAURYA NURSING HOME — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Loading Screen ---- */
  const loader = document.getElementById('loading-screen');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 1900);
  }

  /* ---- Scroll Progress ---- */
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (docH > 0 ? (scrollTop / docH) * 100 : 0) + '%';
  }

  /* ---- Navbar Scroll ---- */
  const navbar = document.querySelector('.navbar-main');
  function updateNavbar() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }

  /* ---- Back to Top ---- */
  const btt = document.getElementById('back-to-top');
  function updateBTT() {
    if (!btt) return;
    btt.classList.toggle('visible', window.scrollY > 400);
  }
  if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  window.addEventListener('scroll', () => {
    updateProgress();
    updateNavbar();
    updateBTT();
  }, { passive: true });

  // Initial call
  updateNavbar();

  /* ---- Active Nav Link ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  /* ---- Animated Counters ---- */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 16);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = '1';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

  /* ---- FAQ Accordion ---- */
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  /* ---- Gallery Lightbox ---- */
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lb-img');
  const lbCap    = document.getElementById('lb-caption');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let lbIndex = 0;

  function openLightbox(index) {
    if (!lightbox || !galleryItems[index]) return;
    lbIndex = index;
    const img = galleryItems[index].querySelector('img');
    lbImg.src = img.src;
    if (lbCap) lbCap.textContent = img.alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));

  const lbClose = document.querySelector('.lb-close');
  const lbPrev  = document.querySelector('.lb-prev');
  const lbNext  = document.querySelector('.lb-next');
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev)  lbPrev.addEventListener('click', () => openLightbox((lbIndex - 1 + galleryItems.length) % galleryItems.length));
  if (lbNext)  lbNext.addEventListener('click', () => openLightbox((lbIndex + 1) % galleryItems.length));
  if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft')  openLightbox((lbIndex - 1 + galleryItems.length) % galleryItems.length);
    if (e.key === 'ArrowRight') openLightbox((lbIndex + 1) % galleryItems.length);
  });

  /* ---- Staff Filter ---- */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.staff-item').forEach(item => {
        if (filter === 'all' || item.dataset.dept === filter) {
          item.style.display = '';
          setTimeout(() => item.style.opacity = '1', 10);
        } else {
          item.style.opacity = '0';
          setTimeout(() => item.style.display = 'none', 300);
        }
      });
    });
  });

  /* ---- Testimonials Auto Slider (Swiper) ---- */
  if (window.Swiper && document.querySelector('.testimonial-swiper')) {
    new Swiper('.testimonial-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: { delay: 4000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      breakpoints: {
        640:  { slidesPerView: 1 },
        768:  { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  }

  /* ---- Contact Form ---- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check me-2"></i>Message Sent!';
        btn.style.background = 'linear-gradient(135deg,#2ECC71,#27AE60)';
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.disabled = false;
          btn.style.background = '';
          contactForm.reset();
        }, 3000);
      }, 1800);
    });
  }

  /* ---- AOS init (if library loaded) ---- */
  if (window.AOS) AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });

  /* ---- Smooth page transition on nav click ---- */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('tel') || href.startsWith('mailto')) return;
    link.addEventListener('click', e => {
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.3s';
      setTimeout(() => { window.location.href = href; }, 280);
    });
  });
  // Fade in on load
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s';
  setTimeout(() => { document.body.style.opacity = '1'; }, 50);

});
