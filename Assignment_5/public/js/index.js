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

// ============================================
// TESTIMONIAL SLIDER + VIEW MORE / VIEW LESS
// ============================================

const track = document.querySelector('.testimonial-track');
const cards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const viewMoreBtn = document.getElementById('viewMoreBtn');
const viewLessBtn = document.getElementById('viewLessBtn');

let index = 0;
let cardWidth = cards[0]?.offsetWidth || 300;
let visibleCards = window.innerWidth < 768 ? 1 : 2; // responsive
let autoSlide;

// Adjust card size on resize
window.addEventListener('resize', () => {
  cardWidth = cards[0].offsetWidth;
  visibleCards = window.innerWidth < 768 ? 1 : 2;
  updateSlider();
});

// Update slider position
function updateSlider() {
  const offset = -(index * cardWidth);
  track.style.transform = `translateX(${offset}px)`;
}

// Next slide
function nextSlide() {
  if (index < cards.length - visibleCards) {
    index++;
  } else {
    index = 0; // loop
  }
  updateSlider();
}

// Prev slide
function prevSlide() {
  if (index > 0) {
    index--;
  } else {
    index = cards.length - visibleCards; // loop
  }
  updateSlider();
}

// Auto play
function startAutoSlide() {
  autoSlide = setInterval(nextSlide, 3000);
}

function stopAutoSlide() {
  clearInterval(autoSlide);
}

// Manual button controls
if (nextBtn && prevBtn) {
  nextBtn.addEventListener('click', () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
  });

  prevBtn.addEventListener('click', () => {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
  });
}

// Start autoplay
startAutoSlide();


// ============================================
// VIEW MORE / VIEW LESS
// ============================================

viewMoreBtn?.addEventListener('click', () => {
  stopAutoSlide();

  // Expand to grid layout
  track.style.transform = 'none';
  track.style.display = 'grid';
  track.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
  track.style.gap = '20px';

  // Buttons
  viewMoreBtn.style.display = 'none';
  viewLessBtn.style.display = 'inline-block';
  prevBtn.style.display = 'none';
  nextBtn.style.display = 'none';
});

viewLessBtn?.addEventListener('click', () => {
  // Restore slider
  track.style.display = 'flex';
  track.style.transition = 'transform 0.4s ease';
  track.style.gap = '0';
  index = 0;
  updateSlider();

  // Buttons
  viewLessBtn.style.display = 'none';
  viewMoreBtn.style.display = 'inline-block';
  prevBtn.style.display = 'inline-block';
  nextBtn.style.display = 'inline-block';

  startAutoSlide();
});


});
