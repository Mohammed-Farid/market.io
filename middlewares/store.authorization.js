const expressJwt = require('express-jwt');
const Store = require('../models/store.model');

function authorization(roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    // authenticate JWT token and attach user to request object (req.store)
    expressJwt({ secret: process.env.SECRET_KEY, requestProperty: 'store' }),

    // authorize based on user role
    (req, res, next) => {
      if (roles.length && !roles.includes(req.store.role)) {
        console.log(req.store);
        // user's role is not authorized
        return res.status(401).json({ message: 'Unauthorized' });
      }

      req.token = req.header('Authorization').replace('Bearer ', '');
      // authentication and authorization successful
      next();
    },
  ];
}

module.exports = authorization;
