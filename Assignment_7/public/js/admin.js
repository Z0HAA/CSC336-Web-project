// Admin Panel JavaScript

document.addEventListener('DOMContentLoaded', () => {
  
  // Sidebar Toggle
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.admin-sidebar');
  const content = document.querySelector('.admin-content');

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      sidebar.classList.toggle('show');
      content.classList.toggle('expanded');
    });
  }

  // Auto-dismiss alerts after 5 seconds
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      const bsAlert = new bootstrap.Alert(alert);
      bsAlert.close();
    }, 5000);
  });

  // Form validation styling
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });

  // Confirm delete actions
  const deleteForms = document.querySelectorAll('form[action*="delete"]');
  deleteForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      if (!confirm('Are you sure you want to delete this product?')) {
        e.preventDefault();
      }
    });
  });

});