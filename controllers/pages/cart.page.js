const Cart = require('../../models/cart.model');

const getCart = async (req, res) => {
  const { client: user } = req;
  const { role } = user;
  const cart = await Cart.aggregate([
    { $match: { user: user._id, ordered: false } },
    {
      $lookup: {
        from: 'products',
        localField: 'product',
        foreignField: '_id',
        as: 'product',
      },
    },

    {
      $unwind: {
        path: '$product',
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $lookup: {
        from: 'bundles',
        localField: 'bundle',
        foreignField: '_id',
        as: 'bundle',
      },
    },

    {
      $unwind: {
        path: '$bundle',
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $lookup: {
        from: 'stores',
        localField: 'store',
        foreignField: '_id',
        as: 'store',
      },
    },

    {
      $unwind: {
        path: '$store',
      },
    },

    {
      $project: {
        amount: '$amount',
        bill: {
          // amount * productPrice * ( !bundle ? productDiscount  )
          $multiply: [
            '$amount',
            '$product.price',
            {
              $subtract: [
                1,
                {
                  $divide: [
                    { $ifNull: ['$bundle.discount', '$product.discount'] },
                    100,
                  ],
                },
              ],
            },
          ],
        },
        bundle: '$bundle',
        product: '$product',
        store: '$store',
      },
    },

    {
      $group: {
        _id: '$bundle._id',
        bill: { $sum: '$bill' },
        products: {
          $push: {
            product: '$product.name',
            amount: '$amount',
            bill: '$bill',
            discount: { $ifNull: ['$bundle.discount', '$product.discount'] },
          },
        },
      },
    },
  ]);
  console.log('cart :', JSON.stringify(cart, undefined, 2));

  res.render('user/cart', { title: 'Shopping Cart', [role]: true, cart });
};

module.exports = {
  getCart,
};
