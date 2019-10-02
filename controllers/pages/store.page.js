const Store = require('../../models/store.model');
const numeral = require('numeral');

const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');

const {
  getJSONStatistics,
  getJSONTopSellers,
  statisticsParser,
} = require('./helpers/store.helper');

const getStore = async (req, res) => {
  try {
    const { client } = req;
    const { role } = client;

    const store = await Store.findOne({
      username: req.params.username,
    }).populate('products');

    if (!store) {
      return res
        .status(404)
        .json({ success: false, message: 'No store was found' });
    }

    const storeOwner = store.id.toString() === client._id.toString();

    res.render('store/profile', {
      [role]: true,
      store,
      storeOwner,
      title: store.name,
      username: client.username,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getStatistics = async (req, res) => {
  try {
    const { client: store } = req;
    const { role } = store;
    // All Store Products
    const statistics = await getJSONStatistics(store);
    const parsedStatistics = statistics.map(product =>
      statisticsParser(product)
    );

    const totals = {
      sold: statistics.reduce((a, b) => a + b.sold, 0),
      revenue: numeral(statistics.reduce((a, b) => a + b.revenue, 0)).format(
        '$0,0.00'
      ),
    };

    totals.simpleRevenue = numeral(totals.revenue).format('0a');

    res.render('store/dashboard', {
      title: 'Dashboard',
      [role]: true,
      statistics: parsedStatistics,
      totals,
    });
    // res.json({ success: true, message: 'Products found', statistics });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getTopSeller = async (req, res) => {
  try {
    const { client: store } = req;
    const { role } = store;
    const limit = parseInt(req.params.limit) || 5;
    // These are only 'limits' items
    const statistics = await getJSONTopSellers(store, limit);
    res.json({ success: true, message: 'Products found', statistics });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// const getDashboard = async (req, res) => {
//   try {
//     const { client: store } = req;
//     const { role } = store;

//     const statistics = await getStatistics(store);

//     const products = await getDemandedProducts(store);

//     res.render('store/dashboard', {
//       title: 'Dashboard',
//       [role]: true,
//       store,
//       products,
//       statistics,
//     });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// const getMyProducts = async (req, res) => {
//   try {
//     const { client: store } = req;
//     const { role } = store;
//     const products = await getProducts(store);

//     res.render('store/products', {
//       title: 'Products list',
//       [role]: true,
//       store,
//       products,
//     });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

const addProduct = (req, res) => {
  try {
    const { client: store } = req;
    const { role } = store;
    const mode = { type: 'add', button: 'Add Product' };
    res.render('store/add-edit-product', {
      [role]: true,
      mode,
      store,
      title: 'Add Product',
    });
  } catch (error) {
    res.redirect('/');
  }
};

module.exports = {
  getStore,
  addProduct,
  getStatistics,
  getTopSeller,
};
