const { Types } = require('mongoose');
const jwt = require('jsonwebtoken');

const Cart = require('../../models/cart.model');
const Courier = require('../../models/courier.model');
const Order = require('../../models/order.model');
const Product = require('../../models/product.model');
const Store = require('../../models/store.model');
const User = require('../../models/user.model');
const Role = require('../../middlewares/role');

const cartOneId = new Types.ObjectId();
const courierOneId = new Types.ObjectId();
const courierTwoId = new Types.ObjectId();
const orderOneId = new Types.ObjectId();
const productOneId = new Types.ObjectId();
const productTwoId = new Types.ObjectId();
const storeOneId = new Types.ObjectId();
const userOneId = new Types.ObjectId();
const userTwoId = new Types.ObjectId();

const cartOne = {
  _id: cartOneId,
  owner: userOneId,
  id: productOneId,
  amount: 1,
};

const courierOne = {
  _id: courierOneId,
  firstname: 'John',
  lastname: 'Doe',
  email: 'jd@sigma.com',
  phone: '01012227422',
  role: Role.Courier,
  password: '123456',
  workplace: storeOneId,
  tokens: [
    {
      token: jwt.sign(
        { id: courierOneId, role: Role.Courier },
        process.env.SECRET_KEY
      ),
    },
  ],
};

const courierTwo = {
  _id: courierTwoId,
  firstname: 'Jane',
  lastname: 'Doe',
  email: 'jd@badr.com',
  phone: '01012227425',
  role: Role.Courier,
  password: '123456',
  workplace: storeOneId,
  tokens: [
    {
      token: jwt.sign(
        { id: courierTwoId, role: Role.Courier },
        process.env.SECRET_KEY
      ),
    },
  ],
};

const orderOne = {
  _id: orderOneId,
  delivered: false,
  owner: userOneId,
  courier: null,
  products: [{ id: productOneId, amount: 1 }],
};

const productOne = {
  _id: productOneId,
  category: 'Mobile Phone',
  manufacturer: 'Samsung',
  name: 'Note 10',
  description: 'A flagship phone made by Samsung',
  model: 'note-10',
  color: 'glue',
  amount: 100,
  discount: 0,
  store: storeOneId,
  booked: 0,
};

const productTwo = {
  _id: productTwoId,
  category: 'Mobile Phone',
  manufacturer: 'Honor',
  name: 'Honor 8x',
  description: 'A midrange phone made by Honor',
  model: 'honor-8x',
  color: 'blue',
  amount: 100,
  discount: 0,
  store: storeOneId,
  booked: 0,
};

const storeOne = {
  _id: storeOneId,
  name: 'Sigma',
  username: 'sigma',
  phone: '01012227421',
  email: 'sigma@gmail.com',
  password: '123456',
  role: Role.Store,
  tokens: [
    {
      token: jwt.sign(
        { id: storeOneId, role: Role.Store },
        process.env.SECRET_KEY
      ),
    },
  ],
};

const userOne = {
  _id: userOneId,
  firstname: 'Mohammed',
  lastname: 'Farid',
  email: 'mohammed@gmail.com',
  phone: '01012227424',
  password: '123456',
  role: Role.User,
  tokens: [
    {
      token: jwt.sign(
        { id: userOneId, role: Role.User },
        process.env.SECRET_KEY
      ),
    },
  ],
};

const userTwo = {
  _id: userTwoId,
  firstname: 'Sherif',
  lastname: 'Ashraf',
  email: 'sherif@gmail.com',
  phone: '01252186752',
  password: '654321',
  role: Role.User,
  tokens: [
    {
      token: jwt.sign(
        { id: userTwoId, role: Role.User },
        process.env.SECRET_KEY
      ),
    },
  ],
};

const setupDatabase = async () => {
  await Cart.deleteMany();
  await Courier.deleteMany();
  await Order.deleteMany();
  await Product.deleteMany();
  await Store.deleteMany();
  await User.deleteMany();
  await new Cart(cartOne).save();
  await new Courier(courierOne).save();
  await new Order(orderOne).save();
  await new Product(productOne).save();
  await new Store(storeOne).save();
  await new User(userOne).save();
};

module.exports = {
  storeOneId,
  storeOne,
  productOneId,
  productOne,
  productTwoId,
  productTwo,
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  courierOneId,
  courierOne,
  courierTwoId,
  courierTwo,
  cartOneId,
  cartOne,
  setupDatabase,
};
