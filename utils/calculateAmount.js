module.exports = (products) => {
  const shippingAmount = 100;
  let totalAmount = shippingAmount;
  products.forEach((item) => {
    totalAmount += item.price * item.quantity;
  });
  return totalAmount;
};
