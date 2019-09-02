const expressJwt = require('express-jwt');

function authorization(roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    // authenticate JWT token and attach courier to request object (req.courier)
    expressJwt({ secret: process.env.SECRET_KEY, requestProperty: 'courier' }),

    // authorize based on courier role
    (req, res, next) => {
      if (roles.length && !roles.includes(req.courier.role)) {
        // courier's role is not authorized
        return res.status(401).json({ message: 'Unauthorized' });
      }

      req.token = req.header('Authorization').replace('Bearer ', '');
      // authentication and authorization successful
      next();
    },
  ];
}

module.exports = authorization;