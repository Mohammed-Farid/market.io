const Order = require('../../models/order.model');
const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');
const { ObjectId } = require('mongoose').Types;
const { formatUpdates } = require('./helpers/order.helper');

const postOrder = async (req, res) => {
  try {
    const { client: user } = req;

    const carts = await Cart.find({ user: user.id, ordered: false });
    if (carts.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "You've no products in your cart" });
    }

    const cartsIds = carts.map(cart => cart.id);
    const productsInfo = carts.map(cart => ({
      id: cart.product,
      amount: cart.amount,
    }));

    const order = new Order({
      user: user.id,
      carts: cartsIds,
    });

    await order.save();

    await Cart.updateMany(
      { _id: { $in: cartsIds } },
      { $set: { ordered: true } }
    );

    const requests = productsInfo.map(item =>
      Product.updateOne(
        { _id: item.id },
        { $inc: { amount: item.amount * -1, booked: item.amount * -1 } }
      )
    );

    await Promise.all(requests);

    res
      .status(201)
      .json({ success: true, message: 'Your order has been set!', order });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      formatUpdates(req.body.updates),
      { new: true }
    );

    res.json({ success: true, message: 'This order has been updated', order });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  postOrder,
  updateOrder,
};
