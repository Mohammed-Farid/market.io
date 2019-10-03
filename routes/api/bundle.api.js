const express = require('express');
const authorization = require('../../middlewares/authorization');
const authentication = require('../../middlewares/authentication');
const controller = require('../../controllers/api/bundle.controller');
const Role = require('../../middlewares/role');
const router = express.Router();

router.post(
  '/',
  authorization(Role.Store),
  authentication,
  controller.postBundle
);

router.patch(
  '/:id',
  authorization(Role.Store),
  authentication,
  controller.patchBundle
);

router.put(
  '/:id',
  authorization(Role.Store),
  authentication,
  controller.putBundle
);

router.delete(
  '/:id',
  authorization(Role.Store),
  authentication,
  controller.deleteBundle
);

module.exports = router;
