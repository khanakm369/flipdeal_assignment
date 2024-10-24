const express = require('express');
const { resolve } = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.static('static'));
app.use(cors());

let taxRate = 5; // 5% tax rate
let discountRate = 10;
let loyaltyRate = 2;

const totalCart = (newItem, cartTotal) => {
  let result = newItem + cartTotal;
  return result;
};

app.get('/cart-total', (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let cartTotal = parseFloat(req.query.cartTotal);

  if (isNaN(newItemPrice) || isNaN(cartTotal)) {
    return res.status(400).send('Invalid query parameters');
  }

  res.status(200).send({ total: totalCart(newItemPrice, cartTotal) });
});

const membershipDiscount = (cartTotal, isMember) => {
  let result;
  if (isMember) {
    result = cartTotal * 0.9; // Apply 10% discount for members
  } else {
    result = cartTotal;
  }

  return result;
};

app.get('/membership-discount', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let isMember = req.query.isMember === 'true'; // Convert to boolean

  if (isNaN(cartTotal)) {
    return res.status(400).send('Invalid query parameters');
  }

  res
    .status(200)
    .send({ discountedTotal: membershipDiscount(cartTotal, isMember) });
});

// New endpoint to calculate tax on cart total
app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);

  if (isNaN(cartTotal)) {
    return res.status(400).send('Invalid query parameters');
  }

  let taxAmount = cartTotal * (taxRate / 100);
  res.status(200).send(`Tax amount: ${taxAmount}`);
});

app.get('/estimate-delivery', (req, res) => {
  let shippingMethod = req.query.shippingMethod;
  let distance = parseFloat(req.query.distance);

  if (isNaN(distance) || !shippingMethod) {
    return res.status(400).send('Invalid query parameters');
  }

  let deliveryDays;

  if (shippingMethod.toLowerCase() === 'standard') {
    deliveryDays = Math.ceil(distance / 50);
  } else if (shippingMethod.toLowerCase() === 'express') {
    deliveryDays = Math.ceil(distance / 100);
  } else {
    return res.status(400).send('Invalid shipping method');
  }

  res.status(200).send(`Estimated delivery time: ${deliveryDays} day(s)`);
});

app.get('/shipping-cost', (req, res) => {
  let weight = parseFloat(req.query.weight);
  let distance = parseFloat(req.query.distance);
  let result = weight * distance * 0.1;
  res.status(200).send(`${result}`);
});

app.get('/loyalty-points', (req , res) => {
  let purchaseAmount = parseFloat(req.query.purchaseAmount);
  let result = purchaseAmount * loyaltyRate;

  res.status(200).send(`${result}`);
} )

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
