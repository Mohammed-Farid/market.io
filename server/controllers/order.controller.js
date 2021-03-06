const mongoose = require("mongoose");
const Cart = require("../models/cart.model");
const Order = require("../models/order.model");

// @route       POST api/orders
// @desc        Create an order
// @access      Private
const postOrder = async (req, res) => {
  try {
    const { client: user } = req;
    const carts = await Cart.find({ user: user.id, ordered: false })
      .populate("product")
      .populate({
        path: "bundle",
        model: "Bundle",
        populate: {
          path: "offers.product",
          model: "Product"
        }
      });

    const orders = carts
      .map(cart => {
        const isBundle = !!cart.bundle;

        // Loops in bundle to create proper order
        if (isBundle) {
          const orders = cart.bundle.offers.map(offer => {
            // From Order schema
            return {
              user: user._id,
              product: offer.product._id,
              bundle: cart.bundle._id,
              price: offer.product.price,
              discount: offer.discount,
              amount: cart.amount,
              cart: cart._id,
              store: cart.store
            };
          });

          return orders;
        } else {
          return {
            user: user._id,
            product: cart.product._id,
            bundle: null,
            price: cart.product.price,
            discount: cart.product.discount,
            amount: cart.amount,
            cart: cart._id,
            store: cart.store
          };
        }
      })
      .reduce((acc, current) => {
        if (Array.isArray(current)) {
          acc.push(...current);
        } else {
          acc.push(current);
        }
        return acc;
      }, []);

    await Order.insertMany(orders);
    await Cart.updateMany();

    const ids = orders.map(order => order.cart);
    await Cart.updateMany({ _id: { $in: ids } }, { $set: { ordered: true } });

    res.status(201).json({
      success: true,
      message: "You order has been set",
      orders
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const { client: user } = req;

    const orders = await Order.aggregate([
      { $match: { user: user._id } },
      {
        $project: {
          _id: "$cart",
          type: {
            $cond: {
              if: { $eq: ["$bundle", null] },
              then: "product",
              else: "bundle"
            }
          },
          amount: "$amount",
          bill: {
            $sum: {
              $multiply: [
                "$price",
                "$amount",
                {
                  $subtract: [
                    1,
                    {
                      $divide: ["$discount", 100]
                    }
                  ]
                }
              ]
            }
          },
          createdAt: "$createdAt",
          updatedAt: "$updatedAt"
        }
      },

      {
        $group: {
          _id: "$_id",
          type: { $first: "$type" },
          amount: { $first: "$amount" },
          bill: { $sum: "$bill" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.status(200).json({
      success: true,
      message: "Your orders has been fetched",
      orders
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  postOrder,
  getOrders
};
