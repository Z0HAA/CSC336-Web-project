document.addEventListener("DOMContentLoaded", () => {
  const termsCheckbox = document.getElementById("terms");
  const placeOrderBtn = document.getElementById("placeOrderBtn");

  // Enable/disable Place Order button 
  termsCheckbox.addEventListener("change", () => {
    placeOrderBtn.disabled = !termsCheckbox.checked;
  });

  // Redirect to ordersplaced.html when button is clicked
  placeOrderBtn.addEventListener("click", (e) => {
    e.preventDefault(); 
    if (!placeOrderBtn.disabled) {
      window.location.href = "ordersplaced.html";
    }
  });
});
