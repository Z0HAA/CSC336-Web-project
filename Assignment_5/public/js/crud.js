const apiURL = "/crud/api/products";

// Toast helper
function showToast(msg, type = 'success') {
  const toastHTML = `
    <div class="toast text-bg-${type}" role="alert">
      <div class="d-flex">
        <div class="toast-body">${msg}</div>
        <button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>`;
  
  const toastEl = $(toastHTML).appendTo('.toast-container');
  const toast = new bootstrap.Toast(toastEl[0]);
  toast.show();
  toastEl.on('hidden.bs.toast', () => toastEl.remove());
}

// Toggle loading spinner
const toggleLoad = (show) => $("#loading").toggle(show);

// Fetch and display products
function fetchProducts() {
  toggleLoad(true);
  $.get(apiURL)
    .done((products) => {
      const rows = products.map(p => `
        <tr data-id="${p._id}">
          <td>${p.name}</td>
          <td>$${p.price}</td>
          <td>${p.category}</td>
          <td>${p.inStock === true || p.inStock === 'true' ? '✓ Yes' : '✗ No'}</td>
          <td>
            <button class="btn btn-sm btn-outline edit-btn" style="color: #E8BCB5; border-color: #E8BCB5;">Edit</button>
            <button class="btn btn-sm btn-danger delete-btn ms-1">Delete</button>
          </td>
        </tr>
      `).join('');
      
      $("#productsTable").html(rows || '<tr><td colspan="5">No products found</td></tr>');
    })
    .fail(() => showToast("Failed to load products!", "danger"))
    .always(() => toggleLoad(false));
}

// Reset form
function resetForm() {
  $("#productForm")[0].reset();
  $("#productId").val("");
  $("#saveBtn").text("Save Package");
}

// Create or Update product
$("#productForm").on("submit", (e) => {
  e.preventDefault();
  
  const id = $("#productId").val();
  const productData = {
    name: $("#name").val(),
    description: $("#description").val(),
    price: parseFloat($("#price").val()),
    category: $("#category").val(),
    image: $("#image").val(),
    inStock: $("#inStock").val() === 'true',
    featured: $("#featured").val() === 'true'
  };

  toggleLoad(true);

  const request = id 
    ? $.ajax({ url: `${apiURL}/${id}`, method: "PUT", contentType: "application/json", data: JSON.stringify(productData) })
    : $.ajax({ url: apiURL, method: "POST", contentType: "application/json", data: JSON.stringify(productData) });

  request
    .done(() => {
      showToast(id ? "Product updated!" : "Product created!");
      resetForm();
      fetchProducts();
    })
    .fail((xhr) => showToast(xhr.responseJSON?.error || "Operation failed!", "danger"))
    .always(() => toggleLoad(false));
});

// Edit - populate form
$(document).on("click", ".edit-btn", function() {
  const id = $(this).closest("tr").data("id");
  toggleLoad(true);
  
  $.get(`${apiURL}`)
    .done((products) => {
      const product = products.find(p => p._id === id);
      if (product) {
        $("#productId").val(product._id);
        $("#name").val(product.name);
        $("#description").val(product.description);
        $("#price").val(product.price);
        $("#category").val(product.category);
        $("#image").val(product.image);
        $("#inStock").val(product.inStock.toString());
        $("#featured").val(product.featured.toString());
        $("#saveBtn").text("Update Package");
        $('html, body').animate({ scrollTop: 0 }, 300);
      }
    })
    .always(() => toggleLoad(false));
});

// Delete product
$(document).on("click", ".delete-btn", function() {
  const id = $(this).closest("tr").data("id");
  if (!confirm("Delete this product?")) return;
  
  toggleLoad(true);
  $.ajax({ url: `${apiURL}/${id}`, method: "DELETE" })
    .done(() => {
      showToast("Product deleted!");
      fetchProducts();
    })
    .fail(() => showToast("Delete failed!", "danger"))
    .always(() => toggleLoad(false));
});

// Clear form button
$("#resetBtn").on("click", resetForm);

// Load products on page load
$(fetchProducts);