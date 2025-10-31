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

  const packagePrices = {
    "Basic Tattoo": 80,
    "Standard Tattoo": 150,
    "Premium Tattoo": 250
  };

  const params = new URLSearchParams(window.location.search);
  const packageName = params.get("package");

  if (packageName && packagePrices[packageName.replace(/\+/g," ")]) {
    const name = packageName.replace(/\+/g," ");
    const price = packagePrices[name];
    const shipping = 10;
    const tax = Math.round(price * 0.05);
    const total = price + shipping + tax;

    $selectedPackageDiv.html(`<h4>Selected Package: <span>${name}</span></h4>`);

    $orderSummaryList.html(`
      <li class="list-group-item d-flex justify-content-between">
        ${name} <span>$${price}</span>
      </li>
      <li class="list-group-item d-flex justify-content-between">
        <span>Subtotal</span><strong>$${price}</strong>
      </li>
      <li class="list-group-item d-flex justify-content-between">
        <span>Shipping</span><strong>$${shipping}</strong>
      </li>
      <li class="list-group-item d-flex justify-content-between">
        <span>Tax</span><strong>$${tax}</strong>
      </li>
      <li class="list-group-item d-flex justify-content-between">
        <span>Total</span><strong>$${total}</strong>
      </li>
    `);
  } else {
    $selectedPackageDiv.html(`<h4>No package selected</h4>`);
    $orderSummaryList.empty();
  }

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
  });

  // Helpers
  const isLetters = value => /^[A-Za-z\s]+$/.test(value.trim()); // letters + spaces
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
    const validCountry = validateField($("#country"), "Country required", v=>v.val()!=="");

    let validCard = true;
    if ($credit.is(":checked")) {
      validCard &= validateField($("#cc-name"), "Name on card required", v=>v.trim()!=="");
      validCard &= validateField($("#cc-number"), "Enter valid 16-digit card number", v=>/^\d{16}$/.test(v.replace(/\s+/g,"")) && luhnCheck(v.replace(/\s+/g,"")));
      validCard &= validateField($("#cc-exp"), "Expiry must be MM/YY & future date", v=>/^\d{2}\/\d{2}$/.test(v) && isFutureExpiry(v));
      validCard &= validateField($("#cc-cvv"), "CVV must be 3 digits", v=>/^\d{3,4}$/.test(v));
    }

    // Only enable place order if terms checked
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
  // Only check terms checkbox
  if($terms.is(":checked")) {
    window.location.href = "ordersplaced.html";
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
