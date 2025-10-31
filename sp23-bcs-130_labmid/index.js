// index.js
document.addEventListener('DOMContentLoaded', () => {
  // Modal image 
  document.querySelectorAll('.tattoo-item .bi-search').forEach(icon => {
    icon.addEventListener('click', function (e) {
      const img = e.currentTarget.closest('.tattoo-item').querySelector('img');
      if (img) {
        document.getElementById('modalImage').src = img.src;
      }
    });
  });

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
  // 
  logo.style.transition = 'transform 0.6s ease-out';
   carousel.addEventListener('slide.bs.carousel', () => {
    // random offset in px
    const offsetX = Math.floor(Math.random() * 60 - 30); // -30 to +30 px
    const offsetY = Math.floor(Math.random() * 60 - 30); // -30 to +30 px
    logo.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
  });
}

// Customer Testimonials Carousel
// ===============================
const track = document.querySelector('.testimonial-track');
const testimonials = document.querySelectorAll('.testimonial-card');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

let index = 0;
const total = testimonials.length;

function showSlide(i) {
  index = (i + total) % total; // loop around
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

// Auto-slide every 6 seconds (pause when expanded)
let autoSlide = setInterval(() => {
  showSlide(index + 1);
}, 6000);

// View More / View Less functionality
const viewMoreBtn = document.getElementById('viewMoreBtn');
const viewLessBtn = document.getElementById('viewLessBtn');

if (viewMoreBtn && track) {
  viewMoreBtn.addEventListener('click', () => {
    // Stop auto-slide completely
    clearInterval(autoSlide);

    // Expand grid view
    track.style.transition = 'none';
    track.style.transform = 'translateX(0)';
    track.style.flexWrap = 'wrap';
    track.querySelectorAll('.testimonial-card').forEach(card => {
      card.style.flex = '0 0 45%';
      card.style.maxWidth = '45%';
      card.style.margin = '1rem auto';
    });

    // Toggle buttons
    viewMoreBtn.style.display = 'none';
    viewLessBtn.style.display = 'inline-block';
  });

  viewLessBtn.addEventListener('click', () => {
    // Restore carousel layout
    track.style.flexWrap = 'nowrap';
    track.style.gap = '1.5rem'; 
    track.querySelectorAll('.testimonial-card').forEach(card => {
      card.style.flex = '0 0 100%';
      card.style.maxWidth = '100%';
      card.style.margin = '0';
    });

    // Reset to first slide visually
    showSlide(0);

    // Restart auto-slide
    autoSlide = setInterval(() => {
      showSlide(index + 1);
    }, 6000);

    // Toggle buttons
    viewLessBtn.style.display = 'none';
    viewMoreBtn.style.display = 'inline-block';
  });
}

});
