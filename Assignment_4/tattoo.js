document.addEventListener('DOMContentLoaded', () => {
  const modalImage = document.getElementById('modalImage');

  // For every search icon in the gallery
  document.querySelectorAll('.tattoo-item .bi-search').forEach(icon => {
    icon.addEventListener('click', function (e) {
    
      const img = e.currentTarget.closest('.tattoo-item').querySelector('img');
      if (img) {
        modalImage.src = img.src; 
      }
    });
  });
});
