const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    passwordCurrent: req.body.passwordCurrent,
    active: req.body.active,
    photo: req.body.image,
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
