$(document).ready(function() {
  const $form = $("#checkoutForm");
  const $cod = $("#cod");
  const $credit = $("#credit");
  const $creditFields = $("#creditFields");
  const $toggleCvv = $(".toggle-cvv");
  const $ccCvv = $("#cc-cvv");
  const $selectedPackageDiv = $("#selectedPackage");
  const $terms = $("#terms");
  const $placeOrderBtn = $("#placeOrderBtn");
  const $orderSummaryList = $("#orderSummaryList");

  const $fullName = $("#fullName");
  const $email = $("#email");
  const $phone = $("#phone");

  // Get cart from session storage
  function getCart() {
    const cart = sessionStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  // Display cart items on checkout page
  function displayCheckoutSummary() {
    const cart = getCart();
    
    if (cart.length === 0) {
      $selectedPackageDiv.html('<h4 style="color: #999;">No items in cart. <a href="/buy-now" style="color: #E8BCB5;">Go shopping</a></h4>');
      $orderSummaryList.html('<li class="list-group-item" style="background: #1a1a1a; color: #999;">Cart is empty</li>');
      return;
    }
    
    let total = 0;
    let summaryHTML = '<div style="background: rgba(232, 188, 181, 0.1); padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">';
    summaryHTML += '<h4 style="color: #E8BCB5; margin-bottom: 1rem;">Your Cart Items:</h4>';
    
    let orderListHTML = '';
    
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      
      summaryHTML += `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.8rem; padding-bottom: 0.8rem; border-bottom: 1px solid #333;">
          <div>
            <strong style="color: #fff;">${item.name}</strong>
            <span style="color: #999;"> × ${item.quantity}</span>
          </div>
          <span style="color: #E8BCB5; font-weight: 600;">$${itemTotal.toFixed(2)}</span>
        </div>
      `;
      
      orderListHTML += `
        <li class="list-group-item d-flex justify-content-between" style="background: #1a1a1a; border-color: #333; color: #ccc;">
          <div>
            <h6 class="my-0" style="color: #E8BCB5;">${item.name}</h6>
            <small style="color: #999;">Quantity: ${item.quantity}</small>
          </div>
          <span style="color: #fff;">$${itemTotal.toFixed(2)}</span>
        </li>
      `;
    });
    
    const shipping = 10;
    const tax = Math.round(total * 0.05);
    const grandTotal = total + shipping + tax;
    
    summaryHTML += `
      <div style="display: flex; justify-content: space-between; margin-top: 1rem; padding-top: 1rem; border-top: 2px solid #E8BCB5;">
        <strong style="color: #E8BCB5; font-size: 1.2rem;">Subtotal:</strong>
        <strong style="color: #fff; font-size: 1.2rem;">$${total.toFixed(2)}</strong>
      </div>
    </div>`;
    
    $selectedPackageDiv.html(summaryHTML);
    
    orderListHTML += `
      <li class="list-group-item d-flex justify-content-between" style="background: #1a1a1a; border-color: #333;">
        <span style="color: #ccc;">Subtotal</span>
        <strong style="color: #fff;">$${total.toFixed(2)}</strong>
      </li>
      <li class="list-group-item d-flex justify-content-between" style="background: #1a1a1a; border-color: #333;">
        <span style="color: #ccc;">Shipping</span>
        <strong style="color: #fff;">$${shipping}</strong>
      </li>
      <li class="list-group-item d-flex justify-content-between" style="background: #1a1a1a; border-color: #333;">
        <span style="color: #ccc;">Tax (5%)</span>
        <strong style="color: #fff;">$${tax}</strong>
      </li>
      <li class="list-group-item d-flex justify-content-between" style="background: #252525; border-color: #E8BCB5;">
        <span style="color: #E8BCB5; font-weight: 600;">Total (USD)</span>
        <strong style="color: #E8BCB5; font-size: 1.3rem;">$${grandTotal.toFixed(2)}</strong>
      </li>
    `;
    
    $orderSummaryList.html(orderListHTML);
  }

  // Initialize checkout display
  displayCheckoutSummary();

  // Show/hide credit fields
  $credit.change(function() {
    $creditFields.show();
    updateProgress("payment");
  });

  $cod.change(function() {
    $creditFields.hide();
    updateProgress("payment");
  });

  // Toggle CVV
  $toggleCvv.click(function() {
    $ccCvv.attr("type", $ccCvv.attr("type") === "password" ? "text" : "password");
    $(this).text($ccCvv.attr("type") === "password" ? "👁️" : "🙈");
  });

  // Validation helpers
  const isLetters = value => /^[A-Za-z\s]+$/.test(value.trim());
  const validateEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const validatePhone = value => /^\d{10,}$/.test(value.trim());
  const luhnCheck = number => {
    let sum = 0, shouldDouble = false;
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number[i]);
      if (shouldDouble) { digit *= 2; if(digit>9) digit -= 9; }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };
  const isFutureExpiry = value => {
    const [m,y] = value.split("/").map(Number);
    if(!m || !y || m<1 || m>12) return false;
    const now = new Date();
    const expDate = new Date(2000+y, m);
    return expDate > now;
  };

  const validateField = ($input, message, testFn) => {
    if(!testFn($input.val())) {
      $input.addClass("is-invalid");
      $("#" + $input.attr("id") + "Error").text(message);
      return false;
    } else {
      $input.removeClass("is-invalid");
      $("#" + $input.attr("id") + "Error").text("");
      return true;
    }
  };

  // Real-time validation
  $form.find(".form-control, .form-select").on("input change", function() {
    $form.trigger("validate");
  });

  $form.on("validate", function() {
    const validFullName = validateField($fullName, "Full name required, letters only", v=>v.trim().length>=3 && isLetters(v));
    const validEmail = validateField($email, "Valid email required", validateEmail);
    const validPhone = validateField($phone, "Valid phone required (min 10 digits)", validatePhone);
    const validAddress = validateField($("#address"), "Address required", v=>v.trim().length>=3);
    const validCity = validateField($("#city"), "City required & letters only", v=>v.trim()!=="" && isLetters(v));
    const validZip = validateField($("#zip"), "Valid zip required (4-6 digits)", v=>/^\d{4,6}$/.test(v.trim()));
    const validCountry = validateField($("#country"), "Country required", v=>$("#country").val()!=="");

    let validCard = true;
    if ($credit.is(":checked")) {
      validCard &= validateField($("#cc-name"), "Name on card required", v=>v.trim()!=="");
      validCard &= validateField($("#cc-number"), "Enter valid 16-digit card number", v=>/^\d{16}$/.test(v.replace(/\s+/g,"")) && luhnCheck(v.replace(/\s+/g,"")));
      validCard &= validateField($("#cc-exp"), "Expiry must be MM/YY & future date", v=>/^\d{2}\/\d{2}$/.test(v) && isFutureExpiry(v));
      validCard &= validateField($("#cc-cvv"), "CVV must be 3-4 digits", v=>/^\d{3,4}$/.test(v));
    }

    // Enable/disable place order button
    $placeOrderBtn.prop("disabled", !$terms.is(":checked") || !validFullName || !validEmail || !validPhone || !validAddress || !validCity || !validZip || !validCountry || !validCard);

    // Scroll to first error
    const $firstError = $(".is-invalid").first();
    if($firstError.length) {
      $('html, body').animate({scrollTop: $firstError.offset().top - 100}, 400);
    }
  });

  // Form submission
  $form.submit(function(e) {
    e.preventDefault();
    
    if($terms.is(":checked")) {
      // Clear cart after successful order
      sessionStorage.removeItem('cart');
      
      // Redirect to order confirmation
      window.location.href = "/ordersplaced";
    } else {
      alert("You must agree to the terms & conditions to place the order.");
    }
  });

  // Terms checkbox
  $terms.change(function() {
    $placeOrderBtn.prop("disabled", !$terms.is(":checked"));
    if($terms.is(":checked")) updateProgress("review");
    else updateProgress("payment");
  });

  // Progress Bar
  const progressItems = {
    cart: $(".checkout-steps span:nth-child(1)"),
    checkout: $(".checkout-steps span:nth-child(2)"),
    payment: $(".checkout-steps span:nth-child(3)"),
    review: $(".checkout-steps span:nth-child(4)")
  };

  function updateProgress(step) {
    $.each(progressItems, function(key, $el) {
      if(key === step) {
        $el.addClass("fw-bold text-warning").removeClass("text-secondary");
      } else {
        $el.removeClass("fw-bold text-warning").addClass("text-secondary");
      }
    });
  }

  updateProgress("checkout");
});