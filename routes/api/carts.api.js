const express = require('express');
// const authorization = require('../../middlewares/user.authorization');
// const authentication = require('../../middlewares/user.authentication');

const authorization = require('../../middlewares/authorization');
const authentication = require('../../middlewares/authentication');

const controller = require('../../controllers/cart.controller');
const Role = require('../../middlewares/role');

const router = express.Router();

router.post('/', authorization(Role.User), authentication, controller.postCart);
router.delete(
  '/',
  authorization(Role.User),
  authentication,
  controller.deleteCart
);
router.delete(
  '/all',
  authorization(Role.User),
  authentication,
  controller.deleteFullCart
);
module.exports = router;
