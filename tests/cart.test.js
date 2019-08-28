const request = require('supertest');
const app = require('../app');
const Cart = require('../models/cart.model');

const {
  setupDatabase,
  userOneId,
  userOne,
  productOneId,
  productTwoId,
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should add a valid amount of a product to the cart', async () => {
  const cartBefore = await Cart.findOne({ owner: userOneId });
  expect(cartBefore.products).toHaveLength(1);

  const resposne = await request(app)
    .post('/cart')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      product: {
        id: productOneId,
        amount: 10,
      },
    })
    .expect(200);

  const cartAfter = await Cart.findOne({ owner: userOneId });
  expect(cartAfter.products).toHaveLength(2);
});

test('Should not add an invalid amount of a product to the cart', async () => {
  const cartBefore = await Cart.findOne({ owner: userOneId });
  expect(cartBefore.products).toHaveLength(1);

  const resposne = await request(app)
    .post('/cart')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      product: {
        id: productOneId,
        amount: 200,
      },
    })
    .expect(400);

  const cartAfter = await Cart.findOne({ owner: userOneId });
  expect(cartAfter.products).toHaveLength(1);
});

test('Should delete product from cart', async () => {
  const cartBefore = await Cart.findOne({ owner: userOneId });
  expect(cartBefore.products).toHaveLength(1);

  const resposne = await request(app)
    .delete('/cart')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      products: [
        {
          id: productTwoId,
        },
      ],
    })
    .expect(200);

  const cartAfter = await Cart.findOne({ owner: userOneId });
  expect(cartAfter.products).toHaveLength(0);
});