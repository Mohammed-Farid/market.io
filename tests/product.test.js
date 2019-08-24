const request = require('supertest');
const app = require('../app');
const Product = require('../models/product.model');

const { setupDatabase, storeOne } = require('./fixtures/db');

beforeEach(setupDatabase);

const deafaultProduct = {
  category: 'Mobile Phone',
  manufacturer: 'Honor',
  name: 'Honor 8x',
  description: 'Cool ass phone',
  model: '8x',
  color: 'blue',
  amount: 10,
  discount: 5,
};

test('Should create product for store', async () => {
  const response = await request(app)
    .post('/product')
    .set('Authorization', `Bearer ${storeOne.tokens[0].token}`)
    .send({
      product: deafaultProduct,
    })
    .expect(201);

  const product = await Product.findById(response.body.product._id);
  expect(product).not.toBeNull();
});
