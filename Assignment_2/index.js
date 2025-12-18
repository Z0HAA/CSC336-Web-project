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

});
