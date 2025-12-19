module.exports = (req, res, next) => {
  let { subtotal, coupon } = req.body;

  // Convert subtotal to number
  subtotal = parseFloat(subtotal) || 0;

  // Trim and normalize coupon
  coupon = (coupon || '').trim().toUpperCase();

  let discountAmount = 0;

  if (coupon === 'SAVE10') {
    discountAmount = subtotal * 0.10; // 10% discount
  }

  req.discount = {
    code: coupon || null,
    amount: discountAmount
  };

  req.finalTotal = subtotal - discountAmount;
  next();
};
