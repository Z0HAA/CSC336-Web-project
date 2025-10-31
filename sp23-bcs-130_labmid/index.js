// index.js
document.addEventListener('DOMContentLoaded', () => {

  // ===============================
  // Modal image 
  // ===============================
  document.querySelectorAll('.tattoo-item .bi-search').forEach(icon => {
    icon.addEventListener('click', function (e) {
      const img = e.currentTarget.closest('.tattoo-item').querySelector('img');
      if (img) {
        document.getElementById('modalImage').src = img.src;
      }
    });
  });

  // ===============================
  // Intro Section Animation
  // ===============================
  const slideTextElements = document.querySelectorAll('.slide-text');

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      } else {
        entry.target.classList.remove('animate'); // allows replay on scroll
      }
    });
  }, { threshold: 0.3 });

  slideTextElements.forEach(el => slideObserver.observe(el));

  // ===============================
  // Feature Icons Fade-in Animation
  // ===============================
  const featureIcons = document.querySelectorAll('.feature-icon i');
  const featureTitles = document.querySelectorAll('.feature-box h3');

  const featureObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.3 });

  featureIcons.forEach(el => featureObserver.observe(el));
  featureTitles.forEach(el => featureObserver.observe(el));

  
  // Carousel logo movement
  
  const carousel = document.querySelector('.carousel');
  const logo = document.querySelector('.carousel-logo');

  if (carousel && logo) {
    logo.style.transition = 'transform 0.6s ease-out';
    carousel.addEventListener('slide.bs.carousel', () => {
      const offsetX = Math.floor(Math.random() * 60 - 30); // -30 to +30 px
      const offsetY = Math.floor(Math.random() * 60 - 30); // -30 to +30 px
      logo.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
    });
  }

 
  // Customer Testimonials Carousel
  
  const track = document.querySelector('.testimonial-track');
  const testimonials = document.querySelectorAll('.testimonial-card');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');

  let index = 0;
  const total = testimonials.length;

  function showSlide(i) {
    index = (i + total) % total;
    const offset = -index * 100;
    track.style.transform = `translateX(${offset}%)`;

    testimonials.forEach((t, j) => {
      t.classList.toggle('active', j === index);
    });
  }

  // Button controls
  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => showSlide(index + 1));
    prevBtn.addEventListener('click', () => showSlide(index - 1));
  }

  // Auto-slide every 6 seconds
  let autoSlide = setInterval(() => {
    showSlide(index + 1);
  }, 3000);

  
  // View More / View Less functionality (FINAL FIX)
  
  const viewMoreBtn = document.getElementById('viewMoreBtn');
  const viewLessBtn = document.getElementById('viewLessBtn');
  const testimonialCarousel = document.querySelector('.testimonial-carousel');

  if (viewMoreBtn && track) {
    // Save original inline styles (so we can restore them exactly)
    const originalTrackStyles = {
      display: track.style.display,
      flexWrap: track.style.flexWrap,
      justifyContent: track.style.justifyContent,
      gap: track.style.gap,
      transition: track.style.transition,
      transform: track.style.transform
    };

    const originalCardStyles = Array.from(testimonials).map(card => ({
      flex: card.style.flex,
      maxWidth: card.style.maxWidth,
      margin: card.style.margin
    }));

    viewMoreBtn.addEventListener('click', () => {
      clearInterval(autoSlide); // Stop auto-slide

      // Expand to grid view
      track.style.transition = 'none';
      track.style.transform = 'none';
      track.style.display = 'flex';
      track.style.flexWrap = 'wrap';
      track.style.justifyContent = 'center';
      track.style.gap = '2rem';
      testimonialCarousel.style.overflow = 'visible';

      testimonials.forEach(card => {
        card.style.flex = '0 0 45%';
        card.style.maxWidth = '45%';
        card.style.margin = '1rem auto';
        card.classList.add('active');
      });

      viewMoreBtn.style.display = 'none';
      viewLessBtn.style.display = 'inline-block';
    });

    viewLessBtn.addEventListener('click', () => {
      // Restore original carousel layout
      Object.entries(originalTrackStyles).forEach(([prop, value]) => {
        track.style[prop] = value || '';
      });
      testimonialCarousel.style.overflow = 'hidden';

      testimonials.forEach((card, i) => {
        card.style.flex = originalCardStyles[i].flex || '';
        card.style.maxWidth = originalCardStyles[i].maxWidth || '';
        card.style.margin = originalCardStyles[i].margin || '';
      });

      showSlide(0); // reset to first slide

      // Restart auto-slide
      autoSlide = setInterval(() => {
        showSlide(index + 1);
      }, 6000);

      viewLessBtn.style.display = 'none';
      viewMoreBtn.style.display = 'inline-block';
    });
  }

});
