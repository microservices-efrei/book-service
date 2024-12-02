const jwt = require('jsonwebtoken');
const User = require('../models/book');
const { Op } = require('sequelize');

const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers['authorization'];
    if (!token) {
      return res.status(403).send({
        message: 'No token provided!',
      });
    } else {
      token = token.replace('Bearer ', '');
      const userInfo = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({
        where: {
          [Op.or]: [{ email: userInfo.email }],
        },
      });
      if (!user) {
        return res.status(401).send({
          message: 'Unauthorized!',
        });
      }
      req.user = user;
      next();
    }
  } catch (error) {
    return res.status(500).send({
      message: error.message || 'Something went wrong!',
    });
  }
};

module.exports = verifyToken;
