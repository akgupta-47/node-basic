const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

