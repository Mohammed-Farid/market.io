const Store = require('../../models/store.model');
const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');

const {
  getStatistics,
  getDemandedProducts,
  getProducts,
  getTopSellers,
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

const getStatisticsPage = async (req, res) => {
  try {
    const { client: store } = req;
    const { role } = store;
    // These are only 5 items
    const statistics = await getTopSellers(store);
    res.json({ success: true, message: 'Products found', statistics });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    const { client: store } = req;
    const { role } = store;

    const statistics = await getStatistics(store);

    const products = await getDemandedProducts(store);

    res.render('store/dashboard', {
      title: 'Dashboard',
      [role]: true,
      store,
      products,
      statistics,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const { client: store } = req;
    const { role } = store;
    const products = await getProducts(store);

    res.render('store/products', {
      title: 'Products list',
      [role]: true,
      store,
      products,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

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
  getDashboard,
  addProduct,
  getMyProducts,
  getStatisticsPage,
};
