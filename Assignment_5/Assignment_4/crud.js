const apiURL = "https://jsonplaceholder.typicode.com/posts";
let nextId = 101;

// Toast helper
function showToast(msg, type = 'success') {
  const el = $(`
    <div class="toast text-bg-${type}" role="alert">
      <div class="d-flex">
        <div class="toast-body">${msg}</div>
        <button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `).appendTo('.toast-container');
  new bootstrap.Toast(el[0]).show();
  el.on('hidden.bs.toast', () => el.remove());
}

// Spinner toggle
const toggleLoad = (show) => $("#loading").toggle(show);

// Fetch items (Read)
function fetchItems() {
  toggleLoad(true);
  $.get(apiURL)
    .done((data) => {
      const rows = data.slice(0, 5).map(
        (x) => `
        <tr data-id="${x.id}">
          <td>${x.id}</td><td>${x.title}</td><td>${x.body}</td>
          <td>
            <button class="btn btn-sm btn-outline edit-btn">Edit</button>
            <button class="btn btn-sm btn-danger delete-btn">Delete</button>
          </td>
        </tr>`
      );
      $("#itemsTable").html(rows.join(""));
    })
    .fail(() => showToast("Failed to load items!", "danger"))
    .always(() => toggleLoad(false));
}

// Reset form
function resetForm() {
  $("#itemForm")[0].reset();
  $("#itemId").val("");
}

// Create / Update
$("#itemForm").on("submit", (e) => {
  e.preventDefault();
  const id = +$("#itemId").val(),
        title = $("#title").val(),
        body = $("#body").val();

  if (!title || !body) return showToast("Please fill all fields", "warning");
  toggleLoad(true);

  const updateRow = () => {
    const row = $(`tr[data-id="${id}"]`);
    row.find("td:eq(1)").text(title);
    row.find("td:eq(2)").text(body);
  };

  const newRow = (id) => `
    <tr data-id="${id}">
      <td>${id}</td><td>${title}</td><td>${body}</td>
      <td>
        <button class="btn btn-sm btn-outline edit-btn">Edit</button>
        <button class="btn btn-sm btn-danger delete-btn">Delete</button>
      </td>
    </tr>`;

  if (id) {
    if (id >= 101) {
      updateRow(); showToast("Local item updated!"); toggleLoad(false); resetForm();
    } else {
      $.ajax({ url: `${apiURL}/${id}`, method: "PUT", data: { title, body } })
        .done(() => { updateRow(); showToast("Item updated!"); })
        .fail(() => showToast("Update failed!", "danger"))
        .always(() => { toggleLoad(false); resetForm(); });
    }
  } else {
    $.post(apiURL, { title, body })
      .done(() => {
        $("#itemsTable").prepend(newRow(nextId++));
        showToast("Item created!");
      })
      .fail(() => showToast("Create failed!", "danger"))
      .always(() => { toggleLoad(false); resetForm(); });
  }
});

// Prefill form for Edit (works for both API rows and local rows)
$(document).on("click", ".edit-btn", function () {
  const row = $(this).closest("tr");
  $("#itemId").val(row.data("id"));
  $("#title").val(row.find("td:eq(1)").text());
  $("#body").val(row.find("td:eq(2)").text());
});

// Delete
$(document).on("click", ".delete-btn", function () {
  const row = $(this).closest("tr"), id = row.data("id");
  if (!confirm("Delete this item?")) return;
  toggleLoad(true);

  const done = (msg) => {
    row.fadeOut(300, () => row.remove());
    showToast(msg); toggleLoad(false);
  };

  id >= 101
    ? done("Local item deleted!")
    : $.ajax({ url: `${apiURL}/${id}`, method: "DELETE" })
        .done(() => done("Item deleted!"))
        .fail(() => { showToast("Delete failed!", "danger"); toggleLoad(false); });
});

$("#resetBtn").on("click", resetForm);
$(fetchItems);
