// Admin Products Management - API Based

$(document).ready(function() {
  
  // Load products on page load
  if ($('#productsTableBody').length) {
    loadProducts();
  }

  // Load products from API
  function loadProducts() {
  $.ajax({
    url: '/admin/api/products',
    method: 'GET',
    success: function(response) {
      if (response.success) {
        displayProducts(response.products);
      } else {
        window.location.href = '/admin/login';
      }
    },
    error: function(xhr) {
      if (xhr.status === 401) {
        window.location.href = '/admin/login';
      }
    }
  });
}


  // Display products in table
  function displayProducts(products) {
    const tbody = $('#productsTableBody');
    
    if (products.length === 0) {
      tbody.html(`
        <tr>
          <td colspan="7" class="text-center py-5">
            <i class="bi bi-inbox" style="font-size: 4rem; color: #666;"></i>
            <p style="color: #999; margin-top: 1rem;">No products yet. Add your first product!</p>
            <a href="/admin/products/add" class="btn btn-primary mt-3">
              <i class="bi bi-plus-circle"></i> Add Product
            </a>
          </td>
        </tr>
      `);
      return;
    }

    let html = '';
    products.forEach(product => {
      html += `
        <tr data-id="${product._id}">
          <td>
            <img src="${product.image}" alt="${product.name}" class="product-img">
          </td>
          <td>${product.name}</td>
          <td style="color: #E8BCB5; font-weight: 600;">$${product.price.toFixed(2)}</td>
          <td><span class="badge bg-secondary">${product.category}</span></td>
          <td>
            ${product.inStock 
              ? '<span class="badge bg-success">In Stock</span>' 
              : '<span class="badge bg-danger">Out of Stock</span>'}
          </td>
          <td>
            ${product.featured 
              ? '<i class="bi bi-star-fill" style="color: #ffc107;"></i>' 
              : '<i class="bi bi-star" style="color: #666;"></i>'}
          </td>
          <td>
            <button class="btn btn-sm btn-warning me-2 edit-btn" data-id="${product._id}">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-danger delete-btn" data-id="${product._id}">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });

    tbody.html(html);
  }

  // Delete product
  $(document).on('click', '.delete-btn', function() {
    const productId = $(this).data('id');
    const productName = $(this).closest('tr').find('td:eq(1)').text();

    if (!confirm(`Delete "${productName}"?`)) {
      return;
    }

    $.ajax({
      url: `/admin/api/products/${productId}`,
      method: 'DELETE',
      success: function(response) {
        if (response.success) {
          showNotification(response.message, 'success');
          loadProducts();
        }
      },
      error: function(xhr) {
        showNotification('Error deleting product', 'danger');
        console.error('Delete error:', xhr);
      }
    });
  });

  // Edit product - redirect to edit page
  $(document).on('click', '.edit-btn', function() {
    const productId = $(this).data('id');
    window.location.href = `/admin/products/edit/${productId}`;
  });

  // Product form submission (Add/Edit)
  $('#productForm').on('submit', function(e) {
    e.preventDefault();

    const productId = $('#productId').val();
    const formData = {
      name: $('#name').val(),
      description: $('#description').val(),
      price: parseFloat($('#price').val()),
      category: $('#category').val(),
      image: $('#image').val(),
      inStock: $('#inStock').val() === 'true',
      featured: $('#featured').val() === 'true'
    };

    const isEdit = productId !== '';
    const url = isEdit ? `/admin/api/products/${productId}` : '/admin/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    $.ajax({
      url: url,
      method: method,
      contentType: 'application/json',
      data: JSON.stringify(formData),
      success: function(response) {
        if (response.success) {
          showNotification(response.message, 'success');
          setTimeout(() => {
            window.location.href = '/admin/products';
          }, 1000);
        }
      },
      error: function(xhr) {
        const error = xhr.responseJSON ? xhr.responseJSON.error : 'An error occurred';
        showNotification(error, 'danger');
        console.error('Form error:', xhr);
      }
    });
  });

  // Show notification
  function showNotification(message, type) {
    const alertHtml = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
    
    $('#notificationArea').html(alertHtml);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      $('.alert').fadeOut();
    }, 3000);
  }

});