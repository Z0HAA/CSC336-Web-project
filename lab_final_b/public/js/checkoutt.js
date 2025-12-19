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
  const $couponInput = $("#couponCode");
  const $applyCouponBtn = $("#applyCoupon");

  let appliedDiscount = 0;

  function getCart() {
    const cart = sessionStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  function displayCheckoutSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal - appliedDiscount;

    let summaryHTML = `<div style="background: rgba(232,188,181,0.1); padding:1.5rem; border-radius:8px; margin-bottom:1.5rem;">
      <h4 style="color:#E8BCB5; margin-bottom:1rem;">Your Cart Items:</h4>
      ${cart.map(item=>`
        <div style="display:flex;justify-content:space-between;margin-bottom:0.8rem;padding-bottom:0.8rem;border-bottom:1px solid #333;">
          <div><strong style="color:#fff;">${item.name}</strong> <span style="color:#999;">× ${item.quantity}</span></div>
          <span style="color:#E8BCB5;font-weight:600;">$${(item.price*item.quantity).toFixed(2)}</span>
        </div>`).join('')}
      <div style="display:flex;justify-content:space-between;margin-top:1rem;padding-top:1rem;border-top:2px solid #E8BCB5;">
        <span style="color:#ccc;">Subtotal:</span>
        <span style="color:#fff;">$${subtotal.toFixed(2)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;">
        <span style="color:#ccc;">Discount:</span>
        <span style="color:#fff;">$${appliedDiscount.toFixed(2)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;">
        <strong style="color:#E8BCB5;font-weight:600;">Total:</strong>
        <strong style="color:#E8BCB5;font-size:1.3rem;">$${total.toFixed(2)}</strong>
      </div>
    </div>`;

    $selectedPackageDiv.html(summaryHTML);
  }

  displayCheckoutSummary();

  $credit.change(() => $creditFields.show());
  $cod.change(() => $creditFields.hide());

  $toggleCvv.click(function() {
    $ccCvv.attr("type", $ccCvv.attr("type")==="password"?"text":"password");
    $(this).text($ccCvv.attr("type")==="password"?"👁️":"🙈");
  });

  $applyCouponBtn.click(function() {
    const code = $couponInput.val().trim().toUpperCase();
    if(!code){ alert("Enter coupon"); return; }

    const subtotal = getCart().reduce((sum, item) => sum + item.price*item.quantity, 0);
    appliedDiscount = (code === 'SAVE10') ? subtotal * 0.10 : 0;

    if($("#checkoutForm input[name='coupon']").length)
      $("#checkoutForm input[name='coupon']").val(code);
    else
      $("<input>").attr({type:"hidden", name:"coupon", value:code}).appendTo("#checkoutForm");

    displayCheckoutSummary();
    alert(`Coupon "${code}" applied!`);
  });

  $form.submit(function(e) {
    e.preventDefault();
    if(!$terms.is(":checked")){ alert("Agree to terms"); return; }

    const cart = getCart();
    addHidden("items", JSON.stringify(cart));
    const subtotal = cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
    addHidden("subtotal", subtotal);
    addHidden("coupon", $couponInput.val().trim());

    $form.attr("action","/order/preview").attr("method","POST");
    this.submit();
  });

  function addHidden(name,value){
    if(!$form.find(`input[name='${name}']`).length){
      $("<input>").attr({type:"hidden",name:name,value:value}).appendTo($form);
    } else {
      $form.find(`input[name='${name}']`).val(value);
    }
  }

});
