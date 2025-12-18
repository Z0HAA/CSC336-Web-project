const apiURL = "http://localhost:3000/api/products";

// Toast notification
function showToast(message, type = 'success') {
  const toastHTML = `
    <div class="toast align-items-center text-bg-${type} border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `;
  const toastEl = $(toastHTML).appendTo('.toast-container');
  const toast = new bootstrap.Toast(toastEl[0]);
  toast.show();
  toastEl.on('hidden.bs.toast', function() {
    $(this).remove();
  });
}

// Add table row
function addRow(item) {
  $("#itemsTable").append(`
    <tr data-id="${item._id}">
      <td>${item._id}</td>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${item.description}</td>
      <td>
        <button class="btn btn-sm btn-outline edit-btn" data-id="${item._id}">Edit</button>
        <button class="btn btn-sm btn-danger delete-btn" data-id="${item._id}">Delete</button>
      </td>
    </tr>
  `);
}

// Update row
function updateRow(item) {
  const row = $(`tr[data-id="${item._id}"]`);
  row.find("td:eq(1)").text(item.name);
  row.find("td:eq(2)").text(item.price);
  row.find("td:eq(3)").text(item.description);
}

// Fetch all products
function fetchItems() {
  $("#loading").show();
  $.get(apiURL, function (data) {
    const tableBody = $("#itemsTable");
    tableBody.empty();
    data.forEach((item) => addRow(item));
    $("#loading").hide();
  }).fail(() => {
    showToast("Failed to load products!", "danger");
    $("#loading").hide();
  });
}

// Reset form
function resetForm() {
  $("#itemId").val("");
  $("#name").val("");
  $("#price").val("");
  $("#description").val("");
}
$("#resetBtn").on("click", resetForm);

// Handle form submit
$("#itemForm").on("submit", function (e) {
  e.preventDefault();
  const id = $("#itemId").val();
  const name = $("#name").val();
  const price = $("#price").val();
  const description = $("#description").val();

  if (!name || !price || !description) {
    showToast("Please fill out all fields.", "warning");
    return;
  }

  $("#loading").show();

  // ---- UPDATE ----
  if (id) {
    $.ajax({
      url: `${apiURL}/${id}`,
      method: "PUT",
      contentType: "application/json",
      data: JSON.stringify({ name, price, description }),
      success: function (data) {
        updateRow(data);
        resetForm();
        showToast("Product updated successfully!", "success");
        $("#loading").hide();
      },
      error: function () {
        showToast("Update failed!", "danger");
        $("#loading").hide();
      },
    });
    return;
  }

  // ---- CREATE ----
  $.ajax({
    url: apiURL,
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ name, price, description }),
    success: function (data) {
      addRow(data);
      resetForm();
      showToast("Product created successfully!", "success");
      $("#loading").hide();
    },
    error: function () {
      showToast("Create failed!", "danger");
      $("#loading").hide();
    },
  });
});

// Edit button click
$(document).on("click", ".edit-btn", function () {
  const id = $(this).data("id");
  $("#loading").show();
  $.get(`${apiURL}/${id}`, function (data) {
    $("#itemId").val(data._id);
    $("#name").val(data.name);
    $("#price").val(data.price);
    $("#description").val(data.description);
    $("#loading").hide();
  }).fail(() => {
    showToast("Failed to load product!", "danger");
    $("#loading").hide();
  });
});

// Delete button click
$(document).on("click", ".delete-btn", function () {
  const id = $(this).data("id");
  if (confirm("Are you sure you want to delete this product?")) {
    $("#loading").show();
    $.ajax({
      url: `${apiURL}/${id}`,
      method: "DELETE",
      success: function () {
        $(`tr[data-id="${id}"]`).fadeOut(400, function() { $(this).remove(); });
        showToast("Product deleted!", "success");
        $("#loading").hide();
      },
      error: function () {
        showToast("Delete failed!", "danger");
        $("#loading").hide();
      },
    });
  }
});

// Initialize
$(document).ready(fetchItems);
